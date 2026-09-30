With your socket bound to an address, you now need to prepare it to accept incoming connections. The [listen](https://man7.org/linux/man-pages/man2/listen.2.html) syscall transforms your socket into a passive one that awaits client connection requests. It requires the socket’s file descriptor and a backlog parameter, which sets the maximum number of queued connections. This step is vital because without marking the socket as listening, your server wouldn’t be able to receive any connection attempts.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
a:
    .word 2          ; sa_family = AF_INET
    .word 0x5000     ; sin_port = htons(80)
    .long 0          ; sin_addr = INADDR_ANY (0.0.0.0)
    .quad 0          ; padding to make sockaddr_in 16 bytes

.section .text
_start:
    mov eax, 41      ; rax = SYS_socket
    mov edi, 2       ; rdi = AF_INET
    mov esi, 1       ; rsi = SOCK_STREAM
    xor edx, edx     ; rdx = IPPROTO_IP (0)
    syscall          ; socket(AF_INET, SOCK_STREAM, 0)

    mov edi, eax     ; rdi = socket fd returned by socket()
    lea rsi, [rip+a] ; rsi = pointer to sockaddr_in
    mov edx, 16      ; rdx = sizeof(sockaddr_in)
    mov eax, 49      ; rax = SYS_bind
    syscall          ; bind(fd, &addr, 16)

    xor esi, esi     ; rsi = backlog = 0
    mov eax, 50      ; rax = SYS_listen
    syscall          ; listen(fd, 0)

    xor edi, edi     ; rdi = exit status 0
    mov eax, 60      ; rax = SYS_exit
    syscall          ; exit(0)
```
