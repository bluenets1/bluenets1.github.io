In this level, **you will be working with registers**. You will be asked to modify or read from registers.

We will now **set some values in memory dynamically before each run**. On each run, **the values will change**. This means you will need to d**o some type of formulaic operation** with registers. We will tell you **which registers are set beforehand** and where you should put the result. In most cases, it's `rax`.

Using your new knowledge, please compute the following:

- `f(x) = mx + b`, where:
    - `m = rdi`
    - `x = rsi`
    - `b = rdx`

Place the result into `rax`.

Note: T**here is an important difference between** `mul` (**unsigned multiply**) and `imul` (**signed multiply**) in terms of which registers are used. Look at the documentation on these instructions to see the difference.

In this case, you will want to use `imul`.

---
=> My Approach for this is:

```Assembly
.intel_syntax noprefix
.global _start

_start:
	mov rax,rdi ; here rax = rdi = m
	imul rax,rsi ; here m * rsi(x) , where m *=rsi ; and then it becomes mx
	add rax,rdx  ; here rax = mx + rdx
```

**Note**
```bash
We will now set the following in preparation for your code:
rdi = 0x2538
rsi = 0x68f
rdx = 0x8b6                                                  
Extracting binary code from provided ELF file...
Executing your code...
---------------- CODE ---------------- 
0x400000:       mov     rax, rdi                                                        0x400003:       imul    rax, rsi
0x400007:       add     rax, rdx
--------------------------------------                                                                                    

```
