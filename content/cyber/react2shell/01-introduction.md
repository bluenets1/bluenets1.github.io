In this task, we will explore CVE-2025-55182, one of the most critical vulnerabilities discovered in December 2025, with a maximum CVSS score of 10.0. This vulnerability affects React Server Components (RSC) and the frameworks that implement them, particularly Next.js. The vulnerability, dubbed “React2Shell” by researchers, allows unauthenticated remote code execution through a single crafted HTTP request. We’ll examine the technical foundations of this flaw, understand how the React Flight protocol works, analyse the actual exploitation chain, and dissect a working proof-of-concept that demonstrates real-world remote code execution. By the end of this task, we’ll comprehend how a seemingly innocuous deserialization flaw can cascade into full system compromise.

Before we dive, in the [official](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) [security advisory](https://www.facebook.com/security/advisories/cve-2025-55182), the vulnerable versions are 19.0, 19.1.0, 19.1.1, and 19.2.0. The vulnerability spans the following:

- react-server-dom-webpack
- react-server-dom-parcel
- react-server-dom-turbopack

To protect your systems, you need to update to version 19.0.1, 19.1.2, or 19.2.1.
