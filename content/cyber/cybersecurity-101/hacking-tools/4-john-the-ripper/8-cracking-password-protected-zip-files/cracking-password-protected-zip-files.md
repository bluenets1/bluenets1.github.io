Yes! You read that right. We can use John to crack the password on password-protected Zip files. Again, we’ll use a separate part of the John suite of tools to convert the Zip file into a format that John will understand, but we’ll use the syntax you’re already familiar with for all intents and purposes.

## Zip2John

Similarly to the `unshadow` tool we used previously, we will use the `zip2john` tool to convert the Zip file into a hash format that John can understand and hopefully crack. The primary usage is like this:

`zip2john [options] [zip file] > [output file]`

- `[options]`: Allows you to pass specific checksum options to `zip2john`; this shouldn’t often be necessary
- `[zip file]`: The path to the Zip file you wish to get the hash of
- `>`: This redirects the output from this command to another file
- `[output file]`: This is the file that will store the output

**Example Usage**

`zip2john zipfile.zip > zip_hash.txt`

## Cracking

We’re then able to take the file we output from `zip2john` in our example use case, `zip_hash.txt`, and, as we did with `unshadow`, feed it directly into John as we have made the input specifically for it.

`john --wordlist=/usr/share/wordlists/rockyou.txt zip_hash.txt`

## Practical

Now, have a go at cracking a “secure” Zip file! The file is located in `~/John-the-Ripper-The-Basics/Task09/`.

-> What is the password for the secure.zip file?
![](content/cyber/cybersecurity-101/hacking-tools/4-john-the-ripper/8-cracking-password-protected-zip-files/_img/pasted-image-20250808183310.png)

-> What is the contents of the flag inside the zip file?
`THM{w3ll_d0n3_h4sh_r0y4l}`
