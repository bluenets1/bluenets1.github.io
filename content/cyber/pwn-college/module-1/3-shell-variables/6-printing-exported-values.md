There are multiple ways to access variables in bash. `echo` was just one of them, and we'll now learn at least one more in this challenge.

Try the `env` command: it'll print out every _exported_ variable set in your shell, and you can look through that output to find the `FLAG` variable!

=> Flag: `pwn.college{REDACTED}`

```Shell
hacker@module-1~printing-exported-variables:~$ env
SHELL=/run/dojo/bin/bash
HOSTNAME=module-1~printing-exported-variables
PWD=/home/hacker
MANPATH=/run/dojo/share/man:
DOJO_AUTH_TOKEN=0a9b33e6cc5aeeccb50427c8c7436db907aa1e1076c248c3f78ddcce26e99b40
HOME=/home/hacker
LANG=C.UTF-8
==FLAG=pwn.college{REDACTED}==
TERMINFO=/run/dojo/share/terminfo
TERM=xterm-256color
SHLVL=2
LC_CTYPE=C.UTF-8
SSL_CERT_FILE=/run/dojo/etc/ssl/certs/ca-bundle.crt
PATH=/run/challenge/bin:/run/dojo/bin:/root/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
DEBIAN_FRONTEND=noninteractive
_=/run/dojo/bin/env
```
