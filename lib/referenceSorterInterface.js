// Textile Sort HTML page textarea interaction

const referenceSorter = require("./referenceSorter");
const { referenceSection, textareaName, buttonName, formatCheckResults } = require("./config");

window.onload = function() {
  let button = document.getElementById(buttonName);

  button.addEventListener("click", function() {
    referenceSortTextarea();
  });
}

// Manipulate DOM, insert into textarea
function referenceSortTextarea() {
  let textarea = document.getElementById(textareaName);
  let text = textarea.value;

  const formatCheckPassed = formatCheckWithPopups(text);
  if (formatCheckPassed == false) {
    return;
  }
  const oldRefSectionPosition = text.indexOf(referenceSection);
  text = referenceSorter.sortReferences(text)
  
  copyPasteOverTextarea(textarea, text, oldRefSectionPosition);
}

// Performs formatCheck on textarea's text
// Returns true if no errors are found, false otherwise
function formatCheckWithPopups(text) {
  const { ALERT, CONFIRM, PASS } = formatCheckResults;
  let formatCheckText = "";
  let ignoreConfirmCode = 0; // increasing by one bypasses a "CONFIRM" in the formatCheck

  while (formatCheckText !== PASS) {
    formatCheckText = referenceSorter.formatCheck(text, ignoreConfirmCode);

    if (formatCheckText.substring(0, 7) === ALERT) {
      alert(formatCheckText.substring(7));
      return false;
    } else if (formatCheckText.substring(0, 7) === CONFIRM) {
      if (confirm(formatCheckText.substring(7))) {
        ignoreConfirmCode++;
        continue;
      } else {
        return false;
      }
    }
  }
  return true;
}

function copyPasteOverTextarea(textarea, text, oldRefSectionPosition) {
  // Select all text and copypaste over it
  // Before copypasting, store cursor position
  // After copypasting, use stored values to reposition cursor at or near original position
  const newRefSectionPosition = text.indexOf(referenceSection);
  const bodyTextChangeDifference = newRefSectionPosition - oldRefSectionPosition;
  const originalStartPosition = textarea.selectionStart + bodyTextChangeDifference;
  const originalEndPosition = textarea.selectionEnd + bodyTextChangeDifference;

  // copyPaste from start of referenceSection to end of text
  textarea.selectionStart = 0;
  textarea.selectionEnd = textarea.value.length;
  textarea.focus();
  document.execCommand("insertText", false, text);
  textarea.selectionStart = originalStartPosition;
  textarea.selectionEnd = originalEndPosition;
}

modules.export = {
  referenceSortTextarea
}
