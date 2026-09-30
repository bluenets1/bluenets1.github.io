ICMP is primarily used for network diagnostics and troubleshooting. Two common commands that rely on ICMP are:

- **Ping**: Tests the connectivity between your device and a target system. It sends an ICMP Echo Request and waits for an ICMP Echo Reply.
- **Traceroute**: Finds the path data takes from your device to a target system by identifying each router along the way.

**Ping Example**:  
You can use the `ping` command to check if a server is online. By typing `ping example.com`, the system sends ICMP Echo Requests to the server, and if the server is reachable, it replies with ICMP Echo Replies​(DHCP).

The `ping` command sends an ICMP Echo Request (ICMP Type `8`). The screenshot below shows the ICMP message within an IP packet.

Zoom image will be displayed

![](https://miro.medium.com/v2/resize:fit:1260/0*FKHHUv6j19qJCsAb.png)

The computer on the receiving end responds with an ICMP Echo Reply (ICMP Type `0`).

Zoom image will be displayed

![](https://miro.medium.com/v2/resize:fit:1260/0*oywcQadLDI0_iQFw.png)

Many things might prevent us from getting a reply. In addition to the possibility of the target system being offline or shut down, a firewall along the path might block the necessary packets for `ping` to work. In the example below, we used `-c 4` to tell the `ping` command to stop after sending four packets.

user@TryHackMe$ ping 192.168.11.1 -c 4  
PING 192.168.11.1 (192.168.11.1) 56(84) bytes of data.  
64 bytes from 192.168.11.1: icmp_seq=1 ttl=63 time=11.2 ms  
64 bytes from 192.168.11.1: icmp_seq=2 ttl=63 time=3.81 ms  
64 bytes from 192.168.11.1: icmp_seq=3 ttl=63 time=3.99 ms  
64 bytes from 192.168.11.1: icmp_seq=4 ttl=63 time=23.4 ms  
--- 192.168.11.1 ping statistics ---  
4 packets transmitted, 4 received, 0% packet loss, time 3003ms  
rtt min/avg/max/mdev = 3.805/10.596/23.366/7.956 ms

- **ping**: The command that sends an ICMP Echo Request to test network connectivity.
- **192.168.11.1**: The target IP address of the device you are trying to reach.
- **-c 4**: The `-c` option specifies the number of ping requests to send. In this case, it will send 4 packets and stop.

**Traceroute Example**:  
If you want to find out the path your data takes to reach `example.com`, the `traceroute` command will show each router the data passes through.

The Internet protocol has a field called Time-to-Live (TTL) that indicates the maximum number of routers a packet can travel through before it is dropped. The router decrements the packet’s TTL by one before it sends it across. When the TTL reaches zero, the router drops the packet and sends an ICMP Time Exceeded message (ICMP Type `11`). (In this context, “time” is measured in the number of routers, not seconds.)

user@TryHackMe$ traceroute example.com  
traceroute to example.com (93.184.215.14), 30 hops max, 60 byte packets  
 1  _gateway (192.168.66.1)  4.414 ms  4.342 ms  4.320 ms  
 2  192.168.11.1 (192.168.11.1)  5.849 ms  5.830 ms  5.811 ms  
 3  100.104.0.1 (100.104.0.1)  11.130 ms  11.111 ms  11.093 ms  
 4  10.149.1.45 (10.149.1.45)  6.156 ms  6.138 ms  6.120 ms  
 5  * * *  
 6  * * *  
 7  * * *  
 8  172.16.48.1 (172.16.48.1)  5.667 ms  8.165 ms  6.861 ms  
 9  ae81.edge4.Marseille1.Level3.net (212.73.201.45)  50.811 ms  52.857 ms 213.242.116.233 (213.242.116.233)  52.798 ms  
10  NTT-level3-Marseille1.Level3.net (4.68.68.150)  93.351 ms  79.897 ms  79.804 ms  
11  ae-9.r20.parsfr04.fr.bb.gin.ntt.net (129.250.3.38)  62.935 ms  62.908 ms  64.313 ms  
12  ae-14.r21.nwrknj03.us.bb.gin.ntt.net (129.250.4.194)  141.816 ms  141.782 ms  141.757 ms  
13  ae-1.a02.nycmny17.us.bb.gin.ntt.net (129.250.3.17)  145.786 ms ae-1.a03.nycmny17.us.bb.gin.ntt.net (129.250.3.128)  141.701 ms  147.586 ms  
14  ce-0-3-0.a02.nycmny17.us.ce.gin.ntt.net (128.241.1.14)  148.692 ms ce-3-3-0.a03.nycmny17.us.ce.gin.ntt.net (128.241.1.90)  141.615 ms ce-0-3-0.a02.nycmny17.us.ce.gin.ntt.net (128.241.1.14)  148.168 ms  
15  ae-66.core1.nyd.edgecastcdn.net (152.195.69.133)  141.100 ms ae-65.core1.nyd.edgecastcdn.net (152.195.68.133)  140.360 ms ae-66.core1.nyd.edgecastcdn.net (152.195.69.133)  140.638 ms  
16  93.184.215.14 (93.184.215.14)  140.574 ms  140.543 ms  140.514 ms  
17  93.184.215.14 (93.184.215.14)  140.488 ms  139.397 ms  141.854 ms

The traversed route might change as we rerun the command.

**Answer the questions below**

> Using the example images above, how many bytes were sent in the echo (ping) request?

**Answer:** 40

> Which IP header field does the `traceroute` command require to become zero?

**Answer:** TTL
