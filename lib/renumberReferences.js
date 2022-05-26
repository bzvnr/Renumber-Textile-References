const { referenceSection, referenceSectionDivStart, referenceSectionDivEnd, mainHeading, formatCheckResults } = require("./config");
const listify = require("listify");

class Reference {
  constructor(orderedCitationNumber, referenceText) {
    this.orderedCitationNumber = orderedCitationNumber;
    this.referenceText = referenceText;
  }
}

const openBracketLength = "[".length;
const closeBracketLength = "]".length;
const fnLength = "fn".length;

/*
  The current implementation modifies the text as it goes through it, which
  could modify other citations' indices in text if the number of digits for
  the reference changes (ex: [1000]. to [1].). 
  This is part of why it uses the regex.exec(string) loop instead of creating
  objects from the arrays seen in checkFormat(). The other part is that formatChecks'
  uniqueFootnotes' matched array order does not match the order of each citations'
  appearance in text.
*/
/*
  Given a body of text, return the body with in-text citations
  numbered by order of appearance and the citations' corresponding references
  inserted in correct order after the referenceSection.
*/
function renumberReferences(text) {
  let references = new Map(); // key:value -> oldCitationNumber:Reference

  const inTextCitationRegex = /\[(?<number>\d+)\]/g; // [number]
  let citationCount = 0; // number of unique citations so far
  let currentCitation;
  let oldCitationNumber; // number of citation in text
  let orderedCitationNumber; // new number for citation based on order of appearance
  let referenceText;

  while ((currentCitation = inTextCitationRegex.exec(text)) !== null) {
    oldCitationNumber = currentCitation.groups.number;

    // assign the proper in-order number
    if (!references.has(oldCitationNumber)) {
      orderedCitationNumber = ++citationCount;
      referenceText = createReferenceText(text, oldCitationNumber, orderedCitationNumber);
      const reference = new Reference(orderedCitationNumber, referenceText)
      references.set(oldCitationNumber, reference);
    } else {
      orderedCitationNumber = references.get(oldCitationNumber).orderedCitationNumber;
    }
    // Replace citation in text
    // Adjust inTextCitationRegex index to account for any difference in string length between oldCitationNumber and orderedCitationNumber
    const indexAfterOpenBracket = currentCitation.index + openBracketLength;
    const textBeforeCitation = text.substring(0, indexAfterOpenBracket);
    const textAfterCitation =
      text.substring(indexAfterOpenBracket + `${oldCitationNumber}`.length, text.length);

    text = textBeforeCitation + orderedCitationNumber + textAfterCitation;
    const indexAfterCloseBracket = indexAfterOpenBracket + `${orderedCitationNumber}`.length + openBracketLength;
    inTextCitationRegex.lastIndex = indexAfterCloseBracket;
  }
  // delete all captured references from text
  text = deleteReferencesFromText(text, references);
  // add remaining (uncited) references to end of references
  let uncitedReferences = new Map();
  let uncitedReference;
  // almost identical to while loop seen above, except it replace references
  while ((uncitedReference = (/fn(?<number>\d+)\./g).exec(text)) !== null) {
    oldCitationNumber = uncitedReference.groups.number;
    orderedCitationNumber = ++citationCount;
    referenceText = createReferenceText(text, oldCitationNumber, orderedCitationNumber);
    text = deleteReferenceFromText(text, oldCitationNumber);
    const reference = new Reference(orderedCitationNumber, referenceText)
    uncitedReferences.set(oldCitationNumber, reference);
  }
  // merge cited and uncited refernces
  const combinedReferences = new Map([...references, ...uncitedReferences]);
  text = recreateReferences(text, combinedReferences);
  return text;
}

/*
  A lookahead function to check text format for errors and potential errors.
  Returns "ALERT: " for format error, "CONFIRM" for format warning
  or "PASS" if checkFormat passes.
*/
function checkFormat(text, ignoreConfirmCode) {
  const { ALERT, CONFIRM, PASS } = formatCheckResults;
  const referenceSectionPosition = text.indexOf(referenceSection);

  // Error: No text in text area.
  if (text.trim().length === 0) {
    return `${ALERT}The text area must not be empty.`;
  }

  // Error: referenceSection not in text or is not the last section in text area.
  // (ReferenceSectionAtEndOfFileAssumption)
  // TODO: keep or toss?
  if (referenceSectionPosition == -1 ||
    referenceSectionPosition < text.indexOf(mainHeading, referenceSectionPosition + 2)) { // TODO: replace + 2 with mainHeading.length
    return `${ALERT}\"${referenceSection}\" must be the last section in the text area.`;
  }

  const potentialReferencesRegex = /(\bfn(?<number>\d+))/g; // fn(number), including duplicates
  const allReferencesRegex = /(\bfn(?<number>\d+)\.)/g; // fn(number)., including duplicates
  // the following ensure no duplicates
  const uniqueReferencesRegex = /(\bfn(?<number>\d+)\.)(?![\s\S]*\1)/g; // unique fn(number).
  const uniqueInTextCitationsRegex = /(\[(?<number>\d+)\])(?![\s\S]*\1)/g; // unique [number]

  const potentialReferences = text.match(potentialReferencesRegex);
  const allReferences = text.match(allReferencesRegex);
  const uniqueReferences = text.match(uniqueReferencesRegex);
  const uniqueInTextCitations = text.match(uniqueInTextCitationsRegex);

  // Error: No references or citations in text area.
  if (!uniqueReferences) {
    return `${ALERT}There are no references in the text area.`;
  } else if (uniqueInTextCitations === null) {
    return `${ALERT}There are no citations in the text area.`;
  }

  const numOfUniqueRefs = uniqueReferences.length;
  const numOfUniqueCits = uniqueInTextCitations.length;
  const numOfTotalReferences = allReferences.length;

  // Confirm: the String "fn[number]" is incorrectly formatted or appears in text, but not as a reference. 
  if (ignoreConfirmCode === 0 &&
    potentialReferences.length > numOfTotalReferences) {
    return `${CONFIRM}There may be one or more incorrectly formatted references. Otherwise, the text area contains text in the format \"fn[number]\". Do you still wish to proceed?`;
  }

  /*
  // TODO: rewrite this
  NOTE: Confirm: text in citation format as part of a reference only fires on references 
    after the reference heading and is overriden by the "Unreferenced citation" error

  ex: fn9. Wikipedia - "Wikipediafn9.":...

  FIX?: Extract potential refs and compare to unique citations.
  // change this ignoreConfirmCode to 1 and increase subsequents confirms by one
  if (text.indexOf(uniqueInTextCitations[numOfUniqueCits - 1]) > referenceSectionPosition) {
    if (!confirm(
        `There is text in citation format (i.e. [1], [2]) after the ` +
        `reference heading \"${referenceSection}\" in the text area. Do you ` +
        `wish to proceed?`)
      ) {
        return false;
    }      
  }  
  */
  const uniqueReferenceNumbers = uniqueReferences.map(ref => ref.substring(fnLength, ref.length - 1));
  const uniqueCitationNumbers = uniqueInTextCitations.map(cit => cit.substring(openBracketLength, cit.length - closeBracketLength));
  const uRefCitDiff = uniqueReferenceNumbers.filter(ref => !uniqueCitationNumbers.includes(ref));
  const uCitRefDiff = uniqueCitationNumbers.filter(cit => !uniqueReferenceNumbers.includes(cit));

  // Error: Duplicate references.
  if (numOfTotalReferences > numOfUniqueRefs) {
    return `${ALERT}Please ensure there are no duplicate references (i.e \"fn[number].\").`;
  }
  // Error: Citation without accompanying reference in text area. 
  if (uCitRefDiff.length > 0) {
    return `${ALERT}Citation${pluralizer(uCitRefDiff)}unreferenced. Please ensure there are no citations without a reference.`;
  }
  // Confirm: Reference without accompanying citation in text area.
  if (ignoreConfirmCode != 1 &&
    numOfUniqueRefs - numOfUniqueCits > 0) {
    return `${CONFIRM}Reference${pluralizer(uRefCitDiff)}uncited. Do you still wish to proceed?`;
  }

  return PASS;
}

// delete references corresponding to collected inTextCitations
function deleteReferencesFromText(text, references) {
  for (const oldCitationNumber of references.keys()) {
    text = deleteReferenceFromText(text, oldCitationNumber);
  }
  return text;
}

// Create new references after referenceSection
function recreateReferences(text, references) {
  text = text.substring(0, text.indexOf(referenceSection));
  text += `${referenceSection}\n\n${referenceSectionDivStart}\n\n`;

  for (const value of references.values()) {
    text += `${value.referenceText}\n\n`;
  }
  text += referenceSectionDivEnd;
  return text;
}

// Replace old reference number in text with new reference number, then return text
function createReferenceText(text, oldCitationNumber, orderedCitationNumber) {
  const referenceFN = `fn${oldCitationNumber}.`;
  const startPosition = text.indexOf(referenceFN);
  const positionAfterFN = startPosition + fnLength;

  // referenceText = all text until next newline to the next  of line for the reference
  // Note: This is the part that prevents there being two references on the same line
  let nextLinePosition = text.indexOf("\n", positionAfterFN);
  if (nextLinePosition == -1) {  // case for the last reference with no new line
    nextLinePosition = text.length; // ReferenceSectionAtEndOfFileAssumption
  }

  const positionAfterOldCitationNumber = startPosition + referenceFN.length;
  const oldReferenceDescription = text.substring(positionAfterOldCitationNumber, nextLinePosition).trim()
  const newReference = `fn${orderedCitationNumber}. ` + oldReferenceDescription;
  return newReference;
}

// delete reference in text
function deleteReferenceFromText(text, oldCitationNumber) {
  const startPosition = text.indexOf(`fn${oldCitationNumber}.`);

  let nextLinePosition = text.indexOf("\n", startPosition + fnLength);
  if (nextLinePosition == -1) { // case for the last reference with no new line
    nextLinePosition = text.length; // ReferenceSectionAtEndOfFileAssumption
  }
  // remove reference
  text = text.substring(0, startPosition) + text.substring(nextLinePosition);
  return text;
}

function pluralizer(array) {
  const plural = (array.length == 1) ? " " : "s ";
  const verb = (array.length == 1) ? " is " : " are ";
  return plural + listify(array) + verb;
}

module.exports = {
  renumberReferences,
  checkFormat
}
