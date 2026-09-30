The stack is easiest to reason about if you remember that addresses are just numbers. Diagrams often draw the stack vertically, but the numbers themselves still have a simple left-to-right order:

```text
smaller addresses                                      larger addresses
...  rsp-0x10      rsp-0x08      rsp      rsp+0x08      rsp+0x10  ...
```

Positive offsets from `rsp`, such as `[rsp+8]`, read bytes at larger addresses. Negative offsets, such as `[rsp-8]`, read bytes at smaller addresses.

When a program starts, the kernel has already placed launch data at the starting `rsp` and at larger addresses to its right on this number line.
