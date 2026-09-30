### **Windows Domain & Active Directory – Short Notes**
#### **Scenario Overview**
- Managing a small network (5 computers/users) can be done manually.
- As the network grows (e.g., 157 computers, 320 users, 4 offices), manual management becomes impractical.
#### **What is a Windows Domain?**
- A **Windows Domain** is a centralized group of computers and users managed by a central server.
- Uses **Active Directory (AD)** to manage users, computers, and policies.
- The server running AD is called a **Domain Controller (DC)**.
#### **Advantages of a Windows Domain**
1. **Centralized Identity Management**
    - Users can log in to any domain-joined computer using their credentials.
2. **Centralized Policy Management**
    - Security settings and restrictions can be deployed across all devices.
3. **Simplified Administration**
    - Easier user and device management from one central place.
#### **Real-World Example**
- In schools/universities:
    - One login works across all campus computers.
    - Central AD checks your credentials.
    - Policies restrict admin access and control panel access.


Picture yourself administering a small business network with only five computers and five employees. In such a tiny network, you will probably be able to configure each computer separately without a problem. You will manually log into each computer, create users for whoever will use them, and make specific configurations for each employee's accounts. If a user's computer stops working, you will probably go to their place and fix the computer on-site.

While this sounds like a very relaxed lifestyle, let's suppose your business suddenly grows and now has 157 computers and 320 different users located across four different offices. Would you still be able to manage each computer as a separate entity, manually configure policies for each of the users across the network and provide on-site support for everyone? The answer is most likely no.

To overcome these limitations, we can use a Windows domain. Simply put, a **Windows domain** is a group of users and computers under the administration of a given business. The main idea behind a domain is to centralise the administration of common components of a Windows computer network in a single repository called **Active Directory (AD)**. The server that runs the Active Directory services is known as a **Domain Controller (DC)**.

![Windows Domain Overview](https://tryhackme-images.s3.amazonaws.com/user-uploads/5ed5961c6276df568891c3ea/room-content/bebe5dfec0208bf563d01fa2dd1fb7a7.png)

The main advantages of having a configured Windows domain are:

- **Centralised identity management:** All users across the network can be configured from Active Directory with minimum effort.
- **Managing security policies:** You can configure security policies directly from Active Directory and apply them to users and computers across the network as needed.

A Real-World Example

If this sounds a bit confusing, chances are that you have already interacted with a Windows domain at some point in your school, university or work.

In school/university networks, you will often be provided with a username and password that you can use on any of the computers available on campus. Your credentials are valid for all machines because whenever you input them on a machine, it will forward the authentication process back to the Active Directory, where your credentials will be checked. Thanks to Active Directory, your credentials don't need to exist in each machine and are available throughout the network.

Active Directory is also the component that allows your school/university to restrict you from accessing the control panel on your school/university machines. Policies will usually be deployed throughout the network so that you don't have administrative privileges over those computers.

Welcome to THM Inc.

During this task, we'll assume the role of the new IT admin at THM Inc. As our first task, we have been asked to review the current domain "THM.local" and do some additional configurations. You will have administrative credentials over a pre-configured Domain Controller (DC) to do the tasks.

Be sure to click the **Start Machine** button below now, as you'll use the same machine for all tasks. This should open a machine in your browser.

---
##### In a Windows domain, credentials are stored in a centralised repository called..
> Active Directory

##### The server in charge of running the Active Directory services is called...
> Domain Controller
