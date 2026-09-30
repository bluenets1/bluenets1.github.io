Now that your server can establish connections, it’s time to learn how to send data. In this challenge, your goal is to send a fixed HTTP response (`HTTP/1.0 200 OK\r\n\r\n`) to any client that connects. You will use the [write](https://man7.org/linux/man-pages/man2/write.2.html) syscall, which requires a file descriptor, a pointer to a data buffer, and the number of bytes to write. This exercise is important because it teaches you how to format and deliver data over the network.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
addr:
    .word 2                  ; AF_INET
    .word 0x5000             ; port 80 in network byte order (htons(80))
    .long 0                  ; INADDR_ANY (0.0.0.0)
    .quad 0                  ; padding to make sockaddr_in = 16 bytes

resp:
    .ascii "HTTP/1.0 200 OK\r\n\r\n"   ; fixed HTTP response

.section .bss
.lcomm buf, 1024             ; buffer to read client request

.section .text
_start:
    mov eax, 41              ; SYS_socket
    mov edi, 2               ; AF_INET
    mov esi, 1               ; SOCK_STREAM
    xor edx, edx             ; IPPROTO_IP (0)
    syscall                  ; socket(AF_INET, SOCK_STREAM, 0)

    mov edi, eax             ; socket fd -> rdi
    lea rsi, [rip+addr]      ; pointer to sockaddr_in
    mov edx, 16              ; sizeof(sockaddr_in)
    mov eax, 49              ; SYS_bind
    syscall                  ; bind(fd, &addr, 16)

    xor esi, esi             ; backlog = 0
    mov eax, 50              ; SYS_listen
    syscall                  ; listen(fd, 0)

    xor esi, esi             ; addr = NULL
    xor edx, edx             ; addrlen = NULL
    mov eax, 43              ; SYS_accept
    syscall                  ; accept(fd, NULL, NULL)
                             
    mov edi, eax             ; client socket fd

    lea rsi, [rip+buf]       ; buffer for request
    mov edx, 1024            ; max bytes to read
    xor eax, eax             ; SYS_read
    syscall                  ; read(client_fd, buf, 1024)

    mov esi, edi             ; client fd (write arg 1)
    lea rsi, [rip+resp]      ; pointer to HTTP response
    mov edx, 19              ; length of response
    mov eax, 1               ; SYS_write
    syscall                  ; write(client_fd, response, 19)

    mov eax, 3               ; SYS_close
    syscall                  ; close(client_fd)

    xor edi, edi             ; exit status 0
    mov eax, 60              ; SYS_exit
    syscall                  ; exit(0)

```
