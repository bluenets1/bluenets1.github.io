In this level, you will be working with registers. You will be asked to modify or read from registers.

In this level, you will work with multiple registers. Please set the following:

- `rax = 0x1337`
- `r12 = 0xCAFED00D1337BEEF`
- `rsp = 0x31337`

---
## Challenge
=> My approach to solve this is :
```Assembly
.intel_syntax noprefix
.global _start
_start:
	movabs r12, 0xCAFED00D11337BEEF
	mov rsp, 0x31337
	mov rax, 0x1337
```

=> **Key Findings**
-> when we have to move the 64 bit full constant into `r12` , and in x86-64 it takes 32 bit character to normal mov , for 64 bits we required to make it absolute to feed more.
so we use it as : `movabs` 

-> and as given we have to provide `rax` the 0x1337 , and we doesn't have any syscall number for that so. we'll not write any syscall here .
