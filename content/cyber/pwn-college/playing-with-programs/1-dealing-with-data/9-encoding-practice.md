```python
def decode_from_bits(s):
    s = s.decode("latin1")
    assert set(s) <= {"0", "1"}
    assert len(s) % 8 == 0
    return int.to_bytes(
        int(s, 2),
        length=len(s) // 8,
        byteorder="big"
    )
```

### Key Constraints
- Input must contain **only `0` and `1`**
- Length must be a **multiple of 8**
- Uses **big-endian**
- Converts full bitstream → integer → bytes
![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260119133441.png)

| Byte | Hex | Binary   |
| ---- | --- | -------- |
| \xbc | BC  | 10111100 |
| \xe0 | E0  | 11100000 |
| \xaa | AA  | 10101010 |
| \xb2 | B2  | 10110010 |
| \xde | DE  | 11011110 |
| \xee | EE  | 11101110 |
| \x98 | 98  | 10011000 |
| \x9f | 9F  | 10011111 |
![](content/cyber/pwn-college/playing-with-programs/1-dealing-with-data/_img/pasted-image-20260119133653.png)
