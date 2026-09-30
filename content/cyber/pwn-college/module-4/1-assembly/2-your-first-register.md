The CPU thinks in very simple terms. **It moves data around, changes data, makes decisions based on data**, and **takes action based on data**. Most of the time, this **data is stored in _registers_**.

Simply put, **registers are containers for data**. The **CPU** can p**ut data into registers, move data between registers, and so on**. These registers, at a hardware level, are implemented using very expensive chips, crammed into shockingly microscopic spaces, and accessed at a frequency where even physical concepts such as the **speed of light impact their performance**. Hence, the number of registers that a CPU can have is _extremely_ constrained. **Different CPU architectures have different amounts of registers**, **different names for these registers, and so on**, but typically, there are **between 10 and 20 "general purpose" registers** that program code can use for any reason, and up to a **few dozen** other ones that are **used for special purposes.**

In x86's modern incarnation, x86_64, programs have access to **16 general purpose registers**. In this challenge, we will learn about our first one: `rax`. Hi, **Rax**!

---

`rax`, **a single x86 register**, is a tiny piece of the **massively complex design** of the x**86 CPU**, but this is where we'll start. Like the other registers, `rax` is a container for a **small amount of data**. You _move_ data into `rax` with the `mov` instruction. Instructions are specified as an _operator_ (in this case, `mov`), and _operands_, which represent additional data (in this case, it will be the specification of `rax` as a destination, and the value we will want to store there).

For example, if you wanted to store the value `1337` into `rax`, the x86 Assembly would look like:

```assembly
mov rax, 1337
```

**You can see a few things:**

1. The destination (`rax`) is specified _before_ the source (the value `1337`).
2. The operands are separated by a comma.   (operator = symbols , operands = value)
3. It is _really_ simple!

---

**ERRATA:** If you've seen x86 assembly before, there is a chance that you've seen a slightly different dialect of it. The dialect used in pwn.college is "Intel Syntax", which is the correct way to write x86 assembly (as a reminder, Intel created x86). Some courses incorrectly teach the use of "AT&T Syntax", causing enormous amounts of confusion. We'll touch on this slightly in the next module and then, hopefully, never have to think about AT&T Syntax again.

---
## Challenge 
In this challenge, you will write your first assembly. You must move the value `60` into `rax`. Write your program in a file with a `.s` extension, such as `rax-challenge.s` (while not mandatory, `.s` is the typical extension for assembly files), and pass it as an argument to the `/challenge/check` file (e.g., `/challenge/check rax-challenge.s`). You can use either your favourite text editor or the text editor in pwn.college's VSCode Workspace to implement your `.s` file!

=> What i wrote as program:

```Assembly
mov rax, 60
```

![](content/cyber/pwn-college/module-4/1-assembly/_img/pasted-image-20250919113744.png)

```Important
... uh oh. The program crashed! We'll go into more details about
what a Segmentation Fault is later, but in this case, the program
crashed because, after the CPU moved the value 60 into rax, it was
never instructed to stop execution. With no further instructions
to execute, and no directive to stop, it crashed.

In the next level, we'll learn about how to stop program execution.
For now, here is your flag for your first (crashing) program!
```

```Note
`rax` is the **main register for results, system calls, and returns**. It’s like the “working desk” register where important values land after computations or calls.
```
