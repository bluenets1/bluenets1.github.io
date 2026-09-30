**Pointers can get even more interesting**! **Imagine that your friend lives in a different house on your street**. Rather **than remembering their address**, **you might write it down, and store the paper with their house address in _your_ house**. Then, to get data from your friend, **you'd need to point the CPU at your house**, **have it go in there and find the friend's address**, and **use that address as a pointer to their house.**

Similarly, **since memory addresses are really just values**, **they can be stored in memory, and retrieved later!** Let's explore a scenario where we store the value `133700` at the address `123400`, and store the value `42` at the address `133700`. Consider the following instructions:

```assembly
mov rdi, 123400    # after this, rdi becomes 123400
mov rdi, [rdi]     # after this, rdi becomes the value stored at 123400 (which is 133700)
mov rax, [rdi]     # here we dereference rdi, reading 42 into rax!
```

Wow! **This storing of addresses is _extremely_ common in programs**. **Addresses and data are stored, loaded, moved around**, and, sometimes, **mixed up with each other**! When that happens, **security issues can arise, and you'll romp through many such issues during your pwn.college journey**.

---
## Challenge 
For now, let's practice dereferencing an address stored in memory. I'll store a secret value at a secret address, then store that secret address at the address `567800`. You must read the address, dereference it, get the secret value, and then `exit` with it as the exit code. You got this!

**Note**
- On **x86-64 Linux**, the **`exit` syscall** takes the **exit code from `rdi`**.
    - `rax` → syscall number (60 for exit)
    - `rdi` → exit code
So whatever value you want the program to exit with (the secret), it **must be in `rdi`** when you do `syscall`.

=> My Approach:
```Assembly
.intel_syntax noprefix
.global _start

_start:
	mov rdi,567800 ; i'm wrong here 
	mov rdi,[rdi]
	mov rdi,[rdi] ; here as well
	mov rax, 60 ;always remember to put this in last
	syscall
```
that's wrong

=> Correct one

```Assembly
.intel_syntax noprefix
.global _start

_start:
    mov rdi, [567800]   ; rdi = secret_address (read from memory)
    mov rdi, [rdi]      ; rdi = secret_value (dereference secret_address)
    mov rax, 60         ; syscall number for exit
    syscall             ; exit(secret_value)
```

**Notes**

- **Memory can store addresses**, not just data.
- **Dereferencing** means “go to the memory at the address stored in a register or memory, and read its value.”
- You can have **multiple levels of dereferencing** (pointer → pointer → value).
- **Registers matter for syscalls:** `rdi` is the first argument (exit code here), so the secret must end up there.
![](content/cyber/pwn-college/module-4/3-computer-memory/_img/pasted-image-20250920235547.png)
