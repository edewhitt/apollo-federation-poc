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


all_providers: List[Provider] = [
    Provider(
        id="90f0b355-64ae-42e7-91a8-cb93e33c11e0",
        practice="Firefly Station Boston",
    ),
    Provider(
        id="4f4b37e9-c3d1-44c1-827f-4768fd987c5c",
        practice="Firefly Station UT",
    ),
]