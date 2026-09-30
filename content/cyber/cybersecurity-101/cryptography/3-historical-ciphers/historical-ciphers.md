Cryptography’s history is long and dates back to ancient Egypt in 1900 BCE. However, one of the simplest historical ciphers is the Caesar Cipher from the first century BCE. The idea is simple: shift each letter by a certain number to encrypt the message.

Consider the following example:

- Plaintext: `TRYHACKME`
- Key: 3 (Assume it is a right shift of 3.)
- Cipher: Caesar Cipher

We can easily figure out that T becomes W, R becomes U, Y becomes B, and so on. As you noticed, once we reach Z, we start all over, as shown in the figure below. Consequently, we get the ciphertext of `WUBKDFNPH`.

![Caesar Cipher shifts each letter by a certain number to encrypt the message.](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1725293808044.svg)  

To decrypt, we need the following information:

- Ciphertext: `WUBKDFNPH`
- Key: 3
- Cipher: Caesar Cipher

![Caesar Cipher shifts each letter by a certain number to decrypt the message.](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1725293821679.svg)  

For encryption, we shift to the right by three; for decryption, we shift to the left by three and recover the original plaintext, as illustrated in the image above. However, if someone gives you a ciphertext and tells you that it was encrypted using Caesar Cipher, recovering the original text would be a trivial task as there are only 25 possible keys. The English alphabet is 26 letters, and shifting by 26 will keep the letter unchanged; hence, 25 valid keys for encryption with Caesar Cipher. The figure below shows how decryption will succeed by attempting all the possible keys; in this case, we recovered the original message with _K__e__y_ = 5. Consequently, by today’s standards, where the cipher is publicly known, Caesar Cipher is considered insecure.

![Caesar Cipher is susceptible to brute force attacks.](https://tryhackme-images.s3.amazonaws.com/user-uploads/5f04259cf9bf5b57aed2c476/room-content/5f04259cf9bf5b57aed2c476-1725293835225.svg)  

You would come across many more historical ciphers in movies and cryptography books. Examples include:

- The Vigenère cipher from the 16th century
- The Enigma machine from World War II
- The one-time pad from the Cold War

### [Practical Questions]
-> Knowing that XRPCTCRGNEI was encrypted using Caesar Cipher, what is the original plaintext?

| Shift | Decrypted Text                      |
| ----- | ----------------------------------- |
| 1     | WQOBSBQFMDH                         |
| 2     | VPNARAPELCG                         |
| 3     | UOMZQZODKBF                         |
| 4     | TNLYPYNCJAE                         |
| 5     | SMKXOXMBIZD                         |
| 6     | RLJWNWLAHYC                         |
| 7     | QKIVMVKZGXB                         |
| 8     | PJHULUJYFWA                         |
| 9     | OIGTKTIXEVZ                         |
| 10    | NHFSJSHWDUY                         |
| 11    | MGERIRGVCTX                         |
| 12    | LFDQHQFUBSW                         |
| 13    | KECPGPETARV                         |
| 14    | JDBOFODSZQU                         |
| 15 ✅  | **ICANENCRYPT** ← Correct plaintext |


# **Note**
*There are 26 shifting in Caesar-cipher to find the correct plaintext*
