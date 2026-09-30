# Getting Your Program to the Right State

This is about **navigating through your program** to reach the exact spot where you want to investigate a bug or behaviour.
## Moving Through Your Code (Execution Control)
### **Step Commands - Move Instruction by Instruction**
```bash
(gdb) stepi       # or si    - Execute ONE instruction, go INTO functions
(gdb) stepi 5     # or si 5  - Execute 5 instructions at once

(gdb) nexti       # or ni    - Execute ONE instruction, SKIP OVER functions  
(gdb) nexti 10    # or ni 10 - Execute 10 instructions, skipping function calls
```
**🔑 KEY DIFFERENCE:**
- `stepi` (si) = **Goes INTO** function calls (detailed view)
- `nexti` (ni) = **Steps OVER** function calls (faster, less detail)

### **Other Movement Commands**
```bash
(gdb) finish              # Run until current function returns
(gdb) continue            # or c - Run until next breakpoint
(gdb) break *0x401234     # Set breakpoint at specific memory address
```
## Keeping Track While You Move (Display Commands)
Instead of typing the same command repeatedly, **auto-display** information:
### **Display Command - Auto-Show Information**
```bash
(gdb) display/8i $rip     # Always show next 8 instructions
(gdb) display/4gx $rsp    # Always show top 4 stack values
```
**Format:** `display/<count><unit><format>`
- Same syntax as `x` (examine) command
- Updates automatically after each step!
### **Layout Command - Visual Mode**
```bash
(gdb) layout regs         # Show all registers + nearby instructions in TUI mode
```
This gives you a **split-screen view** - super helpful for seeing everything at once!

---
#### MOST IMPORTANT POINTS TO HIGHLIGHT

### 1. **You Control the State Now** 
- Previously, breakpoints were set FOR you
- Now YOU decide where to pause and investigate
- This is critical for real debugging!
### 2. **si vs ni - Know the Difference** 
```
stepi (si)  → Step INTO functions (detailed)
nexti (ni)  → Step OVER functions (faster)
```
**When to use:**
- `si`: When you need to debug INSIDE a function
- `ni`: When you trust a function and want to skip it
### 3. **Display = Your Dashboard** 
```bash
display/8i $rip    # Your "always-on" instruction view
display/4gx $rsp   # Your "always-on" stack view
```
- Shows info automatically after EVERY step
- No need to retype commands constantly
- Essential for tracking changes!
### 4. **Break at Addresses** 
```bash
break *0x401234    # Set breakpoint at exact memory location
```
- Different from `break function_name`
- Useful when you know the exact address you want to stop at
### 5. **Finish Command** 
```bash
finish    # "Get me out of this function!"
```
- Runs until current function returns
- Saves time when you're deep in a call you don't care about

## Real Workflow Example
```bash
# 1. Set breakpoint at specific address
(gdb) break *0x401000

# 2. Run program
(gdb) run

# 3. Set up your "dashboard"
(gdb) display/8i $rip      # See instructions
(gdb) display/4gx $rsp     # See stack

# 4. Step through carefully
(gdb) si                   # Step one instruction
(gdb) ni 5                 # Skip ahead 5 instructions
(gdb) finish               # Get out of this function

# 5. Continue to next breakpoint
(gdb) continue
```

## Pro Tip Summary

|Command|Use When...|
|---|---|
|`si`|You want to see EVERYTHING (including inside functions)|
|`ni`|You want to move fast (skip function internals)|
|`finish`|You're stuck in a function you don't care about|
|`display`|You want to monitor something continuously|
|`layout regs`|You want a visual dashboard|
|`break *addr`|You know the exact address to stop at|

- **Bottom line:** These tools let you **navigate precisely** to the program state you want to analyse, and **monitor** what's happening along the way! .
---
=> **CLAUDE TAUGHT BASICS**
**What's a breakpoint?** It's a marker that tells your program "stop here so I can look around." Like putting a bookmark in a book.
- **Most Common ways to use break**
  ```bash
(gdb) break main                # Stop at the start of main()
(gdb) b function_name      # Stop at any function
(gdb) b 42                          # Stop at line 42
(gdb) b file.c:15                  # Stop at line 15 in file.c
  ```

**Quick versions:**
- `b` is short for `break` (less typing!)
- `tbreak` = temporary break (stops once, then deletes itself)

**Seeing Your Breakpoints**
```bash
(gdb) info breakpoints     # Shows all your breakpoints
(gdb) info break           # Same thing, shorter
```
You'll see a table like:
```
Num   Type        What
1     breakpoint  at main.c:24
2     breakpoint  at calculate()
```

## Controlling Breakpoints
**Turn them on/off:**
```bash
(gdb) disable 1            # Turn off breakpoint #1
(gdb) enable 1             # Turn it back on
(gdb) delete 1             # Remove it completely
```

## Conditional Breakpoints (Smart Breaks!)
Instead of stopping _every_ time, only stop when something is true:
```bash
(gdb) break 25 if x == 10      # Only stop when x equals 10
(gdb) break func if count > 100 # Only stop if count is over 100
```
This is super useful in loops! Instead of stopping 1000 times, stop only when something interesting happens.

## Challenge 
- In order to solve this level, you must figure out a **series of random values** which will be placed on the **stack**. As before, `run` will start you out, but it will interrupt the program and you must, carefully, continue its execution.

- You are highly encouraged to try using combinations of `stepi`, `nexti`, `break`, `continue`, and `finish` to make sure you have a good internal understanding of these commands. The commands are all absolutely critical to navigating a program's execution.



**RELEVANT DOCUMENTATION:**
- gdb's [run](https://sourceware.org/gdb/current/onlinedocs/gdb#Starting) command
- gdb's [continue](https://sourceware.org/gdb/current/onlinedocs/gdb#Continuing-and-Stepping) command
- gdb's [info](https://sourceware.org/gdb/current/onlinedocs/gdb#Registers) command
- gdb's [print](https://sourceware.org/gdb/current/onlinedocs/gdb#Data) command
- gdb's [examine](https://sourceware.org/gdb/current/onlinedocs/gdb#Memory) command
- gdb's [break](https://sourceware.org/gdb/current/onlinedocs/gdb#Set-Breaks) command
- gdb's [display](https://sourceware.org/gdb/current/onlinedocs/gdb#Auto-Display) command
- gdb's [various stepping commands](https://sourceware.org/gdb/current/onlinedocs/gdb#Continuing-and-Stepping) command (that whole section)

**NOTE:** This challenge will require you to _read_ and _understand_ assembly! Don't worry, this skill will come in quite handy later in pwn.college.

---
`rip` always points to the next instruction


# pwn.college - EmbryoGDB Level 4 Writeup
**Challenge:** `/challenge/embryogdb_level4`
**Objective:** Use GDB to bypass a random value check and retrieve the flag.

---
## 1. Initial Analysis
Upon starting the challenge, we are dropped into a GDB session debugging the `/challenge/embryogdb_level4` binary. The challenge description informs us that we need to figure out a series of random values placed on the stack to proceed.
### Disassembling Main
The first step is to understand the program flow. We disassemble the `main` function:

```gdb
(gdb) disas main
```
Key observations from the disassembly:
- **Random Value Generation**: The program opens `/dev/urandom` and reads 8 bytes into `[rbp-0x18]`.
- **User Input**: It uses `scanf` with the format string `%llx` to read a value into `[rbp-0x10]`.
- **Comparison**: It compares the value at `[rbp-0x10]` (our input) with the value at `[rbp-0x18]` (the random value).
- **Loop**: This process repeats 4 times (controlled by a counter at `[rbp-0x1c]`).
- **Win Condition**: If all comparisons pass, it calls the `win` function.

```bash
(gdb) disas main
Dump of assembler code for function main:
=> 0x000057c622ea6aa6 <+0>:     endbr64 
   0x000057c622ea6aaa <+4>:     push   %rbp
   0x000057c622ea6aab <+5>:     mov    %rsp,%rbp
   0x000057c622ea6aae <+8>:     sub    $0x40,%rsp
   0x000057c622ea6ab2 <+12>:    mov    %edi,-0x24(%rbp)
   0x000057c622ea6ab5 <+15>:    mov    %rsi,-0x30(%rbp)
   0x000057c622ea6ab9 <+19>:    mov    %rdx,-0x38(%rbp)
   0x000057c622ea6abd <+23>:    mov    %fs:0x28,%rax
   0x000057c622ea6ac6 <+32>:    mov    %rax,-0x8(%rbp)
   0x000057c622ea6aca <+36>:    xor    %eax,%eax
   0x000057c622ea6acc <+38>:    cmpl   $0x0,-0x24(%rbp)
   0x000057c622ea6ad0 <+42>:    jg     0x57c622ea6af1 <main+75>
   0x000057c622ea6ad2 <+44>:    lea    0x1070(%rip),%rcx        # 0x57c622ea7b49 <__PRETTY_FUNCTION__.5345>
   0x000057c622ea6ad9 <+51>:    mov    $0x51,%edx
   0x000057c622ea6ade <+56>:    lea    0x54c(%rip),%rsi        # 0x57c622ea7031
   0x000057c622ea6ae5 <+63>:    lea    0x6d0(%rip),%rdi        # 0x57c622ea71bc
   0x000057c622ea6aec <+70>:    callq  0x57c622ea61f0 <__assert_fail@plt>
   0x000057c622ea6af1 <+75>:    lea    0x6cd(%rip),%rdi        # 0x57c622ea71c5
   0x000057c622ea6af8 <+82>:    callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6afd <+87>:    mov    -0x30(%rbp),%rax
   0x000057c622ea6b01 <+91>:    mov    (%rax),%rax
   0x000057c622ea6b04 <+94>:    mov    %rax,%rsi
   0x000057c622ea6b07 <+97>:    lea    0x6bb(%rip),%rdi        # 0x57c622ea71c9
   0x000057c622ea6b0e <+104>:   mov    $0x0,%eax
   0x000057c622ea6b13 <+109>:   callq  0x57c622ea61d0 <printf@plt>
   0x000057c622ea6b18 <+114>:   lea    0x6a6(%rip),%rdi        # 0x57c622ea71c5
   0x000057c622ea6b1f <+121>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6b24 <+126>:   mov    $0xa,%edi
   0x000057c622ea6b29 <+131>:   callq  0x57c622ea6170 <putchar@plt>
   0x000057c622ea6b2e <+136>:   mov    0x24eb(%rip),%rax        # 0x57c622ea9020 <stdin@@GLIBC_2.2.5>
   0x000057c622ea6b35 <+143>:   mov    $0x0,%ecx
   0x000057c622ea6b3a <+148>:   mov    $0x2,%edx
   0x000057c622ea6b3f <+153>:   mov    $0x0,%esi
   0x000057c622ea6b44 <+158>:   mov    %rax,%rdi
   0x000057c622ea6b47 <+161>:   callq  0x57c622ea6240 <setvbuf@plt>
   0x000057c622ea6b4c <+166>:   mov    0x24bd(%rip),%rax        # 0x57c622ea9010 <stdout@@GLIBC_2.2.5>
   0x000057c622ea6b53 <+173>:   mov    $0x1,%ecx
   0x000057c622ea6b58 <+178>:   mov    $0x2,%edx
   0x000057c622ea6b5d <+183>:   mov    $0x0,%esi
   0x000057c622ea6b62 <+188>:   mov    %rax,%rdi
   0x000057c622ea6b65 <+191>:   callq  0x57c622ea6240 <setvbuf@plt>
   0x000057c622ea6b6a <+196>:   lea    0x66f(%rip),%rdi        # 0x57c622ea71e0
   0x000057c622ea6b71 <+203>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6b76 <+208>:   lea    0x6db(%rip),%rdi        # 0x57c622ea7258
   0x000057c622ea6b7d <+215>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6b82 <+220>:   lea    0x72f(%rip),%rdi        # 0x57c622ea72b8
   0x000057c622ea6b89 <+227>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6b8e <+232>:   lea    0x79b(%rip),%rdi        # 0x57c622ea7330
   0x000057c622ea6b95 <+239>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6b9a <+244>:   lea    0x807(%rip),%rdi        # 0x57c622ea73a8
   0x000057c622ea6ba1 <+251>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6ba6 <+256>:   lea    0x833(%rip),%rdi        # 0x57c622ea73e0
   0x000057c622ea6bad <+263>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bb2 <+268>:   lea    0x89f(%rip),%rdi        # 0x57c622ea7458
   0x000057c622ea6bb9 <+275>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bbe <+280>:   lea    0x90b(%rip),%rdi        # 0x57c622ea74d0
   0x000057c622ea6bc5 <+287>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bca <+292>:   lea    0x977(%rip),%rdi        # 0x57c622ea7548
   0x000057c622ea6bd1 <+299>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bd6 <+304>:   lea    0x9db(%rip),%rdi        # 0x57c622ea75b8
   0x000057c622ea6bdd <+311>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6be2 <+316>:   lea    0xa47(%rip),%rdi        # 0x57c622ea7630
   0x000057c622ea6be9 <+323>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bee <+328>:   lea    0xab3(%rip),%rdi        # 0x57c622ea76a8
   0x000057c622ea6bf5 <+335>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6bfa <+340>:   lea    0xab7(%rip),%rdi        # 0x57c622ea76b8
   0x000057c622ea6c01 <+347>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c06 <+352>:   lea    0xb23(%rip),%rdi        # 0x57c622ea7730
   0x000057c622ea6c0d <+359>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c12 <+364>:   lea    0xb8f(%rip),%rdi        # 0x57c622ea77a8
   0x000057c622ea6c19 <+371>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c1e <+376>:   lea    0xbfb(%rip),%rdi        # 0x57c622ea7820
   0x000057c622ea6c25 <+383>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c2a <+388>:   lea    0xc67(%rip),%rdi        # 0x57c622ea7898
   0x000057c622ea6c31 <+395>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c36 <+400>:   lea    0xcdb(%rip),%rdi        # 0x57c622ea7918
   0x000057c622ea6c3d <+407>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c42 <+412>:   lea    0xd07(%rip),%rdi        # 0x57c622ea7950
   0x000057c622ea6c49 <+419>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c4e <+424>:   lea    0xd73(%rip),%rdi        # 0x57c622ea79c8
   0x000057c622ea6c55 <+431>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c5a <+436>:   lea    0xde7(%rip),%rdi        # 0x57c622ea7a48
   0x000057c622ea6c61 <+443>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c66 <+448>:   lea    0xe4f(%rip),%rdi        # 0x57c622ea7abc
   0x000057c622ea6c6d <+455>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6c72 <+460>:   int3   
   0x000057c622ea6c73 <+461>:   nop
   0x000057c622ea6c74 <+462>:   movl   $0x0,-0x1c(%rbp)
   0x000057c622ea6c7b <+469>:   jmpq   0x57c622ea6d2b <main+645>
   0x000057c622ea6c80 <+474>:   mov    $0x0,%esi
   0x000057c622ea6c85 <+479>:   lea    0xe3c(%rip),%rdi        # 0x57c622ea7ac8
   0x000057c622ea6c8c <+486>:   mov    $0x0,%eax
   0x000057c622ea6c91 <+491>:   callq  0x57c622ea6250 <open@plt>
   0x000057c622ea6c96 <+496>:   mov    %eax,%ecx
   0x000057c622ea6c98 <+498>:   lea    -0x18(%rbp),%rax
   0x000057c622ea6c9c <+502>:   mov    $0x8,%edx
   0x000057c622ea6ca1 <+507>:   mov    %rax,%rsi
   0x000057c622ea6ca4 <+510>:   mov    %ecx,%edi
   0x000057c622ea6ca6 <+512>:   callq  0x57c622ea6210 <read@plt>
   0x000057c622ea6cab <+517>:   lea    0xe26(%rip),%rdi        # 0x57c622ea7ad8
   0x000057c622ea6cb2 <+524>:   callq  0x57c622ea6190 <puts@plt>
   0x000057c622ea6cb7 <+529>:   lea    0xe3a(%rip),%rdi        # 0x57c622ea7af8
   0x000057c622ea6cbe <+536>:   mov    $0x0,%eax
   0x000057c622ea6cc3 <+541>:   callq  0x57c622ea61d0 <printf@plt>
   0x000057c622ea6cc8 <+546>:   lea    -0x10(%rbp),%rax
   0x000057c622ea6ccc <+550>:   mov    %rax,%rsi
   0x000057c622ea6ccf <+553>:   lea    0xe31(%rip),%rdi        # 0x57c622ea7b07
   0x000057c622ea6cd6 <+560>:   mov    $0x0,%eax
   0x000057c622ea6cdb <+565>:   callq  0x57c622ea6260 <__isoc99_scanf@plt>
   0x000057c622ea6ce0 <+570>:   mov    -0x10(%rbp),%rax
   0x000057c622ea6ce4 <+574>:   mov    %rax,%rsi
   0x000057c622ea6ce7 <+577>:   lea    0xe1e(%rip),%rdi        # 0x57c622ea7b0c
   0x000057c622ea6cee <+584>:   mov    $0x0,%eax
   0x000057c622ea6cf3 <+589>:   callq  0x57c622ea61d0 <printf@plt>
   0x000057c622ea6cf8 <+594>:   mov    -0x18(%rbp),%rax
   0x000057c622ea6cfc <+598>:   mov    %rax,%rsi
   0x000057c622ea6cff <+601>:   lea    0xe17(%rip),%rdi        # 0x57c622ea7b1d
   0x000057c622ea6d06 <+608>:   mov    $0x0,%eax
   0x000057c622ea6d0b <+613>:   callq  0x57c622ea61d0 <printf@plt>
   0x000057c622ea6d10 <+618>:   mov    -0x10(%rbp),%rdx
   0x000057c622ea6d14 <+622>:   mov    -0x18(%rbp),%rax
   0x000057c622ea6d18 <+626>:   cmp    %rax,%rdx
   0x000057c622ea6d1b <+629>:   je     0x57c622ea6d27 <main+641>
   0x000057c622ea6d1d <+631>:   mov    $0x1,%edi
   0x000057c622ea6d22 <+636>:   callq  0x57c622ea6280 <exit@plt>
   0x000057c622ea6d27 <+641>:   addl   $0x1,-0x1c(%rbp)
   0x000057c622ea6d2b <+645>:   cmpl   $0x3,-0x1c(%rbp)
   0x000057c622ea6d2f <+649>:   jle    0x57c622ea6c80 <main+474>
   0x000057c622ea6d35 <+655>:   mov    $0x0,%eax
   0x000057c622ea6d3a <+660>:   callq  0x57c622ea697d <win>
   0x000057c622ea6d3f <+665>:   mov    $0x0,%eax
   0x000057c622ea6d44 <+670>:   mov    -0x8(%rbp),%rcx
   0x000057c622ea6d48 <+674>:   xor    %fs:0x28,%rcx
   0x000057c622ea6d51 <+683>:   je     0x57c622ea6d58 <main+690>
   0x000057c622ea6d53 <+685>:   callq  0x57c622ea61c0 <__stack_chk_fail@plt>
   0x000057c622ea6d58 <+690>:   leaveq 
   0x000057c622ea6d59 <+691>:   retq   
End of assembler dump.
```
---
## 2. Exploitation Strategy
Since the "random" value is stored in memory before we are asked for input, we can use GDB to inspect the memory and read the value directly.
### Step 1: Set a Breakpoint
We need to stop the program after the random value has been loaded into memory but before the `scanf` call. Looking at the disassembly, the `scanf` call is at an offset within `main`.

```gdb
0x000057c622ea6cdb <+565>: callq 0x57c622ea6260 <__isoc99_scanf@plt>
```
  
We set a breakpoint at this address:
```gdb
(gdb) break *0x57c622ea6cdb
```
### Step 2: Run and Inspect
Run the program. When it hits the breakpoint, the random value for the current iteration is already at `[rbp-0x18]`.
```gdb
(gdb) run
...
Breakpoint 1, 0x000057c622ea6cdb in main ()
```  
Now, inspect the 8-byte value (giant hex) at `$rbp-0x18`:
```gdb
(gdb) x/gx $rbp-0x18
0x7ffec4f01f68: 0x6a1b5dc623991b45
```
### Step 3: Provide the Input
Continue the execution and provide the value we just found:
```gdb
(gdb) continue
6a1b5dc623991b45
```
  
---
## 3. Repeating the Process
The loop runs 4 times. We repeat the "Inspect and Input" process for each iteration.
1. **Iteration 1**: Value `0x6a1b5dc623991b45` -> Success.
2. **Iteration 2**: Value `0x0b43a4343c4ed319` -> Success.
3. **Iteration 3**: Value `0xc8e143b5edb2ec8f` -> Success.
4. **Iteration 4**: Value `0xcf6a82d9872c6923` -> Success.

![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20260105164145.png)
---
## 4. Retrieving the Flag
After the fourth correct input, the program calls the `win` function, which prints the flag.
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20260105164210.png)
**Flag:**
`pwn.college{REDACTED}`

---
## Summary of GDB Commands Used
- `disas main`: View the assembly code of the main function.
- `break *<address>`: Set a breakpoint at a specific instruction.
- `run`: Start the program.
- `x/gx $rbp-0x18`: Examine memory as a 64-bit hex value.
- `continue`: Resume program execution.

---
#### In case if you don't understand the gdb :
### 1. Focus on the "Big Three" Registers
- `$rip` (**Instruction Pointer**): This is the "You Are Here" marker. It points to the next instruction the CPU will execute.
- `$rbp` **and** `$rsp` (**Stack Pointers**): These manage the "Stack."
  - `$rbp` (**Base Pointer**) is like a fixed anchor for the current function.
  - `$rsp` (**Stack Pointer**) moved as data is **pushed** or **popped**.
  - **Tip:** If you see `[rbp - 0x10]`, it's almost always a local variable.
- `$rax` This is the "**Return Value**" register. After a function call(like `scanf` or `open`), the result is usually stored here.
### 2. Learn the "Common Patterns"
Compilers follow predictable rules. Instead of reading line-by-line, look for these shapes:
- **The Function Call Pattern:**
```nasm
mov rdi, 0x400500  ; 1st argument
mov rsi, rax       ; 2nd argument
call 0x400400 <func>
```
In x86_64 Linux, arguments go in this order:
`RDI,RSI,RDX,RCX,R8,R9,` . if you see `mov rdi, ...` followed by a `call` , the program is setting up a function's first input.

- **The Comparison (If-Statement) Pattern:**
```nasm
cmp rax, rdx       ; Compare two values
je  0x400600       ; Jump if Equal (JE)
```
Whenever you see `cmp` followed by a `j` (jump)instruction(like `je` , `jne` , `jg`, `jl` ),it's an `if` statement or a loop.

- **The Local Variable Pattern:**
```nasm
lea rax, [rbp-0x10]
mov rsi, rax
```

`LEA` stands for "**Load Effective Address**." It basically means "**get the memory address of this variable**." This is often used when passing a variable to `scanf` or `read` .

### 3. Use GDB to "See" the Code
Don't just read the static disassembly. Use GDB to watch it change:
- `layout regs` : This is a game-changer. It shows you the assembly and the registers in real-time. As you `stepi` (**step instruction**), you can see exactly which register changes.
- `x/s $rdi` : If you see a function call, check what's in the arguments. If
  `rdi` is an argument, `x/s $rdi` will show you if it's a string (like "**Enter password**:").

### 4. Translate to "Pseudo-C"
When you see a block of code, try to write it out in simple English or Python/C:
```nasm
mov [rbp-0x4], 0 → int i == 0; 
add [rbp-0x4], 1 → i++; 
cmp [rbp-0x4], 9 → if (i == 9)
```

---
### Summary
Alright, this is solid thinking already. Now let’s turn it into a **clean, no-BS README** you can drop straight into Obsidian and actually _use_ during CTFs or RE sessions.

---

# GDB Reverse Engineering Playbook
**Finding the Secret, Every Time**
This guide focuses on the core idea behind most RE challenges:  
👉 _The program always compares your input with a secret._  
Your job is to **pause execution at the right moment and look at memory**.

---

## 1. Find the **Comparison** (The Moment of Truth)
Almost every binary has a point where it checks:
> “Is the user’s input equal to the secret?”
### What to look for
- `cmp`
- `test`
### Why this matters
This is the **sweet spot**.  
If the program is doing something like:

```
cmp rax, [rbp-0x18]
```
Then **one of these is the secret**.
### Action
1. Set a breakpoint **exactly on the comparison instruction**.
2. Inspect what’s being compared.
Useful commands:

```
info registers
x/gx <address>
```
---
## 2. Find the **Input Sink** (Where You Talk to the Program)
You want to stop execution **before** the program waits for your input.
### What to look for
- `call scanf`
- `call read`
- `call gets`
- `call fgets`
### Why this matters
By the time the program asks for your input, it often has **already generated the correct answer** and placed it somewhere in memory.
### Action
1. Set a breakpoint **at the input function call**.
2. Inspect the stack and nearby memory.
**Common stack peek:**
```
x/20gx $rsp
```
You’re looking for values that _don’t belong to you_.

---
## 3. Trace the **Secret’s Origin** (Where the Secret Is Born)
If the program does something shady _before_ asking for input, that’s a huge clue.
### What to look for
- `open("/dev/urandom")`
- `call rand`
- Reads from weird memory locations
### Why this matters
This is the moment the secret is **created**.
### Action
If you see something like:
```
read(fd, buffer, 8)
```
And the file is `/dev/urandom`:
- Set a breakpoint **after the read**
- The secret is now inside `buffer`
---
## Example: Choosing Breakpoints in a Real Challenge
### 1. The Birth
The program reads from `/dev/urandom` into:
```
[rbp-0x18]
```
Conclusion:
> The secret lives at `rbp-0x18`
---
### 2. The Ask
The program calls `scanf` and stores your input at:
```
[rbp-0x10]
```
Thought process:
> If I break at `scanf`, I can inspect `rbp-0x18` **before typing anything**
---
### 3. The Check
Later, the program executes:
```
cmp rax, rdx
```
Where:
- `rax` = your input
- `rdx` = the secret
Thought process:
> If I miss it earlier, I can **definitely** catch it here
---
## The Golden Rule of `x` (Examine)
Use `x` **whenever a register is treated like a pointer**.
### Case 1: Memory Access
Assembly:
```
mov rax, [rbp-0x18]
```
Think:
> “What’s stored there?”

Command:
```
x/gx $rbp-0x18
```

---
### Case 2: String Loading
Assembly:
```
lea rdi, [rip+0xe26]
```

Think:
> “This is probably a string (printf, puts, etc.)”


```
x/s $rip+0xe26
```
---
## Final Checklist (Tattoo This)
- Disassemble `main`
- Locate the `cmp` instruction
- Identify registers / memory being compared
- Break **before** the comparison (ideally at `scanf` or the `cmp` itself.)
- Use `x` to inspect memory
- Extract secret
- Profit 🏴‍☠️
---
