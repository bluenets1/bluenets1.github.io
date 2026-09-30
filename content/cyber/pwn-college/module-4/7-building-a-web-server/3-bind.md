After creating a socket, the next step is to assign it a network identity. In this challenge, you will use the [bind](https://man7.org/linux/man-pages/man2/bind.2.html) syscall to connect your socket to a specific IP address and port number. The call requires you to provide the socket file descriptor, a pointer to a `struct sockaddr` (specifically a `struct sockaddr_in` for IPv4 that holds fields like the address family, port, and IP address), and the size of that structure. Binding is essential because it ensures your server listens on a known address, making it reachable by clients.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
a:
    .word 2
    .word 0x5000
    .long 0
    .quad 0

.section .text
_start:
    mov eax, 41
    mov edi, 2
    mov esi, 1
    xor edx, edx
    syscall

    mov edi, eax
    lea rsi, [rip+a]
    mov edx, 16
    mov eax, 49
    syscall

    xor edi, edi
    mov eax, 60
    syscall

```
## What each part is doing

### `.data` section
This is a raw `sockaddr_in` laid out **exactly** how the kernel expects it:
```bash
word 2        → AF_INET .word 0x5000   → port 80 in network byte order .long 0       → INADDR_ANY (0.0.0.0) .quad 0 → padding to reach 16 bytes
```


`bind()` does **not** parse fields logically.  
It blindly reads 16 bytes from memory. Layout matters.

---

### `socket` syscall
`mov eax, 41 mov edi, 2 mov esi, 1 xor edx, edx syscall`
Registers before `syscall`:
```bash
rax = 41   → socket rdi = 2    → AF_INET rsi = 1    → SOCK_STREAM rdx = 0    → IPPROTO_IP
```
Return value:
- socket fd comes back in `rax`
---
### `bind` syscall

`mov edi, eax lea rsi, [rip+a] mov edx, 16 mov eax, 49 syscall`
Registers:
```bash
rax = 49 → bind rdi = socket fd rsi = &sockaddr_in rdx = 16 → sizeof(sockaddr_in)
```
This is why `.data` exists — `bind` needs a **pointer**, not values.

---
### `exit`
`xor edi, edi mov eax, 60 syscall`
`exit(0)`
Clean termination, checker-friendly.
