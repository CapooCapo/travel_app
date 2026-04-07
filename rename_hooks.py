import os
import re

root_dir = "travel_app/src"

pattern = re.compile(r'\b([A-Z][A-Za-z0-9_]*)Function\b')

for dirpath, dnames, fnames in os.walk(root_dir):
    for fname in fnames:
        if not fname.endswith(('.ts', '.tsx')):
            continue

        filepath = os.path.join(dirpath, fname)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        def replacer(match):
            word = match.group(1)
            return 'use' + word  # giữ PascalCase

        new_content = pattern.sub(replacer, content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")