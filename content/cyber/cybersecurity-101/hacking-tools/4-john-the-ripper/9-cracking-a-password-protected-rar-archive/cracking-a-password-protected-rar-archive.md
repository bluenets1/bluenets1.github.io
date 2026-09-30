We can use a similar process to the one we used in the last task to obtain the password for RAR archives. If you aren’t familiar, RAR archives are compressed files created by the WinRAR archive manager. Like Zip files, they compress folders and files.

## Rar2John

Almost identical to the `zip2john` tool, we will use the `rar2john` tool to convert the RAR file into a hash format that John can understand. The basic syntax is as follows:

`rar2john [rar file] > [output file]`

- `rar2john`: Invokes the `rar2john` tool
- `[rar file]`: The path to the RAR file you wish to get the hash of
- `>`: This redirects the output of this command to another file
- `[output file]`: This is the file that will store the output from the command  
    

**Example Usage**

`/opt/john/rar2john rarfile.rar > rar_hash.txt`

## Cracking

Once again, we can take the file we output from `rar2john` in our example use case, `rar_hash.txt`, and feed it directly into John as we did with `zip2john`.

`john --wordlist=/usr/share/wordlists/rockyou.txt rar_hash.txt`

## Practical

Now, have a go at cracking a “secure” RAR file! The file is located in `~/John-the-Ripper-The-Basics/Task10/`.

-> What is the password for the secure.rar file?
![](content/cyber/cybersecurity-101/hacking-tools/4-john-the-ripper/9-cracking-a-password-protected-rar-archive/_img/pasted-image-20250808183836.png)

-> What are the contents of the flag inside the zip file?
`THM{r4r_4rch1ve5_th15_t1m3}`
