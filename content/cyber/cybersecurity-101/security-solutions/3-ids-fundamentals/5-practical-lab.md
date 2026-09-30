## Exercise

**Scenario:** You are a third-party forensic investigator. A company contacts you to investigate a recent attack on their network. They handed over a PCAP file named "Intro_to_IDS.pcap", which contained the network traffic captured during the attack. Your task is to run Snort on this PCAP file and answer the questions given in this task.

**Note:**The PCAP file `Intro_to_IDS.pcap` is placed in the `/etc/snort/` directory. You have to change your directory to `/etc/snort` and run the PCAP analysis command on that new PCAP file the same way as we did in task 4.

---
=> What is the IP address of the machine that tried to connect to the subject machine using SSH?
:=> 10.11.90.211
![](content/cyber/cybersecurity-101/security-solutions/3-ids-fundamentals/_img/pasted-image-20251205145746.png)

=> What other rule message besides the SSH message is detected in the PCAP file?
:=> Ping Detected
![](content/cyber/cybersecurity-101/security-solutions/3-ids-fundamentals/_img/pasted-image-20251205145831.png)


=> What is the sid of the rule that detects SSH?
:=> 10000002
![](content/cyber/cybersecurity-101/security-solutions/3-ids-fundamentals/_img/pasted-image-20251205145854.png)
