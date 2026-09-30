You've learned how to kill other processes with the `kill` command, but sometimes you just want to get rid of the process that's clogging up your terminal! Luckily, terminals have a hotkey for this: `Ctrl-C` (e.g., holding down the `Ctrl` key and pressing `C`) sends an "interrupt" to whatever application is waiting on input from the terminal and, typically, this causes the application to cleanly exit.

---
## Challenge
Try it here! `/challenge/run` will refuse to give you the flag until you interrupt it. Good luck!
For the very interested, check out this [article about terminals and "control codes"](https://catern.com/posts/terminal_quirks.html) (such as `Ctrl-C`).

=> Flag: `pwn.college{REDACTED}`

```Shell
hacker@module-1~interrupting-processes:~$ /challenge/run
I could give you the flag... but I won't, until this process exits. Remember, 
you can force me to exit with Ctrl-C. Try it now!
^C
Good job! You have used Ctrl-C to interrupt this process! Here is your flag:
pwn.college{REDACTED}
hacker@module-1~interrupting-processes:~$ 
```
