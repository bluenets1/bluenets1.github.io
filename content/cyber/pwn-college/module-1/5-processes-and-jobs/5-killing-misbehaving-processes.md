Sometimes, misbehaving processes can interfere with your work. These processes might need to be killed...

In this challenge, there's a decoy process that's hogging a critical resource - a named pipe (FIFO) at `/tmp/flag_fifo` into which (like in the [Practicing Piping](https://pwn.college/linux-luminarium/piping) FIFO challenge) `/challenge/run` wants to write your flag. You need to `kill` this process.

Your general workflow should be:

1. Check what processes are running.
2. Find `/challenge/decoy` in the list and figure out its process ID.
3. `kill` it.
4. Run `/challenge/run` to get the flag without being overwhelmed by decoys (you don't need to redirect its output; it'll write to the FIFO on its own).

Good luck!

---

**NOTE:** You might see a few decoy flags show up even after killing the decoy process. This happens because Linux pipes are _buffered_: conceptually, they have a sort of length through which data flows, and you might kill the decoy process while data is in the pipe. That data, having already entered the pipe, will proceed to the other end (your `cat`). If you wait a second, you'll see the decoys stop, and then you can `/challenge/run` and win!

=> Flag : `pwn.college{REDACTED}`

---
```Shell
hacker@module-1~killing-misbehaving-processes:~$ ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 07:55 ?        00:00:00 /sbin/docker-init -- /nix/var/nix/profiles/dojo-workspace/bin/dojo-init /run/dojo
root           7       1  0 07:55 ?        00:00:00 /run/dojo/bin/sleep 6h
root         137       1  0 07:55 ?        00:00:00 /bin/bash /challenge/.init
root         138       1  0 07:55 ?        00:00:00 /bin/bash /challenge/.init
root         139       1  0 07:55 ?        00:00:00 su -c exec /challenge/decoy > /tmp/flag_fifo hacker
root         140     138  0 07:55 ?        00:00:00 sleep 6h
root         141     137  0 07:55 ?        00:00:00 sleep 6h
hacker       142     139  0 07:55 ?        00:00:00 /usr/bin/python /challenge/decoy
hacker       153       1  0 07:55 ?        00:00:00 /nix/store/g0q8n7xfjp7znj41hcgrq893a9m0i474-ttyd-1.7.7/bin/ttyd --port 7681 --int
hacker       157     153  0 07:55 pts/0    00:00:00 /run/dojo/bin/bash --login
hacker       167     157  0 07:55 pts/0    00:00:00 ps -ef
```

```Shell
hacker@module-1~killing-misbehaving-processes:~$ kill 142
hacker@module-1~killing-misbehaving-processes:~$ /challenge/run
Sending the flag to /tmp/flag_fifo!
^C
hacker@module-1~killing-misbehaving-processes:~$ /challenge/run
Sending the flag to /tmp/flag_fifo!
^C
hacker@module-1~killing-misbehaving-processes:~$ /tmp/flag_fifo
bash: /tmp/flag_fifo: Permission denied
hacker@module-1~killing-misbehaving-processes:~$ cat /tmp/flag_fifo
pwn.college{REDACTED}
pwn.college{REDACTED}
pwn.college{REDACTED}
pwn.college{REDACTED}
pwn.college{REDACTED}
```

```Shell
hacker@module-1~killing-misbehaving-processes:~$ /challenge/run
Sending the flag to /tmp/flag_fifo!
```

```Shell
hacker@module-1~killing-misbehaving-processes:~$ cat /tmp/flag_fifo
pwn.college{REDACTED}
```
