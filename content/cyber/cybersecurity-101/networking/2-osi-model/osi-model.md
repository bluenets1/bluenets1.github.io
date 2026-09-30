## What is OSI Model?
-> The OSI mode (or **O**pen **S**ystems **I**nterconnection Model) is an essential model used in networking.  This **critical** model provides a framework dictating how all *networked devices* will **send**, **receive** and **interpret data**.

-> One of the main **benefits** of the OSI model is that **devices can have different functions and designs** on a network while *communicating with other devices*. Data sent across a network that follows the uniformity of the OSI model can be understood by other devices.

-> All OSI Model Layers together makes **Encapsulation**(When pieces of information get added to data)
--> When the data reaches the other side(receiver), the layers *remove the headers one by one* - this process is called **decapsulation**.

### Physical Layer
-> This layer is one of the easiest layers to grasp. Put simply, this layer references the **physical components of the hardware** used in **networking and is the lowest layer** that you will find. **Devices use electrical signals to transfer data between each other in a binary numbering system (1's and 0's).**

### Data Link Layer
-> The data link layer focuses on the physical addressing of the transmission.
-> It receives a packet from the network layer (including the IP address for the remote computer) and adds in the physical **MAC** (Media Access Control) address of the receiving endpoint.
-> MAC addresses are set by the manufacturer and literally burnt into the card; they can’t be changed

### Network Layer
- Responsible for **routing** and **re-assembling** data chunks.
- Determines the **best path** for data to travel across networks.
- Uses protocols like:
    - **OSPF** (Open Shortest Path First)
    - **RIP** (Routing Information Protocol)
- **Route decision factors:**
    - Shortest path (fewer hops)
    - Most reliable path (fewer packet losses)
    - Fastest physical connection (e.g., fiber > copper)
- Uses **IP addresses** (like `192.168.1.100`) for data delivery.
- **Routers** are Layer 3 devices — they forward data based on IP.

### Transport Layer
###  Purpose:

- Manages **data transmission** between devices.
- Uses **TCP** or **UDP** based on needs like **reliability vs speed**.
###  **TCP – Transmission Control Protocol**

**Key Features:**
- Reliable and connection-oriented. 
- Ensures data arrives **in order** and **without errors**.
- Reserves a connection for the entire session.
- Performs **error checking** and **synchronization**.
**Used For:*
- File transfer
- Email
- Web browsing  
    (_Where complete and correct data is essential_)    
 **Example:**
- Picture sent in small packets → Reassembled perfectly.
**Advantages:**
- Guarantees accuracy.
- Prevents data flooding.
- Reliable communication.
**Disadvantages:**
- Slower than UDP.
- Needs stable connection.
- One missing packet can break the whole chunk.
### **UDP – User Datagram Protocol**
**Key Features:**
- Fast and connectionless.
- No guarantee of delivery or order.
- No error checking or synchronization.
- Sends data regardless of success.
**Used For:**
- Video streaming
- Online gaming
- ARP, DHCP  
    (_Where speed is more important than perfection_)
 **Example:**
- Packets #1 and #3 received → Missing parts in image/video.
**Advantages:**
- Much faster than TCP.
- Doesn’t reserve connection.    
- Flexible for developers.
 **Disadvantages:**
- No reliability.
- Packet loss = data loss.
- Bad for unstable networks.

### Session Layer
-> the session layer (layer 5) will begin to create and maintain the connection to other computer for which the data is destined. When a connection is established, a session is created. Whilst this connection is active, so is the session.

-> The session layer is also responsible for closing the connection if it hasn't been used in a while or if it is lost. Additionally, a session can contain "checkpoints," where if the data is lost, only the newest pieces of data are required to be sent, saving bandwidth. 

###### What is the technical term for when a connection is successfully established?
-> Session

### Presentation Layer
-> The Presentation Layer is responsible for **translating, formatting, and encrypting** data between applications.  
-> It ensures that data from one system can be **understood by another**, even if their software is different.  
-> It also handles **encryption/decryption**, like when using **HTTPS** on websites.  
Example:_ An email sent from Gmail appears the same when opened in Outlook.
-> The main purpose for this layer is as **Translator**

### Application Layer
- he **topmost layer** of the OSI model, closest to the end user.
- Provides a **GUI (Graphical User Interface)** for users to interact with network data.    
- Controls how data is **presented and accessed** by applications.
- Uses protocols like:
    - **HTTP/HTTPS** (web browsing)
    - **SMTP/IMAP** (email)
    - **FTP** (file transfers)
    - **DNS** (translates domain names to IPs)
 _Example:_ Gmail, Chrome, FileZilla, and any browser or email app you use.


### Summary

Reading about the ISO OSI model for the first time can be intimidating; however, it becomes easier as you progress in your study of networking protocols. To help with your studies, we have summarised the ISO OSI layers in the table below.

|Layer Number|Layer Name|Main Function|Example Protocols and Standards|
|---|---|---|---|
|Layer 7|Application layer|Providing services and interfaces to applications|HTTP, FTP, DNS, POP3, SMTP, IMAP|
|Layer 6|Presentation layer|Data encoding, encryption, and compression|Unicode, MIME, JPEG, PNG, MPEG|
|Layer 5|Session layer|Establishing, maintaining, and synchronising sessions|NFS, RPC|
|Layer 4|Transport layer|End-to-end communication and data segmentation|UDP, TCP|
|Layer 3|Network layer|Logical addressing and routing between networks|IP, ICMP, IPSec|
|Layer 2|Data link layer|Reliable data transfer between adjacent nodes|Ethernet (802.3), WiFi (802.11)|
|Layer 1|Physical layer|Physical data transmission media|Electrical, optical, and wireless signals|
**MIME** : *Multipurpose Internet Mail Extension*
