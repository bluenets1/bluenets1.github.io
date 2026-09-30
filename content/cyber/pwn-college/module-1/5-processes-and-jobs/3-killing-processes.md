You've launched processes, you've viewed processes, now you will learn to _terminate_ processes! In Linux, this is done using the aggressively-named `kill` command. With default options (which is all we'll cover in this level), `kill` will terminate a process in a way that gives it a chance to get its affairs in order before ceasing to exist.

Let's say you had a pesky `sleep` process (`sleep` is a program that simply hangs out for the number of seconds specified on the commandline, in this case, 1337 seconds) that you launched in another terminal, like so:

```console
hacker@dojo:~$ sleep 1337
```

How do we get rid of it? You use `kill` to terminate it by passing the process identifier (the `PID` from `ps`) as an argument, like so:

```console
hacker@dojo:~$ ps -e | grep sleep
 342 pts/0    00:00:00 sleep
hacker@dojo:~$ kill 342
hacker@dojo:~$ ps -e | grep sleep
hacker@dojo:~$
```

---
## Challenge
Now, it's time to terminate your first process! In this challenge, `/challenge/run` will refuse to run while `/challenge/dont_run` is running! You must find the `dont_run` process and `kill` it. If you fail, `pwn.college` will disavow all knowledge of your mission. Good luck.

=> Flag: `pwn.college{REDACTED}`
How i got this
```Shell
hacker@module-1~killing-processes:~$ ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 07:37 ?        00:00:00 /sbin/docker-init -- /nix/var/nix/profiles/dojo-workspace/bin/dojo-init /run/dojo
root           6       1  0 07:37 ?        00:00:00 /run/dojo/bin/sleep 6h
root         135       1  0 07:37 ?        00:00:00 su -c /challenge/.launcher hacker
hacker       136     135  0 07:37 ?        00:00:00 /challenge/dont_run
hacker       137     136  0 07:37 ?        00:00:00 sleep 6h
hacker       148       1  0 07:37 ?        00:00:00 /nix/store/g0q8n7xfjp7znj41hcgrq893a9m0i474-ttyd-1.7.7/bin/ttyd --port 7681 --int
hacker       152     148  0 07:37 pts/0    00:00:00 /run/dojo/bin/bash --login
hacker       163     152  0 07:39 pts/0    00:00:00 ps -ef
hacker@module-1~killing-processes:~$ kill 136
hacker@module-1~killing-processes:~$ ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 07:37 ?        00:00:00 /sbin/docker-init -- /nix/var/nix/profiles/dojo-workspace/bin/dojo-init /run/dojo
root           6       1  0 07:37 ?        00:00:00 /run/dojo/bin/sleep 6h
hacker       137       1  0 07:37 ?        00:00:00 sleep 6h
hacker       148       1  0 07:37 ?        00:00:00 /nix/store/g0q8n7xfjp7znj41hcgrq893a9m0i474-ttyd-1.7.7/bin/ttyd --port 7681 --int
hacker       152     148  0 07:37 pts/0    00:00:00 /run/dojo/bin/bash --login
hacker       164     152  0 07:39 pts/0    00:00:00 ps -ef
hacker@module-1~killing-processes:~$ /challenge/run
Great job! Here is your payment:
pwn.college{REDACTED}
```
