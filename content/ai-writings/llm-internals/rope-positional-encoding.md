Transformers have no inherent sense of order — attention is permutation-invariant. **RoPE** (rotary position embeddings) fixes this by rotating query and key vectors by an angle proportional to their position.

## the trick

Instead of *adding* a position vector, RoPE *rotates* pairs of dimensions. The dot product between a query at position `m` and a key at position `n` then depends only on `m - n` — giving relative position for free.

```python title=rope.py
import torch

def rope(x, base=10000):
    # x: (seq, dim), dim even
    seq, dim = x.shape
    theta = base ** (-torch.arange(0, dim, 2) / dim)
    pos = torch.arange(seq)[:, None] * theta[None, :]
    cos, sin = pos.cos(), pos.sin()
    x1, x2 = x[..., 0::2], x[..., 1::2]
    return torch.stack([x1 * cos - x2 * sin,
                        x1 * sin + x2 * cos], -1).flatten(-2)
```

## why it generalizes

Because the encoding is relative, a model trained on short sequences can be *stretched* to longer ones by scaling the frequencies — the basis of NTK-aware and YaRN context extension.

> [!TIP]
> If your long-context model degrades past its training length, the fix is almost always in how RoPE's `base` is scaled, not in the attention code itself.
