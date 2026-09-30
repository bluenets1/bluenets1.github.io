Cryptographic failiures makes yet another appearence on this OWASP Top 10 list. Let's explore what this exactly and some mitigation steps below.

## What are Cryptographic Failures?![](https://tryhackme-images.s3.amazonaws.com/user-uploads/5de96d9ca744773ea7ef8c00/room-content/5de96d9ca744773ea7ef8c00-1763116479494.png)

Cryptographic failures happen when sensitive data isn't adequately protected due to lack of encryption, faulty implementation, or insufficient security measures. This includes storing passwords without hashing, using outdated or weak algorithms (such as MD5, SHA1, or DES), exposing encryption keys, or failing to secure data during transmission.

An incredible example of this is an application or service "rolling their own cryptography", rather than using well-established, vetted, and verifiably secure encryption algorithms.

## How to Prevent Cryptographic Failures

Preventing cryptographic failures starts with choosing strong, modern algorithms and implementing them properly. Sensitive information such as passwords should be hashed using robust, slow hashing functions like bcrypt, scrypt, or Argon2. When encrypting data, avoid creating your own algorithms; instead, rely on trusted, industry-standard libraries.

Never embed access credentials (i.e., to a third-party service) in source code, configuration files, or repositories. Instead, use secure key management systems or environments specifically designed for storing secrets.

## Practical

The practical for this task is located at [http://10.48.133.42:8001](http://10.48.133.42:8001/). This web app demonstrates a "note sharing" service that uses a weak, shared derivative key to protect the notes.

Follow the steps on the web application to unlock all notes and retrieve a flag.

## Recommended TryHackMe Content

If you'd like to explore this type of attack in much further depth, we highly recommend the following TryHackMe content:

- [Cryptographic Failures](https://tryhackme.com/module/cryptofailures) Module

---
![](content/cyber/cybersecurity-101/owasp-top-10-2025/3-insecure-data-handling/_img/pasted-image-20251216202649.png)
