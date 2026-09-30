So, **your first program crashed**... Don't worry, it happens! In this challenge, you'll learn how to make your program cleanly exit instead of crashing.

**Starting your program and cleanly stopping it are actions handled by your computer's _Operating System_**. The **operating system** manages the **existence of programs and interactions between the programs, your hardware, the network environment, and so on**.

**Your programs "interact" with the CPU using assembly instructions** such as the `mov` instruction you wrote earlier. Similarly, **your programs interact with the operating system (via the CPU, of course**) **using the `syscall`, or _System Call_ instruction.**

Like **how you might use a phone call to interact with a local restaurant to order food**, **programs use system calls to request the operating system to carry out actions on the program's behalf**. As a bit of an over generalisation, **anything your program does** that **doesn't involve performing computation** on **data** is done with a **system call.**

There are a lot of **different system calls your program can invoke**. For example, **Linux has around 330 different ones**, though this number changes over time as **syscalls** are added and deprecated. Each **system call is indicated by a _syscall number_,** **counting upwards from 0, and your program invokes a specific syscall by moving its syscall number into the `rax` register and invoking the `syscall` instruction**. For example, if we wanted to invoke syscall 42 (a syscall that you'll learn about sometime later!), we would write two instructions:

```assembly
mov rax, 42
syscall
```

Very cool, and super easy!

---
## Challenge
In this challenge, we'll learn our first syscall: `exit`. The `exit` syscall causes a program to exit. By explicitly exiting, we can avoid the crash we ran into with our previous program!

Now, the syscall number of `exit` is `60`. Go and write your first program: it should move `60` into `rax`, then invoke `syscall` to cleanly exit!

=> My Approach
```Assembly
mov rax, 60
syscall
```

![](content/cyber/pwn-college/module-4/1-assembly/_img/pasted-image-20250919115400.png)

---
# ChatGPT easy explanation of syscall
## What is a **system call**?

- A **system call (syscall)** is a special way for your program to **ask the operating system (kernel) to do something**.
- User programs don’t directly talk to hardware (like files, network, memory) — they ask the kernel to do it **through syscalls**.
