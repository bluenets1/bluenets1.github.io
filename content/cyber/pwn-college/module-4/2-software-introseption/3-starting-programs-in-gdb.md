**Debuggers, including gdb, observe the debugged program _as it runs_ to expose information about its runtime behaviour**. In the previous level, we automatically launched the program for you. Here, we will tone down the magic somewhat: you must start the execution of the program, and we'll do the rest (e.g., recover the secret value from it).

When you launch gdb now, it will eventually bring up a command prompt, that looks like this:

```gdb
(gdb) 
```

You start a program with the `starti` command:

```gdb
(gdb) starti
```

`starti` **start**s the program at the very first **i**nstruction. **Give it a try now, and we'll configure gdb to magically extract the secret value once the program is running.**

---
## Challenge
`starti` **start**s the program at the very first **i**nstruction. **Give it a try now, and we'll configure gdb to magically extract the secret value once the program is running.**

=> What i did to reach to the end

```Assembly
 gdb /challenge/debug-me
 GNU gdb (Ubuntu 9.2-0ubuntu1~20.04.2) 9.2
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
Type "show copying" and "show warranty" for details.
This GDB was configured as "x86_64-linux-gnu".
Type "show configuration" for configuration details.
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>.
Find the GDB manual and other documentation resources online at:
    <http://www.gnu.org/software/gdb/documentation/>.

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from /challenge/debug-me...
(No debugging symbols found in /challenge/debug-me)
(gdb) starti
```

![](content/cyber/pwn-college/module-4/2-software-introseption/_img/pasted-image-20250919205140.png)
