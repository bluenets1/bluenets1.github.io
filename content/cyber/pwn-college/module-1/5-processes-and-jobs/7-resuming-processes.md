Usually, when you suspend processes, you'll want to resume them at some point. Otherwise, why not just terminate them? To resume processes, your shell provides the `fg` command, a builtin that takes the suspended process, resumes it, and puts it back in the foreground of your terminal.

Go try it out! This challenge's `run` needs you to suspend it, then resume it. Good luck!

```Shell
hacker@module-1~resuming-processes:~$ /challenge/run
Let's practice resuming processes! Suspend me with Ctrl-Z, then resume me with 
the 'fg' command! Or just press Enter to quit me!
^Z
[1]+  Stopped                 /challenge/run
hacker@module-1~resuming-processes:~$ man fg
No manual entry for fg
hacker@module-1~resuming-processes:~$ fg 1
/challenge/run
I'm back! Here's your flag:
pwn.college{REDACTED}
Don't forget to press Enter to quit me!
```
