import os

os.environ["HF_HUB_DISABLE_XET"] = "1"

import torch
from transformers import AutoModelForCausalLM

BASE_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

print("Loading model...")

model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto",
)

print("\nMODEL TYPE:")
print(type(model))

print("\nIMPORTANT MODULES:")

for name, module in model.named_modules():
    if name in [
        "model",
        "model.embed_tokens",
        "lm_head",
    ]:
        print(name, type(module))