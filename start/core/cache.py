import json

class Cache:
    def __init__(self):
        self.embeddings_cache =json.load(open('data/test/cache/embeddings.json'))

    def get_embedding(self, key: str):
        return self.embeddings_cache[key]
