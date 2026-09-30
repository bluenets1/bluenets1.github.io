Now that you have come this far, it is essential that you refrain from attempting such penetration tests against any system without explicit permission and a written agreement. The primary purpose of this room is to allow you to experiment in a safe laboratory environment without violating any laws. We have provided you with one PoC; however, it is up to you to experiment with other exploit codes.

When we set out to create a room about CVE-2025-55182, the number of incorrect PoC exploits was astonishing. As [Lachlan Davidson](https://react2shell.com/) put it, “Anything that requires the developer to have explicitly exposed dangerous functionality to the client is not a valid PoC.” In fact, we wasted a non-trivial amount of time dealing with PoC codes that only work with their bundled Node.js app. Things get “funny” when the bundled app remains exploitable despite upgrading the vulnerable libraries. In other words, there are many PoC online that work with their bundled app; however, they are not real PoC, and the bundled app is broken, continuing to allow things it should not despite switching to patched versions. The app that you exploited earlier is using vulnerable libraries listed below.

```json
 "dependencies": {  
   "next": "16.0.6",  
   "pm2": "^6.0.14",  
   "react": "19.2.0",  
   "react-dom": "19.2.0"  
 }  
```

Moreover, we confirmed that once we follow the recommendations of `npm audit`, the exploit no longer works. Our goal is to offer the most authentic laboratory experience for our users.

Finally, remember to upgrade your servers to a patched version.
