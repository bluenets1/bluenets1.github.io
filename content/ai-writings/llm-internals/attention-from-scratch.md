Attention is the one idea you need to understand transformers. Strip away the jargon and it's a **weighted average** where the weights are computed on the fly.

## the intuition

Every token asks a question (**query**), advertises what it contains (**key**), and carries a payload (**value**). A token's output is the values of all tokens, weighted by how well their keys answer its query.

> [!NOTE]
> The `1/sqrt(d_k)` scale keeps dot products from growing with dimension, which would otherwise push softmax into near one-hot territory and kill gradients.

## the code

```python title=attention.py {6-8}
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)  # numerical stability
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def attention(Q, K, V, mask=None):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)
    return softmax(scores) @ V
```

## causal masking

For a decoder, token `i` must not see tokens `> i`:

```python
T = 5
mask = np.tril(np.ones((T, T), dtype=bool))
```

## cost

| op            | time       | memory    |
|---------------|------------|-----------|
| `Q @ K.T`     | O(T² · d)  | O(T²)     |
| `softmax @ V` | O(T² · d)  | O(T · d)  |

That `T²` is why long context is expensive — and why FlashAttention tiles the computation so the full score matrix never lives in HBM.

---

Next up: multi-head attention and why splitting `d_model` into heads is almost free.
