let firstNumber = "";
let operator = "";
let secondNumber = "";
let justEvaluated = false;

const add = (num1, num2) => {
    return num1 + num2;
}
const subtract = (num1, num2) => {
    return num1 - num2;
}
const multiply = (num1, num2) => {
    return num1 * num2;
}
const divide = (num1, num2) => {
    if (num2 === 0) {
        return undefined;
    }

    return num1 / num2;
}

const operate = (operator, firstNumber, secondNumber) => {
    if (operator === '+') {
        return add(firstNumber, secondNumber);
    } else if (operator === '-') {
        return subtract(firstNumber, secondNumber);
    } else if (operator === '*') {
        return multiply(firstNumber, secondNumber);
    } else if (operator === '/') {
        return divide(firstNumber, secondNumber);
    } else {
        return undefined;
    }
}

const formatResult = (num) => {
    const rounded = Math.round(num * 1e9) / 1e9;
    return String(rounded);
}

const currentOperandDisplay = document.getElementById('current-operand');
const decimalButton = document.querySelector('[data-value="."]');

const updateDecimalButtonState = () => {
    const activeValue = operator === "" ? firstNumber : secondNumber;
    decimalButton.disabled = activeValue.includes('.');
}

const evaluatePending = () => {
    const result = operate(operator, Number(firstNumber), Number(secondNumber));

    if (result === undefined) {
        currentOperandDisplay.textContent = "Nice try. Can't divide by zero!";
        firstNumber = "";
        operator = "";
        secondNumber = "";
        updateDecimalButtonState();
        return false;
    }

    firstNumber = formatResult(result);
    secondNumber = "";
    currentOperandDisplay.textContent = firstNumber;
    return true;
}

const handleDigit = (button) => {
    if (justEvaluated) {
        firstNumber = "";
        operator = "";
        secondNumber = "";
        justEvaluated = false;
    }

    const digit = button.dataset.value;
    const buildingFirstNumber = operator === "";
    const activeValue = buildingFirstNumber ? firstNumber : secondNumber;

    if (digit === '.' && activeValue.includes('.')) return;

    const updatedValue = (digit === '.' && activeValue === "") ? "0." : activeValue + digit;

    if (buildingFirstNumber) {
        firstNumber = updatedValue;
    } else {
        secondNumber = updatedValue;
    }

    currentOperandDisplay.textContent = updatedValue;
    updateDecimalButtonState();
}

const handleOperator = (button) => {
    if (firstNumber === "") return;

    justEvaluated = false;

    if (operator !== "" && secondNumber !== "") {
        const success = evaluatePending();
        if (!success) return;
    }

    operator = button.dataset.value;
    updateDecimalButtonState();
}

const handleClear = () => {
    firstNumber = "";
    operator = "";
    secondNumber = "";
    justEvaluated = false;
    currentOperandDisplay.textContent = "0";
    updateDecimalButtonState();
}

const handleDelete = () => {
    justEvaluated = false;

    if (operator === "") {
        firstNumber = firstNumber.slice(0, -1);
        currentOperandDisplay.textContent = firstNumber || "0";
    } else {
        secondNumber = secondNumber.slice(0, -1);
        currentOperandDisplay.textContent = secondNumber || "0";
    }

    updateDecimalButtonState();
}

const handleEquals = () => {
    if (firstNumber === "" || operator === "" || secondNumber === "") return;

    const success = evaluatePending();
    if (!success) return;

    operator = "";
    justEvaluated = true;
    updateDecimalButtonState();
}

const handlePercent = () => {
    justEvaluated = false;

    const buildingFirstNumber = operator === "";
    const activeValue = buildingFirstNumber ? firstNumber : secondNumber;
    if (activeValue === "") return;

    const percented = formatResult(Number(activeValue) / 100);

    if (buildingFirstNumber) {
        firstNumber = percented;
    } else {
        secondNumber = percented;
    }

    currentOperandDisplay.textContent = percented;
    updateDecimalButtonState();
}

document.querySelector('.keypad').addEventListener('click', (event) => {
    const button = event.target.closest('.btn');
    if (!button) return;

    if (button.classList.contains('btn-number')) {
        handleDigit(button);
    } else if (button.classList.contains('btn-operator')) {
        handleOperator(button);
    } else if (button.classList.contains('btn-clear')) {
        handleClear();
    } else if (button.classList.contains('btn-delete')) {
        handleDelete();
    } else if (button.classList.contains('btn-equals')) {
        handleEquals();
    } else if (button.dataset.action === 'percent') {
        handlePercent();
    }
});

const keyMap = {
    '+': '[data-value="+"]',
    '-': '[data-value="-"]',
    '*': '[data-value="*"]',
    '/': '[data-value="/"]',
    '.': '[data-value="."]',
    'Enter': '[data-action="calculate"]',
    '=': '[data-action="calculate"]',
    'Backspace': '[data-action="delete"]',
    'Escape': '[data-action="clear"]',
};
for (let digit = 0; digit <= 9; digit++) {
    keyMap[digit] = `[data-value="${digit}"]`;
}

document.addEventListener('keydown', (event) => {
    const selector = keyMap[event.key];
    if (!selector) return;

    event.preventDefault();
    document.querySelector(selector).click();
});
