- **Packets vs Frames**:
    - **Frame**: Exists at **OSI Layer 2 (Data Link Layer)**; no IP address info.    
    - **Packet**: Exists at **OSI Layer 3 (Network Layer)**; includes IP address info.
- **Encapsulation**:
    - Data is wrapped in layers (like envelopes within envelopes).
    - Packet is the outer envelope; frame is inside it.
    - Removing encapsulation reveals the frame.    
- **Use of Packets**:
    - Efficient for data transmission across networks.
    - Reduces bottlenecks compared to sending large data at once.
    - Example: An image is sent in packets and reconstructed at the destination.    
- **Key Insight**:
    - Talking about **IP = Packets**.    
    - After stripping encapsulation = **Frame**.

![](content/cyber/cybersecurity-101/networking/3-packet-frames/_img/pasted-image-20250801132430.png)
### **Packet Structure & Headers**
- **Packet structure** varies based on **protocol used** (e.g., IP).
- **Standards & protocols** ensure reliable communication across billions of devices.
---
### **Common Internet Protocol (IP) Headers**:
- **Time to Live (TTL)**:
    - Prevents infinite looping of packets; acts as an expiry timer.
- **Checksum**:
    - Verifies data integrity; detects corruption in transit.
- **Source Address**:
    - IP of sender device; used for reply routing.
- **Destination Address**:
    - IP of recipient device; used to deliver the packet to the correct location.

---
##### What is the name for a piece of data when it **does have** IP addressing information?
->  Packets
##### What is the name for a piece of data when it **does not** have IP addressing information?
-> Frames

-----
### TCP/IP (The Three-Way Handshake)
### **TCP (Transmission Control Protocol) — Simple Notes**
- **TCP is a set of rules** used to send and receive data between two computers. 
- **Reliable** – It makes sure data gets delivered correctly and in the right order.
- **Connection-based** – It needs a connection to be made first (like a phone call) before sending data.
---

###  **TCP/IP Layers (4 Total):**
1. **Application** – Apps like browsers or games.
2. **Transport** – Ensures correct delivery (TCP works here).
3. **Internet** – Handles IP addresses (like house addresses).
4. **Network Interface** – Physical sending (like wires or Wi-Fi).

---
### **Encapsulation:**
- Every layer adds a “wrapper” to the data—like putting it in envelopes inside boxes.
---

###  **Advantages of TCP:**
- Delivers data **accurately**.
- Keeps **order** of messages.
- Reliable with **error checks**.
### **Disadvantages:**
- **Slower** than other methods (like UDP).
- Needs a **stable connection**.
---

### **Important TCP Packet Headers:**

|Header|Meaning|
|---|---|
|Source Port|Port from sender|
|Destination Port|Port on receiver|
|Source IP|Sender’s address|
|Destination IP|Receiver’s address|
|Sequence Number|Order of data|
|Acknowledgment Number|Confirms data received|
|Checksum|Error check|
|Flag|Special instructions|
|Data|Actual message|

---
##  **Three-Way Handshake — for an 11-year-old**
Imagine Alice (your computer) wants to **talk to Bob** (another computer):
### 1. **SYN** – Alice:
👧 “Hi Bob! Can we talk? I’ll start at number 0.”
### 2. **SYN + ACK** – Bob:
👦 “Hi Alice! Yes, let’s talk. I’ll start at number 5000. I got your number 0!”
### 3. **ACK** – Alice:
👧 “Cool! I got your number 5000. Let’s start sending messages!”
Now the connection is made! They can safely chat and send files!

---
### Sending Data:
Each message has a number:
- First message = 0
- Next = 1
- Then 2... and so on  
    - So Bob can **put messages in order** if they get mixed.
---

### ❌ **Closing the Connection**
When done talking:
1. Alice says “I’m done” with a **FIN** packet.
2. Bob replies “Okay, me too” with **FIN**.
3. Alice says “Got it” with an **ACK**.
Connection is closed nicely!

Because **bigger, random numbers** **ISN**  make the connection **more secure and reliable**. If it always started at 0 or 1 or 2, attackers could guess what’s coming next and mess with the data.

---
Another Topic

---
### UDP/IP

### **What is UDP?**

- A **connectionless** protocol (stateless).  
- **No handshake** or synchronization needed before sending data.
- Simply sends data across without checking if it was received.

---
### **Advantages of UDP:**

|Advantage|Meaning|
|---|---|
|Fast|Much faster than TCP since there’s no connection setup.|
|Flexible|Developers control how data is sent, without built-in restrictions.|
|Lightweight|Doesn’t reserve system resources (unlike TCP connections).|

---
### **Disadvantages of UDP:**

|Disadvantage|Meaning|
|---|---|
|No Guarantee|Doesn't check if the data arrives or is in order.|
|Unstable on bad networks|Poor connection results in a bad user experience.|
|No built-in error correction|The application must handle reliability if needed.|

---
### **UDP Packet Headers (Simpler than TCP):**

| Header              | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| Time to Live (TTL)  | Sets an expiry time to prevent packets from getting stuck.      |
| Source Address      | IP address of the sender.                                       |
| Destination Address | IP address of the receiver.                                     |
| Source Port         | Random port opened by the sender.                               |
| Destination Port    | Fixed port of the receiving service (like port 80).             |
| Data                | The actual content being transmitted (e.g., video/audio chunk). |

---
### **UDP in Action (Explained Simply):**
Imagine you're throwing paper planes (data) to your friend.  
You don’t check if your friend caught them or not — you just keep throwing.  
That’s UDP. Fast and simple, but not always reliable.

---
### **When to Use UDP**
- Voice and video calls (real-time) 
- Online gaming
- Live streaming

---
## Ports 101
### **What are Ports?**
- **Ports are numbered endpoints** used for sending and receiving data.
- They help devices **organize and manage multiple communications**.
- Think of them like **docking stations** at a harbour: only certain ships (applications) can dock at certain ports.

---
### **Port Range:**

- Ports range from **0 to 65535**.
    
- Ports from **0 to 1023** are known as **common (well-known) ports**.
    

---

### **Why Use Standard Ports?**
- To **avoid confusion** in communication.
- Applications use **standard port numbers** so systems know how to handle the data.

---
### **Examples of Common Protocols and Port Numbers:**

|Protocol|Port|Use|
|---|---|---|
|FTP|21|File transfers|
|SSH|22|Secure remote login (text-based)|
|HTTP|80|Standard web traffic|
|HTTPS|443|Secure web traffic (encrypted)|
|SMB|445|File and device sharing (e.g., printers)|
|RDP|3389|Remote desktop access (visual interface)|

---
### **Custom Port Usage:**

- You **can use non-standard ports**, like running a web server on port 8080 instead of 80.
- But clients must be told, e.g., `example.com:8080`.
