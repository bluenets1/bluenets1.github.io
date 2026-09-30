Now, let's put your knowledge together. You must master the ultimate piping task: redirect stdout to one program and stderr to another.

The challenge here, of course, is that the `|` operator links the _stdout_ of the left command with the _stdin_ of the right command. Of course, you've used `2>&1` to redirect stderr into stdout and, thus, pipe stderr over, but this then mixes stderr and stdout. How to keep it unmixed?

You will need to combine your knowledge of `>()`, `2>`, and `|`. How to do it is a task I'll leave to you.

In this challenge, you have:

- `/challenge/hack`: this produces data on _stdout_ and _stderr_
- `/challenge/the`: you must redirect `hack`'s _stderr_ to this program
- `/challenge/planet`: you must redirect `hack`'s _stdout_ to this program

Go get the flag!

---
=> Flag: `pwn.college{REDACTED}`
How i got this?
```Shell
$ /challenge/hack > >( /challenge/planet ) 2> >( /challenge/the )
```


---
what i did (irl)


---

### ❌ My Attempt attempt:

`/challenge/hack 2>&1 >(/challenge/the) | 2>&1 >(/challenge/planet)`

---

### ✅ Correct solution:

`/challenge/hack > >( /challenge/planet ) 2> >( /challenge/the )`

---

## ➤ Let's break them down side by side:

|Feature|❌ Your attempt|✅ Correct solution|
|---|---|---|
|**Command executed**|`/challenge/hack`|`/challenge/hack`|
|**Stdout handling**|`> (/challenge/the)` after `2>&1` – stdout is sent to `/challenge/the`|`> >( /challenge/planet )` – stdout is sent to `/challenge/planet`|
|**Stderr handling**|`2>&1` → stderr merged into stdout → sent to `/challenge/the`|`2> >( /challenge/the )` → stderr sent to `/challenge/the`|
|**Pipe usage**|Pipe after stdout redirection → second part starts another command unexpectedly|No pipe; handled via process substitution|
|**Second process**|`2>&1 >(/challenge/planet)` not properly applied to hack’s output|Not needed; redirection is handled in one command|
|**Result**|stderr and stdout confused; stdout goes to wrong place; pipe misused|Exactly meets the challenge’s requirement|

---

### ✅ Why this is wrong:

1. **Order of redirections matters:**
    
    - `2>&1 >(/challenge/the)` means:
        
        - First, redirect stderr (2) to wherever stdout (1) is currently going (probably the terminal).
            
        - Then redirect stdout to `/challenge/the`.
            
        - **But stderr already went to the terminal**, not to `/challenge/the`.
            
2. **Pipe (`|`) applies after redirections:**
    
    - The left side is a completed process, and the pipe doesn't carry over the intended streams properly.
        
    - The second part of the pipe starts independently.
        
3. **You tried to redirect both outputs but misused `2>&1`**, which merges streams before redirecting.
    

---

### ✅ Why the correct version works:

- `> >( /challenge/planet )`: redirects stdout directly to the process.
    
- `2> >( /challenge/the )`: redirects stderr directly to the process.
    
- No merging of streams, so each one goes exactly where it’s supposed to.
    

---

### 📌 Core takeaway:

|Concept|❌ Your attempt|✅ Correct solution|
|---|---|---|
|Order matters|❌ `2>&1` redirects before stdout is changed|✅ redirects are applied as intended|
|Stream separation|❌ stdout and stderr are merged then redirected incorrectly|✅ stdout and stderr handled separately|
|Pipe usage|❌ pipe is unnecessary and breaks the logic|✅ everything handled inline|
|Final output|❌ stdout and stderr may go to wrong places|✅ meets challenge perfectly|

---

If you want, I can further show:

✔ How `2>&1` affects file descriptors step-by-step  
✔ How merging streams with pipes vs redirection differs  
✔ More examples to master bash redirections in practice
