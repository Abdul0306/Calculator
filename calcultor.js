// Basic math functions used by the calculator
function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    // Prevent division by zero
    if (num2 === 0) {
        return "nice try buddy";
    }
    return num1 / num2;
}

function modulo(num1, num2) {
    return num1 % num2;
}

// Choose the right operation based on the operator symbol
function operate(operator, num1, num2) {
    if (operator === '+') {
        return add(num1, num2);
    } else if (operator === '-') {
        return subtract(num1, num2);
    } else if (operator === '*') {
        return multiply(num1, num2);
    } else if (operator === '/') {
        return divide(num1, num2);
    } else if (operator === '%') {
        return modulo(num1, num2);
    }
    return null;
}

// State variables for the calculator
let firstNumber = null;         // first number entered before pressing an operator
let currentOperator = null;     // current operator selected (+, -, *, /, %)
let shouldResetScreen = false;  // true after an operator is pressed, to reset the next number input
let currentInput = "";        // the number currently being entered
let displayValue = "";        // what is shown on the calculator screen

// Get references to page elements
const putResult = document.querySelector("#result");
const myButtons = document.querySelector(".buttons");

// Listen for button clicks on the calculator
myButtons.addEventListener("click", (e) => {
    const target = e.target;
    if (!target.matches('button')) return; // ignore clicks outside buttons

    const action = target.dataset.action;
    const value = target.dataset.value;

    // Number buttons: add digit to the current input
    if (action === "number") {
        if (shouldResetScreen) {
            currentInput = "";
            shouldResetScreen = false;
        }
        currentInput += value;
        displayValue += value;
        putResult.value = displayValue;
        return;
    }

    // Decimal point button: add '.' if not already present
    if (action === "decimal") {
        if (shouldResetScreen) {
            currentInput = "0";
            displayValue = "0";
            shouldResetScreen = false;
        }
        if (!currentInput.includes('.')) {
            currentInput = currentInput === '' ? '0.' : currentInput + '.';
            displayValue = displayValue === '' ? '0.' : displayValue + '.';
            putResult.value = displayValue;
        }
        return;
    }

    // Operator buttons: save the first number and operator, or calculate the intermediate result
    if (action === "operator") {
        if (currentInput === "") return; // do nothing if no number entered yet
        if (firstNumber === null) {
            firstNumber = currentInput;
        } else if (!shouldResetScreen) {
            const result = operate(currentOperator, parseFloat(firstNumber), parseFloat(currentInput));
            displayValue = String(result);
            putResult.value = displayValue;
            firstNumber = String(result);
        }
        currentOperator = value;
        displayValue += value;
        putResult.value = displayValue;
        shouldResetScreen = true;
        return;
    }

    // Equals button: perform the calculation and show the result
    if (action === "equals") {
        if (firstNumber === null || currentOperator === null || currentInput === "") return;
        const result = operate(currentOperator, parseFloat(firstNumber), parseFloat(currentInput));
        displayValue = String(result);
        putResult.value = displayValue;
        firstNumber = String(result);
        currentInput = "";
        shouldResetScreen = true;
        return;
    }

    // Clear button: reset the calculator state
    if (action === "clear") {
        firstNumber = null;
        currentOperator = null;
        currentInput = "";
        displayValue = "";
        shouldResetScreen = false;
        putResult.value = "";
        return;
    }

    // Delete button: remove the last character from the current input
    if (action === "delete") {
        if (displayValue === "") return;
        displayValue = displayValue.slice(0, -1);
        currentInput = currentInput.slice(0, -1);
        putResult.value = displayValue;
    }
});
