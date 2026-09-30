A critical part of working with computing is understanding what goes wrong when something inevitably does. This module will build on your prior exposure to GDB with some more _debugging_ of programs: digging in, poking around, and gaining knowledge. This is one of the most critical skills that you will learn in your computing journey, and this module will hopefully help water the seed that we planted before.

As you know, GDB is a very powerful dynamic analysis tool which you can use in order to understand the state of a program throughout its execution. You will become more familiar with some of its capabilities in this module.

[](https://github.com/pwncollege/cse365-f2025/edit/main/module-4/module.yml#L1 "Edit on GitHub")

**rip** always points to the next instruction which we need to execute
**print** $rax instead you can use **p** $rax as well
`x` -> examine (this will deference the value we give it)
`i`-> shows an instruction pointer register
`x/i $rax` but for multiple and how many you need . `x/10i $rax
`diassembler main`

if you wanted to check something about stack , you should look for stack pointer or rsp
```bash
(gdb) x/4i $rsp
   0x7fffffffdb18:      rex.WX xchg %rax,%rdx
   0x7fffffffdb1a:      fdivp  %st,%st(7)
   0x7fffffffdb1c:      (bad)
   0x7fffffffdb1d:      jg     0x7fffffffdb1f
(gdb) x/4gx $rsp
0x7fffffffdb18: 0x00007ffff7de924a      0x0000000000000000
0x7fffffffdb28: 0x0000555555555159      0x0000000200000000
```

`gx` -> this means to **giant hex values**
`d` -> this is for signed numbers
`u` -> this is for unsigned
`a` -> this if for address

-> print rsp as a number `p/d $rsp`
-> print rsp as an address `p/a $rsp`
=> casting in gdb
`p/a  * (long *) $rsp`

-> gdb define things in a variable  denoted with $
```bash
(gdb) printf "%lx", $5
7fffffffdb18(gdb) printf "%lx\n", $5
7fffffffdb18
```

`si` -> step instruction
`ni` -> next instruction


for using display
`display/a $rip`

```bash
(gdb) disass main
Dump of assembler code for function main:
   0x0000555555555159 <+0>:     push   %rbp
   0x000055555555515a <+1>:     mov    %rsp,%rbp
=> 0x000055555555515d <+4>:     sub    $0x20,%rsp
   0x0000555555555161 <+8>:     mov    %edi,-0x4(%rbp)
   0x0000555555555164 <+11>:    mov    %rsi,-0x10(%rbp)
   0x0000555555555168 <+15>:    mov    %rdx,-0x18(%rbp)
   0x000055555555516c <+19>:    cmpl   $0x1,-0x4(%rbp)
   0x0000555555555170 <+23>:    jg     0x55555555518b <main+50>
   0x0000555555555172 <+25>:    lea    0xe8b(%rip),%rax        # 0x555555556004
   0x0000555555555179 <+32>:    mov    %rax,%rdi
   0x000055555555517c <+35>:    call   0x555555555030 <puts@plt>
   0x0000555555555181 <+40>:    mov    $0x1,%edi
   0x0000555555555186 <+45>:    call   0x555555555050 <exit@plt>
   0x000055555555518b <+50>:    mov    -0x4(%rbp),%edx
   0x000055555555518e <+53>:    mov    -0x10(%rbp),%rax
   0x0000555555555192 <+57>:    mov    %edx,%esi
   0x0000555555555194 <+59>:    mov    %rax,%rdi
   0x0000555555555197 <+62>:    call   0x5555555551a3 <my_hello_function>
   0x000055555555519c <+67>:    mov    $0x0,%eax
   0x00005555555551a1 <+72>:    leave
   0x00005555555551a2 <+73>:    ret
End of assembler dump.
(gdb) p/a $rip
$10 = 0x55555555515d <main+4>
(gdb) si
0x0000555555555161 in main ()
(gdb) si
0x0000555555555164 in main ()
(gdb) si
0x0000555555555168 in main ()
(gdb) display/a $rip
1: /a $rip = 0x555555555168 <main+15>
(gdb) si
0x000055555555516c in main ()
1: /a $rip = 0x55555555516c <main+19>
(gdb) display/4i *(long *) $rip
2: x/4i *(long *) $rip
   0x8d48197f01fc7d83:
```
