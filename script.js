const numbers = document.querySelectorAll(".number");
const input1 = document.querySelector(".input1");
const input2 = document.querySelector(".input2");
const dot = document.getElementById("dot");
const c = document.getElementById("c");
const clr = document.getElementById("clr");
const operations = document.querySelectorAll(".sign");
const equal = document.getElementById("equal");
const prefix = document.getElementById("prefix");

input1.textContent = "0";
let inp2Ind = false;
let operationInd = 0;
let currentOperator;
let secondInputInd = false;
let lastOperation = null;

numbers.forEach((number) => {
  number.addEventListener("click", () => {
    if (inp2Ind === true) {
      input1.textContent = "";
      inp2Ind = false;
    }
    if (input1.textContent.length < 11) {
      if (input1.textContent === "0" || lastOperation !== null) {
        input1.textContent = number.textContent;
        secondInputInd = true;
      } else {
        input1.textContent += number.textContent;
        secondInputInd = true;
      }
    }

    lastOperation = null;
  });
});

dot.addEventListener("click", function () {
  if (!input1.textContent.includes(".")) {
    input1.textContent += ".";
  }
});

c.addEventListener("click", function () {
  if (input1.textContent === "Error: Division by zero") input1.textContent = "";
  input1.textContent = input1.textContent.slice(0, -1);

  if (input1.textContent.length === 0) {
    input1.textContent = "0";
  }

  if (input1.textContent.slice(-1) === ".") {
    input1.textContent = input1.textContent.slice(0, -1);
  }
});

clr.addEventListener("click", function () {
  input1.textContent = "";
  input2.textContent = "";
  input1.textContent = "0";
  operationInd = 0;
  secondInputInd = false;
  lastOperation = null;
});

operations.forEach((operation) => {
  operation.addEventListener("click", function () {
    operationInd++;
    if (operationInd === 2 && secondInputInd === true) {
      equal.click();
    }
    if (operationInd > 1) {
      input2.textContent =
        input2.textContent.slice(0, -1) + operation.textContent;
      currentOperator = operation.textContent;
      input2.textContent = input1.textContent + operation.textContent;
      inp2Ind = true;
      operationInd--;
    } else {
      op1 = Number(input1.textContent);
      input2.textContent = input1.textContent + operation.textContent;
      inp2Ind = true;
      currentOperator = operation.textContent;
      secondInputInd = false;
    }
    lastOperation = operation;
  });
});

equal.addEventListener("click", function () {
  if (secondInputInd === true) {
    const op2 = Number(input1.textContent);

    input2.textContent += input1.textContent + "=";

    let result;

    switch (currentOperator) {
      case "+":
        result = op1 + op2;
        break;
      case "-":
        result = op1 - op2;
        break;
      case "*":
        result = op1 * op2;
        break;
      case "/":
        if (op2 !== 0) {
          result = op1 / op2;
        } else {
          result = "Error: Division by zero";
        }
        break;
      default:
        result = "Error: Invalid operator";
    }

    let result2;
    result = parseFloat(result.toFixed(4));
    result2 = result.toString();
    if (result2.length > 10) {
      input1.textContent = result.toExponential(10);
    } else {
      input1.textContent = result;
    }

    op1 = result;
    currentOperator = null;
    inp2Ind = true;

    operationInd--;
    secondInputInd = false;
  }
});
prefix.addEventListener("click", function () {
  let num = Number(input1.textContent);
  input1.textContent = -num;
});
