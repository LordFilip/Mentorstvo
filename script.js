const button = document.getElementById("button");
const output = document.getElementById("output");

const operations = ["+", "/", "-", "*", "^", "!", "."];
const brackets = ["(", ")"];

const basicOperations = ["+", "/", "-", "*"];
const advancedOperations = ["^", "!"];

document.addEventListener("DOMContentLoaded", function () {
  // Check if the button exists before adding the event listener
  if (button) {
    button.addEventListener("click", function () {
      const expressionInput = document.getElementById("expressionInput");
      const expression = expressionInput.value;

      if (!stringValidation(expression)) {
        output.innerText = "Invalid input!";
      } else {
        output.innerText = "Invalid input!";
        calculate(expression);
      }
    });
  }
});

// Function to validate a mathematical expression string
function stringValidation(expression) {
  // Initialize a variable to keep track of the balance of brackets
  var bracketsInd = 0;

  // Check the first and last characters for valid starting and ending
  if (
    (isNaN(expression[0]) && expression[0] !== "(") ||
    (isNaN(expression[expression.length - 1]) &&
      expression[expression.length - 1] !== ")" &&
      expression[expression.length - 1] !== "!")
  ) {
    return false;
  }

  // Loop through each character in the expression
  for (let i = 0; i < expression.length; i++) {
    // Update the bracket balance for each opening and closing parenthesis
    if (expression[i] === "(") {
      bracketsInd++;
    } else if (expression[i] === ")") {
      bracketsInd--;
    } else if (bracketsInd < 0) {
      return false; // Return false if unbalanced closing parenthesis found
    }
  }

  // Check if there are any unmatched opening or closing parenthesis
  if (bracketsInd != 0) {
    return false;
  }

  // Loop through each character again for further validation
  for (let i = 0; i < expression.length; i++) {
    // Check if the character is valid based on defined operations, brackets, or numbers
    if (
      !(
        operations.includes(expression[i]) ||
        brackets.includes(expression[i]) ||
        !isNaN(expression[i])
      )
    ) {
      return false; // Return false if any invalid character is found
    } else if (
      // Check for consecutive basic or advanced operations
      (basicOperations.includes(expression[i]) &&
        basicOperations.includes(expression[i + 1])) ||
      (advancedOperations.includes(expression[i]) &&
        advancedOperations.includes(expression[i + 1]))
    ) {
      return false;
    } else if (
      // Check for invalid sequences of opening and closing parenthesis
      (expression[i] === ")" && expression[i + 1] === "(") ||
      (expression[i] === "(" && expression[i + 1] === ")")
    ) {
      return false;
    } else if (
      // Check for invalid sequence of opening parenthesis followed by an operation
      expression[i] === "(" &&
      operations.includes(expression[i + 1]) &&
      expression[i + 1] !== "-" &&
      !isNaN(expression[i + 2])
    ) {
      continue; // Allow a minus sign as the first character after an opening parenthesis
    } else if (
      // Check for division by zero
      expression[i] === "/" &&
      expression[i + 1] === "0"
    ) {
      return false;
    } else if (
      // Check for invalid sequence of closing parenthesis followed by an operation
      expression[i] === ")" &&
      operations.includes(expression[i - 1]) &&
      expression[i - 1] !== "!"
    ) {
      return false;
    } else if (expression[i] === "." && expression[i + 1] === ".") {
      return false;
    }
  }

  return true; // Return true if all characters pass validation
}

// Function to perform calculations on a mathematical expression
function calculate(expression) {
  // Initialize variables to store indices for parentheses
  let ind1 = 0;
  let ind2 = 0;

  // Continue processing the expression as long as there are parentheses
  while (expression.includes("(")) {
    // Loop through each character in the expression
    for (let i = 0; i < expression.length; i++) {
      // If a closing parenthesis is encountered, find the corresponding opening parenthesis
      if (expression[i] === ")") {
        ind2 = i - 1;

        // Traverse backward to find the matching opening parenthesis
        while (expression[i] !== "(") {
          i--;

          // Update the indices when the opening parenthesis is found
          if (expression[i] === "(") {
            ind1 = i + 1;
            break; // Exit the inner loop when "(" is found
          }
        }

        break; // Exit the outer loop when ")" is found
      }
    }

    // Extract the substring within the parentheses
    let copiedSubstring1 = expression.substring(ind1, ind2 + 1);

    // Perform split by addition and subtraction on the extracted substring
    let newPart = splitByPlusAndMinus(copiedSubstring1);

    // Replace the substring within the parentheses with the calculated result
    let newString =
      expression.substring(0, Math.max(0, ind1 - 1)) +
      newPart +
      expression.substring(ind2 + 2);

    // Update the expression for further iterations
    expression = newString;
  }

  // Log the final expression to the console for debugging
  console.log(expression);

  // Perform split by addition and subtraction on the final expression
  var final = splitByPlusAndMinus(expression);

  // Log the final result to the console for debugging
  console.log(final);

  // Update the output element with the final result

  if (output) {
    output.innerText = final;
  }
  return final;
}

// Function to split an expression by addition and subtraction
function splitByPlusAndMinus(expression) {
  // Initialize an array to store the result
  var result = [];

  // Iterate through each character in the input expression
  for (let i = 0; i < expression.length; i++) {
    // Add the current character to the result array
    result.push(expression[i]);
    console.log(`push1: ${result}`);

    // If the current character is '-', add 'k' to represent subtraction
    if (expression[i] === "-") {
      result.push("k");
      console.log(`push1: ${result}`);
    }
  }

  // Join the characters into a string, split by '+' and '-', then flatten the result
  result = result
    .join("")
    .split("+")
    .flatMap((element) => element.split("-"));

  // Replace every 'k' with '-'
  result = result.map((element) => element.replace(/k/g, "-"));

  // Filter out empty elements from the result
  result = result.filter((element) => element !== "");

  // Log the result array before post-processing
  console.log(`splitByPlusAndMinus ${result}`);

  // Post-processing: Merge elements ending with '*' and starting with '-'
  let continueMerging = true;

  while (continueMerging) {
    continueMerging = false; // Assume we won't continue merging in this iteration

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i].endsWith("*") && result[i + 1].startsWith("-")) {
        // Merge the two elements
        result[i] += result[i + 1].substring(1);
        // Remove the second element
        result.splice(i + 1, 1);
        // Add a single minus sign back to the beginning of the element
        result[i] = `-${result[i]}`;
        continueMerging = true; // Set to true to continue merging in the next iteration
      }
    }
  }

  for (let i = 0; i < result.length; i++) {
    // Check if the element starts with two minus signs
    if (result[i].startsWith("--")) {
      // Remove both minus signs from the beginning of the element
      result[i] = result[i].substring(2);
    }
  }

  // Log the final result after post-processing
  console.log(`splitByPlusAndMinus ${result}`);

  // Return the result after further calculations
  return calculateArray(result);
}

/*
  Function to perform calculations on a mathematical expression.
  Supports factorial (!) and exponentiation (^). Expressions are evaluated
  based on multiplication (*), division (/), and addition (+) operations.
 */
function calculateArray(arr) {
  // Helper function to calculate factorial
  function factorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    } else {
      return n * factorial(n - 1);
    }
  }

  // Helper function to calculate power
  function power(base, exponent) {
    return Math.pow(base, exponent);
  }

  // Iterate through the array
  for (let i = 0; i < arr.length; i++) {
    // Replace factorial expressions
    arr[i] = arr[i].replace(/(-?\d+)!/, (_, num) => factorial(parseInt(num)));

    // Replace power expressions
    arr[i] = arr[i].replace(/(-?\d+)\^(-?\d+)/, (_, base, exponent) =>
      power(parseFloat(base), parseFloat(exponent))
    );

    // Split the expression into terms based on * and /
    const terms = arr[i].split(/(\*|\/)/);

    // Initialize result with the first term
    let result = parseFloat(terms[0]);

    // Iterate over the remaining terms
    for (let j = 1; j < terms.length; j += 2) {
      const operator = terms[j];
      const operand = parseFloat(terms[j + 1]);

      // Perform the operation based on the operator
      if (operator === "*") {
        result *= operand;
      } else if (operator === "/") {
        result /= operand;
      }
    }

    // Update the array with the calculated result
    arr[i] = result;
  }

  console.log(`Calculate Array: ${arr}`);
  return findArraySum(arr);
}
//Function to find sum of an array
function findArraySum(arr) {
  // Check if the input array is empty
  if (arr.length === 0) {
    return 0;
  }

  // Use the reduce function to calculate the sum
  const sum = arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  console.log(`findArraySum: ${sum}`);
  return sum;
}

// Change this line to export the module with the correct name

module.exports = { stringValidation, calculate };
