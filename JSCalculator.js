const numbers = document.querySelectorAll(".number");
const operands = document.querySelectorAll(".operand");
const equals = document.getElementById("equals");
const clear = document.getElementById("clear");
const del = document.getElementById("delete");
const previous = document.getElementById("display-previous")
const current = document.getElementById("display")
let lastOperand = '';

numbers.forEach(number => {
  number.addEventListener('click', () => {
    appendNumber(number.innerText);
  })
})

operands.forEach(operand => {
  operand.addEventListener('click', () => {
    appendOperand(operand.innerText);
  })
})

clear.addEventListener('click', () => {
  clearDisplay();
})

del.addEventListener('click', () => {
  deleteLast(previous.innerText, current.innerText);
})

equals.addEventListener('click', () => {
  calculate(previous.innerText);
})


function appendNumber(number) {
  const last = previous.innerText.slice(-1);
  const secondLast = previous.innerText.slice(-2,-1);

  // a term can be started with any number but 0
  if (last === '' || last === "0" && number != "0") {
    current.innerText = number;
    previous.innerText = number;
  }
  // prevent appending zeros in the beginning
  else if (last === "0" && secondLast === "" && number === "0") {
    return
  }
  // display the term in previous but in current only the recent pressed number
  else if (_.contains(["/","+","x","-"], last)) {
    current.innerText = number;
    previous.innerText = previous.innerText + number;
  }
  // update previous and current display simultaneously with every new number
  else {
    previous.innerText = previous.innerText + number;
    current.innerText = current.innerText + number;
  }
}

function appendOperand(operand) {
  const last = previous.innerText.slice(-1);
  const secondLast = previous.innerText.slice(-2,-1);

  // change operands
  if (_.contains(["/","+","x"], last) && _.contains(["/","+","x"], operand) ) {
    previous.innerText = previous.innerText.slice(0,-1) + operand;
  }
  // change combination of operands (/+x & -) into a new single operand
  else if (_.contains(["/","+","x"], secondLast) && last === "-") {
    previous.innerText = previous.innerText.slice(0,-2) + operand
  }
  // /+* operands cannot be in the first place
  else if (_.contains(["","-"], last) && _.contains(["/","+","x"], operand)) {
    return
  }
  // display result with new operand
  else if (lastOperand === "=") {
    let index = previous.innerText.indexOf("=");
    previous.innerText = previous.innerText.slice(index+1) + operand
    current.innerText = current.innerText + operand;
  }
  // prevent double or more dots
  else if (lastOperand === "." && operand === ".") {
    return
  }
  // enable using decimal dots
  else if (operand === ".") {
    previous.innerText = previous.innerText + operand;
    current.innerText = current.innerText + operand;
  }
  // display the term in previous but in current only the recent pressed operand
  else {
    previous.innerText = previous.innerText + operand;
    current.innerText = operand;
  }
  // save last operand that was pressed
  lastOperand = operand;
}

function calculate(calc) {
  const calcArr = previous.innerText.split(/(?=[/+x-])|(?<=[/+x-])/g);

  // case when there is a negative number in the beginning
  if (calcArr[0] === "-") {
    calcArr[1] = `-${calcArr[1]}`
    calcArr[0] = ''
  }
  // Multiplication
  calcArr.forEach((c, index) => {
    if (c === "x") {
     if (calcArr[index + 1] != "-"){
      const multiplication = calcArr[index-1] * calcArr[index+1];
      calcArr[index - 1] = calcArr[index + 1] = "";
      calcArr[index] = multiplication;
     } else {
      const multiplication = calcArr[index-1] * (-calcArr[index+2]);
      calcArr[index - 1] = calcArr[index + 1] = calcArr[index + 2] = "";
      calcArr[index] = multiplication;
      }
    }
    // Division
    if (c === "/") {
      if (calcArr[index+1] != "-"){
       const division = calcArr[index-1] / calcArr[index+1];
       calcArr[index - 1] = calcArr[index + 1] = "";
       calcArr[index] = division;
      } else {
       const division = calcArr[index-1] / (-calcArr[index+2]);
       calcArr[index - 1] = calcArr[index + 1] = calcArr[index + 2] = "";
       calcArr[index] = division;
       }
     }
  })
  const calcArrFilt = calcArr.filter(c => c != "");

  calcArrFilt.forEach((c,index) => {
    // Addition
    if (c === "+") {
      if (calcArrFilt[index+1] != "-"){
       const addition = Number(calcArrFilt[index-1]) + Number(calcArrFilt[index+1]);
       calcArrFilt[index - 1] = calcArrFilt[index + 1] = 0;
       calcArrFilt[index] = addition;
      } else {
       const addition = Number(calcArrFilt[index-1]) + Number((-calcArrFilt[index+2]));
       calcArrFilt[index - 1] = calcArrFilt[index + 1] = calcArrFilt[index + 2] = 0;
       calcArrFilt[index] = addition;
       }
     }
    //  Subtraction
     if (c === "-") {
       if (calcArrFilt[index+1] != "-"){
        const subtraction = Number(calcArrFilt[index-1]) - Number(calcArrFilt[index+1]);
        calcArrFilt[index - 1] = calcArrFilt[index + 1] = 0;
        calcArrFilt[index] = subtraction;
       } else {
        const subtraction = Number(calcArrFilt[index-1]) - Number((-calcArrFilt[index+2]));
        calcArrFilt[index - 1] = calcArrFilt[index + 1] = calcArrFilt[index + 2] = 0;
        calcArrFilt[index] = subtraction;
        }
      }
  })
  let sum = 0;
  calcArrFilt.forEach(c => {
    sum += Number(c);
  })
  current.innerText = sum;
  previous.innerText = previous.innerText + "=" + sum;
  lastOperand = "=";
}

function clearDisplay() {
  previous.innerText = "";
  current.innerText = 0;
  lastOperand = '';
}

function deleteLast(prev, curr) {
  previous.innerText = prev.slice(0,-1);
  current.innerText = curr.slice(0,-1);
}
