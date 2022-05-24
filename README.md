# Textile-Reference-Sorter

A function to automatically renumber [explicitly numbered footnotes in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text. It solves a problem with the Textile markup language where altering the order of explicitly numbered footnotes in a body of text may result in the user having to renumber the footnotes manually.

There is already solution in the Textile language that uses [auto-numbered](https://textile-lang.com/doc/auto-numbered-notes) notes instead of explicit numbering. This function can be used for bodies of text that already use explicitly numbered footnotes or where auto-numbered notes are not supported.

## Terminology

| Appearance in text | Textile | Code |
|:------------------:| ------- | ---- |
| [1] | Reference | In-text citation |
| fn1. Author - "Sample Text":https://www.example.com | Footnote | Reference |

## Assumptions

This solution is currently configured as such:

* `terminatingSection` - specified in config.js, a part of the text assumed to be the last [header](https://textile-lang.com/doc/headings) or a unique section in the text. The program places all references under the `terminatingSection`
* it modifies the text in a [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
* the location of the references in the text does not matter. They can be placed anywhere, and the function will place them under the `terminatingSection`

## Limitations

(Using Textile terminology): The function currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).
