## Introduction To Port Forwarding
### **Port Forwarding – Short Notes**
- **Port forwarding** allows devices **outside a local network** to access a service inside the network. 
- Without it, services like web servers are **only accessible within the same local (intranet) network**.
- It is used to **connect internal services (e.g., a web server on 192.168.1.10:80)** to the **public internet** via the router’s **public IP**.
- Configured on the **network’s router**.
- **Opens specific ports** so external devices can reach internal ones.
- **Not the same as a firewall**:
    - Port forwarding **opens the door**.
    - Firewall **decides who can walk through**.

---
## Firewalls 101
###  **What is a Firewall? (Kid Version)**
Imagine your **network is a castle**, and a **firewall is the guard at the castle gate**. It decides:
- **Who can come in** 
- **Who can go out**
- **What they’re carrying (like messages or files)**
Just like a guard checks ID cards, the **firewall checks each message (called a packet)** before letting it in or out.

---
###  **What does the firewall check?**
The firewall asks:
1. Where are you coming from? (Good place or bad place?)
2. Where are you going? (Allowed or not?)
3. Which **door (port)** are you using? (e.g., door 80 for websites)
4. Are you using **safe rules (TCP/UDP)?**
If the answer is wrong, the packet gets **blocked**. If everything looks good, it gets **allowed**.
---
###  **Types of Firewalls (Simple):**

| Type                   | Like...           | What it does                                                                                                 |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| **Stateful Firewall**  | A smart guard     | Looks at the **whole conversation**, not just one message. If someone misbehaves, it blocks them completely. |
| **Stateless Firewall** | A checklist guard | Only checks each message **one at a time**. Doesn’t remember what happened before. Faster but less smart.    |

---
### **Where does a firewall work?**
- It works at **Layer 3** (Internet address level) and **Layer 4** (Talking rules like TCP/UDP) — basically, the **address** and the **rules** the packet is using.
---
## VPN Basics
### What is a VPN?
Imagine you and your friend want to pass secret notes in class. But you don't want the teacher or anyone else to read them. So, you make a secret tunnel between your desks and send messages through it. Only you two can see what's inside.

A **VPN** works the same way. It creates a **private and safe path** (called a tunnel) over the internet so your computer can talk to another computer secretly.

---
### Why use a VPN?
1. **Connects distant places**  
    A company with offices in two different cities can use a VPN to make their computers work together as if they were in the same room.
2. **Privacy**  
    VPN hides your internet activity. People like hackers or your internet provider can’t see what you're doing.
3. **Safety on public Wi-Fi**  
    When you use free Wi-Fi (like in cafes), a VPN keeps your data safe from people trying to spy on you.
4. **Anonymity**  
    Journalists and activists use VPNs to hide who they are in countries where it's not safe to speak freely.
5. **Used by TryHackMe**  
    TryHackMe uses VPNs to connect you safely to their hacking practice machines without exposing them to the entire internet.
---
### VPN Technologies

|Technology|Simple Meaning|Notes|
|---|---|---|
|**PPP**|Basic connection method|Used to create private connections. It can't travel outside the local network on its own.|
|**PPTP**|Builds a tunnel for PPP|Easy to set up, but not very secure. Helps PPP work over the internet.|
|**IPSec**|Strong protection for data|Harder to set up, but gives strong encryption. Safer than PPTP.|


---
## LAN Networking Devices
## **Router (Layer 3)**

### What is it?
- A router connects different **networks** together.
- It **forwards data** between networks using **routing**.
- Routers work at **Layer 3** (Network Layer) of the OSI model.

### Main job:
- **Decides the best path** for data to travel between networks.
### Example:
If Computer A and Computer B are in different networks, the router chooses the best way to send data between them.
### Routing decisions are based on:
- **Shortest path**
- **Reliable connection**
- **Speed of the link** (fiber is faster than copper)    
### Extra:
- Routers can be configured using web interfaces.
- Routers **do not** work like switches.
---
## **Switch**
### What is it?
- A switch connects **multiple devices** in the **same network**.
- It works using **Ethernet cables**.
### Layer 2 Switch:
- Works at **Layer 2** (Data Link Layer).
- Sends **frames** to the correct device using **MAC addresses**.
### Layer 3 Switch:
- Works at **Layer 3** (Network Layer).
- Sends **frames** like Layer 2 and **routes packets** like routers using **IP addresses**.
### VLAN (Virtual LAN):
- Used with Layer 3 switches.
- Virtually **separates devices** inside the same switch.
- Example: Sales and Accounting departments can share internet but **can’t talk to each other**.
---
### Summary:

|Device|Works At|Purpose|
|---|---|---|
|Router|Layer 3|Connects networks, routes data|
|Switch (L2)|Layer 2|Connects devices in one network using MAC|
|Switch (L3)|Layer 3|Routes + connects devices using IP|

---
