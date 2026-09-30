Your first task is to create the simplest possible program—one that immediately terminates when run. In this challenge, you will use the [exit](https://man7.org/linux/man-pages/man2/_exit.2.html) syscall, which is responsible for ending a process and returning an exit status to the operating system. This syscall takes a single argument: the exit status (with `0` typically indicating success). Understanding how to cleanly exit a program is crucial because it ensures your process communicates its completion state properly.

> i first runned `/challenge/run` where i see the below script . where i need to create a `server.py` file and paste this script there. 
```assembly
.intel_syntax noprefix
.globl _start

.section .text

_start:
    mov rdi, 0
    mov rax, 60     # SYS_exit
    syscall

.section .data

```

 >After That i just runned `as -o server.o server.s && ld -o server server.o`
 
> After That i runned `/challenge/run ./server`

and i got the flag: `pwn.college{REDACTED}`

![](content/cyber/pwn-college/module-4/7-building-a-web-server/_img/pasted-image-20260110074811.png)
