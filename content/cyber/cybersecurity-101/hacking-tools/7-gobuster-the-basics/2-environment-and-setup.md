For this room, we will use an Ubuntu 20.04 VM acting as a web server. This web server hosts multiple subdomains and vhosts. The web server also has two content management systems (CMS) installed. These are Wordpress and Joomla.

Throughout this room, we will be using the AttackBox, where Gobuster is already installed, to enumerate the web server directories and subdomains. However, if you prefer to use your own machine instead of the AttackBox, you must be connected to the TryHackMe VPN and have Gobuster installed. You can find installation instructions for Gobuster on your own machine in the official [Gobuster GitHub repository](https://github.com/OJ/gobuster).

You can start the web server by clicking the `Start Machine` button below. The VM will take approximately 2 minutes to boot up. Direct access to this web server is not required. To start the AttackBox, click the `Start AttackBox` button at the top of the page.

Start Machine

Important: We work in a local network with a DNS server on the web server. To ensure we can resolve the domains used throughout this room, you need to change the `/etc/resolv-dnsmasq` file:

- Open up a terminal on the the AttackBox and enter the command: `sudo nano /etc/resolv-dnsmasq`.
- Insert `nameserver 10.201.74.104` as the first line.
- Save the file by pressing CTRL+O, followed by pressing ENTER, and then exit the editor by pressing CTRL+X.
- Enter the command `/etc/init.d/dnsmasq restart` to restart the Dnsmasq service.

The file should look something like this:

AttackBox Terminal

```shell-session
root@tryhackme:~# cat /etc/resolv-dnsmasq 
nameserver 10.201.74.104
nameserver 169.254.169.253
```
