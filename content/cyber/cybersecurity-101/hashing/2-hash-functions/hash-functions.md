### What is a Hash Function?

Hash functions are different from encryption. There is no key, and it’s meant to be impossible (or computationally impractical) to go from the output back to the input.

A hash function takes some input data of any size and creates a summary or **digest** of that data. The output has a fixed size. It’s hard to predict the output for any input and vice versa. Good hashing algorithms will be relatively fast to compute and prohibitively slow to reverse, i.e., go from the output and determine the input. Any slight change in the input data, even a single bit, should cause a significant change in the output.

Let’s check an example. In the terminal below, we can see two files; the first contains the letter T, while the second contains the letter U. If you check T and U in an ASCII table or using `hexdump`, you will notice that the two letters differ by a single bit.

- The letter T is `54` in hexadecimal, i.e., `01010100` in binary.
- The letter U is `55` in hexadecimal, i.e., `01010101` in binary.

Consequently, the following two files differ by a single bit. However, if we compare their **MD5** (*Message-Digest Algorithm 5*) hashes, their **SHA1** (*Secure Hash Algorithm 1*) hashes, or their SHA-256 (Secure Hash Algorithm 256) hashes, we will notice that they are entirely different. We recommend that you try the commands below yourself. The files are located in `~/Hashing-Basics/Task-2/`.  

Terminal

```shell-session
strategos@g5000 ~> cat file1.txt 
T⏎
strategos@g5000 ~> cat file2.txt 
U⏎   
strategos@g5000 ~> hexdump -C file1.txt 
00000000  54                                                |T|
00000001
strategos@g5000 ~> hexdump -C file2.txt 
00000000  55                                                |U|
00000001
strategos@g5000 ~> md5sum *.txt
b9ece18c950afbfa6b0fdbfa4ff731d3  file1.txt
4c614360da93c0a041b22e537de151eb  file2.txt
strategos@g5000 ~> sha1sum *.txt
c2c53d66948214258a26ca9ca845d7ac0c17f8e7  file1.txt
b2c7c0caa10a0cca5ea7d69e54018ae0c0389dd6  file2.txt
strategos@g5000 ~> sha256sum *.txt
e632b7095b0bf32c260fa4c539e9fd7b852d0de454e9be26f24d0d6f91d069d3  file1.txt
a25513c7e0f6eaa80a3337ee18081b9e2ed09e00af8531c8f7bb2542764027e7  file2.txt
```

The output of a hash function is typically raw bytes, which are then encoded. Common encodings are base64 or hexadecimal. `md5sum`, `sha1sum`, `sha256sum`, and `sha512sum` produce their outputs in hexadecimal format. Remember that hexadecimal format prints each raw byte as two hexadecimal digits.

### Why is Hashing Important?

Hashing plays a vital role in our daily use of the Internet. Like other cryptographic functions, hashing remains hidden from the user. **Hashing helps protect data’s integrity and ensure password confidentiality.**

Consider this example of hashing being used to protect your cyber security. When you log into TryHackMe, the server uses hashing to verify your password. In fact, as per good security practices, a server does not record your password; it records the hash value of your password. Whenever you want to log in, it will calculate the hash value of the password you submitted with the recorded hash value. Similarly, when you log into your computer, hashing plays a role in verifying your password. You interact more indirectly with hashing than you would think, and almost daily in the context of passwords.

### What’s a Hash Collision?

*A hash collision is when two different inputs give the same output*. Hash functions are designed to avoid collisions as best as possible. Furthermore, hash functions are designed to prevent an attacker from being able to create, i.e., engineer, a collision intentionally. However, because the number of inputs is practically unlimited and the number of possible outputs is limited, this leads to a pigeonhole effect.

As a numeric example, if a hash function produces a 4-bit hash value, we only have 16 different hash values. The total number of possible hash values is number of bits = 2^4 = 16. The probability of a collision is relatively very high.

The **pigeonhole effect** states that the number of items (_pigeons_) is more than the number of containers (_pigeonholes_); some containers must hold more than one item. In other words, in this context, there are a fixed number of different output values for the hash function, but you can give it any size input. As there are more inputs than outputs, some inputs must inevitably give the same output. If you have 21 pigeons and 16 pigeonholes, some of the pigeons are going to share the pigeonholes. Consequently, collisions are unavoidable. However, a good hash function ensures that the probability of a *collision is negligible*.

MD5 and SHA1 have been attacked and are now considered insecure due to the ability to engineer hash collisions. However, no attack has yet given a collision in both algorithms simultaneously, so if you compare the MD5 and SHA1 hash, you will see that they’re different. You can view the MD5 collision example on the [MD5 Collision Demo](https://www.mscs.dal.ca/~selinger/md5collision/) page; furthermore, you can read the details of the SHA1 collision attack at [Shattered](https://shattered.io/). Due to these, you shouldn’t trust either algorithm for hashing passwords or data.

---
### [Practice Questions]
-> What is the SHA256 hash of the `passport.jpg` file in `~/Hashing-Basics/Task-2`?![](content/cyber/cybersecurity-101/hashing/2-hash-functions/_img/pasted-image-20250808122548.png)

-> What is the output size in bytes of the MD5 hash function?
we know that md5 size is 128 bits
convert bits to bytes, 1 bits = 8 bytes
![](content/cyber/cybersecurity-101/hashing/2-hash-functions/_img/pasted-image-20250808123008.png)

-> If you have an 8-bit hash output, how many possible hash values are there?
no of bits given = 8
each bit can have 2 possible values = `0 and 1`
the total  numbers of unique combinations are: 2^8
which is 256
