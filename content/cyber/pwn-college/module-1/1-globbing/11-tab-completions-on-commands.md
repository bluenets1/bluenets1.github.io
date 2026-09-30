## Challenge
=> Tab completion is for more than files! You can also tab-complete commands. This level has a command that starts with `pwncollege`, and it'll give you the flag. Type `pwncollege` and hit the tab key to auto-complete it!

=> **NOTE:** You can auto-complete any command, but be careful: callous auto-completes without double-checking the result can wreak havoc in your shell if you accidentally run the wrong commands!


flag ==> `pwn.college{REDACTED}`
How i got this:
```C
$ pwncollege<tab>
$ pwncollege-263
$ Correct! Here is your flag:
pwn.college{REDACTED}
```
