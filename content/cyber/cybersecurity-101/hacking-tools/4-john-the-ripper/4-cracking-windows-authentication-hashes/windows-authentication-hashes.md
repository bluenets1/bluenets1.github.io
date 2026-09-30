Now that we understand the basic syntax and usage of John the Ripper, let’s move on to cracking something a little bit more complicated, something that you may even want to attempt if you’re on an actual Penetration Test or Red Team engagement. Authentication hashes are the hashed versions of passwords stored by operating systems; it is sometimes possible to crack them using our brute-force methods. To get your hands on these hashes, you must often already be a privileged user, so we will explain some of the hashes we plan on cracking as we attempt them.

## NTHash / NTLM

NThash is the hash format modern Windows operating system machines use to store user and service passwords. It’s also commonly referred to as NTLM, which references the previous version of Windows format for hashing passwords known as LM, thus NT/LM.

A bit of history: the NT designation for Windows products originally meant New Technology. It was used starting with Windows NT to denote products not built from the MS-DOS Operating System. Eventually, the “NT” line became the standard Operating System type to be released by Microsoft, and the name was dropped, but it still lives on in the names of some Microsoft technologies.

In Windows, SAM (Security Account Manager) is used to store user account information, including usernames and hashed passwords. You can acquire NTHash/NTLM hashes by dumping the SAM database on a Windows machine, using a tool like Mimikatz, or using the Active Directory database: `NTDS.dit`. You may not have to crack the hash to continue privilege escalation, as you can often conduct a “pass the hash” attack instead, but sometimes, hash cracking is a viable option if there is a weak password policy.

## Practical

Now that you know the theory behind it, see if you can use the techniques we practised in the last task and the knowledge of what type of hash this is to crack the `ntlm.txt` file! The file is located in `~/John-the-Ripper-The-Basics/Task05/`.

-> What do we need to set the `--format` flag to in order to crack this hash?
: nt

-> What is the cracked value of this password?
![](content/cyber/cybersecurity-101/hacking-tools/4-john-the-ripper/4-cracking-windows-authentication-hashes/_img/pasted-image-20250808174440.png)
![](content/cyber/cybersecurity-101/hacking-tools/4-john-the-ripper/4-cracking-windows-authentication-hashes/_img/pasted-image-20250808174527.png)
