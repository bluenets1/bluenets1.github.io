In this level, you will work with control flow manipulation. This involves using instructions to indirectly and directly control the special register `rip`, the instruction pointer. You will use instructions such as `jmp`, `call`, `cmp`, and their alternatives to implement the requested behaviour.

We will be testing your code multiple times in this level with dynamic values! This means we will run your code in various random ways to verify that the logic is robust enough to survive normal use.

The **last jump type is the indirect jump**, often used for **switch statements** in the real world. **Switch statements** are a special case of **if-statements** that use only numbers to determine where the control flow will go.

Here is an example:

```
switch(number):
  0: jmp do_thing_0
  1: jmp do_thing_1
  2: jmp do_thing_2
  default: jmp do_default_thing
```

The switch in this example works on `number`, which can either be 0, 1, or 2. I**f `number` is not one of those numbers, the default triggers.** You can consider this a **reduced else-if type structure**. In x86, you are already used to using numbers, so it should be no surprise that you can make if statements based on something being an exact number. Additionally, if you know the range of the numbers, a switch statement works very well.

Take, for instance, the existence of a jump table. A **jump table is a contiguous section of memory that holds addresses of places to jump.**

In the above example, the jump table could look like:

```
[0x1337] = address of do_thing_0
[0x1337+0x8] = address of do_thing_1  ; [addr + offset] 8 bytes
[0x1337+0x10] = address of do_thing_2 ; 16 bytes
[0x1337+0x18] = address of do_default_thing_3 ; 24 bytes
```

Using the jump table, we can greatly reduce the amount of `cmps` we use. Now all we need to check is if `number` is greater than 2. If it is, always do:

```
jmp [0x1337+0x18]
```

Otherwise:

```
jmp [jump_table_address + number * 8]
```

---
## Challenge
Using the above knowledge, implement the following logic:

```plaintext
if rdi is 0:
  jmp 0x40301e
else if rdi is 1:
  jmp 0x4030da
else if rdi is 2:
  jmp 0x4031d5
else if rdi is 3:
  jmp 0x403268
else:
  jmp 0x40332c
```

Please do the above with the following constraints:

- Assume `rdi` will NOT be negative.
- Use no more than 1 `cmp` instruction.
- Use no more than 3 jumps (of any variant).
- We will provide you with the number to 'switch' on in `rdi`.
- We will provide you with a jump table base address in `rsi`.

Here is an example table:

```
[0x40427c] = 0x40301e (addrs will change) (+0x00)
[0x404284] = 0x4030da (+0x8)
[0x40428c] = 0x4031d5 (+0x10)
[0x404294] = 0x403268 (+0x18)
[0x40429c] = 0x40332c (+0x20)
```

=> My Approach

```Assembly
.intel_syntax noprefix
.global _start
_start:
    cmp rdi, 3
	ja default
	mov rax, rdi
	imul rax, 8
	add rax, rsi
	mov rax, [rax]
	jmp rax
default:
	mov rax, rsi
	add rax, 32
	mov rax, [rax]
	jmp rax
```

**Note**
```nudes
rsi points to jump_table:
[jump_table+0] = 0x403043   ; rdi=0
[jump_table+8] = 0x4030fa   ; rdi=1
[jump_table+16] = 0x4031db  ; rdi=2
[jump_table+24] = 0x40327a  ; rdi=3
[jump_table+32] = 0x403383  ; default
```

=> start from below
3 pehle
