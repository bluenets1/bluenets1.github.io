As you might know, **every program exits with an _exit code_ as it terminates**. This is **done by passing a parameter to the `exit` system call**.

Similarly to **how a system call number** (e.g., `60` for `exit`) is specified in **the `rax` variable**, **parameters are also passed** to the **syscall through registers**. **System calls can take multiple parameters**, ***though `exit` takes only one***: **the exit code**. **The first parameter to a system call is passed via another register**: `rdi`. `rdi` is what we will focus on in this challenge.

**Note**
- `rax` is **not the exit code box**.
- `rax` is the **syscall number box**.
---
## Challenge
In this challenge, you must make your program exit with the exit code of `42`. Thus, your program will need three instructions:

1. Set your program's exit code (move it into `rdi`).
2. Set the system call number of the `exit` syscall (`mov rax, 60`).
3. `syscall`!

Now, go and do it!

=> What i wrote for this :
```Assembly
mov rax, 60 ;rax takes sytemscalls results, system calls, and returns
mov rdi, 42 ; it sets that if the program exits, it should give the 42 as exit code
syscall
```

### Line by line:

`mov rax, 60`
- ✅ `rax` is used to **tell the kernel which syscall you want**.
- Here, `60` means: **I want the `exit` syscall**.
- (After the syscall runs, yes, the **return value** also comes back in `rax`, but when _calling_ the syscall, `rax` is strictly the "which syscall?" box.)
---
`mov rdi, 42`
- ✅ `rdi` holds the **first parameter** for the syscall.
- For `exit`, the **only parameter** is the exit code.
- So `42` means: _"when this program ends, tell the OS I’m exiting with code 42."_
---
`syscall`
- ✅ This instruction actually **triggers the kernel** to perform the syscall you requested (`exit`) with the parameter you passed (`42`).
- After this, your program is terminated immediately with exit code 42.
---
### 🔹 Refined Explanation (corrected version of yours):
- `rax = 60` → selects the `exit` system call.
- `rdi = 42` → gives the **exit code** (not "error code", since exit code `42` doesn’t necessarily mean an error—it’s just a number the parent process can check).
- `syscall` → hands control to the kernel to carry it out.
---

✅ So your explanation is 90% right — just remember:
- `rax` = syscall number (not results here, that happens _after_ syscall finishes).
- `rdi` = parameter (exit code).
![](content/cyber/pwn-college/module-4/1-assembly/_img/pasted-image-20250919121240.png)
