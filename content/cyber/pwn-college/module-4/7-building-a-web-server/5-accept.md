Once your socket is listening, it’s time to actively accept incoming connections. In this challenge, you will use the [accept](https://man7.org/linux/man-pages/man2/accept.2.html) syscall, which waits for a client to connect. When a connection is established, it returns a new socket file descriptor dedicated to communication with that client and fills in a provided address structure (such as a `struct sockaddr_in`) with the client’s details. This process is a critical step in transforming your server from a passive listener into an active communicator.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
addr:
    .word 2          ; AF_INET
    .word 0x5000     ; htons(80)
    .long 0          ; INADDR_ANY
    .quad 0          ; padding

.section .text
_start:
    mov eax, 41      ; socket
    mov edi, 2
    mov esi, 1
    xor edx, edx
    syscall

    mov edi, eax     ; bind
    lea rsi, [rip+addr]
    mov edx, 16
    mov eax, 49
    syscall

    xor esi, esi     ; listen backlog = 0
    mov eax, 50
    syscall

    xor esi, esi     ; accept(addr = NULL)
    xor edx, edx     ; accept(addrlen = NULL)
    mov eax, 43      ; accept
    syscall          ; blocks until client connects

    xor edi, edi     ; exit(0)
    mov eax, 60
    syscall
```
