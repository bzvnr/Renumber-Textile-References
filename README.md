# Renumber-Textile-References

[Use with GitHub Pages](https://bzvnr.github.io/Renumber-Textile-References/)

Automatically renumber [explicitly numbered references in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text. This project solves a problem with the Textile markup language where altering the reference order or inserting a new reference in a body of text can result in the user having to renumber the references manually.

Textile already provides a solution for this problem by allowing users to use [auto-numbered notes](https://textile-lang.com/doc/auto-numbered-notes) instead of [explicitly numbered references](https://textile-lang.com/doc/footnotes). This project is suited for Textile documents with explicitly numbered references or where auto-numbered notes are not supported.

## Example 

| Before | After |
| ------ | ----- |
| h2. Section<br><br>Lorem.[2] ipsum.[1]<br><br>h2. External References<br><br>fn2. First Ref<br><br>fn1. Second Ref | h2. Section<br><br>Lorem.[1] ipsum.[2]<br><br>h2. External References<br><br>fn1. First Ref<br><br>fn2. Second Ref |

## Terminology

This project uses different terminology than the Textile markup language, as seen below.

| Appearance in text | Textile | Project |
|:------------------:| ------- | ---- |
| [1] | Reference | In-text citation |
| fn1. Author - "Sample Text":https://www.example.com | Footnote | Reference |

## Use Instructions

The script can be used without downloading via [GitHub Pages](https://bzvnr.github.io/Renumber-Textile-References/). See [Configuration](./#configuration) for customization details.

## Configuration

This project is currently configured as such:

* *referenceSection* - specified in `config.js`, a part of the text assumed to be the last [heading](https://textile-lang.com/doc/headings) or a unique last section in the text. The program places all references under the *referenceSection* after it is finished renumbering the references. By default, it is `h2. External References`, but it can be customized [see instructions below]
* it was designed to serve a single [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) on an HTML page
* all references are placed under the *referenceSection*, regardless of where they are located in the <textarea>

The program can be used and customized offline by downloading it from GitHub.

### ReferenceSection Instructions

Follow one of the sets of instructions to change the *referenceSection* value to a preferred value:

If you are new to Node.js, npm, and JavaScript, follow the Downloading From GitHub instructions. Otherwise, follow instruction set 2.

#### Downloading from GitHub

This requires Node.js and npm to be installed on your system. See [installation instructions for details](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). A short video on how to install can also be viewed [here](https://youtu.be/OBhw2BOez0w?t=82).

- Download the project from this page by clicking the green `Code` button and downloading the project as a ZIP file
- Unzip the project (AKA Extract all)
- Locate `lib/config.js` in the project folder
- Open `config.js` and change the value corresponding to *referenceSection* (i.e. referenceSection: "changeTheValueInQuotes")
- Open your operating system's terminal
- Type in `cd [filePathToProjectFolder]` without the brackets. (ex: `cd C:\Users\bzvnr\Downloads\Renumber-Textile-References`)
- Once the terminal's directory has been changed to the project folder, enter `npm install`, then `npm run build`. The `bundle.js` file that `index.html` uses should be updated
- Open `index.html` in any browser. The HTML page should update your references using the desired *referenceSection*

#### Cloning from GitHub

This assumes Node.js and npm are already installed.

- Clone the repository to your system
- Locate and open `lib/config.js`
- Change the *referenceSection* value
- Locate the project in terminal and type `npm i`, then `npm run build`
- `index.html` should now be configured to the entered *referenceSection*

## Limitations

(Using Textile terminology): The function currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).

### Bugs 

To view inputs that currently cause errors, open  `lib/testCases.yaml` in the project and search for "Failing".

## Development Instructions

This project was built and tested using [Node.js and npm](https://nodejs.org/en/download/).

Create bundle.js for index.html:

```
npm run build
```

Run Tests using [Jest](https://jestjs.io/):

```
npm test
```
