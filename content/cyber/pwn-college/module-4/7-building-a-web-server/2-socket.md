In this challenge, you’ll begin your journey into networking by creating a socket using the [socket](https://man7.org/linux/man-pages/man2/socket.2.html) syscall. A socket is the basic building block for network communication; it serves as an endpoint for sending and receiving data. When you invoke [socket](https://man7.org/linux/man-pages/man2/socket.2.html), you provide three key arguments: the domain (for example, `AF_INET` for IPv4), the type (such as `SOCK_STREAM` for TCP), and the **protocol** (usually set to `0` to choose the default). Mastering this syscall is important because it lays the foundation for all subsequent network interactions.

---

**NOTE:** Looking through documentation, the arguments of the system calls are listed as names in all capitals. For instance, we may wish to call `socket(AF_INET, SOCK_STREAM, 0)` but we cannot simply perform `mov rdi, AF_INET`: `AF_INET` is simply not a concept at the assembly level. We need to find the integer which corresponds to `AF_INET`. These numbers are not even found in the man pages, but these numbers do exist on your machine. Check out the `/usr/include` directory. All the system's general-use include files for C programming are placed here. (For those who have written C, think of any header files you've included in your code "`#include <stdio.h>`". All those Functions and constants are defined somewhere here). Since C is compiled to assembly, these numbers are present somewhere in this directory. Rather than manually searching, you can [grep](https://pwn.college/linux-luminarium/commands/) for them.

> All these mean to say is , when we write a code in c the terms `AF_INET` , `SOCK_STREAM` , `IP_PROTOCOL` are already get set , but here in assembly we don't knew we now need to search in using grep, what there defined values are in `/usr/include` directory, but there are a lot of files. So we're gonna use `grep` here to find out.

```bash
grep -R "AF_INET" /usr/include && grep -R "SOCK_STREAM" /usr/include
```

![](content/cyber/pwn-college/module-4/7-building-a-web-server/_img/pasted-image-20260110081457.png)

> we got these values , now in assembly code , we just need to write them, with the syscall of socket which is `41` 

```assembly
.intel_syntax noprefix
.global _start

.section .text
_start:
    mov rax, 41 ; Socket Syscall
    mov rdi, 2  ; AF_INET
    mov rsi, 1  ; SOCK_STREAM
    xor rdx, rdx ; PROTOCOL
    syscall

    xor rdi, rdi 
    mov rax, 60 ;Exit Syscall Code
    syscall

```

```bash
as -o server.o server.s && ld -o server server.o
```
> and after running , `/challenge/run ./server` we'll get the flag

> Flag: `pwn.college{REDACTED}`

![](content/cyber/pwn-college/module-4/7-building-a-web-server/_img/pasted-image-20260110082011.png)
