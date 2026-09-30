## Challenge
=> Now, let's put the previous levels together! We put a few happy, but diversely-named files in `/challenge/files`. Go `cd` there and, using the globbing you've learned, write a single, short (6 characters or less) glob that (when passed as an argument to `/challenge/run`) will match the files "challenging", "educational", and "pwning"!

=> Flag : `pwn.college{REDACTED}`
=> How i did it?
i fucking tried every possible way here:
```c
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [?ha??enge educ?tion p?ning]
Error: you called this command with more than 1 argument (pre-globbing)! Please 
call me with one argument.
```

```C
hacker@module-1~mixing-globs:/challenge/files$ [cep] /challenge/run
bash: [cep]: command not found
```

```C
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [cep]
Your expansion did not expand to the requested files (challenging, educational, 
pwning). Instead, it expanded to:
[cep]
```

```C
acker@module-1~mixing-globs:/challenge/files$ /challenge/run [?ha??enge educ?tion p?ning]
Error: you called this command with more than 1 argument (pre-globbing)! Please 
call me with one argument.
hacker@module-1~mixing-globs:/challenge/files$ [cep] /challenge/run
bash: [cep]: command not found
hacker@module-1~mixing-globs:/challenge/files$ [challenge eductional pwning] /challenge/run
bash: [challenge: command not found
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [challenge] [educational] [pwning]
Error: you called this command with more than 1 argument (pre-globbing)! Please 
call me with one argument.
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [challenge educational pwning]
Error: you called this command with more than 1 argument (pre-globbing)! Please 
call me with one argument.
hacker@module-1~mixing-globs:/challenge/files$ [challenging eductional pwning] /challenge/run
bash: [challenging: command not found
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [ch*edu*pwn*]
Error: your argument is too long! It must be 6 characters or less.
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [c*e*p*]
Error: your argument is too long! It must be 6 characters or less.
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [ce?p?]
Error: your argument is too long! It must be 6 characters or less.
hacker@module-1~mixing-globs:/challenge/files$ /challenge/run [c-e-p]*
Error: your argument is too long! It must be 6 characters or less.
```


----
# Finally 
```C
hacker@module-1~mixing-globs:/challenge/files$ **/challenge/run [cep]***
You got it! Here is your flag!
pwn.college{REDACTED}
```
