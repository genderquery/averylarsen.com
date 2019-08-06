---
title: Git Alias
tags: git
date: 2019-08-05 20:36:11
---


I use both [GitHub] and [GitLab] and their respective private email
address features. This means, however, that I have two different commit
email addresses that can't be set globally.

When creating a new repository, previously I would have to set
`user.email` manually, but something like
`5616307+genderquery@users.noreply.github.com` is a bit hard to
remember.

Using what I learned from <cite>[Project specific git author, without the gas pains]</cite>,
I created an [alias] that will set the `user.email` config setting to the appropriate value:

```sh
git config --global alias.github 'config user.email "5616307+genderquery@users.noreply.github.com"'
git config --global alias.gitlab 'config user.email "3369804-genderquery@users.noreply.gitlab.com"'
```

Now when starting a new project that I plan to host on [GitLab], for
example, I can run the following commands to get things started:

```sh
git init
git gitlab
```

[github]: https://github.com/
[gitlab]: https://gitlab.com/
[project specific git author, without the gas pains]: https://www.codeography.com/2011/08/05/project-specific-git-author.html
[alias]: https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases
