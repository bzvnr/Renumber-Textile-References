# Autonumber-Textile-References

Automatically renumber [explicitly numbered references in Textile](https://textile-lang.com/doc/footnotes) by order of their appearance in text. This package solves a problem with the Textile markup language when altering the references order or inserting a new references results in the user having to renumber the references manually.

There is already a solution in the Textile language that uses [auto-numbered](https://textile-lang.com/doc/auto-numbered-notes) notes instead of explicit numbering. This function can be used for bodies of text that already use explicitly numbered references or where auto-numbered notes are not supported.

## Terminology

| Appearance in text | Textile | Code |
|:------------------:| ------- | ---- |
| [1] | Reference | In-text citation |
| fn1. Author - "Sample Text":https://www.example.com | Footnote | Reference |

## Assumptions

This solution is currently configured as such:

* `referenceSection` - specified in config.js, a part of the text assumed to be the last [header](https://textile-lang.com/doc/headings) or a unique section in the text. The program places all references under the `referenceSection`
* it modifies the text in a [<textarea>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
* the location of the references in the text does not matter. They can be placed anywhere, and the function will place them under the `referenceSection`

## Limitations

(Using Textile terminology): The function currently does not support [references that don't link to the footnote or footnotes with a backlink](https://textile-lang.com/doc/footnotes).
