**Summary.** A syscall is a controlled jump from user mode into the kernel. On x86-64 Linux, you put the syscall number in `rax`, arguments in `rdi, rsi, rdx, r10, r8, r9`, and execute `syscall`.

## key points

- `syscall` switches to ring 0 and jumps to the address in `MSR_LSTAR`
- the kernel saves user registers, dispatches through `sys_call_table`
- return value comes back in `rax`; negative values are `-errno`

```x86asm title=write.s
mov rax, 1          ; SYS_write
mov rdi, 1          ; stdout
lea rsi, [rel msg]
mov rdx, 13
syscall
```

```c
// same thing via libc
write(1, "hello, world\n", 13);
```
