const fileSystem = require("fs");
const path = require("path");
const { renumberReferences } = require("./renumberReferences");
const yaml = require("js-yaml");

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);

const { renumberReferencesTests, checkFormatTests } = testCases;
const { standard } = renumberReferencesTests;
const { confirmTests } = checkFormatTests;

function compareRenumberResult(input, expected) {
  const actualOutput = renumberReferences(input);
  expect(actualOutput).toEqual(expected);
}

describe(".renumberReferences:", () => {
  test.each(standard)
    (`$testName`, ({ input, expected }) => {
      compareRenumberResult(input, expected);
    });
});

describe(".checkFormat:", () => {
  describe("checkFormat:", () => {
    describe("pass:", () => {
      test.each(standard)
        (`$testName`, ({ input, expected }) => {
          let ignoreConfirmCode = 0;
          let formatCheckResult = checkFormat(input, ignoreConfirmCode);
          expect(formatCheckResult).toEqual(expect.stringContaining(PASS));
        });
    });
    describe("confirm:", () => {
      describe("continue:", () => {
        test.each(confirmTests.continue)
          (`$testName`, ({ input, expected }) => {
            let ignoreConfirmCode = 0;
            let formatCheckResult = checkFormat(input, ignoreConfirmCode);
            expect(formatCheckResult).toEqual(expect.stringContaining(CONFIRM));
            ignoreConfirmCode++;
            formatCheckResult = checkFormat(input, ignoreConfirmCode);
            expect(formatCheckResult).toEqual(expect.stringContaining(PASS));

            compareRenumberResult(input, expected);
          });
      });
      describe("error:", () => {
        test.each(confirmTests.error)
          (`$testName`, ({ input, expected }) => {
            const formatCheckResult = checkFormat(input);
            expect(formatCheckResult).toEqual(expect.stringContaining(expected));
            expect(formatCheckResult).toEqual(expect.stringContaining(ALERT));
          });
      });
    });
  });
  describe("alertPrompt", () => {

  });
});
