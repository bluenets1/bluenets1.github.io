Expanding your server’s capabilities further, this challenge focuses on handling HTTP POST requests concurrently. POST requests are more complex because they include both headers and a message body. You will once again use [fork](https://man7.org/linux/man-pages/man2/fork.2.html) to manage multiple connections, while using [read](https://man7.org/linux/man-pages/man2/read.2.html) to capture the entire request. Again, you will parse the URL path to determine the specified file, but this time instead of reading from that file, you will instead write to it with the incoming POST data. In order to do so, you must determine the length of the incoming POST data. The _obvious_ way to do this is to parse the `Content-Length` header, which specifies exactly that. Alternatively, consider using the return value of [read](https://man7.org/linux/man-pages/man2/read.2.html) to determine the total length of the request, parsing the request to find the total length of the headers (which end with `\r\n\r\n`), and using that difference to determine the length of the body--this seemingly more complicated algorithm may actually be easier to implement. Finally, return just a `200 OK` response to the client to indicate that the POST request was successful.

```assembly
.intel_syntax noprefix
.globl _start

.section .data
# Socket address structure for binding
addr:
    .word 2              # AF_INET (address family)
    .word 0x5000         # Port 80 in network byte order (0x5000 = htons(80))
    .long 0              # INADDR_ANY (0.0.0.0)
    .quad 0              # Padding to make it 16 bytes

# HTTP response header
hdr:
    .ascii "HTTP/1.0 200 OK\r\n\r\n"

.section .bss
# Buffer to store incoming HTTP request (8KB)
.lcomm req, 8192

.section .text
_start:
    # socket(AF_INET, SOCK_STREAM, 0)
    # Create a TCP socket
    mov eax, 41          # syscall number for socket
    mov edi, 2           # AF_INET
    mov esi, 1           # SOCK_STREAM
    xor edx, edx         # protocol = 0 (default)
    syscall
    mov r15, rax         # Save socket fd in r15 (server socket)

    # bind(sockfd, &addr, 16)
    # Bind socket to port 80 on all interfaces
    mov rdi, r15         # socket fd
    lea rsi, [rip+addr]  # pointer to address structure
    mov edx, 16          # address structure size
    mov eax, 49          # syscall number for bind
    syscall

    # listen(sockfd, 0)
    # Start listening for connections
    xor esi, esi         # backlog = 0
    mov eax, 50          # syscall number for listen
    syscall

accept_loop:
    # accept(sockfd, NULL, NULL)
    # Wait for and accept incoming connection
    mov rdi, r15         # server socket fd
    xor esi, esi         # addr = NULL (we don't need client address)
    xor edx, edx         # addrlen = NULL
    mov eax, 43          # syscall number for accept
    syscall
    mov r12, rax         # Save client socket fd in r12

    # fork()
    # Create child process to handle the connection
    mov eax, 57          # syscall number for fork
    syscall
    test rax, rax        # Check if we're parent or child
    jnz parent           # If rax != 0, we're parent (rax = child PID)

child:
    # Child process handles the connection
    
    # close(server_socket)
    # Child doesn't need the listening socket
    mov rdi, r15         # server socket fd
    mov eax, 3           # syscall number for close
    syscall

    # read(client_socket, req, 8192)
    # Read the entire HTTP POST request
    mov rdi, r12         # client socket fd
    lea rsi, [rip+req]   # buffer to store request
    mov edx, 8192        # buffer size
    xor eax, eax         # syscall number for read
    syscall
    mov r14, rax         # Save total bytes read in r14

    # Parse the URL path from the request
    # Request format: "POST /path/to/file HTTP/1.1\r\n..."
    lea rbx, [rip+req]   # rbx points to start of request
    lea rsi, [rbx+5]     # rsi points to path (skip "POST ")
    mov rcx, rsi         # rcx will scan for end of path

pfind:
    # Find the space after the path
    cmp byte ptr [rcx], ' '  # Check if current char is space
    je pdone                  # If yes, we found the end
    inc rcx                   # Move to next character
    jmp pfind

pdone:
    # Null-terminate the path string
    mov byte ptr [rcx], 0    # Replace space with null terminator
                              # Now rsi points to null-terminated path

hfind:
    # Find the end of HTTP headers (marked by \r\n\r\n)
    # We're looking for 0x0a0d0a0d (little-endian for \r\n\r\n)
    cmp dword ptr [rbx], 0x0a0d0a0d  # Check 4 bytes at once
    je hdone                          # If found, headers are done
    inc rbx                           # Move to next byte
    jmp hfind

hdone:
    # rbx now points to start of \r\n\r\n
    add rbx, 4           # Skip past \r\n\r\n to start of body

    # Calculate body length
    # body_length = total_bytes_read - (body_start - request_start)
    mov r13, r14         # r13 = total bytes read
    lea rax, [rip+req]   # rax = start of request buffer
    sub rbx, rax         # rbx = offset to body (header length)
    sub r13, rbx         # r13 = body length

    # open(path, O_WRONLY|O_CREAT, 0777)
    # Open/create the file for writing
    mov rdi, rsi         # filename (from path parsing)
    mov esi, 65          # O_WRONLY (1) | O_CREAT (64) = 65
    mov edx, 0777        # file permissions (rwxrwxrwx)
    mov eax, 2           # syscall number for open
    syscall
    mov r8, rax          # Save file fd in r8

    # Calculate pointer to body data
    lea rbx, [rip+req]   # rbx = start of request
    add rbx, r14         # rbx = end of request
    sub rbx, r13         # rbx = start of body (end - body_length)

    # write(file_fd, body_data, body_length)
    # Write POST body to the file
    mov rdi, r8          # file fd
    mov rsi, rbx         # pointer to body data
    mov rdx, r13         # body length
    mov eax, 1           # syscall number for write
    syscall

    # close(file_fd)
    mov rdi, r8          # file fd
    mov eax, 3           # syscall number for close
    syscall

    # write(client_socket, "HTTP/1.0 200 OK\r\n\r\n", 19)
    # Send success response to client
    mov rdi, r12         # client socket fd
    lea rsi, [rip+hdr]   # pointer to HTTP response header
    mov edx, 19          # response length
    mov eax, 1           # syscall number for write
    syscall

    # close(client_socket)
    mov rdi, r12         # client socket fd
    mov eax, 3           # syscall number for close
    syscall

    # exit(0)
    # Child process terminates
    xor edi, edi         # exit code = 0
    mov eax, 60          # syscall number for exit
    syscall

parent:
    # Parent process continues to accept new connections
    
    # close(client_socket)
    # Parent doesn't need the client socket
    mov rdi, r12         # client socket fd
    mov eax, 3           # syscall number for close
    syscall
    
    # Loop back to accept next connection
    jmp accept_loop
```
