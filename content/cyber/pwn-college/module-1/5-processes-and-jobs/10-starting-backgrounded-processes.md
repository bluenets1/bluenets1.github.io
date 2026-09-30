Of course, you don't have to suspend processes to background them: you can start them backgrounded right off the bat! It's easy; all you have to do is append a `&` to the command, like so:

```console
hacker@dojo:~$ sleep 1337 &
[1] 1771
hacker@dojo:~$ ps -o user,pid,stat,cmd
USER         PID STAT CMD
hacker      1709 Ss   bash
hacker      1771 S    sleep 1337
hacker      1782 R+   ps -o user,pid,stat,cmd
hacker@dojo:~$ 
```


---
## Challenge
Here, `sleep` is actively running in the background, _not_ suspended. Now it's your turn to practice! Launch `/challenge/run` backgrounded for the flag!

=> Flag:`pwn.college{REDACTED}`
-> How i got this flag:
```Shell
hacker@module-1~starting-backgrounded-processes:~$ /challenge/run &
[1] 146
hacker@module-1~starting-backgrounded-processes:~$ 


Yay, you started me in the background! Because of that, this text will probably 
overlap weirdly with the shell prompt, but you're used to that by now...

Anyways! Here is your flag!
pwn.college{REDACTED}

[1]+  Done                    /challenge/run
```
