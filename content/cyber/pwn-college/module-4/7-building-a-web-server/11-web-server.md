In the final challenge, your server must seamlessly support both GET and POST requests within a single program. After reading the incoming request using [read](https://man7.org/linux/man-pages/man2/read.2.html), your server will inspect the first few characters to determine whether it is dealing with a GET or a POST. Depending on the request type, it will process the data accordingly and then send back an appropriate response using [write](https://man7.org/linux/man-pages/man2/write.2.html). Throughout this process, [fork](https://man7.org/linux/man-pages/man2/fork.2.html) is employed to handle each connection concurrently, ensuring that your server can manage multiple requests at the same time. After completing this, you will have built a simple, but fully functional, web server capable of handling different types of HTTP requests.

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

# HTTP response header for successful response
hdr:
    .ascii "HTTP/1.0 200 OK\r\n\r\n"

.section .bss
# Buffer to store incoming HTTP request (8KB)
.lcomm req, 8192
# Buffer to store file contents for GET requests (8KB)
.lcomm file_buf, 8192

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
    # Read the entire HTTP request
    mov rdi, r12         # client socket fd
    lea rsi, [rip+req]   # buffer to store request
    mov edx, 8192        # buffer size
    xor eax, eax         # syscall number for read
    syscall
    mov r14, rax         # Save total bytes read in r14

    # Determine request type by checking first 4 bytes
    # "GET " = 0x20544547 (little-endian)
    # "POST" = 0x54534f50 (little-endian)
    lea rbx, [rip+req]   # rbx points to start of request
    mov eax, dword ptr [rbx]  # Load first 4 bytes
    cmp eax, 0x20544547  # Compare with "GET "
    je handle_get        # If GET, jump to GET handler
    # Otherwise, assume it's POST and fall through

handle_post:
    # Parse the URL path from POST request
    # Request format: "POST /path/to/file HTTP/1.1\r\n..."
    lea rsi, [rbx+5]     # rsi points to path (skip "POST ")
    mov rcx, rsi         # rcx will scan for end of path

post_pfind:
    # Find the space after the path
    cmp byte ptr [rcx], ' '  # Check if current char is space
    je post_pdone            # If yes, we found the end
    inc rcx                  # Move to next character
    jmp post_pfind

post_pdone:
    # Null-terminate the path string
    mov byte ptr [rcx], 0    # Replace space with null terminator

post_hfind:
    # Find the end of HTTP headers (marked by \r\n\r\n)
    cmp dword ptr [rbx], 0x0a0d0a0d  # Check for \r\n\r\n
    je post_hdone                     # If found, headers are done
    inc rbx                           # Move to next byte
    jmp post_hfind

post_hdone:
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

    # Jump to cleanup
    jmp cleanup

handle_get:
    # Parse the URL path from GET request
    # Request format: "GET /path/to/file HTTP/1.1\r\n..."
    lea rsi, [rbx+4]     # rsi points to path (skip "GET ")
    mov rcx, rsi         # rcx will scan for end of path

get_pfind:
    # Find the space after the path
    cmp byte ptr [rcx], ' '  # Check if current char is space
    je get_pdone             # If yes, we found the end
    inc rcx                  # Move to next character
    jmp get_pfind

get_pdone:
    # Null-terminate the path string
    mov byte ptr [rcx], 0    # Replace space with null terminator

    # open(path, O_RDONLY, 0)
    # Open the file for reading
    mov rdi, rsi         # filename (from path parsing)
    xor esi, esi         # O_RDONLY = 0
    xor edx, edx         # mode = 0 (not needed for O_RDONLY)
    mov eax, 2           # syscall number for open
    syscall
    mov r8, rax          # Save file fd in r8

    # read(file_fd, file_buf, 8192)
    # Read file contents
    mov rdi, r8          # file fd
    lea rsi, [rip+file_buf]  # buffer to store file contents
    mov edx, 8192        # buffer size
    xor eax, eax         # syscall number for read
    syscall
    mov r13, rax         # Save bytes read in r13

    # close(file_fd)
    mov rdi, r8          # file fd
    mov eax, 3           # syscall number for close
    syscall

    # write(client_socket, "HTTP/1.0 200 OK\r\n\r\n", 19)
    # Send HTTP response header
    mov rdi, r12         # client socket fd
    lea rsi, [rip+hdr]   # pointer to HTTP response header
    mov edx, 19          # response length
    mov eax, 1           # syscall number for write
    syscall

    # write(client_socket, file_contents, bytes_read)
    # Send file contents
    mov rdi, r12         # client socket fd
    lea rsi, [rip+file_buf]  # pointer to file contents
    mov rdx, r13         # number of bytes to send
    mov eax, 1           # syscall number for write
    syscall

cleanup:
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
