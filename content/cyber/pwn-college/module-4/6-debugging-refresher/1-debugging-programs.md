This level gets you re-familiarised with **gdb**. To get started with this level, and all the other levels of this module, **run /challenge/embryogdb_levelXYZ**, where XYZ is the level number. That program will launch gdb. Run the actual level logic with r, and follow the prompts to get that flag!

**RELEVANT DOCUMENTATION:**
gdb's [run](https://sourceware.org/gdb/current/onlinedocs/gdb#Starting) command
gdb's [continue](https://sourceware.org/gdb/current/onlinedocs/gdb#Continuing-and-Stepping) command


### Compiling for Debugging
In order to debug a program effectively, you need to generate debugging information when you compile it. This debugging information is stored in the object file; it describes the data type of each variable or function and the correspondence between source line numbers and addresses in the executable code.

To request debugging information, specify the ‘-g’ option when you run the compiler.

Programs that are to be shipped to your customers are compiled with optimizations, using the ‘-O’ compiler option. However, some compilers are unable to handle the ‘-g’ and ‘-O’ options together. Using those compilers, you cannot generate optimized executables containing debugging information.

GCC, the GNU C/C++ compiler, supports ‘-g’ with or without ‘-O’, making it possible to debug optimized code. We recommend that you always use ‘-g’ whenever you compile a program. You may think your program is correct, but there is no sense in pushing your luck. For more information, see Optimized Code.

**TL;DR**
```bash
gcc -g test.c -o test
```

`gcc` -> GNU C Compiler
`-g` -> generate **debugging information** 
`test.c` -> my source file
`-o test` -> outputs the test file

---
## Challenge + Notes
=> I first  executed that: 
```bash
hacker@module-4~debugging-programs:~$ /challenge/embryogdb_level1
```
this returned me: (**Notes**)
```bash
The program is restarting under the control of gdb! You can run the program with the gdb command `run`.

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
Reading symbols from /challenge/embryogdb_level1...
(No debugging symbols found in /challenge/embryogdb_level1)
```

![](content/cyber/pwn-college/module-4/6-debugging-refresher/_img/pasted-image-20251016161053.png)

which says

```notes
GDB is a very powerful dynamic analysis tool which you can use in order to understand the state of a program throughout
its execution. You will become familiar with some of gdb's capabilities in this module.
```

```notes
You are running in gdb! The program is currently paused. This is because it has set its own breakpoint here.

You can use the command `start` to start a program, with a breakpoint set on `main`. You can use the command `starti` to
start a program, with a breakpoint set on `_start`. You can use the command `run` to start a program, with no breakpoint
set. You can use the command `attach <PID>` to attach to some other already running program. You can use the command
`core <PATH>` to analyze the coredump of an already run program.

When starting or running a program, you can specify arguments in almost exactly the same way as you would on your shell.
For example, you can use `start <ARGV1> <ARGV2> <ARGVN> < <STDIN_PATH>`.

Use the command `continue`, or `c` for short, in order to continue program execution.
```
