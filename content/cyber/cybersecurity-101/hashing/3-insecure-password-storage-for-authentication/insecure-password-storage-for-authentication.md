Hashing has many uses in Cyber Security. In this room, we will focus on two uses: password storage and data integrity. We refer to password storage when used for authentication.

It is important to note that **this does not apply to password managers, where you must retrieve your password in cleartext**. On the other hand, **authentication mechanisms only need to confirm that the user knows the password** so they can be granted access to the resource; therefore, this problem differs from password managers.

### Stories of Insecure Password Storage for Authentication

Most web applications need to verify a user’s password at some point. Storing these passwords in plaintext is a very insecure security practice. You’ve probably seen news stories about companies that have had their database leaked. Knowing that many people use the same password on their various accounts, including their online banking, leaking the password from one account jeopardises the security of all other accounts.

We will visit **three insecure practices** when it comes to passwords:

- Storing passwords in plaintext
- Storing passwords using a deprecated encryption
- Storing passwords using an insecure hashing algorithm

#### **Storing Passwords in Plaintext**

Quite a few data breaches have leaked plaintext passwords. You’re probably familiar with the “rockyou.txt” password list on Kali Linux, among many other offensive security distributions. This password list came from RockYou, a company that developed social media applications and widgets. They stored their passwords in **plaintext**, and the company had a data breach. The text file contains over 14 million passwords. You can find `rockyou.txt` in the `/usr/share/wordlists` directory.

Terminal

```shell-session
strategos@g5000 /usr/share/wordlists> wc -l rockyou.txt 
14344392 rockyou.txt      
strategos@g5000 /usr/share/wordlists> head rockyou.txt 
123456
12345
123456789
password
iloveyou
princess
1234567
rockyou
12345678
abc123
```

#### **Using an Insecure Encryption Algorithm**

Adobe’s notable data breach was slightly different. Instead of using a secure hashing function to store the hash values of the passwords, the company used a deprecated encryption format. Furthermore, password hints were stored in plain text, sometimes containing the password itself. Consequently, the plaintext password could be retrieved relatively quickly.

#### **Using an Insecure Hash Function**

LinkedIn also suffered a data breach in 2012. LinkedIn used an insecure hashing algorithm, the SHA-1, to store user passwords. Furthermore, no password salting was used. **Password salting** refers to adding a **salt**, i.e., a random value, to the password before it is hashed.

---
### [Practice Question]
-> What is the 20th password in `rockyou.txt`?

![](content/cyber/cybersecurity-101/hashing/3-insecure-password-storage-for-authentication/_img/pasted-image-20250808130317.png)
![](content/cyber/cybersecurity-101/hashing/3-insecure-password-storage-for-authentication/_img/pasted-image-20250808130614.png)
