NAT allows multiple devices on a private local network to share a single public IP address to access the internet. This helps conserve public IP addresses, which are limited in number under the IPv4 system.

**Example**: In an office with 50 computers, all the devices can access the internet through a single public IP address using NAT. The router keeps track of which internal device is making each request and translates it to the public IP for communication with external servers​(DHCP).

In the diagram below, multiple devices access the Internet via a router that supports NAT. The router maintains a table that maps the internal IP address and port number with its external IP address and port number. For instance, the laptop might establish a connection with some web server. From the laptop perspective, the connection is initiated from its IP address `192.168.0.129` from TCP source port number `15401`; however, the web server will see this same connection as being established from `212.3.4.5` and TCP port number `19273`, as shown in the translation table. The router does this address translation seamlessly.

**Answer the questions below**

> In the network diagram above, what is the public IP that the phone will appear to use when accessing the Internet?

**Answer:** 212.3.4.5

> Assuming that the router has infinite processing power, approximately speaking, how many **thousand** simultaneous TCP connections can it maintain?

**Answer:** 65
