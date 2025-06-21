// Theme Toggle
document.getElementById("themeSwitch").addEventListener("change", function() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
});

// Switch Views
function switchMode(mode) {
  document.querySelectorAll('.calculator').forEach(el => el.classList.remove('active'));
  document.getElementById(mode).classList.add('active');
}

// Standard Mode
function append(val) {
  document.getElementById("standard-display").value += val;
}
function calculate() {
  try {
    document.getElementById("standard-display").value = eval(document.getElementById("standard-display").value);
  } catch {
    alert("Invalid Expression");
  }
}
function clearDisplay() {
  document.getElementById("standard-display").value = "";
}

// Scientific Mode
let sciDisplayStr = "";
let sciEvalStr = "";

// Function to sanitize user-friendly input for JavaScript eval
function sanitizeScientificInput(input) {
  return input
    .replace(/π/g, "Math.PI")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log(")
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100");
}

function appendSci(val) {
  const funcMap = {
    "Math.sin(": "sin(",
    "Math.cos(": "cos(",
    "Math.tan(": "tan(",
    "Math.log(": "log(",
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

function calculateSci() {
  try {
    const sanitized = sanitizeScientificInput(sciDisplayStr);
    const result = eval(sanitized);
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

// Listen to manual typing and sync both strings
document.getElementById("sci-display").addEventListener("input", function () {
  sciDisplayStr = this.value;
  sciEvalStr = sanitizeScientificInput(this.value);
});


// Computer (Base Conversion)
let originalDecimal = ""; // Store original decimal value

function convertBase(type) {
  const input = document.getElementById("comp-display");

  // If originalDecimal is empty, validate and save current input as decimal
  if (!originalDecimal) {
    let val = input.value.trim();
    if (!/^\d+$/.test(val)) {
      alert("Please enter a valid non-negative decimal number.");
      return;
    }
    originalDecimal = val;
  }

  // Convert based on stored originalDecimal value, never from current input.value
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

function clearComputer() {
  document.getElementById("comp-display").value = "";
  originalDecimal = "";
}

// Static conversion
// Attach click handlers after DOM loaded or script placed at bottom
document.querySelectorAll('.currency-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.currency-btn').forEach(btn => btn.classList.remove('active'));
    // Add active to clicked button
    button.classList.add('active');
    // Update selected currency
    selectedCurrency = button.getAttribute('data-currency');
  });
});

function convertCurrencyStatic() {
  const amt = parseFloat(document.getElementById("currency-amount").value);
  if (isNaN(amt)) return alert("Enter a valid amount");

  const rates = { inr: 86.6, eur: 0.87, gbp: 0.75, aud: 1.54, cad: 1.37, dkk: 6.5, jpy: 146.2};
  const rate = rates[selectedCurrency];
  const converted = (amt * rate).toFixed(2);

  document.getElementById("currency-result").innerText =
    `${amt} USD = ${converted} ${selectedCurrency.toUpperCase()}`;
}

function clearCurrency() {
  document.getElementById("currency-amount").value = "";
  document.getElementById("currency-result").innerText = "";
}

// Trigger calculation when Enter key is pressed in standard input
document.getElementById("standard-display").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculate(); // Correct function for standard mode
  }
});

// Trigger calculation when Enter key is pressed in scientific input
document.getElementById("sci-display").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    calculateSci(); // Correct function for scientific mode
  }
});