const fileSystem = require("fs");
const path = require("path");
const { renumberReferences } = require("./renumberReferences");
const yaml = require("js-yaml");

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);
const { standard } = testCases.testCases;

function compareActualToExpected(testCase) {
  const { input, expected } = testCase;
  const output = renumberReferences(input);
  expect(output).toEqual(expected);
}

test("lessThan10", () => {
  compareActualToExpected(standard.lessThan10);
})

test("referenceBeforeReferenceSectionBeforeCitation", () => {
  compareActualToExpected(standard.referenceBeforeReferenceSectionBeforeCitation);
})

test("referenceBeforeReferenceSectionAfterCitation", () => {
  compareActualToExpected(standard.referenceBeforeReferenceSectionAfterCitation);
})

test("multiDigitCitation", () => {
  compareActualToExpected(standard.multiDigitCitation);
})

test("moreThan10", () => {
  compareActualToExpected(standard.moreThan10);
})
