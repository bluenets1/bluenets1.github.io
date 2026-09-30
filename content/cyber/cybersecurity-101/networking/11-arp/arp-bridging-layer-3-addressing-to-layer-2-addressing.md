ARP is a protocol used to map a device’s IP address to its MAC (Media Access Control) address. When a device wants to communicate with another device on the same local network, it needs the MAC address to create a data link layer frame.

As a reminder, in the screenshot below, we see an IP packet within an Ethernet frame. The Ethernet frame header contains:

- Destination MAC address
- Source MAC address
- Type (IPv4 in this case)

Zoom image will be displayed

![](https://miro.medium.com/v2/resize:fit:1260/0*hPUV3M0ffU8HyYjt.png)

**Example**: If your computer wants to send data to a device with IP address 192.168.66.1 but doesn’t know the MAC address, it will send an ARP Request. The device with the matching IP will respond with an ARP Reply, including its MAC address.

```Shell Session
user@TryHackMe$ tshark -r arp.pcapng -Nn  
    1 0.000000000 cc:5e:f8:02:21:a7 → ff:ff:ff:ff:ff:ff ARP 42 Who has 192.168.66.1? Tell 192.168.66.89  
    2 0.003566632 44:df:65:d8:fe:6c → cc:5e:f8:02:21:a7 ARP 42 192.168.66.1 is at 44:df:65:d8:fe:6c
```


If we use `tcpdump`, the packets will be displayed differently. It uses the terms ARP **Request** and ARP **Reply**. For your information, the output is shown in the terminal below.
```Shell Session
user@TryHackMe$ tcpdump -r arp.pcapng -n -v  
17:23:44.506615 ARP, Ethernet (len 6), IPv4 (len 4), Request who-has 192.168.66.1 tell 192.168.66.89, length 28  
17:23:44.510182 ARP, Ethernet (len 6), IPv4 (len 4), Reply 192.168.66.1 is-at 44:df:65:d8:fe:6c, length 28
```


- **tcpdump**: The command to run tcpdump, which is used to capture or analyze network traffic.
- **-r arp.pcapng**: The `-r` option specifies the packet capture file (`arp.pcapng`) to read from.
- **-n**: Just like in TShark, the `-n` option disables DNS lookups, preventing IP addresses from being resolved into hostnames.
- **-v**: This enables **verbose** mode, meaning more detailed output. It will show extra information about the packets, like packet size, and detailed protocol information.

An ARP Request or ARP Reply is not encapsulated within a UDP or even IP packet; it is encapsulated directly within an Ethernet frame. The following ARP Reply shows this.

Zoom image will be displayed

![](https://miro.medium.com/v2/resize:fit:1260/0*JRyBbA9bI4wlOxLH.png)

**ARP Process**:

- **ARP Request**: The device sends a broadcast message asking for the MAC address associated with the known IP address.
- **ARP Reply**: The device that has the IP address responds with its MAC address​(DHCP).

**Answer the questions below**

> What is the destination MAC address used in an ARP Request?

**Answer:** ff:ff:ff:ff:ff:ff

> In the example above, what is the MAC address of `192.168.66.1`?

**Answer:** ==44:df:65:d8:fe:6c==
