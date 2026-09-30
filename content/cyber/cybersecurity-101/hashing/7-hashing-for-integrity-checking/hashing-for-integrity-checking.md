In Task 3, we mentioned that we would focus on two uses of hashing: password storage and data integrity. We have extensively discussed how hashing secures passwords in authentication systems. In this task, we will discuss how we can use hash functions to check the integrity of files.

### Integrity Checking

Hashing can be used to check that files haven’t been changed. If you put the same data in, you always get the same data out. Even if a single bit changes, the hash will change significantly, as demonstrated in Task 2. This means you can use it to check that files haven’t been modified or to ensure that the file you downloaded is identical to the file on the web server. The text file listed below shows the SHA256 hash of two Fedora Workstation ISO files. If running `sha256sum` on the file you downloaded returned the same hash listed in this signed file, you can be confident that your file is identical to the official one.

AttackBox Terminal

```shell-session
root@AttackBox# head Fedora-Workstation-40-1.14-x86_64-CHECKSUM
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

# Fedora-Workstation-Live-osb-40-1.14.x86_64.iso: 2623733760 bytes
SHA256 (Fedora-Workstation-Live-osb-40-1.14.x86_64.iso) = 8d3cb4d99f27eb932064915bc9ad34a7529d5d073a390896152a8a899518573f
# Fedora-Workstation-Live-x86_64-40-1.14.iso: 2295853056 bytes
SHA256 (Fedora-Workstation-Live-x86_64-40-1.14.iso) = dd1faca950d1a8c3d169adf2df4c3644ebb62f8aac04c401f2393e521395d613
[...]
```

You can also use hashing to find duplicate files; if two documents have the same hash, they are the same document. This is very convenient for finding and deleting duplicate files.

### HMACs

**HMAC (Keyed-Hash Message Authentication Code)** is a type of message authentication code (MAC) that uses a cryptographic hash function in combination with a secret key to verify the authenticity and integrity of data.

An HMAC can be used to ensure that the person who created the HMAC is who they say they are, i.e., authenticity is confirmed; moreover, it proves that the message hasn’t been modified or corrupted, i.e., integrity is maintained. This is achieved through the use of a secret key to prove authenticity and a hashing algorithm to produce a hash and prove integrity.

The following steps give you a fair idea of how HMAC works.

1. The secret key is padded to the block size of the hash function.
2. The padded key is XORed with a constant (usually a block of zeros or ones).
3. The message is hashed using the hash function with the XORed key.
4. The result from Step 3 is then hashed again with the same hash function but using the padded key XORed with another constant.
5. The final output is the HMAC value, typically a fixed-size string.

The illustration below should clarify the above steps.

![A visual representation of the HMAC function.](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1725294564965.svg)  

Technically speaking, the HMAC function is calculated using the following expression:

*HMAC(K,M) = H((K⊕opad)||H((K⊕ipad)||M))*

Note that M and K represent the message and the key, respectively.

---
### [Practice Questions]
-> What is SHA256 hash of `libgcrypt-1.11.0.tar.bz2` found in `~/Hashing-Basics/Task-7`
![](content/cyber/cybersecurity-101/hashing/7-hashing-for-integrity-checking/_img/pasted-image-20250808153700.png)

-> What’s the hashcat mode number for `HMAC-SHA512 (key = $pass)`
![](content/cyber/cybersecurity-101/hashing/7-hashing-for-integrity-checking/_img/pasted-image-20250808153805.png)
