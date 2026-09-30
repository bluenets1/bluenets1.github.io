Sometimes, you want to grab specific columns of data, such as the first column, the third column, or the 42nd column. For this, there's the `cut` command.

For example, imagine that you have the following data file:

```console
hacker@dojo:~$ cat scores.txt
hacker 78 99 67
root 92 43 89
hacker@dojo:~$
```

You could use `cut` to extract specific columns:

```console
hacker@dojo:~$ cut -d " " -f 1 scores.txt
hacker
root
hacker@dojo:~$ cut -d " " -f 2 scores.txt
78
92
hacker@dojo:~$ cut -d " " -f 3 scores.txt
99
43
hacker@dojo:~$
```

The `-d` argument specifies the column _delimiter_ (how columns are separated). In this case, it's a space character. Of course, it has to be in quotes here so that the shell knows that the space is an argument rather than a space separating other arguments! The `-f` argument specifies the _field_ number (which column to extract).

---
## Challenge
In this challenge, the `/challenge/run` program will give you a bunch of lines with random numbers and single characters (characters of the flag) as columns. Use `cut` to extract the flag characters, then pipe them to `tr -d "\n"` (like the previous level!) to join them together into a single line. Your solution will look something like `/challenge/run | cut ??? | tr ???`, with the `???` filled out.

=> Flag : `pwn.college{REDACTED}`
How i got this.

- First i checked the flag form using `/challenge/run` where i see this:
```Shell
hacker@module-1~extracting-specific-sections-of-text:~$ /challenge/run
31086 p
24954 w
16312 n
29359 .
24647 c
23548 o
1917 l
16508 l
12042 e
25852 g
29893 e
13041 {
2513 E
12232 W
5064 w
17043 p
27573 I
26807 J
19799 O
3684 m
32589 J
19403 7
2832 B
26095 Y
20525 p
31723 7
10293 u
23664 o
17942 b
21244 m
16163 M
7340 G
854 a
16616 L
102 p
10827 a
13878 F
18378 w
8182 9
21058 .
31407 0
8222 1
10997 N
25922 x
394 E
16219 z
3151 N
20755 x
25872 w
5231 S
2802 O
11445 w
11044 I
19961 j
17732 M
7840 z
17906 E
18357 z
29780 W
19814 }
```

- after analysing we have the flag in second column.

```Shell
$ /challenge/run cut -d "" -f 2 | tr -d "\n"
```
