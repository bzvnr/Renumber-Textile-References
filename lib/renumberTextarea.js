// Textile Sort HTML page textarea interaction

const referenceSorter = require("./referenceSorter");
const { referenceSection, textareaName, buttonName, formatCheckResults, textareaName } = require("./config");

window.onload = function () {
  let button = document.getElementById(buttonName);

  button.addEventListener("click", function () {
    let textarea = document.getElementById(textareaName);
    renumberTextarea(textarea);
  });
}

// Perform checkFormat on textarea, renumber its text, and paste it into textarea
function renumberTextarea(textarea) {
  const oldText = textarea.value;

  const formatCheckPassed = checkFormatWithPopups(oldText);
  if (formatCheckPassed == false) {
    return;
  }
  const renumberedText = referenceSorter.renumberReferences(oldText)

  const oldRefSectionPosition = oldText.indexOf(referenceSection);
  replaceTextareaContents(textarea, renumberedText, oldRefSectionPosition);
}

// Checks the format of a textarea's body
// Returns true if no errors are found, false otherwise
function checkFormatWithPopups(oldText) {
  const { ALERT, CONFIRM, PASS } = formatCheckResults;
  let formatCheckText = "";
  let ignoreConfirmCode = 0; // increasing by one bypasses a "CONFIRM" in the formatCheck

  while (formatCheckText !== PASS) {
    formatCheckText = referenceSorter.checkFormat(oldText, ignoreConfirmCode);

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

// Replace textarea text with providedText and return cursor to original position
function replaceTextareaContents(textarea, renumberedText, oldRefSectionPosition) {
  /*
    Before pasting, store cursor's position in textarea
    After pasting, use difference in referenceSection's position between
    oldText and renumberedText to reposition cursor near original cursor position
  */
  const newRefSectionPosition = renumberedText.indexOf(referenceSection);
  const refSectionPositionChange = newRefSectionPosition - oldRefSectionPosition;
  const originalStartPosition = textarea.selectionStart + refSectionPositionChange;
  const originalEndPosition = textarea.selectionEnd + refSectionPositionChange;

  replaceTextareaContents(textarea, renumberedText);
  textarea.selectionStart = originalStartPosition;
  textarea.selectionEnd = originalEndPosition;
}

// Replace textarea contents with providedText without returning cursor to original position
function replaceTextareaContents(textarea, providedText) {
  textarea.selectionStart = 0;
  textarea.selectionEnd = textarea.value.length;
  textarea.focus();
  document.execCommand("insertText", false, providedText);
}

modules.export = {
  renumberTextarea
}
