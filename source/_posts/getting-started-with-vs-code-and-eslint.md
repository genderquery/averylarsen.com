---
title: Getting started with Visual Studio Code and ESLint
tags:
  - vscode
  - eslint
  - javascript
date: 2020-01-27
---

In this article, I'll be showing you how to setup Visual Studio Code to use the popular JavaScript [linter] [ESLint][eslint].

<!-- more -->

## Prerequisites

This article assumes you:
* Have basic familiarly with the command line (creating and changing directories, running commands, etc)
* Have [Visual Studio Code][vscode] installed
* Have [Node.js][nodejs] installed

## Creating a project

In order to install and use ESLint, we're going to need to create a folder to hold our code. Additional, we'll be creating a special file called `package.json` that will describe our project and what it needs to work.

Create a folder somewhere and open it in Visual Studio Code by going to the menu bar and selecting *File → Open Folder...*. Choose your folder and hit *OK*.

Open the Terminal in Visual Studio Code by going to the menu bar and selecting *Terminal → New Terminal*. In the newly opened terminal window, initialize a new Node project:

```
npm init
```

It'll ask you a series of questions, but you can just hit enter to accept the defaults.

You should now have a `package.json` file in your file tree.

## Installing and configuring ESLint

Add the ESLint package to your project:

```
npm install eslint
```

Then create an ESLint config file:
```
eslint --init
```

Again, you'll get a series of questions. If you're not sure how to answer them, you can use these answers:
```
How would you like to use ESLint?
  To check syntax and find problems
What type of modules does your project use?
  CommonJS (require/exports)
Which framework does your project use?
  None of these
Does your project use TypeScript?
  No
Where does your code run?
  Node
What format do you want your config file to be in?
  JSON
```

## Installing the ESLint plugin for Visual Studio Code

Go to the menu bar and select *View → Extensions*. In the search bar in the Extensions pane, enter "eslint". You should see a plugin at the top of the list called ESLint, by Dirk Baeumer. Click on it and click the Install button on the page that opens.

## Linting your code

The plugin should automatically detect your ESLint install and configuration. Crate a new file in your project and test it out by putting in the following:

```javascript
var foo = bar;
```

You should get two red squiggles, one under `foo` and the other under `bar`. If you hover your mouse over `foo` you should see a popup with the message:
> 'foo' is assigned a value but never used.

and similarity with bar:
> 'bar' is not defined.

With some errors, there will be a light bulb you can click and get options to fix the error for you.


[vscode]: https://code.visualstudio.com/
[docs]: https://code.visualstudio.com/docs
[videos]: https://code.visualstudio.com/docs/getstarted/introvideos
[eslint]: https://eslint.org/
[linter]: https://en.wikipedia.org/wiki/Lint_(software)
[nodejs]: https://nodejs.org
