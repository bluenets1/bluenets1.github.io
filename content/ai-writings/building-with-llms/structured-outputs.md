"Just ask it to return JSON" works until it doesn't. Here is how to get structured output you can actually parse in production.

## the failure modes

- trailing prose: `Sure! Here's your JSON: { ... }`
- markdown fences around the object
- a valid-looking object with the wrong schema

## constrain, don't hope

The robust fix is **constrained decoding** — restrict the sampler to only emit tokens that keep the output valid against a grammar or JSON schema.

```python title=schema.py
schema = {
    "type": "object",
    "properties": {
        "sentiment": {"enum": ["pos", "neg", "neu"]},
        "score": {"type": "number"}
    },
    "required": ["sentiment", "score"]
}
```

> [!IMPORTANT]
> If the API supports a schema or tool-call mode, use it. It moves validity from "the model was nice" to "the decoder could not produce anything else."

## always validate anyway

```python
import json, jsonschema
obj = json.loads(raw)
jsonschema.validate(obj, schema)   # fail loud, retry once
```

Treat the model as an untrusted input source. Parse, validate, and have a retry path.
