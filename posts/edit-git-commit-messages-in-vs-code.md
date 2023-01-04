---
title: Edit Git Commit Messages in VS Code
tags:
  - git
date: 2023-01-03
---

To edit git commit messages in VS Code insted of `vim` or `nano` when invoked from the integrated terminal, add this to your `settings.json`:

```json
"terminal.integrated.env.linux": {
    "GIT_EDITOR": "code --wait"
}
```

Change `linux` to `osx` or `windows` as needed.
