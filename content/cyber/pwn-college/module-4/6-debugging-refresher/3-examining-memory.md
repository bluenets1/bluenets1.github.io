Next, we'll learn to **use gdb to peek into process memory**!

You can e**x**amine the contents of **memory using** the `x/<n><u><f> <address>` **parameterized command**. In this format `<u>` is the **unit size to display**, `<f>` is the **format to display** it in, and `<n>` is the **number of elements to display**. Valid unit sizes are `b` (1 byte), `h` (2 bytes), `w` (4 bytes), and `g` (8 bytes). Valid formats are `d` (decimal), `x` (hexadecimal), `s` (string) and `i` (instruction). The address can be specified **using a register name, symbol name, or absolute address**. Additionally, you can supply mathematical expressions when specifying the address.

For example, `x/8i $rip` will **print the next 8 instructions** from the **current instruction pointer**. `x/16i main` will print **the first 16 instructions of main**. You can also **use `disassemble main`, or `disas main` for short**, to **print all of the instructions of main**. Alternatively, `x/16gx $rsp` will **print the first 16 values on the** **stack**. `x/gx $rbp-0x32` **will print the local variable stored there on the stack**.

You will probably want to **view your instructions using the CORRECT assembly syntax**. You can do that with **the command** `set disassembly-flavor intel`.

---
## info registers
You can refer to machine register contents, in expressions, as **variables with names starting with ‘$’**. The names of registers are different for each machine; **use info registers to see the names used on your machine.**

`info registers`
Print the names and values of all registers except floating-point and vector registers (in the selected stack frame).

`info all-registers`
Print the names and values of all registers, including floating-point and vector registers (in the selected stack frame).

`info registers reggroup` …
Print the name and value of the registers in each of the specified reggroups. The reggroup can be any of those returned by maint print reggroups (see Maintenance Commands).

`info registers regname` …
Print the relativized value of each specified register regname. As discussed in detail below, register values are normally relative to the selected stack frame. The regname may be any register name valid on the machine you are using, with or without the initial ‘$’.

---
## Examine
Use the `x` command to examine memory.
n, f, and u are all optional parameters that specify how much memory to display and how to format it; addr is an expression giving the address where you want to start displaying memory. If you use defaults for nfu, you need not type the slash ‘/’. Several commands set convenient defaults for addr.

**n, the repeat count**
The repeat count is a decimal integer; the default is 1. It specifies how much memory (counting by units u) to display. If a negative number is specified, memory is examined backward from addr.

**f, the display format**
The display format is one of the formats used by `print` (‘x’, ‘d’, ‘u’, ‘o’, ‘t’, ‘a’, ‘c’, ‘f’, ‘s’), ‘i’ (for machine instructions) and ‘m’ (for displaying memory tags). The default is ‘x’ (hexadecimal) initially. The default changes each time you use either `x` or `print`.

**u, the unit size**

The unit size is any of
`b` - Bytes.
`h` -Half words (two bytes).
`w` - Words (four bytes). This is the initial default.
`g` - Giant words (eight bytes).

---
### Challenge
In order to solve this level, you must figure out the **random value on the stack** (the value read in from `/dev/urandom`). Think about what the arguments to the read system call are.

=>
```lua
- `fd` → arg1 → `rdi`
    
- `buf` → arg2 → `rsi`
    
- `count` → arg3 → `rdx`
```

---
i don't understand how it happened but i use **claude** , coz even **chatgpt** can't solved that
=> at first i opened it using .
```lua
$ /challenge/embroyo_level3
```
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251030161013.png)

=> then i got into gdb and inside gdb i run the `run` command
=> it results me with challenge description.
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251030161202.png)

=> i set the flavour to intel to understand that what the program is trying to say me
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251030161309.png)

=> then i got to know that what it does , from At <+414>: lea rax,[rbp-0x18] - This loads the address of rbp-0x18 into rax
At <+418>: mov edx,0x8 - 8 bytes to read
At <+423>: mov rsi,rax - The buffer address (rbp-0x18) goes into rsi
At <+428>: call read@plt - The read syscall is called

So the random value from /dev/urandom is stored at [rbp-0x18] (8 bytes).
The program is currently stopped at <+377> (right after the int3 at <+376>). We need to continue execution until after the read call, then examine the value at rbp-0x18.
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251030161423.png)

![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251030161453.png)

**RELEVANT DOCUMENTATION:**

- gdb's [run](https://sourceware.org/gdb/current/onlinedocs/gdb#Starting) command
- gdb's [continue](https://sourceware.org/gdb/current/onlinedocs/gdb#Continuing-and-Stepping) command
- gdb's [info](https://sourceware.org/gdb/current/onlinedocs/gdb#Registers) command
- gdb's [print](https://sourceware.org/gdb/current/onlinedocs/gdb#Data) command
- gdb's [examine](https://sourceware.org/gdb/current/onlinedocs/gdb#Memory) command


==> What is the **Stack Canary?**
-> This is a **security feature** to prevent buffer overflow attack
A **canary** is a secret random value placed on the stack:
```
Stack Layout:
+------------------+
| Return Address   |  ← Attacker wants to overwrite this
+------------------+
| Saved RBP        |
+------------------+
| CANARY VALUE     |  ← Random secret value (the guard!)
+------------------+
| Local Variables  |
| (your buffers)   |  ← Buffer overflow starts here
+------------------+

```

```dissassembly
   0x0000584657fcbabd <+23>:    mov    rax,QWORD PTR fs:0x28                               0x0000584657fcbac6 <+32>:    mov    QWORD PTR [rbp-0x8],rax
```
- `fs:0x28` is a special memory location containing a random value
- **Translation**: "Store the canary value at `rbp-0x8`"
