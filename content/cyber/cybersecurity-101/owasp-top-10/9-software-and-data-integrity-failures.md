What is Integrity?  

When talking about integrity, we refer to the capacity we have to ascertain that a piece of data remains unmodified. Integrity is essential in cybersecurity as we care about maintaining important data free from unwanted or malicious modifications. For example, say you are downloading the latest installer for an application. How can you be sure that while downloading it, it wasn't modified in transit or somehow got damaged by a transmission error?

To overcome this problem, you will often see a **hash** sent alongside the file so that you can prove that the file you downloaded kept its integrity and wasn't modified in transit. A hash or digest is simply a number that results from applying a specific algorithm over a piece of data. When reading about hashing algorithms, you will often read about MD5, SHA1, SHA256 or many others available.

Let's take WinSCP as an example to understand better how we can use hashes to check a file's integrity. If you go to their [Sourceforge repository](https://sourceforge.net/projects/winscp/files/WinSCP/5.21.5/), you'll see that for each file available to download, there are some hashes published along:

![WinSCP hashes](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/b93dd140259193ee75ae1d12562bbd29.png)  

These hashes were precalculated by the creators of WinSCP so that you can check the file's integrity after downloading. If we download the `WinSCP-5.21.5-Setup.exe` file, we can recalculate the hashes and compare them against the ones published in Sourceforge. To calculate the different hashes in Linux, we can use the following commands:

AttackBox

```shell-session
user@attackbox$ md5sum WinSCP-5.21.5-Setup.exe          
20c5329d7fde522338f037a7fe8a84eb  WinSCP-5.21.5-Setup.exe
                                                                                                                
user@attackbox$ sha1sum WinSCP-5.21.5-Setup.exe 
c55a60799cfa24c1aeffcd2ca609776722e84f1b  WinSCP-5.21.5-Setup.exe
                                                                                                                
user@attackbox$ sha256sum WinSCP-5.21.5-Setup.exe 
e141e9a1a0094095d5e26077311418a01dac429e68d3ff07a734385eb0172bea  WinSCP-5.21.5-Setup.exe
```

Since we got the same hashes, we can safely conclude that the file we downloaded is an exact copy of the one on the website.

Software and Data Integrity Failures  

This vulnerability arises from code or infrastructure that uses software or data without using any kind of integrity checks. Since no integrity verification is being done, an attacker might modify the software or data passed to the application, resulting in unexpected consequences. There are mainly two types of vulnerabilities in this category:

- Software Integrity Failures
- Data Integrity Failures

---
## 9.1 Software Integrity Failures
Suppose you have a website that uses third-party libraries that are stored in some external servers that are out of your control. While this may sound a bit strange, this is actually a somewhat common practice. Take as an example jQuery, a commonly used javascript library. If you want, you can include jQuery in your website directly from their servers without actually downloading it by including the following line in the HTML code of your website:

```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
```

When a user navigates to your website, its browser will read its HTML code and download jQuery from the specified external source.

![JS without integrity checks](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/95712e9b375e22a57613a75c6b81384d.png)  

The problem is that if an attacker somehow hacks into the jQuery official repository, they could change the contents of `https://code.jquery.com/jquery-3.6.1.min.js` to inject malicious code. As a result, anyone visiting your website would now pull the malicious code and execute it into their browsers unknowingly. This is a software integrity failure as your website makes no checks against the third-party library to see if it has changed. Modern browsers allow you to specify a hash along the library's URL so that the library code is executed only if the hash of the downloaded file matches the expected value. This security mechanism is called Subresource Integrity (SRI), and you can read more about it [here](https://www.srihash.org/).

The correct way to insert the library in your HTML code would be to use SRI and include an integrity hash so that if somehow an attacker is able to modify the library, any client navigating through your website won't execute the modified version. Here's how that should look in HTML:

```html
<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
```

### Practical Question
=> What is the SHA-256 hash of `https://code.jquery.com/jquery-1.12.4.min.js`?
==> `sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=` 
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821212645.png)


---
## 9.2 Data Integrity Failures

Let's think of how web applications maintain sessions. Usually, when a user logs into an application, they will be assigned some sort of session token that will need to be saved on the browser for as long as the session lasts. This token will be repeated on each subsequent request so that the web application knows who we are. These session tokens can come in many forms but are usually assigned via cookies. **Cookies** are key-value pairs that a web application will store on the user's browser and that will be automatically repeated on each request to the website that issued them.  

![Cookies](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/9c9ed045f84136a6e0100f4111d7f34d.png)  

For example, if you were creating a webmail application, you could assign a cookie to each user after logging in that contains their username. In subsequent requests, your browser would always send your username in the cookie so that your web application knows what user is connecting. This would be a terrible idea security-wise because, as we mentioned, cookies are stored on the user's browser, so if the user tampers with the cookie and changes the username, they could potentially impersonate someone else and read their emails! This application would suffer from a data integrity failure, as it trusts data that an attacker can tamper with.

One solution to this is to use some integrity mechanism to guarantee that the cookie hasn't been altered by the user. To avoid re-inventing the wheel, we could use some token implementations that allow you to do this and deal with all of the cryptography to provide proof of integrity without you having to bother with it. One such implementation is **JSON Web Tokens (JWT)**.

JWTs are very simple tokens that allow you to store key-value pairs on a token that provides integrity as part of the token. The idea is that you can generate tokens that you can give your users with the certainty that they won't be able to alter the key-value pairs and pass the integrity check. The structure of a JWT token is formed of 3 parts:

![JSON Web Tokens](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/11c86acaea05f98045cec5634e03e997.png)

The header contains metadata indicating this is a JWT, and the signing algorithm in use is HS256. The payload contains the key-value pairs with the data that the web application wants the client to store. The signature is similar to a hash, taken to verify the payload's integrity. If you change the payload, the web application can verify that the signature won't match the payload and know that you tampered with the JWT. Unlike a simple hash, this signature involves the use of a secret key held by the server only, which means that if you change the payload, you won't be able to generate the matching signature unless you know the secret key.

Notice that each of the 3 parts of the token is simply plaintext encoded with base64. You can use [this online tool](https://appdevtools.com/base64-encoder-decoder) to encode/decode base64. Try decoding the header and payload of the following token:

`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNjY1MDc2ODM2fQ.C8Z3gJ7wPgVLvEUonaieJWBJBYt5xOph2CpIhlxqdUw`  

**Note:** The signature contains binary data, so even if you decode it, you won't be able to make much sense of it anyways.

JWT and the None Algorithm

A data integrity failure vulnerability was present on some libraries implementing JWTs a while ago. As we have seen, JWT implements a signature to validate the integrity of the payload data. The vulnerable libraries allowed attackers to bypass the signature validation by changing the two following things in a JWT:

1. Modify the header section of the token so that the `alg` header would contain the value `none`.
2. Remove the signature part.

Taking the JWT from before as an example, if we wanted to change the payload so that the username becomes "admin" and no signature check is done, we would have to decode the header and payload, modify them as needed, and encode them back. Notice how we removed the signature part but kept the dot at the end.

![JWT None Algorithm](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/f5d1b4ef49ff4eef52e7617631225e8a.png)  

It sounds pretty simple! Let's walk through the process an attacker would have to follow in an example scenario. Navigate to [http://10.201.1.246:8089/](http://10.201.1.246:8089/) and follow the instructions in the questions below.

---
## Practical Questions
=> Try logging into the application as guest. What is guest's account password?
==> guest

=> If your login was successful, you should now have a JWT stored as a cookie in your browser. Press F12 to bring out the Developer Tools.

Depending on your browser, you will be able to edit cookies from the following tabs:

**Firefox**

![Firefox Developer Tools](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/17765aa7418c977b2d07aa67305e04ad.png)  

**Chrome**

![Chrome Developer Tools](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/cd52fcfd91df145fb31d7bad9b56ebdc.png)

=> What is the name of the website's cookie containing a JWT token?
==> jwt-session
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821220815.png)

=> What is the flag presented to the admin user?
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821220907.png)
-> Press SHIFT+F12 to bring up the Developer Tools
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821220936.png)

-> Once you open the Dev Tools go to the Storage tab.
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821221018.png)

Open a word document. Copy the “Value” and paste the entire code to the document. It should look like this:

> eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0IiwiZXhwIjoxNjg2MzIxNjI2fQ.L159cLhW34u6BYodwGSJwHftLw34J-zKQF9Xo1uYBVA

Next, you need to use the head and payload. If you recall from the task the header is up to the “.”, then the payload is up to the next “.”, don’t worry the signature we won’t need it.

Go to [https://appdevtools.com/base64-encoder-decoder](https://appdevtools.com/base64-encoder-decoder) and DECODE the header and payload separately.

![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821221055.png)

Copy and paste the decoded information and change the “HS256” to “none” in the header, then change “guest” to “admin”. Now its time to encode this information. Take the result of the two codes and combine them. It should look like this:
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821221112.png)

Copy and paste the pair into the value of the cookie.
![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821221129.png)

Once you insert the code into the cookie, refresh the page to get the flag.

![](content/cyber/cybersecurity-101/owasp-top-10/_img/pasted-image-20250821221146.png)
