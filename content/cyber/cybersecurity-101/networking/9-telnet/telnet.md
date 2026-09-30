The **TELNET** (**Teletype Network**) protocol is a network protocol for remote terminal connection. In simpler words, telnet, a **TELNET** client, allows you to connect to and communicate with a remote system and issue text commands. Although initially it was used for **remote administration**, we can use telnet to connect to any server listening on a TCP port number.

On the target virtual machine, different services are running. We will experiment with three of them:

**Echo serve**r: This server echoes everything you send it. By default, it listens on port 7.
Daytime server: This server listens on port 13 by default and replies with the current day and time.
**Web (HTTP) server**: This server listens on TCP port 80 by default and serves web pages.
Before continuing, we should mention that the echo and daytime servers are considered security risks and should not be run; however, we started them explicitly to demonstrate communication with the server using telnet. In the terminal below, we connect to the target VM at the echo server’s TCP port number 7. To close the connection, press the CTRL + ] keys simultaneously.

![](content/cyber/cybersecurity-101/networking/9-telnet/_img/pasted-image-20250803224055.png)
The IP We got here is this :
How we connect this using telnet ?
![](content/cyber/cybersecurity-101/networking/9-telnet/_img/pasted-image-20250803224459.png)


-> Use `telnet` to connect to the web server on `10.201.19.115`. What is the name and version of the HTTP server?
![](content/cyber/cybersecurity-101/networking/9-telnet/_img/pasted-image-20250803224757.png)
