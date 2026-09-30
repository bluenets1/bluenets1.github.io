Previously, your server served just one GET request before terminating. Now, you will modify it so that it can handle multiple GET requests sequentially. This involves wrapping the accept-read-write-close sequence in a loop. Each time a client connects, your server will accept the connection, process the GET request, and then cleanly close the client session while remaining active for the next request. This iterative approach is essential for building a persistent server.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
addr:
    .word 2                  ; AF_INET
    .word 0x5000             ; port 80 in network byte order
    .long 0                  ; INADDR_ANY (0.0.0.0)
    .quad 0                  ; padding to 16 bytes

hdr:
    .ascii "HTTP/1.0 200 OK\r\n\r\n"   ; HTTP response header

.section .bss
.lcomm req, 1024             ; buffer for HTTP request
.lcomm filebuf, 4096         ; buffer for file contents

.section .text
_start:
    mov eax, 41              ; SYS_socket
    mov edi, 2               ; AF_INET
    mov esi, 1               ; SOCK_STREAM
    xor edx, edx             ; IPPROTO_IP
    syscall                  ; socket()

    mov r15, rax             ; save listening socket fd permanently

    mov rdi, r15             ; bind(listen_fd, &addr, 16)
    lea rsi, [rip+addr]
    mov edx, 16
    mov eax, 49              ; SYS_bind
    syscall

    xor esi, esi             ; backlog = 0
    mov eax, 50              ; SYS_listen
    syscall

accept_loop:
    mov rdi, r15             ; always accept on listening socket
    xor esi, esi             ; addr = NULL
    xor edx, edx             ; addrlen = NULL
    mov eax, 43              ; SYS_accept
    syscall                  ; accept()

    mov r12, rax             ; client socket fd

    mov rdi, r12             ; read(client_fd, req, 1024)
    lea rsi, [rip+req]
    mov edx, 1024
    xor eax, eax             ; SYS_read
    syscall

    lea rsi, [rip+req+4]     ; skip "GET "
    mov rcx, rsi

find:
    cmp byte ptr [rcx], ' '  ; scan until space after path
    je done
    inc rcx
    jmp find

done:
    mov byte ptr [rcx], 0    ; null-terminate path string

    mov rdi, rsi             ; open(path, O_RDONLY)
    xor esi, esi
    mov eax, 2               ; SYS_open
    syscall

    mov r13, rax             ; file fd

    mov rdi, r13             ; read(file_fd, filebuf, 4096)
    lea rsi, [rip+filebuf]
    mov edx, 4096
    xor eax, eax
    syscall

    mov r14, rax             ; save number of bytes read

    mov rdi, r13             ; close(file_fd)
    mov eax, 3               ; SYS_close
    syscall

    mov rdi, r12             ; write(client_fd, HTTP header)
    lea rsi, [rip+hdr]
    mov edx, 19
    mov eax, 1               ; SYS_write
    syscall

    mov rdi, r12             ; write(client_fd, file contents)
    lea rsi, [rip+filebuf]
    mov edx, r14d
    mov eax, 1               ; SYS_write
    syscall

    mov rdi, r12             ; close(client_fd)
    mov eax, 3               ; SYS_close
    syscall

    jmp accept_loop          ; wait for next connection

```
