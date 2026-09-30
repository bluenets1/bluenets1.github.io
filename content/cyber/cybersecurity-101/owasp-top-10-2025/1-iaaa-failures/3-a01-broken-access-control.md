Broken Access Control happens when the server doesn’t properly enforce **who can access what** on every request. A common occurence of this is **IDOR** (Insecure Direct Object Reference): if changing an ID (like `?id=7 → ?id=6`) lets you see or edit someone else’s data, access control is broken.

In practice this shows up as horizontal privilege escalation (same role, other user’s stuff) or vertical privilege escalation (jumping to admin-only actions) because the application trusts the client too much.

Start the static site attached to this task and play with the `accountID` value in the URL. So if you can identify which user has more than $ 1 million in their account!

If you want a deeper dive or more variations on the theme (encoded IDs, hashed IDs, etc.), work through these rooms afterwards:

- **[Broken Access Control](https://tryhackme.com/room/owaspbrokenaccesscontrol)**
- **[Insecure Direct Object References](https://tryhackme.com/room/idor)**

---

![](content/cyber/cybersecurity-101/owasp-top-10-2025/1-iaaa-failures/_img/pasted-image-20251216161558.png)
