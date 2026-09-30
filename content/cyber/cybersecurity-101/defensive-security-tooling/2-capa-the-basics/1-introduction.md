One of the challenges when analyzing potentially malicious software is that we risk our machine or environment being compromised when we run it unless we have a sandbox or a completely isolated environment where we can test all we want. Generally speaking, there are two types of analysis: dynamic analysis and static analysis. This room will focus on conducting static analysis using a tool called CAPA.

CAPA (Common Analysis Platform for Artifacts) is a tool developed by the FireEye Mandiant team. It is designed to **identify the capabilities** present in executable files like Portable Executables (PE), ELF binaries, .NET modules, shellcode, and even sandbox reports. It does so by analyzing the file and applying a set of rules that **describe common behaviours**, allowing it to determine what the **program is capable of doing**, such as **network communication**, **file manipulation**, **process injection**, and many more.

The beauty of CAPA is that it encapsulates years of reverse engineering knowledge into an automated tool, making it accessible even to those who may not be experts in reverse engineering. This can be incredibly useful for analysts and security professionals, allowing them to quickly understand potentially malicious software's functionality without manually reverse engineering the code.

This tool is particularly useful in malware analysis and threat hunting, where understanding a binary's capabilities is crucial for incident response and defensive measures.

  

### Learning Objectives

- Explore what CAPA is
- Learn how to use CAPA effectively
- Understand common fields and results rendered by using the tool
- Leverage the tool to Identify the program’s potential activity

  

### Room Prerequisites

Familiarity with the MITRE ATT&ACK Framework is recommended but not mandatory before starting the course. You may check the room associated with it.

- [MITRE ATT&CK](https://tryhackme.com/r/room/mitre)
