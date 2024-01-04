class JsonDBManager:
    def getGameSectionsDb():
        return [{'id': 1, 'parent_id': 0, 'keyword': 'forest', 'title': 'Forest 1'},
                {'id': 2, 'parent_id': 0, 'keyword': 'lake'},
                {'id': 3, 'parent_id': 0, 'keyword': 'forest', 'title': 'Forest 2'}
                ]

    def getGameObjects():
        return [{'id': 1, 'section_id': 1, 'parent_id': 0, 'keyword': 'tree'},
                {'id': 2, 'section_id': 2, 'parent_id': 0, 'keyword': 'water'},
                {'id': 2, 'section_id': 2, 'parent_id': 0, 'keyword': 'fish'}
                ]
