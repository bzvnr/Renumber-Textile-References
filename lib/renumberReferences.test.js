const fileSystem = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const { renumberReferences, checkFormat } = require("./renumberReferences");
const { ALERT, CONFIRM, PASS } = require("./config").formatCheckResults;

// load test cases
const filePath = path.resolve(__dirname, "testCases.yaml");
const testCasesFile = fileSystem.readFileSync(filePath, "utf8");
const testCases = yaml.load(testCasesFile);
const { normalTests, confirmTests, alertTests } = testCases;

function compareRenumberResult(input, expected) {
  const actualOutput = renumberReferences(input);
  expect(actualOutput).toEqual(expected);
}

describe(".renumberReferences' actualOutput matches expectedOutput for:", () => {
  describe("normal cases", () => {
    test.each(normalTests)
      (`$testName`, ({ input, expected }) => {
        compareRenumberResult(input, expected);
      });
  });

  describe("confirm cases", () => {
    test.each(confirmTests.continue)
      (`$testName`, ({ input, expected }) => {
        compareRenumberResult(input, expected);
      });
  });
});

describe(".checkFormat:", () => {
  describe("passes:", () => {
    test.each(normalTests)
      (`$testName`, ({ input }) => {
        const ignoreConfirmCode = 0;
        const formatCheckResult = checkFormat(input, ignoreConfirmCode);
        expect(formatCheckResult).toEqual(expect.stringContaining(PASS));
      });
  });

  describe("generates confirm and", () => {
    describe("passes:", () => {
      test.each(confirmTests.continue)
        (`$testName`, ({ input }) => {
          let ignoreConfirmCode = 0;
          let formatCheckResult = checkFormat(input, ignoreConfirmCode);
          expect(formatCheckResult).toEqual(expect.stringContaining(CONFIRM));
          ignoreConfirmCode++;
          formatCheckResult = checkFormat(input, ignoreConfirmCode);
          expect(formatCheckResult).toEqual(expect.stringContaining(PASS));
        });
    });
    describe("triggers Error:", () => {
      test.each(confirmTests.error)
        (`$testName`, ({ input }) => {
          const formatCheckResult = checkFormat(input);
          expect(formatCheckResult).toEqual(expect.stringContaining(ALERT));
        });
    });
  });

  describe("generates alert:", () => {
    test.each(alertTests)(`$testName`, ({ input }) => {
      const ignoreConfirmCode = 0;
      const formatCheckResult = checkFormat(input, ignoreConfirmCode);
      expect(formatCheckResult).toEqual(expect.stringContaining(ALERT));
    })
  });
});
