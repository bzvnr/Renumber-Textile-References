<div align="center">
  <a href="https://bzvnr.github.io/Renumber-Textile-References/">View in action with GitHub Pages</a>
</div>

<h1 align="center">Renumber-Textile-References</h1>

Automatically renumber [explicitly numbered references](https://textile-lang.com/doc/footnotes) in the [Textile markup language](https://en.wikipedia.org/wiki/Textile_(markup_language)) by order of their appearance in text.

## Table of Contents

1. [Introduction](#introduction)
2. [Example](#example)
3. [Features](#features)
4. [Rationale](#rationale)
5. [Terminology](#terminology)
6. [Use Instructions](#use-instructions)
7. [Installation](#installation)
8. [Configuration](#configuration)
9. [Limitations](#limitations)
10. [Technologies](#technologies)

## Introduction

This project is currently designed for a [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) on a webpage. [Click here for live version of project on a provided webpage](https://bzvnr.github.io/Renumber-Textile-References/).

## Example 

| Before | After |
| ------ | ----- |
| h2. Section<br><br>Lorem.[2][3] ipsum.[1]<br><br>h2. External References<br><br>fn2. First Ref<br><br>fn1. Third Ref<br><br>fn3. Second Ref | h2. Section<br><br>Lorem.[1][2] ipsum.[3]<br><br>h2. External References<br><br>fn1. First Ref<br><br>fn2. Second Ref<br><br>fn3. Third Ref |

## Features

- Automatically renumber [explicitly numbered](https://textile-lang.com/doc/footnotes) Textile references by their order of appearance in text
- User formatting errors are detected and highlighted to prevent incorrect usage
- References can be placed almost anywhere in text (for limits, see [Limitations](#bugs))

## Rationale

This project solves a problem with [explicitly numbered references](https://textile-lang.com/doc/footnotes) in the [Textile](https://en.wikipedia.org/wiki/Textile_(markup_language)). When a user alters the reference order or inserts a new reference in a body of text, the references' order by appearance may be compromised. To preserve the references' order by appearance, a user may have to renumber the references manually. This project does that automatically.

Note that Textile already provides a solution to this with [auto-numbered notes](https://textile-lang.com/doc/auto-numbered-notes).

This project is suited for: 

- Anyone using Textile who has text already containing [explicitly numbered references](https://textile-lang.com/doc/footnotes)
- Websites where auto-numbered notes are not supported

## Terminology

This project was developed using different [terminology](https://textile-lang.com/doc/footnotes) than the Textile markup language, as seen below. This terminology may be subject to future change.

### Project vs. Textile

| Appearance in text | Project | Textile |
|:------------------:| ------- | ------- |
| [1] | In-text citation / Citation | Reference |
| fn1. Author - "Sample Text":https://www.example.com | Reference | Footnote |

## Use Instructions

A live version of project can be used with [GitHub Pages](https://bzvnr.github.io/Renumber-Textile-References/). The project can also be used offline by downloading or cloning it from GitHub.

### Requirements

To use this project locally, Node.js and npm must be installed. See [installation instructions for Node.js for details](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). A short video on how to install Node.js can also be viewed [here](https://youtu.be/OBhw2BOez0w?t=82).

## Installation

This part assumes the [requirements](#requirements) have been fulfilled.

1. Click the green `Code` button [on the project's GitHub repository](https://github.com/bzvnr/Renumber-Textile-References) and download the project as a ZIP file
2. Unzip the file
3. [Open your system's terminal](https://web.archive.org/web/20220528160004/https://towardsdatascience.com/a-quick-guide-to-using-command-line-terminal-96815b97b955?gi=f465d80a5ddf)
4. In the terminal, navigate to the project's directory (folder). [If you are unfamiliar with terminal navigation, simply enter `cd [filePathToProjectDirectory]` without the brackets in the terminal (ex: `cd C:\Users\user\Downloads\Renumber-Textile-References-master\Renumber-Textile-References-master`). The directory navigated to should contain the project's `lib` folder.]
5. In the terminal, enter `npm install` to download the npm packages required for the project

The project's [HTML document](./index.html) opened in most browsers should work locally after these instructions.

## Configuration

The project is configured by modifying the variable values in the [config.js](./lib/config.js) file. See [configuration instructions](#configuration-instructions) for more details. See [important details](#important-details) for a better understanding of how the program works.

### Configuration Instructions

This part assumes the project has been [downloaded](#installation) or cloned. To update [config.js](./lib/config.js), follow these instructions

- Locate the [config.js](./lib/config.js) file on your system
- Open [config.js](./lib/config.js) and update the variable values to the desired values (ex: referenceSection: "changeTheValueInQuotes")
- Save [config.js](./lib/config.js) to preserve any changes made
- See steps 3-5 from the [Installation](#installation) section for instructions on opening the system's terminal, navigating to the project directory, and downloading npm packages
- In terminal, enter the command `npm run build` (if interested, see [npm commands](#npm-commands) for how this works)
- Open `index.html` in any browser. The webpage should use the provided values in [config.js](./lib/config.js) with the project files to update any provided text

### Important Details

- *referenceSection* - a variable in [config.js](./lib/config.js), a part of a text assumed to be the last [heading](https://textile-lang.com/doc/headings) / a unique last section in a text. The [program](./lib/renumberReferences.js) places all references under the *referenceSection* after it is finished renumbering them
  - As seen in the [example](#example), *referenceSection's* default value is `h2. External References`. This can be changed by following the [configuration instructions](#configuration-instructions)
  - All references are placed under the *referenceSection*, regardless of where they are in the <textarea> (for limits see[limitations](#bugs)). Note that with the current implementation, any text after the *referenceSection* that is not a reference may be lost

## Limitations

(Using Textile terminology): The project currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).

Compatibility with Internet Explorer is untested.

### Bugs 

To view inputs known to cause errors, open [testCases.yaml](./lib/testCases.yaml) and search for "Failing" without quotes.

## Technologies

Technologies used for this project include:

- [Node.js](https://nodejs.org/en/download/) as a runtime environment
- [npm](https://npmjs.com) for package management 
- [Jest](https://jestjs.io/) for testing
- [webpack](https://github.com/webpack/webpack) for bundling
- [Visual Studio Code](https://code.visualstudio.com/) for creation and editing

### npm Commands

- `npm install` - install the required packages for the project
- `npm run build` - updates the [bundle.js](./dist/bundle.js) to use the latest versions of the [renumberReferences.js](./lib/renumberReferences.js), [renumberTextarea.js](./lib/renumberTextarea.js), and [config.js](./lib/config.js) files. [index.html](./index.html) is also updated because it uses [bundle.js](./dist/bundle.js)
- `npm test` - run the tests for the project with Jest
