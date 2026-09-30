Security-oblivious developers often use encoding-based obfuscation in lieu of encryption. This sort of obfuscation typically fails to prevent determined hackers from accessing the data in question, especially once they read the software logic implementing it. Put yourself in the shoes of such a hacker, and get this flag.

Remember: "Good Artists Copy, Great Artists Steal!" When you're doing security analysis and need to interact with bespoke software, ripping the implementations of custom communication protocols out of that software is a good way to reach interoperability. Give it a try here!

given code: 
```python
import sys
 def reverse_string(s): 
	 return s[::-1] 
	 def encode_to_bits(s):
	  return b"".join(format(c, "08b").encode("latin1") 
for c in s) print("Enter the password:") 
entered_password = sys.stdin.buffer.read1() 
correct_password = b"\x15\xe4}\x15wAW\xd4" 
print(f"Read {len(entered_password)} bytes.") 
correct_password = correct_password.hex().encode("l1") correct_password = encode_to_bits(correct_password) 
correct_password = encode_to_bits(correct_password) 
correct_password = correct_password[::-1] 
if entered_password == correct_password: 
	print("Congrats! Here is your flag:") print(open("/flag").read().strip()) 
	else: print("Incorrect!") 
	sys.exit(1)
```

![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260120132855.png)
