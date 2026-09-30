### Star Topology
The main premise of a star topology is that devices are individually connected via a central networking device such as a switch or hub. This topology is the most commonly found today because of its reliability and scalability - despite the cost.

### Bus Topology
-> This type of connection relies upon a single connection which is known as a **backbone** cable. This type of topology is similar to the leaf off of a tree in the sense that devices (leaves) stem from where the branches are on this cable.

-> However, with this said, bus topologies are one of the easier and more cost-efficient topologies to set up because of their expenses, such as cabling or dedicated networking equipment used to connect these devices.

-> Lastly, another disadvantage of the bus topology is that there is little redundancy in place in case of failures. This disadvantage is because there is a single point of failure along the backbone cable. If this cable were to break, devices can no longer receive or transmit data along the bus.
### Ring Topology
-> The ring topology (also known as token topology) boasts some similarities. Devices such as computers are connected directly to each other to form a loop, meaning that there is little cabling required and less dependence on dedicated hardware such as within a star topology.

-> A ring topology works by sending data across the loop until it reaches the destined device, using other devices along the loop to forward the data. Interestingly, a device will only send received data from another device in this topology if it does not have any to send itself. If the device happens to have data to send, it will send its own data first before sending data from another device.

---
## What is a Switch?
-> Switches are dedicated devices within a network that are designed to aggregate multiple other devices such as computers, printers, or any other networking-capable device using ethernet. These various devices plug into a switch's port. Switches are usually found in larger networks such as businesses, schools, or similar-sized networks, where there are many devices to connect to the network. Switches can connect a large number of devices by having ports of 4, 8, 16, 24, 32, and 64 for devices to plug into.

-> Switches are much more efficient than their lesser counterpart (hubs/repeaters). Switches keep track of what device is connected to which port. This way, when they receive a packet, instead of repeating that packet to every port like a hub would do, it just sends it to the intended target, thus reducing network traffic.

-> Both Switches and Routers can be connected to one another. The ability to do this increases the redundancy (the reliability) of a network by adding multiple paths for data to take. If one path goes down, another can be used. Whilst this may reduce the overall performance of a network because packets have to take longer to travel, there is no downtime -- a small price to pay considering the alternative.

---
## What is a Router?
-> It's a router's job to connect networks and pass data between them. It does this by using routing (hence the name router!).

-> Routing is the label given to the process of data travelling across networks. Routing involves creating a path between networks so that this data can be successfully delivered.

---
## Subnetting
-> Subnetting is achieved by splitting up the number of hosts that can fit within the network, represented by a number called a subnet mask. Let's refer back to our diagram from the first room in this module:
![](content/cyber/cybersecurity-101/networking/1-lan/_img/pasted-image-20250731124856.png)
->  an IP address is made up of four sections called octets. The same goes for a subnet mask which is also represented as a number of four bytes (32 bits), ranging from 0 to 255 (0-255).

-> Subnets use IP addresses in three different ways:
- Identify the network address
- Identify the host address
- Identify the default gateway
-> This cafe will have two networks:
- One for employees, cash registers, and other devices for the facility
- One for the general public to use as a hotspot

-> Subnetting allows you to separate these two use cases from each other whilst having the benefits of a connection to larger networks such as the Internet.

---
## ARP
#### What is ARP?
-> Recalling from our previous tasks that devices can have two identifiers: A MAC address and an IP address, the Address Resolution Protocol or ARP for short, is the technology that is responsible for allowing devices to identify themselves on a network.

-> Simply, ARP allows a device to associate its MAC address with an IP address on the network. Each device on a network will keep a log of the MAC addresses associated with other devices.

-> When devices wish to communicate with another, they will send a broadcast to the entire network searching for the specific device. Devices can use ARP to find the MAC address (and therefore the physical identifier) of a device for communication.

### How does ARP Work?
-> Each device within a network has a ledger to store information on, which is called a     cache. In the context of ARP, this cache stores the identifiers of other devices on the network.

->In order to map these two identifiers together (IP address and MAC address), ARP sends two types of messages:

1. **ARP Request**
2. **ARP Reply**

-> When an **ARP request** is sent, a message is broad-casted on the network to other devices asking, "What is the mac address that owns this IP address?" When the other devices receive that message, they will only respond if they own that IP address and will send an **ARP reply** with its MAC address. The requesting device can now remember this mapping and store it in its **ARP cache** for future use.

---
## DHCP
### 📌 **IP Address Assignment Methods**

- **Manual Assignment:**
    
    - IP address is entered manually into the device.
        
    - Used in small or controlled environments.
        
- **Automatic Assignment (DHCP):**
    
    - Handled by a **DHCP Server**.
        
    - Common in larger or dynamic networks.
        

---

### 📡 **DHCP IP Assignment Process (DORA Process)**

1. **DHCP Discover:**
    
    - Device broadcasts a request to find available DHCP servers.
        
2. **DHCP Offer:**
    
    - DHCP server replies with an available IP address and other network configuration details.
        
3. **DHCP Request:**
    
    - Device sends a message to the server requesting the offered IP.
        
4. **DHCP Acknowledgement (ACK):**
    
    - Server confirms the lease and the device can now use the IP address.
