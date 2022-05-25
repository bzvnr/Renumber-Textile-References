// Textile Sort HTML page textarea interaction

const referenceSorter = require("./referenceSorter");
const { referenceSection, textareaName, buttonName, errorCheckResults } = require("./config");
const { ALERT, CONFIRM, PASS } = errorCheckResults;

window.onload = function() {
  let button = document.getElementById(buttonName);

  button.addEventListener("click", function() {
    interactWithText();
  });
}

// Manipulate DOM, insert into textarea
function interactWithText() {
  let entryBody = document.getElementById(textareaName);
  let text = entryBody.value;

  text = errorCheckWithPopups(text);
  if (text === "ERROR") {
    return;
  }
  text = referenceSorter.sortReferences(text)

  const refSectionPosition = text.indexOf(referenceSection);

  // Select all text and copypaste over it
  // Before copypasting, store cursor position
  // After copypasting, use stored values to reposition cursor at or near original position
  const newRefSectionPosition = text.indexOf(referenceSection);
  const bodyTextChangeDifference = newRefSectionPosition - refSectionPosition;
  const originalStartPosition = entryBody.selectionStart + bodyTextChangeDifference;
  const originalEndPosition = entryBody.selectionEnd + bodyTextChangeDifference;

  entryBody.selectionStart = 0;
  entryBody.selectionEnd = entryBody.value.length;
  entryBody.focus();
  document.execCommand("insertText", false, text);
  entryBody.selectionStart = originalStartPosition;
  entryBody.selectionEnd = originalEndPosition;
}

// Returns true if no errors are found, false otherwise
function errorCheckWithPopups(text) {
  let errorCheckText = "";
  let ignoreConfirmCode = 0; // used to bypass 'Confirms' in the errorCheck

  while (errorCheckText !== PASS) {
    errorCheckText = referenceSorter.errorCheck(text, ignoreConfirmCode);

    if (errorCheckText.substring(0, 7) === ALERT) {
      alert(errorCheckText.substring(7));
      return false;
    } else if (errorCheckText.substring(0, 7) === CONFIRM) {
      if (confirm(errorCheckText.substring(7))) {
        ignoreConfirmCode++;
        continue;
      } else {
        return false;
      }
    }
  }
  return true;
}
