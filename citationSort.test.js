const fileSystem = require("fs");
const path = require("path");
const { sortCitations } = require("./citationSort");
const yaml = require("js-yaml");

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);
const standard = testCases.testCases.standard;

function compareActualToExpected(testCase) {
  const { input, expected } = testCase;
  const output = sortCitations(input);
  expect(output).toEqual(expected);
}

test("", () => {
  compareActualToExpected(standard.lessThan10);
})

test("", () => {
  compareActualToExpected(standard.multiDigitCitation);
})

test("", () => {
  compareActualToExpected(standard.moreThan10);
})
