In this level, you will be working with registers. You will be asked to modify or read from registers.

We will set some values in memory dynamically before each run. On each run, the values will change. This means you will need to perform some type of formulaic operation with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it is `rax`.

In this level, y**ou will be working with bit logic and operations**. This will involve **heavy use of directly interacting with bits stored in a register or memory location**. You will also likely need to **make use of the logic instructions in x86**: `and`, `or`, `not`, `xor`.


---
## Challenge
Using only the following instructions:
- `and`
- `or`
- `xor`

Implement the following logic:

```plaintext
if x is even then
  y = 1
else
  y = 0
```

Where:

- `x = rdi`
- `y = rax`

```Assembly
.intel_start noprefix
.global _start

_start:
and rax, 0       ; clear rax first
or  rax, rdi     ; rax = rdi
and rax, 1       ; keep only LSB
xor rax, 1       ; flip result → even=1, odd=0


```


=> **Serious Notes**

## Step 1: What does "even" mean in binary?

- A number is **even** if its **least significant bit (LSB)** = `0`.    
- A number is **odd** if its LSB = `1`.

Example (8-bit values):
`x = 6  → 00000110 → even (LSB = 0) x = 7  → 00000111 → odd  (LSB = 1)`
So all we need to do is **look at the LSB**.

---
## 🔎 Step 2: How to check LSB in assembly?
We can use:
`and rdi, 1`
This masks all bits except the LSB.
- If x was even → result = 0
- If x was odd → result = 1
---

## 🔎 Step 3: Required Output
We want:
`if even → y = 1 if odd  → y = 0`
But after `and rdi, 1`, we get:
`even → 0 odd  → 1`
That’s the opposite!  
So we just need to **flip** it.

---
## 🔎 Step 4: Flipping the result using XOR
Truth:
`0 XOR 1 = 1 1 XOR 1 = 0`
So if we XOR the result with `1`, we invert it.

=> Short Notes
```ini
[EvenOdd_Check]
EvenOddRule = "Even if LSB=0, Odd if LSB=1"
MaskLSB = "and rax, 1 → keeps only last bit"
FlipResult = "xor rax, 1 → inverts 0↔1"
FinalLogic = "y = ( (x & 1) XOR 1 )"
```
