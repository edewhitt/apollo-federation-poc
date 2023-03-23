from typing import List


class Provider:
    def __init__(self, id: str, practice: str):
        self.id = id
        self.practice = practice

    def to_dict(self):
        return {
            "id": self.id,
            "practice": self.practice,
        }
