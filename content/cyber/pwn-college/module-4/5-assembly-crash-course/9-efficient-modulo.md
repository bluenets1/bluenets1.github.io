In this level, you will be working with registers. You will be asked to modify or read from registers.

We will set some values in memory dynamically before each run. On each run, the values will change. This means you will need to perform some type of **formulaic operation** with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it's `rax`.

It turns out that using the **`div` operator to compute the modulo operation is slow!**

We can use a **math trick to optimise the modulo operator** (`%`). Compilers use this trick a lot.

If we have `x % y`, and `y` is a power of 2, such as `2^n`, the result will be the lower `n` bits of `x`.

Therefore, we can use the lower register byte access to efficiently implement modulo!

## How to Classify the modulo bytes
```Note
- Case 1: % 256
256 = 2^8
So the remainder is the lowest 8 bits of rdi.
In register terms:
Lowest 8 bits of rdi = dil.
If you move that into al → you have rax = rdi % 256.
- Case 2: % 65536
65536 = 2^16
So the remainder is the lowest 16 bits of rsi.
In register terms:
Lowest 16 bits of rsi = si.
If you move that into bx → you have rbx = rsi % 65536.
```

=> **Lower bits in rdi**
```notes
RDI = 64 bits
└─ EDI = low 32 bits
   └─ DI = low 16 bits
      ├─ DIL = low 8 bits
      └─ [no "dh"/"dl" split here in new regs]
```

=> **Lower bits in rsi**
```notes
RSI = 64 bits
└─ ESI = low 32 bits
   └─ SI = low 16 bits
      └─ SIL = low 8 bits
```

=> **Lower bits of rbx** 
```NOTES
RBX = 64 bits
└─ EBX = low 32 bits
	└─ BX = low 16 bits
		└─ BL = low 8 bits
```

---

## Challenge
Using only the following instruction(s):
- `mov` ; we have to use only this one , no other like div , mul
Please compute the following:
- `rax = rdi % 256`  
- `rbx = rsi % 65536`

=> My Approach
```Assembly
.intel_syntax noprefix
.global _start

_start:
	mov al,dil ; 8 lower bits
	mov bx,si ;  16 lower bits
```

*Note*
- Always remember both the registers have to change when you're lowering the byte of one
- Use that register lower bits given above

```Flag
will now set the following in preparation for your code:
  rdi = 0x8856
  rsi = 0x6909f98d

Extracting binary code from provided ELF file...
Executing your code...
---------------- CODE ----------------
0x400000:       mov     al, dil
0x400003:       mov     bx, si
--------------------------------------
pwn.college{REDACTED}
```
