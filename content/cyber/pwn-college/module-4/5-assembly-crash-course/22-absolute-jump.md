We will now set some values in memory dynamically before each run. On each run, the values will change. This means you will need to do some type of formulaic operation with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it's `rax`.

In this level, you will be working with control flow manipulation. This **involves using instructions to both indirectly and directly control the special register `rip`**, the **instruction pointer**. You will use instructions such as `jmp`, `call`, `cmp`, and their alternatives to implement the requested behaviour.

Earlier, you learned how to manipulate data in a pseudo-control way, but **x86 gives us actual instructions to manipulate control flow directly.**

There are two major ways to **manipulate control flow**:
- **Through a jump**
- **Through a call**

In this level, **you will work with jumps.**
There are **two types of jumps:**
- **Unconditional jumps**
- **Conditional jumps**

**Unconditional jumps always trigger and are not based on the results of earlier instructions**.

As you know, **memory locations can store data and instructions**. Your **code will be stored at `0x400042` (this will change each run).**

=> ***For all jumps, there are three types:***
- *Relative jumps: jump + or - the next instruction.*
- *Absolute jumps: jump to a specific address.*
- *Indirect jumps: jump to the memory address specified in a register.*

In x86, absolute jumps (jump to a specific address) are accomplished by first loading the target address into a general-purpose register (we'll call this placeholder `reg`), then doing `jmp reg`.

---
## Challenge
In this level, we will ask you to do an absolute jump. Perform the following: Jump to the absolute address `0x403000`.
=> and we're right in this challenge

```assembly
.intel_syntax noprefix
.global _start
_start:

	mov rax, 0x403000
	jmp rax
```

and this is actually the example of unconditional + indirect jumps .


=> Here we have the list and notes of type of jumps:
## Two Major Ways to Manipulate Control Flow
1. **Through a jump** (`jmp`)
    - CPU moves to another instruction **without returning**
2. **Through a call** (`call`)
    - CPU moves to a function **and remembers return address** for `ret`
This module focuses on **jumps**.
---
## 🏷️ Types of Jumps
### Unconditional Jump
- Always jumps, no conditions.
- Example: `jmp <address>`
### Conditional Jump
- Jumps **only if a condition is met** (like compare result).
- Examples: `je` (jump if equal), `jne`, `jg`, `jl` etc.
---
## 3 Types of Jump Target Addresses
1. **Relative jump**
    - Jump **forward/backward** relative to **next instruction**.
    - Example: `jmp +0x10` (skip 16 bytes ahead)
2. **Absolute jump**
    - Jump to a **specific memory address**.
    - Example: jump to `0x403000`
3. **Indirect jump**
    - Jump to **address stored in a register**.
    - Example:
```assembly
mov rax, 0x403000
jmp rax
```

```results
We will now set the following in preparation for your code:
  Loading your given code at: 0x4000fd

Extracting binary code from provided ELF file...
Executing your code...
---------------- CODE ----------------
0x4000fd:       mov     rax, 0x403000
0x400104:       jmp     rax
--------------------------------------
pwn.college{REDACTED}
```
