<div align="center">
  <a href="https://bzvnr.github.io/Renumber-Textile-References/">View in action with GitHub Pages</a>
</div>

<h1 align="center">Renumber-Textile-References</h1>

Automatically renumber [explicitly numbered references in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text.

## Table of Contents

1. [Introduction](#introduction)
2. [Example](#example)
3. [Features](#features)
4. [Rationale](#rationale)
5. [Terminology](#terminology)
6. [Use Instructions](#use-instructions)
7. [Limitations](#limitations)
8. [Technologies](#technologies)

## Introduction

This project is currently designed for a [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) on a webpage. [Click here to use the project on a provided webpage](https://bzvnr.github.io/Renumber-Textile-References/).

## Example 

| Before | After |
| ------ | ----- |
| h2. Section<br><br>Lorem.[2][3] ipsum.[1]<br><br>h2. External References<br><br>fn2. First Ref<br><br>fn1. Third Ref<br><br>fn3. Second Ref | h2. Section<br><br>Lorem.[1][2] ipsum.[3]<br><br>h2. External References<br><br>fn1. First Ref<br><br>fn2. Second Ref<br><br>fn3. Third Ref |

## Features

- Automatically renumber explicitly numbered Textile references by their order of appearance in text
- User formatting errors are detected and highlighted to prevent incorrect usage
- References can be placed almost anywhere in text (for limits, see [Limitations](#bugs))

## Rationale

This project solves a problem with [explicitly numbered references](https://textile-lang.com/doc/footnotes) in the [Textile](https://en.wikipedia.org/wiki/Textile_(markup_language)) markup language. When a user alters the reference order or inserts a new reference in a body of text, the references' order by appearance may be compromised. To preserve the references' order by appearance, a user may have to renumber the references manually. This project does that automatically.

Note that Textile already provides a solution with [auto-numbered notes](https://textile-lang.com/doc/auto-numbered-notes).

This project is suited for: 

- Anyone using Textile who has text already containing explicitly numbered references
- Websites where auto-numbered notes are not supported

## Terminology

This project was developed using different [terminology](https://textile-lang.com/doc/footnotes) than the Textile markup language, as seen below. This terminology may be subject to future change.

### Project vs. Textile

| Appearance in text | Project | Textile |
|:------------------:| ------- | ------- |
| [1] | In-text citation / Citation | Reference |
| fn1. Author - "Sample Text":https://www.example.com | Reference | Footnote |

### Project-Specific

- [config.js](./lib/config.js) - a configuration file used to customize the project to the user's needs
- *referenceSection* - specified in [config.js](./lib/config.js), a part of a text assumed to be the last [heading](https://textile-lang.com/doc/headings) or a unique last section in a text. The [program](./lib/renumberReferences.js) places all references under the *referenceSection* after it is finished renumbering them
  - As seen in the [example](#example), *referenceSection's* default value is `h2. External References`. This an be changed by following the [Configuration Instructions](#configuration)
  - All references are placed under the *referenceSection*, regardless of where they are located in the <textarea> (for limits see[limitations](#bugs)). Note that with the current implementation, any text after the *referenceSection* that is not a reference will be lost


## Use Instructions

A live version of program can be used with [GitHub Pages](https://bzvnr.github.io/Renumber-Textile-References/). The project can also be used offline by downloading it or cloning it from GitHub.

### Requirements

To use this project locally, Node.js and npm must be installed. See [installation instructions for Node.js for details](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). A short video on how to install can also be viewed [here](https://youtu.be/OBhw2BOez0w?t=82).

### Installation

1. Click the green `Code` button [on the project's GitHub repository](https://github.com/bzvnr/Renumber-Textile-References) and download the project as a ZIP file
2. Unzip the file (AKA Extract all)
3. [Open your system's terminal](https://web.archive.org/web/20220528160004/https://towardsdatascience.com/a-quick-guide-to-using-command-line-terminal-96815b97b955?gi=f465d80a5ddf)
4. In the terminal, navigate to the project's directory (folder)
<details>
  <summary>Click here if unfamiliar with terminal navigation</summary>
  In the terminal, enter `cd [filePathToProjectDirectory]` without the brackets. (ex: `cd C:\Users\user\Downloads\Renumber-Textile-References-master\Renumber-Textile-References-master`). The directory navigated to should contain the project's `lib` folder.
</details>
5. In the terminal, enter `npm install` to download the npm packages required for the project

### Configuration

This part assumes the project has been [downloaded](#installation) or cloned. The project is configured by modifying the variable values in the [config.js](./lib/config.js) file. To update [config.js](./lib/config.js), follow these instructions:

- Locate the [config.js](./lib/config.js) file on your system
- Open [config.js](./lib/config.js) and update the variable values to the desired values (ex: referenceSection: "changeTheValueInQuotes").
- Save [config.js](./lib/config.js) to preserve any changes made
- See steps 3-5 from the [Installation](#installation) section for instructions on opening the system's terminal, navigating to the project directory, and downloading npm packages
- In terminal, enter the command `npm run build`. This updates the [bundle.js](./dist/bundle.js) file, allowing the [webpage](./index.html) to use the updated values from [config.js](./lib/config.js)
- Open `index.html` in any browser. The webpage should use the provided values in [config.js](./lib/config.js) with the [system](./lib/renumberReferences.js) [files](./lib/renumberTextarea.js) to update any provided text

## Limitations

(Using Textile terminology): The project currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).

### Bugs 

To view inputs that currently cause errors, open [testCases.yaml](./lib/testCases.yaml) and search for "Failing" without quotes.

## Technologies

- [Node.js and npm](https://nodejs.org/en/download/) for development and package management
- [Jest](https://jestjs.io/) for testing
- [webpack](https://github.com/webpack/webpack) for bundling
- [Visual Studio Code](https://code.visualstudio.com/) for creation and editing

### npm Commands

- `npm install` - install the required packages for the project
- `npm run build` - create [bundle.js](./dist/bundle.js) for [index.html](./index.html) to use
- `npm test` - run the tests for the project with Jest
