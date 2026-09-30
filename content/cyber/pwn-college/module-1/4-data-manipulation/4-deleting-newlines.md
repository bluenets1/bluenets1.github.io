A common class of characters to remove is a line separator. This happens when you have a stream of data that you want to turn into a single line for further processing. You can specify newlines almost like any other character, by _escaping_ them:

```console
hacker@dojo:~$ echo "hello_world!" | tr _ "\n"
hello
world!
hacker@dojo:~$
```

Here, the backslash (`\`) signifies that the character that follows it is a standin for a character that's hard to input into the shell normally. The newline, of course, is hard to input because when you typically hit `Enter`, you'll run the command itself. `\n` is a standin for this newline, and it _must_ be in quotes to prevent the shell interpreter itself from trying to interpret it and pass it to `tr` instead.

Now, let's combine this with deletion. In this challenge, we'll inject a bunch of newlines into the flag. Delete them with `tr`'s `-d` flag and the _escaped_ newline specification!

---
## Challenge
**Fun fact!** Want to _actually_ replace a backslash (`\`) character? Because `\` is the escape character, you gotta escape it! `\\` will be treated as a backslash by `tr`. This isn't relevant to this challenge, but is a fun fact nonetheless!

=> Flag: `pwn.college{REDACTED}`

How we got this: 

When we run: `/challenge/run`  we got this , where it has new line to all.
```Shell
hacker@module-1~deleting-newlines:~$ /challenge/run
Your line-split flag: 
p
w
n
.
col
l
e
ge
{
EHIpoaQ
1
B
x
a
d
a
iciu
F
e
H
R7
95m
5X.
0
VNxEzNxw
S
O
wIj
Mz
Ez
W
}
```

so for fixing that , we need to remove the `\n` character from that.
How we did it?

```Shell
$ /challenge/run | tr -d "\n"
```
