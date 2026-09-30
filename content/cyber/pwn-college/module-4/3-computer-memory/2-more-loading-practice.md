You look like you need just a tiny bit more practice. In this level, we put the secret value at `123400` instead of `133700`, as so:

```text
  Address │ Contents
+────────────────────+
│ 123400  │ ???      │
+────────────────────+
```

Go load it into `rdi` and `exit` with that as the exit code!

## **My Approach of Doing This**

```Assembly
.intel_syntax noprefix
.global _start

_start:
	mov rax,60
	mov rdi, [123400]
	syscall
```

=> Again we're correct 
![](content/cyber/pwn-college/module-4/3-computer-memory/_img/pasted-image-20250920124803.png)
