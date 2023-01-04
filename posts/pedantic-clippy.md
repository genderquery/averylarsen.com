---
title: Pedantic Clippy
tags:
  - Rust
date: 2023-01-03
---

Turn on all warning for [Clippy](https://github.com/rust-lang/rust-clippy) by adding the following to the top of your `lib.rs`:

```rust
#![deny(clippy::all)]
#![warn(clippy::pedantic)]
#![warn(clippy::restriction)]
#![warn(clippy::nursery)]
#![warn(clippy::cargo)]
```

From https://zhauniarovich.com/post/2021/2021-09-pedantic-clippy/#paranoid-clippy.
