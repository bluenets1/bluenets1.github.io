**UTF-8 is the current king of encodings**. It is used, for example, by the [vast majority](https://en.wikipedia.org/wiki/Popularity_of_text_encodings) of websites on the internet.

But it's not the only game in town. Outside of the web, other encodings are present in significant numbers. For various (misguided) technical reasons, Windows systems often use a different Unicode encoding: UTF-16. This encoding represents the same Unicode characters _using different byte values_! Needless to say, this leads to much confusion, and occasionally, security vulnerabilities.

A common way encoding mixups lead to security vulnerabilities is by incorrectly decoding data to perform security checks, then correctly (and differently) decoding it later to actually carry out security-sensitive actions. If security checks are performed on bad data, then dangerous data can be missed.

This is the case in this challenge. Can you get the flag?

---

**DOJO NOTE:** Due to a bug with unicode displays in the GUI Desktop terminal, we recommend that you use the VSCode Workspace for this challenge (and any other emoji-dependent challenges!).

---
![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260120121441.png)

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260120121513.png)

```bash
echo 6d0070007300650063007a0075007600 | xxd -r -p | /challenge/runme
Enter the password:
Read 16 bytes.
Congrats! Here is your flag:
pwn.college{REDACTED}
```
