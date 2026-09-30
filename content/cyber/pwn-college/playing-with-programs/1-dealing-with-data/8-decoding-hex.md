Now, let's _decode_ some hex, rather than encoding it. Can you figure out what the program needs?

---

**NOTE:** One of the toughest parts of this challenge is to send raw binary data to it stdin. There are a few ways to do this:

1. Write a python script to output data to stdout and pipe that to the challenge's stdin! This would involve using the raw byte interface to stdout: `sys.stdout.buffer.write()`.
2. Write a python script to run the challenge and interact with it directly. Our recommendation is to use pwntools for this: `import pwn`, `p = pwn.process("/challenge/runme")`, `p.write()`, and `p.readall()`. A pwn.college alumni has created an awesome [pwntools cheat sheet](https://gist.github.com/anvbis/64907e4f90974c4bdd930baeb705dedf) that you may reference.
3. For an increasingly hacky solution, `echo -e -n "\xAA\xBB"` will print out bytes to stdout that you can pipe.

---
```python
#!/usr/bin/exec-suid -- /bin/python3 -I

import sys

print("Enter the password:")

entered_password = sys.stdin.buffer.read1()
correct_password = b"e3a6d89fdcf0a8f3"

print(f"Read {len(entered_password)} bytes.")

correct_password = bytes.fromhex(correct_password.decode("l1"))

if entered_password == correct_password:
    print("Congrats! Here is your flag:")
    print(open("/flag").read().strip())
else:
    print("Incorrect!")
    sys.exit(1)
```

```python
entered_password = sys.stdin.buffer.read1()
correct_password = b"e3a6d89fdcf0a8f3"
correct_password = bytes.fromhex(correct_password.decode("l1"))
```

- `correct_password` **starts as hex text**
- Then it’s converted using `bytes.fromhex(...)`
- **Comparison is against raw binary**, not text

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260119132237.png)

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260119132123.png)
