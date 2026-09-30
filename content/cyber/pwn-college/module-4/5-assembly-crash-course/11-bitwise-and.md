In this level, you will be working with registers. You will be asked to modify or read from registers.

We will set some values in memory dynamically before each run. On each run, the values will change. This means you will need to perform some type of formulaic operation with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it's `rax`.

In this level, you will be working with bit logic and operations. This will involve **heavy use of directly interacting with bits stored in a register or memory location**. You will also likely need to make use of the logic instructions in x86: `and`, `or`, `not`, `xor`.

**Bitwise logic** in assembly is yet **another interesting concept**! **x86 allows you to perform logic operations bit by bit on registers**.

For the sake of this example, say registers **only store 8 bits.**

The values in `rax` and `rbx` are:

- `rax = 10101010`
- `rbx = 00110011`

If we were to perform a bitwise AND of `rax` and `rbx` using the `and rax, rbx` instruction, the result would be calculated by **ANDing** each bit pair one by one, hence why it's called bitwise logic.

So from left to right:
-> **If one thing got wrong , another thing got wrong as well**
- 1 AND 0 = 0
- 0 AND 0 = 0
- 1 AND 1 = 1
- 0 AND 1 = 0
- ...

Finally, we combine the results together to get:

- `rax = 00100010`

Here are some truth tables for reference:

- **AND**
```
    A | B | X
    ---+---+---
    0 | 0 | 0
    0 | 1 | 0
    1 | 0 | 0
    1 | 1 | 1
```
 
- **OR**
    -> **if one is correct all are correct**
 ```
    A | B | X
    ---+---+---
    0 | 0 | 0
    0 | 1 | 1
    1 | 0 | 1
    1 | 1 | 1
```
    
- **XOR**
   -> **Same things makes 0 , different things makes 1**
```
    A | B | X
    ---+---+---
    0 | 0 | 0
    0 | 1 | 1
    1 | 0 | 1
    1 | 1 | 0
```


---

## Challenge

Without using the following instructions: `mov`, `xchg`
Please perform the following:

Set `rax` to the value of `(rdi AND rsi)`

---

**NOTE:** `rax` will have all bits set to `1` If it didn't, this level would be trickier!

=> My approach for that gonna be:
```Assembly
.intel_syntax noprefix
.global _start

_start:
	and rax,rdi
	and rax,rsi
```

*Notes*
```Notes
[Bitwise_Logic_Basics]
AND = "If one thing wrong → result wrong (only 1 & 1 = 1)"
OR  = "If one correct → result correct (any 1 = 1)"
XOR = "Same = 0, Different = 1"
NOT = "Flips each bit (1→0, 0→1)"

[Registers_Tip]
RAX = "Result usually stored here"
RDI = "1st function argument"
RSI = "2nd function argument"

[Challenge_Trick]
Given = "RAX initially has all bits set to 1"
CopyWithoutMOV = "Use AND with RAX=all1 to copy another register"
Example_Copy = "and rax, rdi ; makes rax = rdi"

[Solution_Logic]
Step1 = "and rax, rdi ; rax = rdi"
Step2 = "and rax, rsi ; rax = rdi AND rsi"
Final_Result = "(rdi AND rsi)"

[Extra_Tips]
Avoid_MOV = "Use logic ops (AND/OR/XOR) or arithmetic ops (ADD/SUB) to copy"
Check_TruthTables = "Always think bit by bit"

```
