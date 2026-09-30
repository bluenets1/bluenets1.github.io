In this challenge, your server evolves to handle dynamic content based on HTTP GET requests. You will first use the [read](https://man7.org/linux/man-pages/man2/read.2.html) syscall to receive the incoming HTTP request from the client socket. By examining the request line--particularly, in this case, the URL path--you can determine what the client is asking for. Next, use the [open](https://man7.org/linux/man-pages/man2/open.2.html) syscall to open the requested file and [read](https://man7.org/linux/man-pages/man2/read.2.html) to read its contents. Send the file contents back to the client using the [write](https://man7.org/linux/man-pages/man2/write.2.html) syscall. This marks a significant step toward interactivity, as your server begins tailoring its output rather than simply echoing a static message.

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

    mov rdi, rax
    lea rsi, [rip+addr]
    mov edx, 16
    mov eax, 49
    syscall

    xor esi, esi
    mov eax, 50
    syscall

    xor esi, esi
    xor edx, edx
    mov eax, 43
    syscall

    mov r12, rax

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
```
