---
title: Enable Clippy With rust-analyzer
tags:
  - vscode
  - rust
date: 2023-01-03
---

By default, the VS Code extension [rust-analyzer](https://github.com/rust-lang/rust-analyzer) will run `cargo check` on save. If you want to have warnings and errors from [Clippy](https://github.com/rust-lang/rust-clippy) to show instead, change the command to `clippy` in your `settings.json`:

```json
"rust-analyzer.checkOnSave.command": "clippy"
```

Credit goes to 17cupsofcoffee for the [solution](https://users.rust-lang.org/t/how-to-use-clippy-in-vs-code-with-rust-analyzer/41881/2).
