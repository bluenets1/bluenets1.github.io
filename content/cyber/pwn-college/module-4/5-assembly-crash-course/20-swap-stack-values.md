We will now set some values in memory dynamically before each run. On each run the values will change. This means you will need to do some type of formulaic operation with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it's `rax`.

In this level, you will be **working with the stack**, the **memory region that dynamically expands and shrinks**. You will be required to **read and write to the stack**, **which may require you to use the `pop` and `push` instructions.** You may also need to use the stack pointer register (`rsp`) to know where the stack is pointing.

In this level, we are going to explore the last in first out (LIFO) property of the stack.

---
## Challenge
Using only the following instructions:
- `push`
- `pop`
Swap values in `rdi` and `rsi`.
Example:
- If to start `rdi = 2` and `rsi = 5`
- Then to end `rdi = 5` and `rsi = 2`

```assembly
.intel_syntax noprefix
.global _start
_start:

	push rdi
	push rsi
	
	pop rdi 
	pop rsi

```

***Notes***
=> How this swap works in assembly
![](content/cyber/pwn-college/module-4/5-assembly-crash-course/_img/pasted-image-20251006150728.png)

=> Stack grows downwards
