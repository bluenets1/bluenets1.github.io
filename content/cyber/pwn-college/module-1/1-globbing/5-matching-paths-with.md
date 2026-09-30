Globbing happens on a _path_ basis, so you can expand entire paths with your globbed arguments. For example:

```console
hacker@dojo:~$ touch file_a
hacker@dojo:~$ touch file_b
hacker@dojo:~$ touch file_c
hacker@dojo:~$ ls
file_a	file_b	file_c
hacker@dojo:~$ echo Look: /home/hacker/file_[ab]
Look: /home/hacker/file_a /home/hacker/file_b
```

----
## Challenge
=> Now it's your turn. Once more, we've placed a bunch of files in `/challenge/files`. Starting from your home directory, run `/challenge/run` with a single argument that bracket-globs into the absolute paths to the `file_b`, `file_a`, `file_s`, and `file_h` files!

=> `pwn.college{REDACTED}`
-> How to get that?

```Mistake
cd /challenge/files/ file_[bash] /challenge/run    ; tries this but it's wrong
/challenge/files/ file_[bash] /challenge/run       ; again it's wrong
```

then i read the challenge question again:
-> findings:
- the files must be inside the /challenge/files folder

```Solution
/challenge/run /challenge/files/file_[bash]
```
