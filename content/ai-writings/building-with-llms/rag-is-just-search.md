Retrieval-augmented generation sounds exotic. It is mostly **search with extra steps**, and most RAG problems are really *search* problems wearing a trench coat.

## the pipeline

1. chunk your documents
2. embed each chunk into a vector
3. at query time, embed the question and find nearest chunks
4. stuff those chunks into the prompt

```python title=rag.py
q = embed(question)
hits = index.search(q, k=5)
context = "\n\n".join(h.text for h in hits)
answer = llm(f"Answer using only:\n{context}\n\nQ: {question}")
```

## where it actually breaks

- **chunking**: too big and you retrieve noise; too small and you lose context
- **embeddings**: a generic model may not know your domain's vocabulary
- **evaluation**: if you can't measure retrieval hit-rate, you're flying blind

> [!NOTE]
> Before reaching for a bigger model, check whether the right chunk was even in the top-k. Usually it wasn't — and that's a retrieval fix, not a generation fix.
