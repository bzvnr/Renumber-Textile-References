<h1 align="center"> Renumber-Textile-References </h1>

<div align="center">
  <a href="https://bzvnr.github.io/Renumber-Textile-References/">View in action with GitHub Pages</a>
</div>

## Introduction

Automatically renumber [explicitly numbered references in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text.

This project is currently designed to target a [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) on a webpage. [Click here to view the program in action on a webpage](https://bzvnr.github.io/Renumber-Textile-References/).

## Rationale

This project solves a problem with explicitly numbered references in the [Textile](https://en.wikipedia.org/wiki/Textile_(markup_language)) markup language. When a user alters the reference order or inserts a new reference in a body of text, the references' order by appearance may be compromised. To preserve the references' order by appearance, a user may have to renumber the references manually. This project solves that problem by doing that automatically.

Note that Textile already provides [auto-numbered notes](https://textile-lang.com/doc/auto-numbered-notes) as an alternative solution.

This project is suited for: 

- Anyone using Textile who has text already containing explicitly numbered references
- Websites where auto-numbered notes are not supported

## Features

- Automatically renumber explicitly numbered references by their order of appearance in text
- Error detection that highlights user formatting errors to prevent incorrect usage
- References can be placed almost anywhere in text and be placed in the [ReferenceSection]("./configuration") (for limits, see [Limitations](./#limitations))

## Example 

| Before | After |
| ------ | ----- |
| h2. Section<br><br>Lorem.[2][3] ipsum.[1]<br><br>h2. External References<br><br>fn2. First Ref<br><br>fn1. Third Ref<br><br>fn3. Second Ref | h2. Section<br><br>Lorem.[1][2] ipsum.[3]<br><br>h2. External References<br><br>fn1. First Ref<br><br>fn2. Second Ref<br><br>fn3. Third Ref |

## Terminology

This project uses different [terminology](https://textile-lang.com/doc/footnotes) than the Textile markup language, as seen below. The terminology used in this project may be subject to future change.

### Project vs. Textile

| Appearance in text | Project | Textile |
|:------------------:| ------- | ------- |
| [1] | In-text citation | Reference |
| fn1. Author - "Sample Text":https://www.example.com | Reference | Footnote |

### Project-Specific

- *referenceSection* - specified in [config.js](./lib/config.js), a part of the text assumed to be the last [heading](https://textile-lang.com/doc/headings) or a unique last section in the text. The program places all references under the *referenceSection* after it is finished renumbering them. As seen in [the example], *referenceSection's* default value is `h2. External References`, but this can be changed by following the [ReferenceSection Instructions](./#referencesection-instructions). All references are placed under the *referenceSection*, regardless of where they are located in the <textarea>. Note that with the current implementation, any text after the *referenceSection* will be lost.
- [config.js](./lib/config.js) - a file used to customize the program to the user's needs


## Use Instructions

A live version of program can be accessed with [GitHub Pages](https://bzvnr.github.io/Renumber-Textile-References/). The program can also be used offline by downloading it or cloning it from GitHub.

### Requirements

To use this project locally, Node.js and npm must be installed on your system. See [installation instructions for Node.js details](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). A short video on how to install can also be viewed [here](https://youtu.be/OBhw2BOez0w?t=82).

### Installation

- Download the project from this page by clicking the green `Code` button and downloading the project as a ZIP file
- Unzip the file (AKA Extract all)

### Configuration

This part assumes you [downloaded](#installation) or cloned the project. To update [config.js](./lib/config.js), follow these instructions:

- Locate the [config.js](./lib/config.js)
- Open [config.js](./lib/config.js) and update the values of variables to the desired values (ex: referenceSection: "changeTheValueInQuotes"). Save any changes made
- [Open your system's terminal](https://web.archive.org/web/20220528160004/https://towardsdatascience.com/a-quick-guide-to-using-command-line-terminal-96815b97b955?gi=f465d80a5ddf)
- In the terminal, navigate to the project's directory (folder)
- <details>
  <summary>Click here if unfamiliar with terminal navigation</summary>
  In the terminal, enter `cd [filePathToProjectDirectory]` without the brackets. (ex: `cd C:\Users\user\Downloads\Renumber-Textile-References-master\Renumber-Textile-References-master`). The directory navigated to should contain the project's `lib` folder.
</details>
- If npm packages have not been installed yet, enter `npm install` in the terminal
- In terminal, enter the command `npm run build`. This updates the [bundle.js](./dist/bundle.js) file, allowing [webpage](./index.html) to use the updated values. 
- Open `index.html` in any browser. The webpage should update your references using the desired *referenceSection*

## Limitations

(Using Textile terminology): The project currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).

### Bugs 

To view inputs that currently cause errors, open [testCases](./lib/testCases.yaml) in the project and search for "Failing".

## Development Instructions

This project was built using [Node.js and npm](https://nodejs.org/en/download/), tested using [Jest](https://jestjs.io/), bundled with [webpack](https://github.com/webpack/webpack), and created with [Visual Studio Code](https://code.visualstudio.com/).

To create [bundle.js](./dist/bundle.js) for [index.html](./index.html):

```
npm run build
```

Run Tests:

```
npm test
```
