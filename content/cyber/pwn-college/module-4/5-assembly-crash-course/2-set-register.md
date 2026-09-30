In this level, you will be working with registers. You will be asked to modify or read from registers.

In this level, you will work with registers! Please set the following:

`rdi = 0x1337`

---
## Challenge
=> My Approach for This is :
```Assembly
.intel_syntax noprefix
.global _start

_start:
mov rdi = 0x1337
mov rax,60
syscall
```

![](content/cyber/pwn-college/module-4/5-assembly-crash-course/_img/pasted-image-20250924160625.png)
