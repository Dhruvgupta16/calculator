/**
 * Team Project - JavaScript Calculator with Scientific Functions
 * Branch: feature/scientific-mode
 */

class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1 || this.currentOperand === 'Error') {
            this.currentOperand = '0';
            return;
        }
        this.currentOperand = this.currentOperand.slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else if (this.readyToReset) {
            this.currentOperand = number.toString();
            this.readyToReset = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.readyToReset = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        this.currentOperand = this.currentOperand.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.readyToReset = true;
    }

    applyPercent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    toggleSign() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current === 0) return;
        this.currentOperand = (-current).toString();
    }

    // --- Scientific Functions (Branch: feature/scientific-mode) ---
    applyScientific(func) {
        const current = parseFloat(this.currentOperand);

        switch (func) {
            case 'sqrt':
                if (current < 0) {
                    this.currentOperand = 'Error';
                } else {
                    this.currentOperand = Math.sqrt(current).toString();
                }
                break;
            case 'square':
                this.currentOperand = Math.pow(current, 2).toString();
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.currentOperand = 'Error';
                } else {
                    this.currentOperand = (1 / current).toString();
                }
                break;
            case 'pi':
                this.currentOperand = Math.PI.toString();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                break;
            case 'log':
                if (current <= 0) {
                    this.currentOperand = 'Error';
                } else {
                    this.currentOperand = Math.log(current).toString();
                }
                break;
            default:
                return;
        }

        this.readyToReset = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        if (stringNumber === 'Error') return 'Error';

        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('[data-previous-operand]');
    const currentOperandElement = document.querySelector('[data-current-operand]');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Number button listeners
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.getAttribute('data-number'));
            calculator.updateDisplay();
        });
    });

    // Operator button listeners
    document.querySelectorAll('[data-operation]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operation'));
            calculator.updateDisplay();
        });
    });

    // Action button listeners
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            handleAction(action);
        });
    });

    // Scientific button listeners
    document.querySelectorAll('[data-sci]').forEach(button => {
        button.addEventListener('click', () => {
            const func = button.getAttribute('data-sci');
            calculator.applyScientific(func);
            calculator.updateDisplay();
        });
    });

    // Toggle Scientific Keypad
    const toggleBtn = document.getElementById('toggle-scientific');
    const sciKeypad = document.getElementById('scientific-keypad');
    if (toggleBtn && sciKeypad) {
        toggleBtn.addEventListener('click', () => {
            sciKeypad.classList.toggle('hidden');
            const isHidden = sciKeypad.classList.contains('hidden');
            toggleBtn.textContent = isHidden ? 'Scientific: OFF' : 'Scientific: ON';
        });
    }

    function handleAction(action) {
        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                break;
            case 'percent':
                calculator.applyPercent();
                break;
            case 'toggle-sign':
                calculator.toggleSign();
                break;
        }
        calculator.updateDisplay();
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        let triggerButton = null;

        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
            triggerButton = document.querySelector(`[data-number="${e.key}"]`);
        } else if (e.key === '+') {
            calculator.chooseOperation('+');
            calculator.updateDisplay();
            triggerButton = document.querySelector(`[data-operation="+"]`);
        } else if (e.key === '-') {
            calculator.chooseOperation('−');
            calculator.updateDisplay();
            triggerButton = document.querySelector(`[data-operation="−"]`);
        } else if (e.key === '*') {
            calculator.chooseOperation('×');
            calculator.updateDisplay();
            triggerButton = document.querySelector(`[data-operation="×"]`);
        } else if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
            calculator.updateDisplay();
            triggerButton = document.querySelector(`[data-operation="÷"]`);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            handleAction('equals');
            triggerButton = document.querySelector(`[data-action="equals"]`);
        } else if (e.key === 'Backspace') {
            handleAction('delete');
            triggerButton = document.querySelector(`[data-action="delete"]`);
        } else if (e.key === 'Escape') {
            handleAction('clear');
            triggerButton = document.querySelector(`[data-action="clear"]`);
        } else if (e.key === '%') {
            handleAction('percent');
            triggerButton = document.querySelector(`[data-action="percent"]`);
        }

        if (triggerButton) {
            triggerButton.classList.add('active');
            setTimeout(() => triggerButton.classList.remove('active'), 120);
        }
    });

    window.calculatorInstance = calculator;
});
