Authentication Failures happen when an application can’t reliably verify or bind a user’s identity. Common issues include:

- username enumeration
- weak/guessable passwords (no lockout/rate limits)
- logic flaws in the login/registration flow
- insecure session or cookie handling

If any of these are present, an attacker can often log in as someone else or bind a session to the wrong account.

Let's try to break into the `admin` user's account. We know that their username is `admin`, so let's try to fool the application by registering a user with the name of `aDmiN`. Start the static site attached to this task. register your account and log into the admin user's account to get your next flag!

If you want more depth or broader techniques (e.g., brute force, session handling, cookies/JWT/OAuth, and MFA specifics), work through these after this room:

- **[Authentication Bypass Room](https://tryhackme.com/room/authenticationbypass)**
- **[Multi-Factor Authentication](https://tryhackme.com/room/multifactorauthentications)**
- **[Authentication Module](https://tryhackme.com/module/authentication)**
