Injection has been a long-standing feature on the OWASP Top 10 list, and it is no surprise. Injection remains a classic example of web exploitation.

## What is Injection?

Injection occurs when an application takes user input and mishandles it. Instead of processing the input securely, the application passes it directly into a system that can execute commands or queries, such as a database, a shell, a templating engine or API.![](https://tryhackme-images.s3.amazonaws.com/user-uploads/5de96d9ca744773ea7ef8c00/room-content/5de96d9ca744773ea7ef8c00-1763110178614.png)

You are likely familiar with SQL Injection, where an attacker inserts an SQL query into an application's logic, such as a login form, which then gets processed by the database. This happens when the web application fails to sanitise user input and instead uses it to construct the query. For instance, taking the "username" input on a login form and directly using it to query the database.

The following are some classic examples of injection that you may be familiar with:

- SQL Injection
- Command Injection
- AI Prompts
- Server Side Template Injection (SSTI)

Unfortunately, even in 2025, these types of attacks remain relevant, as evidenced by the inclusion of injection on the OWASP top ten list, not just once in 2021, but twice by 2025. Injection is of high severity and should be treated accordingly.

## How to Prevent Injection

Preventing injection starts by ensuring that user input is always treated as untrusted. Rather than parsing directly, instead, take elements of the input for querying. For SQL queries, this means using prepared statements and parameterised queries instead of building queries through string concatenation. For OS commands, avoid functions that pass input directly to the system shell, and instead rely on safe APIs and processes that don’t invoke the shell at all.

Input validation and sanitisation play a crucial role in preventing these types of attack. Escape dangerous characters, enforce strict data types and filter before the application even processes the input.

## Practical

Today's practical will showcase command injection. This example illustrates Server Side Template Injection (SSTI). You will abuse an application's ability to render dynamic content to retrieve a flag stored on the machine hosting the application.

You can access this portion of the practical on [http://10.48.133.42:8000](http://10.48.133.42:8000/).

## Recommended TryHackMe Content

If you'd like to explore this type of attack in much further depth, we highly recommend the following TryHackMe content:

- [Injection Attacks](https://tryhackme.com/module/injection-attacks) Module
- [Command Injection](https://tryhackme.com/room/oscommandinjection)

---
```lua
{{ request.application.__globals__.__builtins__.open('flag.txt').read() }}
```

=> using this fcking payload , we got the flag.
