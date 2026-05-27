let current = '0';
let expression = '';
let realExpression = '';
let justCalculated = false;

const valueEl = document.getElementById('value');
const exprEl = document.getElementById('expression');
const displayEl = document.getElementById('display');

function updateDisplay() {
  valueEl.textContent = current;
  exprEl.textContent = expression;
  valueEl.style.fontSize = current.length > 12 ? '22px' : current.length > 9 ? '30px' : '40px';
  displayEl.classList.remove('error');
}

function appendNumber(n) {
  if (justCalculated) { current = n; expression = ''; realExpression = ''; justCalculated = false; }
  else current = current === '0' ? n : current + n;
  updateDisplay();
}

function appendDecimal() {
  if (justCalculated) { current = '0.'; expression = ''; realExpression = ''; justCalculated = false; updateDisplay(); return; }
  if (!current.includes('.')) current += '.';
  updateDisplay();
}

function appendOperator(op) {
  justCalculated = false;
  const displayOp = op === '/' ? '÷' : op === '*' ? '×' : op === '-' ? '−' : op;
  realExpression = current + op;
  expression = current + ' ' + displayOp;
  exprEl.textContent = expression;
  current = '0';
  valueEl.textContent = current;
  displayEl.classList.remove('error');
}

function calculate() {
  if (!realExpression) return;
  const full = realExpression + current;
  try {
    if (!/^[\d+\-*/%.() ]+$/.test(full)) throw new Error('Invalid');
    let result = Function('"use strict"; return (' + full + ')')();
    if (!isFinite(result)) throw new Error('Cannot divide by zero');
    exprEl.textContent = full.replace(/\//g,'÷').replace(/\*/g,'×').replace(/-/g,'−') + ' =';
    current = parseFloat(result.toFixed(10)).toString();
    realExpression = '';
    justCalculated = true;
    updateDisplay();
  } catch(e) {
    displayEl.classList.add('error');
    valueEl.textContent = e.message === 'Cannot divide by zero' ? 'Div by 0' : 'Error';
    valueEl.style.fontSize = '24px';
    current = '0'; realExpression = ''; expression = '';
    setTimeout(() => { current = '0'; updateDisplay(); }, 1800);
  }
}

function deleteLast() {
  if (justCalculated) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
  updateDisplay();
}

function clearDisplay() {
  current = '0'; expression = ''; realExpression = '';
  justCalculated = false;
  updateDisplay();
}

document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendDecimal();
  else if (['+','-','*','/'].includes(e.key)) appendOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearDisplay();
  else if (e.key === '%') appendOperator('%');
});

updateDisplay();
