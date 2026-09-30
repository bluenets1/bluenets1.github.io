The single biggest reason autoregressive generation is fast enough to be useful is the **KV cache**. Without it, generating token *n* would re-read the entire prompt from scratch.

## the redundant work

At each step a decoder computes attention over every previous token. The keys and values for tokens `0..n-1` do not change when you append token `n` — so recomputing them is pure waste.

```python title=naive.py
# O(n^2) per token — recomputes K,V for the whole prefix every step
for step in range(max_new):
    logits = model(tokens)          # attends over all `tokens` again
    tokens.append(sample(logits[-1]))
```

## caching K and V

Store each layer's keys and values, and only compute them for the **new** token:

```python title=cached.py {6-8}
cache = None
for step in range(max_new):
    x = embed(tokens[-1:])          # just the last token
    for layer in model.layers:
        k, v = layer.kv(x)
        cache[layer] = cat(cache[layer], [k, v])   # append
        x = layer.attend(x, *cache[layer])
    tokens.append(sample(head(x)))
```

> [!NOTE]
> The cache turns per-step cost from O(n²) into O(n). The price is memory: cache size grows linearly with context length and batch size.

## what it costs

| quantity        | formula                                   |
|-----------------|-------------------------------------------|
| cache size      | `2 · layers · heads · head_dim · seq · B` |
| grows with      | context length, batch                     |

This is why long-context serving is a *memory* problem, and why tricks like MQA, GQA, and paged attention exist — they all shrink or better-manage this cache.
