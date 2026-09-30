The next mode we’ll focus on is the `dns` mode. This mode allows Gobuster to brute force subdomains. During a penetration test,  checking the subdomains of your target’s top domain is essential. Just because something is patched in the regular domain, it doesn't mean it is also patched in the subdomain. An opportunity to exploit a vulnerability in one of these subdomains may exist. For example, if TryHackMe owns _tryhackme.thm_ and _mobile.tryhackme.thm_, there may be a vulnerability in _mobile.tryhackme.thm_ that is not present in _tryhackme.thm_. That is why it is important to search for subdomains as well!

## Help

If you want a complete overview of what the Gobuster dns command can offer, you can have a look at the help page. Seeing the extensive help page for the `dns` command can be intimidating. So, we will focus on the most important flags in this room. Type the following command to display the help: `gobuster dns --help`  

The `dns` mode offers fewer flags than the `dir` mode. But these are more than enough to cover most DNS subdomain enumeration scenarios. Let us have a look at some of the commonly used flags:

|Flag|Long Flag|Description|
|---|---|---|
|`-c`|`--show-cname`|Show CNAME Records (cannot be used with the `-i` flag).|
|`-i`|`--show-ips`|Including this flag shows IP addresses that the domain and subdomains resolve to.|
|`-r`|`--resolver`|This flag configures a custom DNS server to use for resolving.|
|`-d`|`--domain`|This flag configures the domain you want to enumerate.|

### How to Use dns Mode

To run Gobuster in dns mode, use the following command syntax:  
`gobuster dns -d example.thm -w /path/to/wordlist`  

Notice that the command also includes the flags `-d` and `-w`, in addition to the `dns` keyword. These two flags are required for the Gobuster subdomain enumeration to work. Let us look at an example of how to enumerate  subdomains with Gobuster dns mode:

`gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt`

- `gobuster dns` enumerates subdomains on the configured domain.  
    
- `-d example.thm` sets the target to the _example.thm_ domain.  
    
- `-w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt` sets the wordlist to s_ubdomains-top1million-5000.txt_. Gobuster uses each entry of this list to construct a new DNS query. If the first entry of this list is 'all', the query would be _all.example.thm._

Go ahead and enter the command for yourself. You should get the following output:

AttackBox Terminal

```shell-session
root@tryhackme:~# gobuster dns -d example.thm -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt 
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     example.thm
[+] Threads:    10
[+] Timeout:    1s
[+] Wordlist:   /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
Found: www.example.thm
                                                                                                                                                            
Found: shop.example.thm
                                                                                                                                                            
Found: academy.example.thm
                                                                                                                                                            
Found: primary.example.thm
                                                                                                                                                            
Progress: 4989 / 4990 (99.98%)
===============================================================
Finished
=============================================================== 
```

---
### [Practice Questions]
=> Apart from the DNS keyword and the -w flag, which **shorthand flag** is required for the command to work?
==> `-d`

=> Use the commands learned in this task, how many subdomains are configured for the `offensivetools.thm` domain?
==> 4
![](content/cyber/cybersecurity-101/hacking-tools/7-gobuster-the-basics/_img/pasted-image-20250824234631.png)
