'use strict'

const equals = document.querySelector('.btn-equals')
const addition = document.querySelector('.btn-add');
const subtraction = document.querySelector('.btn-');
const multiplication = document.querySelector('.btn-x');
const division = document.querySelector('.btn-divide');
const clear = document.querySelector('.clear-button');
const deleteBtn = document.querySelector('.delete-button');
const period = document.querySelector('.btn-period')
const calculationDisplay = document.querySelector('.user-input');
const resultDisplay = document.querySelector('.result');
const mainButtons = document.querySelector('.main-buttons');
let toDisplay = "";  //this takes note of all the numbers that are being pressed and adds it to its value
let fullCalculation = ""; //this takes not of all the numbers and operators being pressed, so it can be used to see which two numbers are the opperands and what is the operator
let currentOperator = ""; //takes note of the latest operator that has been pressed
let operands = []; //will be used to store the values of the operands, at most we want to keep this at length 2


/**
 * Updates the main display with a given text
 *
 * @param {string} display the string we want to display
 */
function populateMainDisplay(display) {
    resultDisplay.textContent = display;
}

/**
 * Updates the side smaller display with a given text
 *
 * @param {string} display the string we want to display
 */
function populateSideDisplay(display) {
    calculationDisplay.textContent = display;
}

/**
 * clears all the specified variables, so it's like we just loaded the page up for the first time
 */
function clearDisplays() {
    toDisplay = "";
    fullCalculation = "";
    operands = [];
    currentOperator = "";
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}


/**
 * performs the calculation of two numbers based on the given operator
 * 
 * @param {string} operator the operator that we are going to use to perform the calculation
 * @param {string/number} a the first operand
 * @param {string/number} b the second operand
 * @returns the result of the operation, however if any invalid argument has been used "invalid" is returned
 */
function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "x":
            return multiply(a, b);
        case "÷":
            return divide(a, b);
        default:
            return "invalid"
    }
}

/**
 * this function is used when the user clicks on the multiplication or division button and updates the operand array and performs the correct logic
 * 
 * @param {string} operatorToChangeTo this is the operator that will be used after the initial operation has been calculated
 */
function operatorLogic(operatorToChangeTo) {
    if (fullCalculation.charAt(fullCalculation.length - 1) === "x" || fullCalculation.charAt(fullCalculation.length - 1) === "÷") { //checks if "x" or "÷" is the last char
        operands.push("1"); //if it is then we push 1 so we can divide or multiply by 1 so we dont get division by 0 or multiplication by 0
        fullCalculation = fullCalculation.slice(0, -1); //remove the operator
    }
    else operands.push(toDisplay);
    fullCalculation += operatorToChangeTo //append the operator of the button clicked
    populateSideDisplay(fullCalculation)
    if (operands.length === 2) {
        let result = operate(currentOperator, +operands[0], +operands[1])
        if (result === Infinity) {
            divideByZeroResponse();
        } else {
            fullCalculation = result;
            operands = [result];
            populateSideDisplay(fullCalculation += operatorToChangeTo);
        }
    }
    currentOperator = operatorToChangeTo;
    toDisplay = "";
}

/**
 * clears the calculator and display a message of how dividing by 0 is not allowed
 */
function divideByZeroResponse() {
    alert("You can't divide by 0, please clear the calculator");
    fullCalculation = "";
    toDisplay = "0"
    populateMainDisplay("0")
    populateSideDisplay("")
    operands = [];
}

/**
 * this function checks if an operator is at the last index of fullCalculation
 * @returns true if an operator is the last char in fullCalculation otherwise, it'll return false
 */
function checkIfOperatorIsLastChar() {
    if (fullCalculation.indexOf("+") === fullCalculation.length - 1) return true;
    if (fullCalculation.indexOf("-") === fullCalculation.length - 1) return true;
    if (fullCalculation.indexOf("x") === fullCalculation.length - 1) return true;
    if (fullCalculation.indexOf("÷") === fullCalculation.length - 1) return true;
    return false;
}

/**
 * calculates the result of the two operands, and checks if the result should be rounded or not. Also updates the display
 * 
 * @param {string} operator the operator that should be used to calculate the result
 * @param {string} whatToDisplay appends the toDisplay value so the user can keep calculating further results
 */
function afterEqualIsPressed(operator, whatToDisplay) {
    let result = operate(operator, +operands[0], +operands[1]); //we perform the calculation 
    if (!(result % 1 === 0)) { //checks if the result is not a whole number
        populateMainDisplay(result.toFixed(2)); //if it isn't round the result to 2dp
        operands = [result.toFixed(2)]; //add it as the only value in the operands array
    } else {
        populateMainDisplay(result); //otherwise just display the result
        operands = [result];
    }
    populateSideDisplay(fullCalculation + "=");
    toDisplay = whatToDisplay;
}

clear.addEventListener("click", function () {
    populateSideDisplay("");
    populateMainDisplay(0);
    clearDisplays();
});

mainButtons.addEventListener('click', function (e) {
    if (!e.target.classList.contains('btn') || e.target.classList.contains('operator')) return;
    else if (e.target.dataset.value === "." && toDisplay.includes(".")) return;
    else {
        populateMainDisplay(toDisplay += e.target.dataset.value);
        fullCalculation += e.target.dataset.value;
    }
});

addition.addEventListener('click', function () {
    operatorLogic("+");
});

subtraction.addEventListener('click', function () {
    operatorLogic("-");
});

multiplication.addEventListener('click', function () {
    operatorLogic("x");
});

division.addEventListener('click', function () {
    operatorLogic("÷");
});

deleteBtn.addEventListener('click', function () {
    toDisplay = toDisplay.slice(0, -1); //if the delete button is pressed we need to remove the last char in the toDisplay variable;
    if (!checkIfOperatorIsLastChar()) fullCalculation = fullCalculation.slice(0, -1);
    populateMainDisplay(toDisplay) //update the main display with the updated toDisplay value
});

equals.addEventListener('click', function () {
    if (fullCalculation.includes("=")) return; //if an equal is already present we can't click it again
    if (checkIfOperatorIsLastChar()) return; //if the last char of fullCalculation is an operator, it means the second operand is missing so prevent equal from being pressed
    operands.push(toDisplay) //add the number before pressing equals into the array
    if (fullCalculation.includes("+")) {
        afterEqualIsPressed("+", "");
    } else if (fullCalculation.slice(1).includes("-")) {
        afterEqualIsPressed("-", "");
    } else if (fullCalculation.includes("x")) {
        afterEqualIsPressed("x", "1");
    } else if (fullCalculation.includes("÷")) {
        let result = operate("÷", +operands[0], +operands[1]);
        if (!(result % 1 === 0)) {
            populateMainDisplay(result.toFixed(2));
            operands = [result.toFixed(2)];
        } else {
            populateMainDisplay(result);
            operands = [result];
        }
        populateSideDisplay(fullCalculation + "=");
        toDisplay = "1";
        if (result === Infinity) {
            divideByZeroResponse();
        }
    }
});