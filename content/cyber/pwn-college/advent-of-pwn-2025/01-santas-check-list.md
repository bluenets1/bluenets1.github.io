## Challenge Description

**Objective:** The challenge involves a binary `check-list` that maintains Santa's Naughty-or-Nice list using "meticulous byte-level bookkeeping". We need to provide the correct input that satisfies a series of byte-level checks to retrieve the flag.
## Initial Analysis
We started by connecting to the challenge server via SSH:
![](content/cyber/pwn-college/advent-of-pwn-2025/_img/pasted-image-20251201151121.png)

![](content/cyber/pwn-college/advent-of-pwn-2025/_img/pasted-image-20251201151300.png)

![](content/cyber/pwn-college/advent-of-pwn-2025/_img/pasted-image-20251201151640.png)
  

## Reverse Engineering

The disassembly revealed a distinct pattern:
1. **Stack Allocation**: The program allocates 1280 bytes on the stack (`sub $0x500, %rsp`).
2. **Input Reading**: It reads 1024 bytes (`0x400`) from stdin into a buffer located at `-0x400(%rbp)`.
3. **Byte Modifications**: The core logic consists of over **1 million** byte-level operations (`addb` and `subb`) performed on the input buffer.
* Example: `addb $0x82, -0x23b(%rbp)` adds 0x82 to the byte at offset -0x23b.
1. **Verification**: After all modifications, the program compares each byte of the buffer against specific expected values using `cmpb`.
* Example: `cmpb $0x2b, -0x400(%rbp)` checks if the byte at -0x400 is 0x2b.
1. **Flag Output**: If all checks pass, the program reads and prints the flag.

  => Flag Checking:
  -> Since the operations are simple additions and subtractions, they are reversible. We can determine the required input by working backwards from the expected final values.

  ### Steps:
1. **Extract Expected Values**: Parse the `cmpb` instructions at the end of the function to find what each byte *should* be after all modifications.
2. **Extract Operations**: Parse the `addb` and `subb` instructions in the order they appear.
3. **Reverse Operations**:
* Start with the expected final values.
* Iterate through the operations in **reverse order**.
* For `addb $val, addr`, we *subtract* `val` from the byte at `addr`.
* For `subb $val, addr`, we *add* `val` to the byte at `addr`.
* Keep values within a single byte range (modulo 256).
1. **Construct Input**: The resulting byte values represent the input we must provide to the program.
## Solver Script
We wrote a Python script to automate this process. It parses the disassembly of the binary and calculates the required input.
```python

#!/usr/bin/env python3

import re

import subprocess

  

# Get the disassembly

result = subprocess.run(['objdump', '-d', 'check-list'], capture_output=True, text=True)

asm = result.stdout

  

# 1. Extract expected final values from cmpb instructions

expected = {}

cmpb_pattern = r'cmpb\s+\$0x([0-9a-f]+),(-?0x[0-9a-f]+)\(%rbp\)'

for match in re.finditer(cmpb_pattern, asm):

value = int(match.group(1), 16)

offset_str = match.group(2)

if offset_str.startswith('-0x'):

offset = -int(offset_str[3:], 16)

elif offset_str.startswith('0x'):

offset = int(offset_str[2:], 16)

else:

offset = int(offset_str, 0)

expected[offset] = value

  

print(f"Found {len(expected)} expected byte values")

  

# 2. Extract all add/sub operations

operations = []

pattern = r'(addb|subb)\s+\$0x([0-9a-f]+),(-?0x[0-9a-f]+)\(%[re]bp\)'

for match in re.finditer(pattern, asm):

op = match.group(1)

value = int(match.group(2), 16)

offset_str = match.group(3)

if offset_str.startswith('-0x'):

offset = -int(offset_str[3:], 16)

elif offset_str.startswith('0x'):

offset = int(offset_str[2:], 16)

else:

offset = int(offset_str, 0)

operations.append((op, value, offset))

  

print(f"Found {len(operations)} operations")

  

# 3. Initialize buffer with expected values

buffer = {}

for offset, value in expected.items():

buffer[offset] = value

  

# 4. Apply operations in REVERSE

for op, value, offset in reversed(operations):

if offset not in buffer:

buffer[offset] = 0

if op == 'addb':

# Reverse of add is subtract

buffer[offset] = (buffer[offset] - value) & 0xFF

else: # subb

# Reverse of subtract is add

buffer[offset] = (buffer[offset] + value) & 0xFF

  

# 5. Construct the input

input_offset = -0x400

# We need to provide the full 1024 bytes as the program checks the entire buffer

input_bytes = []

for i in range(input_offset, input_offset + 1024):

input_bytes.append(buffer.get(i, 0))

  

flag = bytes(input_bytes)

  

# Save to file

with open('/tmp/recovered_input.bin', 'wb') as f:

f.write(flag)

print("Recovered input saved to /tmp/recovered_input.bin")

```

  

## Execution and Flag

We ran the script to generate the input file, and then piped it to the challenge binary on the remote server:

  

```bash

python3 solve_santa.py

cat /tmp/recovered_input.bin | ssh -i key hacker@dojo.pwn.college '/challenge/check-list'

```

  

**Output:**

```

✨ Correct: you checked it twice, and it shows!

pwn.college{REDACTED}

```

  

The challenge was successfully solved by statically analyzing the binary's logic and reversing the massive number of byte-level operations to reconstruct the required input.
