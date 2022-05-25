const fileSystem = require("fs");
const path = require("path");
const { renumberReferences } = require("./renumberReferences");
const yaml = require("js-yaml");

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);
const { standard } = testCases.testCases;

test.each(standard)
  (`.renumberReferences: $testName`, ({ input, expected }) => {
    const actualOutput = renumberReferences(input);
    expect(actualOutput).toEqual(expected);
  });
