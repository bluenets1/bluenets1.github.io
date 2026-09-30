Okay, let's learn about one more register: `rsi`! Like `rdi`, `rsi` is a place you can park some data. For example:

```assembly
mov rsi, 42
```

Of course, you can also move data around between registers! Watch:

```assembly
mov rsi, 42
mov rdi, rsi
```

Just like the first line there moves `42` into `rsi`, the second line moves the value in `rsi` to `rdi`. Here, we have to mention one complication: by _move_, we really mean _set_. After the snippet above, `rsi` _and_ `rdi` will be `42`. It's a mystery as to why the `mov` was chosen rather than something reasonable like `set` (even very knowledgeable people resort to [wild speculation](https://retrocomputing.stackexchange.com/questions/12968/why-is-the-processor-instruction-called-move-not-copy) when asked), but it was, and here we are.

---
## Challenge

Anyways, on to the challenge! In this challenge, we will store a secret value in the `rsi` register, and your program must exit with that value as the return code. Since `exit` uses the value stored in `rdi` as the return code, you'll need to move the secret value in `rsi` into `rdi`. Run `/challenge/check` and pass it your code for the flag! `/challenge/check` will set the secret value in `rsi` before running your code. Good luck!

=> What my approach was:

```Assembly
.intel_syntax noprefix
.global _start
_start:

mov rsi, SECRET_VAL
mov rdi, rsi
syscall
```

=> But that's totally wrong of it.
=> Correct one is :

```Assembly
.intel_syntax noprefix
.global _start
_start:

mov rax, 60 ; as we want an exit (we always need to set it here)
mov rdi,rsi ; copying the stuff from first argumnent to second argument
syscall
```

# CHATGPT EXAMPLE
In **x86-64 System V ABI** (ABI: Application Binary Interface) (the convention Linux and most Unix systems follow):
### Role of registers in function calls and syscalls
- **RAX**    
    - Used to store the **syscall number** (for syscalls).
    - Also used for the **return value** (both syscalls and functions).
- **RDI, RSI, RDX, RCX, R8, R9**
    - Used to pass **arguments** to functions or syscalls.
    - Order:
        - 1st argument → **RDI**
        - 2nd argument → **RSI**
        - 3rd argument → **RDX**
        - 4th argument → **R10** (for syscalls; in functions it’s RCX)
        - 5th argument → **R8**
        - 6th argument → **R9**
So:
- If you call a function like `foo(x, y)`, then `x` goes into **RDI** and `y` goes into **RSI**.
- For syscalls, same thing:
![](content/cyber/pwn-college/module-4/1-assembly/_img/pasted-image-20250919171027.png)

# **NOTE**
### **RAX**
- A **general-purpose register** (just like RDI, RSI, RBX, etc.).
- But by **ABI convention** it’s often used for:
    - **Return values** from functions
    - **Syscall numbers** (on Linux x86-64, when using `syscall`)
    - Temporary calculations (since it’s just a register, you can store anything in it too).
So RAX is not “special by hardware,” it’s special because the **ABI says** “put return values here” and “put syscall numbers here.”

---
### **RDI, RSI**
- Also **general-purpose registers**.
- But the ABI says:
    - **RDI = 1st argument** to a function/syscall
    - **RSI = 2nd argument**
(Then RDX = 3rd, RCX/R10 = 4th, R8 = 5th, R9 = 6th).

---
✅ So your understanding is correct in context:
- **RAX** = result/return/syscall number (by convention)
- **RDI, RSI** = argument registers (by convention)
But remember 👉 you can still use them as “normal registers” for your own calculations if you want — it only matters when you’re _interfacing with OS or functions_.
