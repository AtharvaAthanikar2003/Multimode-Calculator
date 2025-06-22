// =======================
// THEME TOGGLE
// =======================
document.getElementById("themeSwitch").addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
});

// =======================
// SWITCH BETWEEN MODES
// =======================
function switchMode(mode) {
  document.querySelectorAll('.calculator').forEach(el => el.classList.remove('active'));
  document.getElementById(mode).classList.add('active');
}

// =======================
// STANDARD MODE
// =======================
function append(val) {
  document.getElementById("standard-display").value += val;
}

function appendPi() {
  document.getElementById("standard-display").value += "π";
}

function appendE() {
  document.getElementById("standard-display").value += "e";
}

function appendReciprocal() {
  document.getElementById("standard-display").value += "1/(";
}

function calculate() {
  try {
    let expr = document.getElementById("standard-display").value;

    // Replace symbols with actual values
    expr = expr.replace(/π/g, Math.PI).replace(/e/g, Math.E);

    // Auto-close brackets
    const openBrackets = (expr.match(/\(/g) || []).length;
    const closeBrackets = (expr.match(/\)/g) || []).length;
    const missing = openBrackets - closeBrackets;
    if (missing > 0) expr += ")".repeat(missing);

    document.getElementById("standard-display").value = eval(expr);
  } catch {
    alert("Invalid Expression");
  }
}

function clearDisplay() {
  document.getElementById("standard-display").value = "";
}

// =======================
// SCIENTIFIC MODE
// =======================
let sciDisplayStr = "";
let sciEvalStr = "";

function appendSci(val) {
  // Map JS eval functions to user-friendly display strings
  const funcMap = {
    "Math.sin(": "sin(",
    "Math.cos(": "cos(",
    "Math.tan(": "tan(",
    "Math.log10(": "log(",
    "Math.sqrt(": "√(",
  };

  if (funcMap[val]) {
    sciDisplayStr += funcMap[val];
    sciEvalStr += val;
  } else if (val === "%") {
    sciDisplayStr += "%";
    sciEvalStr += "/100";
  } else {
    sciDisplayStr += val;
    sciEvalStr += val;
  }
  document.getElementById("sci-display").value = sciDisplayStr;
}

function sanitizeScientificInput(input) {
  // Insert multiplication where implied
  input = input.replace(/(\d)(π|e|\()/g, '$1*$2');

  return input
    .replace(/π/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)")
    .replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)")
    .replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)")
    .replace(/log\(/g, "Math.log10(")  // keep log as base 10 for eval
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100");
}

// Check for undefined trig values like tan(90)
function isUndefinedTrig(expr) {
  const degRegex = /(tan|cot|sec|cosec)\(([^)]+)\)/g;
  let match;
  while ((match = degRegex.exec(expr)) !== null) {
    const func = match[1];
    const argDeg = parseFloat(match[2]);
    const angle = ((argDeg % 360) + 360) % 360; // normalize

    if (
      (func === "tan" && (angle === 90 || angle === 270)) ||
      (func === "cot" && (angle === 0 || angle === 180 || angle === 360)) ||
      (func === "sec" && (angle === 90 || angle === 270)) ||
      (func === "cosec" && (angle === 0 || angle === 180 || angle === 360))
    ) {
      return true;
    }
  }
  return false;
}

function calculateSci() {
  try {
    if (isUndefinedTrig(sciDisplayStr)) {
      document.getElementById("sci-display").value = "Undefined";
      sciDisplayStr = "";
      sciEvalStr = "";
      return;
    }

    const sanitized = sanitizeScientificInput(sciDisplayStr);
    let result = eval(sanitized);

    // If result is +/- Infinity, show 'Undefined'
    if (result === Infinity || result === -Infinity) {
      document.getElementById("sci-display").value = "Undefined";
      sciDisplayStr = "";
      sciEvalStr = "";
      return;
    }

    sciDisplayStr = result.toString();
    sciEvalStr = result.toString();
    document.getElementById("sci-display").value = sciDisplayStr;
  } catch {
    document.getElementById("sci-display").value = "Error";
    sciDisplayStr = "";
    sciEvalStr = "";
  }
}

function clearEntrySci() {
  sciDisplayStr = sciDisplayStr.slice(0, -1);
  sciEvalStr = sciEvalStr.slice(0, -1);
  document.getElementById("sci-display").value = sciDisplayStr;
}

function clearSci() {
  sciDisplayStr = "";
  sciEvalStr = "";
  document.getElementById("sci-display").value = "";
}

document.getElementById("sci-display").addEventListener("input", function () {
  sciDisplayStr = this.value;
  sciEvalStr = sanitizeScientificInput(this.value);
});

// =======================
// Programmer (BASE CONVERSION)
// =======================
let originalDecimal = "";

function convertBase(type) {
  const input = document.getElementById("comp-display");

  if (!originalDecimal) {
    let val = input.value.trim();
    if (!/^\d+$/.test(val)) {
      alert("Please enter a valid non-negative decimal number.");
      return;
    }
    originalDecimal = val;
  }

  const number = parseInt(originalDecimal, 10);

  switch (type) {
    case 'dec':
      input.value = originalDecimal;
      break;
    case 'bin':
      input.value = number.toString(2);
      break;
    case 'oct':
      input.value = number.toString(8);
      break;
    case 'hex':
      input.value = number.toString(16).toUpperCase();
      break;
  }
}

function clearProgrammer() {
  document.getElementById("comp-display").value = "";
  originalDecimal = "";
}

// =======================
// CURRENCY CONVERSION
// =======================
let selectedCurrency = "inr"; // default currency

document.querySelectorAll('.currency-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.currency-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedCurrency = button.getAttribute('data-currency');
  });
});

function convertCurrencyStatic() {
  const amt = parseFloat(document.getElementById("currency-amount").value);
  if (isNaN(amt)) return alert("Enter a valid amount");

  const rates = {
    inr: 86.6,
    eur: 0.87,
    gbp: 0.75,
    aud: 1.54,
    cad: 1.37,
    dkk: 6.5,
    jpy: 146.2
  };

  const rate = rates[selectedCurrency];
  if (!rate) return alert("Please select a currency");

  const converted = (amt * rate).toFixed(2);
  document.getElementById("currency-result").innerText =
    `${amt} USD = ${converted} ${selectedCurrency.toUpperCase()}`;
}

function clearCurrency() {
  document.getElementById("currency-amount").value = "";
  document.getElementById("currency-result").innerText = "";
}

// =======================
// ENTER KEY LISTENERS
// =======================
document.getElementById("standard-display").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  }
});

document.getElementById("sci-display").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculateSci();
  }
});
document.getElementById("comp-display").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    convertBase('dec');
  }
});
document.getElementById("currency-amount").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    convertCurrencyStatic();
  }
});