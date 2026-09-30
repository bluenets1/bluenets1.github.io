### **DNS (Domain Name System)**
- **Purpose**: DNS helps us access websites using names (like `tryhackme.com`) instead of IP addresses (like `104.26.10.229`). 
- **IP Address**: Every device on the internet has a unique IP address made of 4 number groups (0–255), e.g., `192.168.1.1`.
- **DNS Role**: Translates domain names to IP addresses so users don’t have to remember numbers.
- **Example**: When you enter `tryhackme.com`, DNS finds its IP address and connects you to the right server.

### **Domain Hierarchy**
#### **1. TLD (Top-Level Domain)**
- Last part of a domain (e.g., `.com` in `tryhackme.com`) 
- Two types:
    - **gTLD** (Generic): `.com`, `.org`, `.edu`, `.gov`
    - **ccTLD** (Country Code): `.ca`, `.co.uk`, etc.
- New gTLDs include `.online`, `.club`, `.website`, etc.
#### **2. Second-Level Domain**
- Comes before the TLD (e.g., `tryhackme` in `tryhackme.com`)
- Limited to:
    - 63 characters
    - Only a–z, 0–9, and hyphens
    - No starting/ending/consecutive hyphens
#### **3. Subdomain**
- Comes before the Second-Level Domain (e.g., `admin` in `admin.tryhackme.com`)
- Same rules as Second-Level Domain
- Multiple subdomains allowed (e.g., `jupiter.servers.tryhackme.com`)
- Max total length: 253 characters
---
### **DNS Record Types**
#### **1. A Record**
- Maps domain name to **IPv4 address**    
- Example: `104.26.10.229`
#### **2. AAAA Record**
- Maps domain name to **IPv6 address**
- Example: `2606:4700:20::681a:be5`
#### **3. CNAME Record**
- Points a domain to **another domain**
- Used for aliases or redirection
- Example: `store.tryhackme.com` → `shops.shopify.com`
#### **4. MX Record**
- Defines **mail servers** for the domain
- Example: `alt1.aspmx.l.google.com`
- Includes **priority** to decide order of use
#### **5. TXT Record**
- Stores **text-based info**
- Common uses:
    - Email validation (like SPF)
    - Domain ownership verification

---
### **What Happens When You Make a DNS Request**
#### 1. **Your Computer Checks Itself**

- First, your computer looks in its **own memory (cache)**.
    
- If it remembers the address from before, it uses that.
    

#### 2. **Asking the Recursive DNS Server**
- If your computer doesn't know, it asks a **Recursive DNS Server** (usually from your internet provider).
- This server also checks **its own memory**.
#### 3. **If It Still Doesn’t Know…**
- The Recursive Server asks the **Root DNS Servers** — the “top-level directory” of the internet.
#### 4. **Root DNS Sends to TLD Server**
- The Root DNS says: “.com? Go ask the **.com TLD Server**!”
#### 5. **TLD Sends to Authoritative Nameserver**
- The **TLD Server** tells where to find the **Authoritative Server** (like the real owner of the website name).
#### 6. **Authoritative Server Sends the Answer**
- This server gives the **real IP address** of the website (or other record).
- The answer goes back to the Recursive Server → then to your computer.
#### 7. **It Saves the Answer**
- Your computer and the Recursive Server **save the result** for a while (called **TTL**, Time To Live).
- So next time, it can answer faster
