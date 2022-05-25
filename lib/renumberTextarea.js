// Textile Sort HTML page textarea interaction

const referenceSorter = require("./renumberReferences");
const { referenceSection, textareaId, buttonName, formatCheckResults } = require("./config");

window.onload = function () {
  let button = document.getElementById(buttonName);

  button.addEventListener("click", function () {
    let textarea = document.getElementById(textareaId);
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

  // replaceTextareaContents(textarea, renumberedText, oldRefSectionPosition);
  // NOTE: the code in the above function doesn't work, it only works in this code block for whatever reason
  const newRefSectionPosition = renumberedText.indexOf(referenceSection);
  const refSectionPositionChange = Math.abs(newRefSectionPosition - oldRefSectionPosition);
  const originalStartPosition = textarea.selectionStart + refSectionPositionChange;
  const originalEndPosition = textarea.selectionEnd + refSectionPositionChange;

  textarea.selectionStart = 0;
  textarea.selectionEnd = textarea.value.length;
  textarea.focus();
  document.execCommand("insertText", false, renumberedText);
  textarea.selectionStart = originalStartPosition;
  textarea.selectionEnd = originalEndPosition;
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
// NOTE: does not work, see commented out code in renumberTextarea function
function replaceTextareaContents(textarea, renumberedText, oldRefSectionPosition) {
  /*
    Before pasting, store cursor's position in textarea
    After pasting, use difference in referenceSection's position between
    oldText and renumberedText to reposition cursor near original cursor position
  */
  const newRefSectionPosition = renumberedText.indexOf(referenceSection);
  const refSectionPositionChange = Math.abs(newRefSectionPosition - oldRefSectionPosition);
  const originalStartPosition = textarea.selectionStart + refSectionPositionChange;
  const originalEndPosition = textarea.selectionEnd + refSectionPositionChange;

  textarea.selectionStart = 0;
  textarea.selectionEnd = textarea.value.length;
  textarea.focus();
  document.execCommand("insertText", false, renumberedText);
  textarea.selectionStart = originalStartPosition;
  textarea.selectionEnd = originalEndPosition;
}

modules.export = {
  renumberTextarea
}
