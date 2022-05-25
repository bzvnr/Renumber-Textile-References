# Autonumber-Textile-References

Automatically renumber [explicitly numbered references in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text. This project solves a problem with the Textile markup language where altering the reference order or inserting a new reference in a body of text can result in the user having to renumber the references manually.

Textile already provides a solution for this problem by allowing users to use [auto-numbered notes](https://textile-lang.com/doc/auto-numbered-notes) instead of [explicitly numbered references](https://textile-lang.com/doc/footnotes). This project is suited for Textile documents with explicitly numbered references or where auto-numbered notes are not supported.

## Terminology

This project uses different terminology than the Textile markup language, as seen below.

| Appearance in text | Textile | Project |
|:------------------:| ------- | ---- |
| [1] | Reference | In-text citation |
| fn1. Author - "Sample Text":https://www.example.com | Footnote | Reference |

## Configuration

This project is currently configured as such:

* `referenceSection` - specified in `config.js`, a part of the text assumed to be the last [heading](https://textile-lang.com/doc/headings) or a unique last section in the text. The program places all references under the `referenceSection` after it is finished renumbering
* it was designed to serve a single [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) on an HTML page
* all references are placed under the `referenceSection`, regardless of where they are located in the <textarea>

## Limitations

(Using Textile terminology): The function currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).
