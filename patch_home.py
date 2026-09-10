import re

with open('src/pages/HomePage.tsx', 'r') as f:
    content = f.read()

# Remove why-less-creation section
content = re.sub(
    r'\s*\{\/\* 4\. WHY LESS CREATION.*?\<\/section\>',
    '',
    content,
    flags=re.DOTALL
)

with open('src/pages/HomePage.tsx', 'w') as f:
    f.write(content)
