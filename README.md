# averylarsen.com

Personal website of Avery Larsen (that's me!).

## Branches

- **`main`**: The latest tested and stable state of the site. Commits to this
  branch get automatically deployed to the live site.
- **`staging`**: Test deploys are done from this branch to catch any problems
  before deploying to the live site. Gets merged into `main`.
- **`development`**: The latest development changes live here. Gets merged into
  `staging`. All features, fixes, and posts should branch off from this branch
  and then get merged back in.
- **`features/*`**: New features. Gets merged into `development` then deleted.
- **`fixes/*`**: Bug fixes. Gets merged into `development` then deleted.
- **`posts/*`**: Blog posts. Each gets it's own branch while in draft. When
  published, merged into `development` then deleted.

Features, fixes, and posts should be rebased before merging back into
`development`. All merges into `development`, `staging`, and `main` should not
be fast-forwarded ([`--no-ff`]).

[`--no-ff`]: https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---no-ff
