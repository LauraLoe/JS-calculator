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
  if (last === '' || last === "0" && number != "0" && previous.innerText.length <= 1) {
    current.innerText = number;
    previous.innerText = number;
  } else if (last === "0" && number === "0") {
    current.innerText = current.innerText;
    previous.innerText = current.innerText;
  } else if (_.contains(["/","+","x","-"], last)) {
    current.innerText = number;
    previous.innerText = previous.innerText + number;
  } else {
    previous.innerText = previous.innerText + number;
    current.innerText = current.innerText + number;
  }
}

function appendOperand(operand) {
  const last = previous.innerText.slice(-1);
  const secondLast = previous.innerText.slice(-2,-1);
  if (_.contains(["/","+","x"], last) && _.contains(["/","+","x"], operand) ) {
    previous.innerText = previous.innerText.slice(0,-1) + operand;
  } else if (_.contains(["/","+","x"], secondLast) && last === "-") {
    if ( operand != "-") {
    previous.innerText = previous.innerText.slice(0,-2) + operand
    }
  } else if (lastOperand === "=") {
    let index = previous.innerText.indexOf("=");
    previous.innerText = previous.innerText.slice(index+1) + operand
    current.innerText = current.innerText + operand;
  } else if (lastOperand === "." && operand === ".") {
    current.innerText = current.innerText;
    previous.innerText = current.innerText;
  } else if (operand === ".") {
    previous.innerText = previous.innerText + operand;
    current.innerText = current.innerText + operand;
  } else {
    previous.innerText = previous.innerText + operand;
    current.innerText = operand;
  }
  lastOperand = operand;
}

function calculate(calc) {
  const calcArr = previous.innerText.split(/(?=[/+x-])|(?<=[/+x-])/g);
  // Multiplication
  calcArr.forEach((c, index) => {
    if (c === "x") {
     if (calcArr[index + 1] != "-"){
      const multiplication = calcArr[index-1] * calcArr[index+1];
      calcArr[index - 1] = calcArr[index + 1] = 0;
      calcArr[index] = multiplication;
     } else {
      const multiplication = calcArr[index-1] * (-calcArr[index+2]);
      calcArr[index - 1] = calcArr[index + 1] = calcArr[index + 2] = 0;
      calcArr[index] = multiplication;
      }
    }
    // Division
    if (c === "/") {
      if (calcArr[index+1] != "-"){
       const division = calcArr[index-1] / calcArr[index+1];
       calcArr[index - 1] = calcArr[index + 1] = 0;
       calcArr[index] = division;
      } else {
       const division = calcArr[index-1] / (-calcArr[index+2]);
       calcArr[index - 1] = calcArr[index + 1] = calcArr[index + 2] = 0;
       calcArr[index] = division;
       }
     }
  })
  const calcArrFilt = calcArr.filter(c => c != 0);

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
    sum = sum + c;
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
