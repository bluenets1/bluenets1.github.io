# How an AI Model Uses a Computer: From Tool Call to CPU

![](content/ai-writings/llm-internals/_img/computer-use-loop.svg)

*The model does not reach through the screen. A host program turns its structured request into operating-system actions, captures the result, and sends the new evidence back.*

When a person clicks a button, the story feels simple: hand, mouse, screen. When an AI model clicks a button, there is no hand. There is a request sent over an API, a program that receives it, a desktop stack that accepts input, an application that handles the event, and a screenshot that travels back to the model.

Those are separate processes and separate interfaces. The model proposes an action. The host decides whether that action is allowed. A platform adapter translates it into the local computer's language. The app may or may not react. Then vision has to determine whether the result matches the task.

This is a low-level tour of that path. We will follow one click from a JSON tool call down to an X11 server, look at the x86-64 system-call boundary, compare Linux with macOS and Windows, and trace pixels back into model coordinates. The assembly examples explain where code crosses from user space into the kernel.

## 1. The Agent Loop and the Tool Call

A language model normally returns text. When it needs a computer, the API lets it return a **tool call**: structured data naming an action and its arguments. A simplified click might look like:

```json
{
  "type": "tool_use",
  "name": "left_click",
  "input": { "coordinate": [540, 340] }
}
```

This object is a proposal. It has not moved a pointer yet. The model server returns it to the application that owns the desktop. That application is often called the **host**, **harness**, or **computer-use runner**.

The host parses the response, checks the tool name and input schema, checks that the coordinate lies inside the display, applies policy, and dispatches the action through a platform adapter. After the click, the host waits for the UI to settle, captures a screenshot, and sends a tool result with the matching call ID. The model sees the result on its next turn.

![](content/ai-writings/llm-internals/_img/computer-use-stack.svg)

In a real protocol, IDs matter. The result for tool call `abc123` must say it answers `abc123`. A model response may contain several tool calls, and the host must answer every call. For a batch, the host usually runs actions in order because the later action may rely on the earlier one having worked.

The loop is therefore:

```text
observation -> model decision -> policy check -> input -> new observation
```

That last step is the feedback that separates an agent from a macro. A macro says “click, type, press Enter” and assumes each step worked. An agent looks at the result and can change its plan. A click is only a hypothesis until a new observation confirms the intended state.

A production host also needs boring limits: maximum turns, action timeouts, coordinate bounds, supported key names, and a rule for what to do after an action fails. Without those limits, an agent can get stuck repeating a bad click while spending tokens and changing the desktop.

## 2. A Machine With No Monitor: Xvfb and the Display Server

A graphical application does not need a physical monitor to draw a window. On Linux, **Xvfb** is an X server that renders into a virtual framebuffer in memory. It gives X11 clients a display to connect to even when the machine has no display hardware attached.

Start a simple display like this:

```bash
Xvfb :99 -screen 0 1280x800x24 &
export DISPLAY=:99
```

The `:99` names the X display. `-screen 0 1280x800x24` asks for screen zero at 1280 by 800 pixels with a 24-bit color depth. `DISPLAY` tells programs such as a browser, window manager, screenshot utility, or `xdotool` which X server they should use.

The X server is not the browser and is not the window manager. The browser is an X client that asks to create windows and draw content. A window manager handles placement, focus, decorations, and related desktop behavior. The X server maintains the display resources and routes input events. A screenshot component reads the rendered pixels. The host connects these parts to the model.

This is a virtual display, not automatically a secure sandbox. A container or VM still needs deliberate limits on files, network access, credentials, and privileges. X11 was designed for cooperating desktop clients, so access to the same display can expose windows and allow input. Put an untrusted agent in an environment whose desktop and data it can safely control.

## 3. The Hands: Injecting Clicks With XTEST and xdotool

On X11, a tool such as `xdotool` can ask the X server to synthesize pointer and keyboard events. It uses X11's **XTEST extension** for many actions, together with Xlib functions for connecting to and communicating with the server.

For example:

```bash
xdotool mousemove 540 340 click 1
```

This asks the X server to move the pointer to `(540, 340)`, then send a press and release for logical button 1, usually the left button. `xdotool` does not know the button is labelled “Save.” It only operates on X display coordinates and key/button identities.

At the library level, the action is conceptually close to:

```c
XTestFakeMotionEvent(display, screen, x, y, delay);
XTestFakeButtonEvent(display, 1, True, 0);   /* press */
XTestFakeButtonEvent(display, 1, False, 0);  /* release */
XFlush(display);
```

The real utility handles options, key mapping, delays, errors, and display connections. The important point is that `XTestFakeButtonEvent` asks the **X server** to synthesize an X input event. It does not write to `/dev/input`, impersonate a USB mouse, or directly edit the application's memory. The server then routes the event according to pointer position, focus, grabs, and normal X event rules. Applications can still ignore synthetic events or handle them differently.

### Where assembly enters the picture

An X11 extension call is an ordinary user-space library call. The C compiler follows the platform's function-call ABI to call the function. Xlib encodes an X11 protocol request into a byte buffer. When it flushes that buffer, the library eventually asks the kernel to write bytes to its connection to the X server, commonly a Unix-domain socket selected through `DISPLAY`.

Here is a small x86-64 Linux assembly example for the final `write` system-call boundary. This uses NASM-style Intel syntax and writes a byte buffer to an already-open file descriptor:

```asm
; write(fd, buffer, length)
; Linux x86-64 syscall ABI

mov     eax, 1              ; __NR_write
mov     edi, [rel x_socket_fd] ; argument 1: connected X socket descriptor
lea     rsi, [rel packet]   ; argument 2: pointer to bytes
mov     edx, packet_len    ; argument 3: byte count
syscall                     ; enter the kernel
; rax = bytes written, or a negative error value
```

On Linux x86-64, the syscall number goes in `eax`, the first three arguments go in `rdi`, `rsi`, and `rdx`, and the `syscall` instruction crosses from user mode into the kernel. The kernel checks the descriptor and memory range, then passes the bytes to the socket layer. The X server process reads and decodes them.

The buffer in this example is **not a mouse command understood by Linux**. It is an X11 protocol message addressed to the X server. Xlib constructs the message, handles byte order and request sequencing, and may combine several requests before flushing. The server must advertise XTEST and understand the request. Only then does the server synthesize an X event.

The path looks like this:

```text
model JSON
  -> host validates click
  -> xdotool / libX11 / libXtst
  -> write or writev on X socket
  -> X server decodes XTEST request
  -> X server dispatches motion and button events
  -> focused application processes its event queue
```

This distinction is useful when debugging. If the syscall succeeds, it means bytes were accepted by a socket, not that the browser clicked the expected control. If XTEST accepts the request, it means the server generated an event, not that the application changed state. You still need to observe the screen or app state after the event.

`xdotool type` adds another translation step. Text is mapped through X keysyms and keycodes according to the active keyboard layout, then sent as key press and release events. Unusual characters, dead keys, or a different layout can produce surprising results. A clipboard paste is a different mechanism and has different permission and side-effect considerations.

XTEST belongs to the X11 model. On Wayland, a normal client generally cannot send arbitrary input to every other app. Automation must use an allowed desktop portal, compositor interface, accessibility mechanism, or a separate X11 session. A tool that works on X11 does not automatically work through XWayland for all windows.

## 4. macOS Accessibility and Windows Input Floors

The X11 stack is one example. Other operating systems expose different interfaces and permission boundaries.

### macOS: semantic controls and Quartz events

macOS accessibility clients can query an accessibility object tree. An app may expose a hierarchy of windows, buttons, text fields, labels, and actions through APIs such as `AXUIElement`. A host can sometimes ask for the button named “Save” and invoke its press action. That is more semantic than guessing its pixel location, but it depends on the target app exposing useful accessibility information.

For pointer and keyboard style events, macOS provides Quartz event APIs such as `CGEvent`. The process needs the relevant user-granted privacy permission to control the computer. Accessibility trust is checked by system APIs such as `AXIsProcessTrusted`. Screen capture permission is a separate concern from input permission. A system can let an app inspect accessibility controls while still blocking screen capture, or vice versa.

The two routes solve different problems: accessibility can name an element and its role; a Quartz event can behave more like pointer or keyboard input. Real automation products often combine them. Neither is a license to ignore the user's permission settings.

### Windows: SendInput and UIPI

Windows exposes `SendInput`, which accepts an array of `INPUT` structures describing keyboard or mouse events. The API inserts those events serially into the system input stream. A normal click is still more than a single abstract “click” operation: it usually involves a move, button down, and button up, with coordinates interpreted in the relevant desktop coordinate space.

Windows applies **User Interface Privilege Isolation (UIPI)**. A process may inject input only into an application at an equal or lower integrity level. A normal user process should not be able to drive a higher-privilege window just because the model requested it. Microsoft notes that when UIPI blocks `SendInput`, the return value and last-error code do not clearly say that UIPI was the cause.

This is an input floor. Permissions, session boundaries, secure desktops, locked screens, and privilege levels can prevent a normal automation process from acting. The host should report that boundary and stop or ask an authorized person. Repeatedly trying other input routes to defeat the boundary is not a recovery strategy.

At the machine-code level, a Windows program calls the documented `User32!SendInput` API using the Windows x64 calling convention. The Windows implementation crosses into system code internally, but that path is an implementation detail. The supported interface is the documented API and its permission behavior, not a guessed syscall number.

## 5. The Eyes: Patches, Picture Cost and Scaling Coordinates Back

A screenshot is a rectangular array of pixels. A vision model does not necessarily process each pixel as an independent item. For example, Anthropic documents image input in 28 by 28 pixel visual patches, subject to model-specific resizing and limits. Other providers may use different image encoders and billing rules.

For that documented patch scheme, a 1280 by 720 image is approximately:

```text
ceil(1280 / 28) * ceil(720 / 28)
= 46 * 26
= 1,196 visual patches
```

The screenshot can therefore cost more than a short text prompt, especially when sent again over many turns. Larger images preserve small labels, but if a model downsizes them before reading, the extra original pixels may not improve the evidence it receives. A compact overview plus a targeted zoom is often a better tradeoff than repeatedly sending a full-resolution desktop.

![](content/ai-writings/llm-internals/_img/computer-use-coordinates.svg)

Now follow one coordinate. Suppose the real display is 1920 by 1080, but the host resizes the screenshot to 1280 by 720. The scale is:

```text
sx = 1280 / 1920 = 2/3
sy =  720 / 1080 = 2/3
```

If the model points at `(800, 300)` in the resized screenshot, map it back by dividing each coordinate by its scale:

```text
screen_x = 800 / (2/3) = 1200
screen_y = 300 / (2/3) = 450
```

For a crop that begins at `(crop_x, crop_y)` on the original display and is then resized, the inverse transform is:

```text
screen_x = crop_x + (model_x - pad_left) / scale_x
screen_y = crop_y + (model_y - pad_top)  / scale_y
```

`pad_left` and `pad_top` are zero when no padding was added. If the display uses Retina or another high-density mode, the screenshot may be in device pixels while an input API expects logical points. Multiply or divide by that device-pixel ratio at the correct boundary. Do not guess. Record the dimensions returned by the capture API and the dimensions expected by the input API.

The common bug is not a bad vision model. It is mixing coordinate systems: CSS pixels with screenshot pixels, screenshot pixels with physical pixels, or crop-relative points with full-screen points. A constant offset usually means a crop or window origin was lost. A proportional error usually means a scale factor was missed. Test the transform using known corners before asking the model to hit small controls.

## 6. Grounding: How a Model Learns to Point, and Zoom

**Grounding** maps a phrase such as “the blue Save button near the bottom right” to a location in an image. A screenshot model has to identify the target, estimate its position, and express that position in the coordinate system promised by the tool.

Training examples can pair screenshots and natural-language instructions with target boxes, points, or action traces. [SeeClick](https://arxiv.org/abs/2401.10935) studies screenshot-based GUI grounding. [UI-TARS](https://arxiv.org/abs/2501.12326) is an example of a screenshot-driven agent trained to produce keyboard and mouse actions. These systems learn visual patterns, but their coordinates remain estimates.

Grounding errors often come from ordinary UI details: two similar icons, a moving banner, a loading spinner, a scroll position change, or a screenshot that was resized after the model saw it. A click close to the target can still select the wrong row. The harness can improve accuracy by combining evidence:

- Ask for the target by visible label, color, and approximate region.
- Use an accessibility tree or application API for element names when available.
- Use a full-screen screenshot to find the region, then zoom in to read dense or tiny content.
- Click once and inspect the result before continuing with a destructive or consequential action.

When a tool offers a `zoom` action, define its coordinate contract precisely. Some computer-use tools ask for a region in full-display pixel coordinates and return a magnified image while keeping later action coordinates in the original screenshot's space. Other designs may make the zoom image its own coordinate frame. The model and host must agree on which contract applies. In the Anthropic tool described in the references, zoomed regions do not redefine the full-screen coordinate space used for actions.

## 7. A Real Run: Batches, Approval, Prompt Caching and Pruning

Suppose the task is “open the expense sheet, find the hotel row, and change the amount to 240.” A cautious run looks like this:

1. The host sends the instruction and a screenshot.
2. The model requests a click on the spreadsheet, followed by a screenshot.
3. The host validates the point, clicks, waits for the app, and captures the new screen.
4. The model finds the row, zooms if the text is small, and asks to select the amount cell and type `240`.
5. The host performs the edit and returns a new screenshot.
6. The model verifies that the intended cell changed. If the next step submits or sends the sheet, the host pauses for approval before that action.

If a response batches `click`, `type`, and `screenshot`, run them in order. Typing depends on the click setting the right focus. If the click fails, stop the rest of the batch and return an error result for the failed and skipped actions. The model can then inspect the failure and re-plan.

Approval belongs in the host, beside the code that executes the action. The model can propose “send,” “delete,” or “purchase,” but the host can require a human decision before those specific actions run. Do not treat a sentence in the model's explanation as proof that a person approved the action.

Long runs also create a context-management problem. A screenshot may consume hundreds or thousands of visual tokens, depending on its dimensions and the model. Keeping every screenshot forever makes later turns expensive and buries the current state under stale images.

Prompt caching can reduce repeated work on an unchanged prefix such as system instructions and tool definitions. Keep that prefix byte-for-byte stable if the API's cache depends on prefix matching. Store the task summary and tool configuration in the stable part; append new observations and tool results after it. Prune old screenshots in deliberate batches, preserve the most recent useful image and a compact action summary, and avoid rewriting the whole conversation each turn. The precise cache controls differ across APIs, so follow the provider's implementation details.

## 8. Shell or Screen

A screen is flexible, but it is a noisy API. A shell or application API is often exact. If the task is “rename 200 files,” use a filesystem operation and verify the resulting names. If the task is “find the export control in an unfamiliar graphics program,” the screen may be the only interface that reveals it.

The strongest system chooses the most direct reliable interface for each step. It might inspect a dialog visually, use an API to change a value, then return to the screen to confirm the application accepted it. The computer-use loop is not committed to mouse clicks. It is a way to turn a model's proposed action into a controlled operation and return evidence about what happened.

![](content/ai-writings/llm-internals/_img/computer-use-choice.svg)

The key low-level idea is that a model does not “click the computer.” It emits data. A host validates the data, a platform-specific interface turns it into events or API calls, an application processes them, and a capture path turns the resulting state back into pixels. Each arrow is a boundary where coordinates, permissions, failures, and assumptions can go wrong. Once those boundaries are explicit, computer use becomes ordinary systems engineering.

## References

- Anthropic, [Computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
- Anthropic, [Vision: image patches, costs and coordinates](https://platform.claude.com/docs/en/build-with-claude/vision)
- X.Org, [Xvfb manual](https://xorg.freedesktop.org/releases/X11R6.8.2/doc/Xvfb.1.html)
- X.Org, [XTEST extension functions](https://www.x.org/releases/X11R7.5/doc/man/man3/XTestFakeKeyEvent.3.html)
- xdotool, [project documentation](https://github.com/jordansissel/xdotool)
- Linux man-pages, [syscall(2): architecture calling conventions](https://www.man7.org/linux/man-pages/man2/syscall.2.html)
- Apple, [AXUIElement](https://developer.apple.com/documentation/applicationservices/axuielement) and [CGEvent](https://developer.apple.com/documentation/coregraphics/cgevent)
- Apple, [Allow accessibility apps to access your Mac](https://support.apple.com/guide/mac-help/mh43185/mac)
- Microsoft, [SendInput function and UIPI](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput)
- Cheng et al., [SeeClick: Harnessing GUI Grounding for Advanced Visual GUI Agents](https://arxiv.org/abs/2401.10935)
- Liu et al., [UI-TARS: Pioneering Automated GUI Interaction with Native Agents](https://arxiv.org/abs/2501.12326)
