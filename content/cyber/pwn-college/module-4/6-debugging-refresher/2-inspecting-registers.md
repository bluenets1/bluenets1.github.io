Next, we'll learn about **how to print out the values of registers.**

You can see the values for **all your registers with** `info registers`. Alternatively, you can also just **print a particular register's value** with the `print` **command, or `p` for short**. For example, `p $rdi` will **print the value of $rdi in decimal**. You can also **print its value in hex with** `p/x $rdi`.

## Challenge
In order to solve this level, you must figure out the current random value of register r12 in hex.

As before, start the challenge, invoke the `run` gdb command, then follow the instructions. When you've printed out what you need, remember to `continue` to move on to the next step of the challenge!

#### [how i solved that]
=> i first run `/challenge/embryogdb_level2` it opens me the gdb
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251016162101.png)

=> then i typed run , to see the challenge description
![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251016162245.png)

=> for completing the challenge i ran
```lua
(gdb) info registers
```
-> where that returns me
```lua
(gdb) info registers
registers:     value in hex:       value in decimals or pointers
rax            0x20                32
rbx            0x611dc35c2cb0      106780459543728
rcx            0x77b44d5b1297      131616275632791
rdx            0x0                 0
rsi            0x77b44d690723      131616276547363
rdi            0x77b44d6917e0      131616276551648
rbp            0x7ffc203958c0      0x7ffc203958c0
rsp            0x7ffc20395880      0x7ffc20395880
r8             0x20                32
r9             0x2c                44
r10            0x0                 0
r11            0x246               582
r12            0x882a9a0de86e059e  -8634919951004727906
r13            0x7ffc203959b0      140720849115568
r14            0x0                 0
r15            0x0                 0
rip            0x611dc35c2bfd      0x611dc35c2bfd <main+343>
eflags         0x246               [ PF ZF IF ]
cs             0x33                51
ss             0x2b                43
ds             0x0                 0
es             0x0                 0
fs             0x0                 0
gs             0x0                 0
```

=> i checked the value of r12 here , and after that for matching the value by using

```lua
(gdb) p/x $r12
$1 = 0x882a9a0de86e059e
```

=> after getting this value , i **continue** running the program to  get the flag
```lua
(gdb) c
Continuing.
Random value: 0x882a9a0de86e059e
You input: 882a9a0de86e059e
The correct answer is: 882a9a0de86e059e
You win! Here is your flag:
pwn.college{REDACTED}
```

==> And that's how we got the flag

### Commands Learned in gdb
=> **c or continue** for continue running the program
=> **p/x $r12** for printing the hex value of register `/x` for hex value
=> **info registers** for checking the registers present in the program
=> **starti or si** starts program **at the very first instruction** (before `main`)


---

**RELEVANT DOCUMENTATION:**

- gdb's [run](https://sourceware.org/gdb/current/onlinedocs/gdb#Starting) command
- gdb's [continue](https://sourceware.org/gdb/current/onlinedocs/gdb#Continuing-and-Stepping) command
- gdb's [info](https://sourceware.org/gdb/current/onlinedocs/gdb#Registers) command
- gdb's [print](https://sourceware.org/gdb/current/onlinedocs/gdb#Data) command
