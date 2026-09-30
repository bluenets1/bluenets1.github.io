To enable your server to handle several clients at once, you will introduce concurrency using the [fork](https://man7.org/linux/man-pages/man2/fork.2.html) syscall. When a client connects, [fork](https://man7.org/linux/man-pages/man2/fork.2.html) creates a child process dedicated to handling that connection. Meanwhile, the parent process immediately returns to accept additional connections. With this design, the child uses [read](https://man7.org/linux/man-pages/man2/read.2.html) and [write](https://man7.org/linux/man-pages/man2/write.2.html) to interact with the client, while the parent continues to listen. This concurrent model is a key concept in building scalable, real-world servers.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
addr:
    .word 2
    .word 0x5000
    .long 0
    .quad 0

hdr:
    .ascii "HTTP/1.0 200 OK\r\n\r\n"

.section .bss
.lcomm req, 1024
.lcomm filebuf, 4096

.section .text
_start:
    mov eax, 41
    mov edi, 2
    mov esi, 1
    xor edx, edx
    syscall

    mov r15, rax                 ; listening socket fd

    mov rdi, r15
    lea rsi, [rip+addr]
    mov edx, 16
    mov eax, 49
    syscall

    xor esi, esi
    mov eax, 50
    syscall

accept_loop:
    mov rdi, r15
    xor esi, esi
    xor edx, edx
    mov eax, 43
    syscall

    mov r12, rax                 ; client fd

    mov eax, 57                  ; fork
    syscall

    test rax, rax
    jnz parent                   ; parent if rax != 0

child:
    mov rdi, r15                 ; child closes listening socket
    mov eax, 3
    syscall

    mov rdi, r12
    lea rsi, [rip+req]
    mov edx, 1024
    xor eax, eax
    syscall

    lea rsi, [rip+req+4]
    mov rcx, rsi
find:
    cmp byte ptr [rcx], ' '
    je done
    inc rcx
    jmp find
done:
    mov byte ptr [rcx], 0

    mov rdi, rsi
    xor esi, esi
    mov eax, 2
    syscall

    mov r13, rax

    mov rdi, r13
    lea rsi, [rip+filebuf]
    mov edx, 4096
    xor eax, eax
    syscall

    mov r14, rax

    mov rdi, r13
    mov eax, 3
    syscall

    mov rdi, r12
    lea rsi, [rip+hdr]
    mov edx, 19
    mov eax, 1
    syscall

    mov rdi, r12
    lea rsi, [rip+filebuf]
    mov edx, r14d
    mov eax, 1
    syscall

    mov rdi, r12
    mov eax, 3
    syscall

    xor edi, edi
    mov eax, 60
    syscall

parent:
    mov rdi, r12                 ; parent closes client socket
    mov eax, 3
    syscall

    jmp accept_loop
```
