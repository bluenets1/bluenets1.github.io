You're not limited to two hex digits! Like decimal numbers, you can add arbitrary amounts of them to represent more and more bytes. Every two hex digits are one additional byte. One hex digit, for those curious, is called a _nibble_ (har har!), but this is not used when specifying data. We almost always work with data on the _byte_ level, not less.

What you will do in this level is _hex encode_ arbitrary data. That is, you will figure out what value you want your data to have at the end, _encode_ that value in hex, and send the hex bytes. Wow, your first encoding!


```python
#!/usr/bin/exec-suid -- /bin/python3 -I 
import sys 
print("Enter the password:") 
entered_password = sys.stdin.buffer.read1() correct_password = b"\xc2\xa1\x82\xdb\x91\xce\x94\x8a" 
print(f"Read {len(entered_password)} bytes.") 
entered_password = bytes.fromhex(entered_password.decode("l1")) 
if entered_password == correct_password: 
	print("Congrats! Here is your flag:") print(open("/flag").read().strip()) 
	else:
		 print("Incorrect!") sys.exit(1)
```

```python
entered_password = bytes.fromhex(entered_password.decode("l1"))
## This line says here we need to send the hex data , so first we will convert the password into hex, i used cyberchef to convert it, here.
```

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260118220632.png)

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260118220220.png)
