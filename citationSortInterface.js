// Textile Sort HTML page textarea interaction

const citationSorter = require("./citationSort");
const { referenceSection, textareaName, buttonName } = require("./config");

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
  text = citationSorter.sortCitations(text)

  const refHeaderPosition = text.indexOf(referenceSection);
    
  // Select all text and copypaste over it
  // Before copypasting, store cursor position
  // After copypasting, use stored values to reposition cursor
  const newRefHeaderPosition = text.indexOf(referenceSection);
  const bodyTextChangeDifference = newRefHeaderPosition - refHeaderPosition;
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
  let ignoreConfirmCode = 0;
  
  while (errorCheckText !== "PASS") {
    errorCheckText = citationSorter.errorCheck(text, ignoreConfirmCode);
    
    if (errorCheckText.substring(0, 7) === "ALERT: ") {
      alert(errorCheckText.substring(7));
      return false;
    } else if (errorCheckText.substring(0, 7) === "CONFIRM") {
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
