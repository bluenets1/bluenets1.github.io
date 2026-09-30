We will now set some values in memory dynamically before each run. On each run, the values will change. This means you will need to do some type of formulaic operation with registers. We will tell you which registers are set beforehand and where you should put the result. In most cases, it's `rax`.

---
## Challenge

In this level, you will be working with memory. This will require you to read or write to things stored linearly in memory. If you are confused, go look at the linear addressing module in 'ike. You may also be asked to dereference things, possibly multiple times, to things we dynamically put in memory for your use.

Please perform the following: Place the value stored in `rax` to `0x404000`.

```Assembly
.intel_syntax noprefix
.global _start
_start:

mov [0x404000],rax
```

```ini
Please perform the following:
  Place the value stored in rax to 0x404000

We will now set the following in preparation for your code:
  rax = 0x17f70c

Extracting binary code from provided ELF file...
Executing your code...
---------------- CODE ----------------
0x400000:       mov     qword ptr [0x404000], rax
--------------------------------------
pwn.college{REDACTED}
```
