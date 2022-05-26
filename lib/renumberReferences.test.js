const fileSystem = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const { renumberReferences, checkFormat } = require("./renumberReferences");
const { ALERT, CONFIRM, PASS } = require("./config").formatCheckResults;

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);

const { renumberReferencesTests, checkFormatTests } = testCases;
const { standard } = renumberReferencesTests;
const { confirmTests, alertTests } = checkFormatTests;

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
    describe("passes:", () => {
      test.each(standard)
        (`$testName`, ({ input, expected }) => {
          const ignoreConfirmCode = 0;
          const formatCheckResult = checkFormat(input, ignoreConfirmCode);
          expect(formatCheckResult).toEqual(expect.stringContaining(PASS));
        });
    });

    describe("generates confirm:", () => {
      describe("canContinue:", () => {
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
      describe("triggers Error:", () => {
        test.each(confirmTests.error)
          (`$testName`, ({ input, expected }) => {
            const formatCheckResult = checkFormat(input);
            expect(formatCheckResult).toEqual(expect.stringContaining(expected));
            expect(formatCheckResult).toEqual(expect.stringContaining(ALERT));
          });
      });
    });
  });

  describe("generates alert:", () => {
    test.each(alertTests)(`$testName`, ({ input, expected }) => {
      const ignoreConfirmCode = 0;
      const formatCheckResult = checkFormat(input, ignoreConfirmCode);
      expect(formatCheckResult).toEqual(expect.stringContaining(ALERT));
    })
  });
});
