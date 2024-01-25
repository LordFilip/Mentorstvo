// script.test.js

const { calculate, stringValidation } = require("./script");

describe("stringValidation function", () => {
  test("Valid expression with balanced parentheses and valid characters should return true", () => {
    const expression = "(2+3)*4";
    expect(stringValidation(expression)).toBe(true);
  });

  test("Invalid expression with unbalanced parentheses should return false", () => {
    const expression = "2+(3*4";
    expect(stringValidation(expression)).toBe(false);
  });

  test("Invalid expression with consecutive basic operations should return false", () => {
    const expression = "2+*3";
    expect(stringValidation(expression)).toBe(false);
  });
});

describe("calculate function", () => {
  test("Calculates a simple expression without parentheses", () => {
    const expression = "5+6*2";
    expect(calculate(expression)).toBe(17);
  });

  test("Calculates an expression with parentheses", () => {
    const expression = "((1+2)*(3-4))^2";

    expect(calculate(expression)).toBe(9);
  });

  test("Calculates an expression with nested parentheses", () => {
    const expression = "(-3+(2*3))!-(4/2)";
    expect(calculate(expression)).toBe(4);
  });
});
