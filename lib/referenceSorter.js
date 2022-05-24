const { referenceSection, referenceSectionStart, referenceSectionEnd, commonSection } = require("./config");

class Reference {
  constructor(orderedCitationNumber, referenceText) {
    this.orderedCitationNumber = orderedCitationNumber;
    this.referenceText = referenceText;
  }
}

/*
  The current implementation modifies the text as it goes through it, which
  could modify other citations' indices in text if the number of digits for
  the reference changes (ex: [1000]. to [1].). 
  This is part of why it uses the regex.exec(string) loop instead of creating
  objects from the arrays seen in errorCheck(). The other part is that errorChecks'
  uniqueFootnotes' matched array order does not match the order of each citations'
  appearance in text.
*/
/*
  Given a body of text, return the body with in-text citations
  numbered by order of appearance and the citations' corresponding references
  inserted in correct order after the referenceSection.
*/
function sortReferences(text) {
  let refList = new Map(); // key-value -> oldCitationNumber:Reference

  const inTextCitationRegex = /\[(?<number>\d+)\]/g; // [number]
  let citationCount = 0; // number of unique citations so far
  let currentCitation;
  let oldCitationNumber; // number of citation in text
  let orderedCitationNumber; // new number for citation based on order of appearance
  let referenceText;

  while ((currentCitation = inTextCitationRegex.exec(text)) !== null) {
    oldCitationNumber = currentCitation.groups.number;

    // assign the proper in-order number
    if (!refList.has(oldCitationNumber)) {
      orderedCitationNumber = ++citationCount;
      referenceText = getReferenceText(text, oldCitationNumber, orderedCitationNumber);
      text = replaceAndDeleteReference(text, oldCitationNumber);
      refList.set(oldCitationNumber, new Reference(orderedCitationNumber, referenceText));
    } else {
      orderedCitationNumber = refList.get(oldCitationNumber).orderedCitationNumber;
    }
    // Replace citation in text
    // Adjust inTextCitationRegex index to account for any difference in string length between oldCitationNumber and orderedCitationNumber
    const indexAfterOpenBracket = currentCitation.index + 1; // + 1 to move after the '['
    const textBeforeCitation = text.substring(0, indexAfterOpenBracket);
    const textAfterCitation =
        text.substring(indexAfterOpenBracket + `${oldCitationNumber}`.length, text.length);

    text = textBeforeCitation + orderedCitationNumber + textAfterCitation;
    const indexAfterCloseBracket = indexAfterOpenBracket + `${orderedCitationNumber}`.length + 1; // + 1 to move after the ']'
    inTextCitationRegex.lastIndex = indexAfterCloseBracket; 
  }

  // add remaining (uncited) references to end of referenceList
  let extraRef;
  while ((extraRef = (/fn\d+\./g).exec(text)) !== null) {
    oldCitationNumber = extraRef[0].substring(2, extraRef[0].length - 1);
    orderedCitationNumber = ++citationCount;
    referenceText = getReferenceText(text, oldCitationNumber, orderedCitationNumber);
    text = replaceAndDeleteReference(text, oldCitationNumber);
    const reference = new Reference(orderedCitationNumber, referenceText)
    refList.set(oldCitationNumber, reference);
  }
  text = recreateReferences(text, refList);
  return text;
}

// Create new list of references 
function recreateReferences(text, refList) {
  text = text.substring(0, text.indexOf(referenceSection));
  text += `${referenceSection}\n\n${referenceSectionStart}\n\n`;

  for (const value of refList.values()) {
    text += `${value.referenceText}\n\n`; 
  }
  text += referenceSectionEnd;
  return text;
}

/*
  A lookahead function to check text for errors
  returns 'ALERT: ' for format error, 'CONFIRM' for format warning
  or 'PASS' otherwise
*/
function errorCheck(text, ignoreConfirmCode) {
  const referenceSectionPosition = text.indexOf(referenceSection);

  // Error: No text in text area.
  if (text.trim().length === 0) {
    return "ALERT: " + "The text area must not be empty.";
  }

  // TODO: keep or toss?
  // Error: referenceSection not in text or is not the last section in text area.
  if (referenceSectionPosition == -1 ||
      referenceSectionPosition < text.indexOf(commonSection, referenceSectionPosition + 2)) {
      return "ALERT: " + `\"${referenceSection}\" must be the last section in the text area.`;
  }

  const potentialReferenceRegex = /(\bfn\d+)/g; // fn(number), including duplicates
  const allReferenceRegex = /(\bfn\d+\.)/g; // fn(number)., including duplicates
  // the following ensure no duplicates
  const uniqueReferenceRegex = /(\bfn\d+\.)(?![\s\S]*\1)/g; // unique fn(number).
  const uniqueInTextCitationRegex = /(\[\d+\])(?![\s\S]*\1)/g; // unique [number]

  const potentialReferences = text.match(potentialReferenceRegex);
  const allReferences = text.match(allReferenceRegex); 
  const uniqueReferences = text.match(uniqueReferenceRegex);
  const uniqueInTextCitations = text.match(uniqueInTextCitationRegex); 
  const numOfUniqueRefs = uniqueReferences.length;
  const numOfUniqueCits = uniqueInTextCitations.length;
  const numOfReferences = allReferences.length;

  // Error: No references or citations in text area.
  if (!uniqueReferences) {
    return "ALERT: " + "There are no references in the text area.";
  } else if (uniqueInTextCitations === null) {
    return "ALERT: " + "There are no citations in the text area."; 
  }

  // Confirm: the String "fn[number]" is incorrectly formatted or appears in text, but not as a reference. 
  if (ignoreConfirmCode === 0 && 
      potentialReferences.length > numOfReferences) {
    return "CONFIRM" + "There may be one or more incorrectly formatted references. Otherwise, the text area contains text in the format \"fn[number]\". Do you still wish to proceed?";
  }

  /*
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
  const uRefNums = uniqueReferences.map(ref => ref.substring(2, ref.length - 1));
  const uCitNums = uniqueInTextCitations.map(cit => cit.substring(1, cit.length - 1));
  const uRefCitDiff = uRefNums.filter(ref => !uCitNums.includes(ref));
  const uCitRefDiff = uCitNums.filter(cit => !uRefNums.includes(cit));    

  // Error: Duplicate references.
  if (numOfReferences > numOfUniqueRefs) {
    return "ALERT: " + "Please ensure there are no duplicate references (i.e \"fn[number].\").";
  }
  // Error: Citation without accompanying reference in text area. 
  if (uCitRefDiff.length > 0) {
    return "ALERT: " + "Citation" + pluralizer(uCitRefDiff) + "unreferenced. Please ensure there are no citations without a reference.";
  }
  // Confirm: Reference without accompanying citation in text area.
  if (ignoreConfirmCode != 1 && 
      numOfUniqueRefs - numOfUniqueCits >  0) {
    return "CONFIRM" + "Reference" + pluralizer(uRefCitDiff) + "uncited. Do you still wish to proceed?";
  }

  return "PASS";
}

// delete reference in text.
function replaceAndDeleteReference(text, oldCitationNumber) {
  const startPosition = text.indexOf(`fn${oldCitationNumber}.`);

  let nextLinePosition = text.indexOf("\n", startPosition + 2);
  // case for the last reference with no new line
  if (nextLinePosition == -1) {
    nextLinePosition = text.length;
  }
  // remove reference
  text = text.substring(0, startPosition) + text.substring(nextLinePosition);
  return text;
}

// Replace old reference number in text with new reference number, then return text
function getReferenceText(text, oldCitationNumber, orderedCitationNumber) {
  const startPosition = text.indexOf(`fn${oldCitationNumber}.`);
  const positionAfterFN = startPosition + 2;

  let nextLinePosition = text.indexOf("\n", positionAfterFN);
  // case for the last reference with no new line
  if (nextLinePosition == -1) {
    nextLinePosition = text.length;
  }
  const positionAfterOldCitationNumber =  positionAfterFN + `${oldCitationNumber}`.length + 1;
  const textAfterOldCitationNumber = text.substring(positionAfterOldCitationNumber, nextLinePosition).trim()
  const newReference = `fn${orderedCitationNumber}. ` + textAfterOldCitationNumber;
  return newReference;
}

function pluralizer(array) {
  const plural = (array.length == 1) ? " " : "s ";
  const verb = (array.length == 1) ? " is " : " are ";
  return plural + arrayToList(array) + verb;
}

function arrayToList(array) {
  let newText;	  
  if (array.length === 0) {
    newText = "[ERROR in arrayToList] "; // this should never occur
  } else if (array.length == 1) {
    newText = array[0];
  } else if (array.length == 2) {
    newText = array[0] + " and " + array[1];
  } else {
    array[array.length - 1] = "and " + array[array.length - 1];
    newText = array.join(", ");
  }
  return newText;
}

module.exports = {
  sortReferences: sortReferences,
  errorCheck
}
