# -*- coding: utf-8 -*-
import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Replace the words
    new_content = re.sub(r'\bEmpresa\b', 'Organización', new_content)
    new_content = re.sub(r'\bempresa\b', 'organización', new_content)
    new_content = re.sub(r'\bEmpresas\b', 'Organizaciones', new_content)
    new_content = re.sub(r'\bempresas\b', 'organizaciones', new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('app'):
    for file in files:
        if file.endswith('.vue') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
