$(document).ready(function() {

  var init = "<span class='initial'>Enter a number...</span>"
  var output = init;
  var toCalc = [""];

  let phases = {
    initial: true,
    operator: false,
    calculate: false,
    calcComplete: false,
    decimal: true,
    parCount: 0,
  };

  let index = {
    current: 0,
    previous: function() {
      return this.current - 1;
    },
  };

  $('#output').append(output);

  function clear() {
    $('#output').empty();
    output = init;
    $('#output').append(output);
    toCalc = [""];
    index.current = 0;
    phases.parCount = 0;
    phases.calcComplete = false;
  }

  function clearAll(){
    clear();
    phases.operator = false;
    phases.initial = true;
  }

  $('#clear').click(function() {
    clearAll();
  });


  var toCalcForDisplay = [];
  function display() {
    $('#output').empty();


    toCalcForDisplay = [...toCalc];
    if (toCalcForDisplay.length === 1 && toCalcForDisplay[0] === "") {
      toCalcForDisplay = [init];
      toCalc = [""];
      phases.operator = true;
      phases.initial = true;
    }


    (function trimMultiplication(){
      for (i = 0; i < toCalcForDisplay.length; i++) {
        if (toCalcForDisplay[i] === " &times; " && toCalcForDisplay[i + 1] === "( ") {
          toCalcForDisplay[i] = " ";
        }
      }
    })();

    $('#output').append(toCalcForDisplay.join(''));
  }

  function load(value) {
    phases.initial = false;

    //if a calculation has just been performed, clear it and start a new array
    if (phases.calcComplete) {
      clear();
    }

    //if the current index is NaN (i.e. if it's an operator), begin a new array index...
      //... UNLESS IT'S A NEGATIVE SIGN
    if (toCalc[index.current] &&
        isNaN(Number(toCalc[index.current])) &&
        toCalc[index.current] != "-") {

          index.current++;
          toCalc.push('');

          }

    console.log(toCalc);

    //if the current index is falsy (an empty string or zero), and it's also not...
      //... a negative sign or a decimal point, it now equals value
    if (!Number(toCalc[index.current]) &&
        toCalc[index.current] != "-" &&
        toCalc[index.current] != "0.") {

          toCalc[index.current] = value;

          //otherwise, concatenate:
      } else {
          toCalc[index.current] = toCalc[index.current] + value;
      }

    console.log(toCalc);

    display();
  }


  //========================================
  //INTEGERS
  //========================================

  $("#1").click(function() {
    phases.operator = true;
    load("1");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#2").click(function() {
    phases.operator = true;
    load("2");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#3").click(function() {
    phases.operator = true;
    load("3");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#4").click(function() {
    phases.operator = true;
    load("4");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#5").click(function() {
    phases.operator = true;
    load("5");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#6").click(function() {
    phases.operator = true;
    load("6");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#7").click(function() {
    phases.operator = true;
    load("7");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#8").click(function() {
    phases.operator = true;
    load("8");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#9").click(function() {
    phases.operator = true;
    load("9");
    if (toCalc.length > 2) {
      phases.calculate = true;
    }
  });

  $("#0").click(function() {
    if (toCalc[index.current] != "0") {
      phases.operator = true;
      load("0");
      if (toCalc.length > 2) {
        phases.calculate = true;
      }
    }
  });


//========================================
//SPECIAL CHARACTERS (negative sign, parentheses, backspace, decimal point)
//========================================

  $('#negative').click(function(){

    //the the current index in an operator or parentheses, prepare to insert the...
      // ... negative sign at the next array index
    if (isNaN(Number(toCalc[index.current]))) {
      index.current++;
    }

    function addOrRemoveNegative() {

      function addNegative() {
        toCalc[index.current] = toCalc[index.current].toString().split('');
        toCalc[index.current].unshift("-");
        toCalc[index.current] = toCalc[index.current].join('');
      }

      function removeNegative() {
        toCalc[index.current] = toCalc[index.current].toString().split('');
        toCalc[index.current].shift();
        toCalc[index.current] = toCalc[index.current].join('');
      }

      let currentIndexIsNegative = /^-/.test(toCalc[index.current]);

      if (currentIndexIsNegative) {
        removeNegative();
      } else {
        addNegative();
      }
    }

    //don't add a negative sign to a zero
    if (toCalc[index.current] != "0") {

      //if there's nothing in this index, just add the negative sign
      if(!toCalc[index.current]) {
        load("-");
      } else {
        addOrRemoveNegative();
      }
    }

    console.log(toCalc);
    display();
  })

  /*the parentheses and backspace functions need to track how many unclosed parentheses
  there are. They'll both use this function:*/
  var equalsToggle = function() {
    var equalsEntity = '&equals;';
    $('#equals').text(function (i, equalsEntity) {
      return phases.parCount ? ") !" : "=";
    })
  }

  $('#parentheses').click(function() {

    const pushPar = {
      open: function() {
        index.current++;
        toCalc.push("( ");
        phases.parCount++;
        phases.operator = false;
      },

      openMultiplication: function() {
        operate(' &times; ');
        index.current++;
        toCalc.push("( ");
        phases.parCount++;
        phases.operator = false;
      },

      close: function() {
        index.current++;
        toCalc.push(" )");
        phases.parCount--;
        phases.operator = true;
      },
    }

    // if user selects parentheses immmediately after a calculation, start multiplication
    if (phases.calcComplete) {
      phases.calcComplete = false;
      if (Number(toCalc[0]) != 0) {
        pushPar.openMultiplication();
    //... unless it's a zero, in which case, make that zero into parentheses
      } else {
        toCalc[0] = "( ";
        phases.parCount++;
        index.current++;
      }
      console.log(toCalc);
      display();
      return true;
    }

    let parBlockState = {
      //states to be used in conditionals later on:

      hasNoOperator: false,
      hasOperatorAndReagent: false,

      //determine states:
      assign: function() {
        if (/&/.test(toCalc[index.previous()])) {
          this.hasOperatorAndReagent = true;
        } else {
          this.hasNoOperator = true;
        }
        console.log("hasNoOperator is " + this.hasNoOperator);
        console.log("hasOperatorAndReagent is " + this.hasOperatorAndReagent);
      },

    };


    //now the fun part! If we're at the very beginning, just make open parentheses:
    if (toCalc.length === 1 && toCalc[0] === "") {
      toCalc[0] = "( ";
      phases.parCount++;
    //else, if the current index is a number:
    } else if (!isNaN(Number(toCalc[index.current]))) {
      //first, if there are no open parentheses
      if (!phases.parCount) {
        //if the number before the operator ends in a decimal point, add a zero at the end
        if (/\.$/.test(toCalc[index.current])) {
          toCalc[index.current] = toCalc[index.current] + "0";
        }
        pushPar.openMultiplication();
      //but if there ARE open parentheses....
      } else {
        parBlockState.assign();
        if (parBlockState.hasNoOperator) {
          pushPar.openMultiplication();
        } else if (parBlockState.hasOperatorAndReagent) {
          pushPar.close();
        }
      }
    } else if (toCalc[index.current] === "-") {
      toCalc[index.current] = "-1";
      pushPar.openMultiplication();
    } else if (toCalc[index.current] === "( ") {
      pushPar.open();
    } else if (/&/.test(toCalc[index.current])) {
      index.current++;
      toCalc.push("( ")
      phases.parCount ++;
    } else if (toCalc[index.current] == " )") {
      if (phases.parCount) {
        pushPar.close()
        phases.parCount--;
      } else {
        pushPar.openMultiplication();
        phases.parCount++;
      }
    }

    //if there are unclosed parentheses, change the equals button

    //console.log(phases.parCount);
    equalsToggle();

    console.log("parCount is " + phases.parCount);
    console.log(toCalc);
    display();
  });


  $('#backspace').click(function() {
    phases.calcComplete = false;
    //if there is only one number left in the entire array, make it a zero
    //if that number is already a zero, ABORT MISSION
    if (toCalc[0] == "0" && index.current == 0){
      return true;
    } else if (toCalc[index.current].length == 1 && index.current === 0) {
      toCalc[index.current] = "0";
      display();
      return true;
    }

    //if user deletes a decimal point, make it so you can add one back in again
    if (toCalc[index.current].substr(-1, 1) == ".") {
      phases.decimal = true;
    }

    /*if the current index is a parenthesis, remove the entire index, set parCount
    accordingly*/
    if (/\(/.test(toCalc[index.current])) {
      toCalc.pop();
      index.current--;
      phases.parCount--;
      console.log("parCount after deletion is " + phases.parCount);
      equalsToggle();
      if (/times/.test(toCalc[index.current])) {
        toCalc.pop()
        index.current--;
        phases.operator = true;
      }
      display();
      return true;
    } else if (/\)/.test(toCalc[index.current])) {
      toCalc.pop();
      index.current--;
      phases.parCount++;
      console.log("parCount after deletion is " + phases.parCount);
      equalsToggle();
      if (/\./.test(toCalc[index.previous()])) {
        phases.decimal = false;
      }
      display();
      return true;
    }

    //If the current index is an HTML entity (an operator), remove the entire index...
      //... and make it so you can't add another decimal point to the number before...
      //.. the operator, should a decimal point already exist.
    if (/&/.test(toCalc[index.current])) {
      if (/\./.test(toCalc[index.previous()])) {
        phases.decimal = false;
      }
      toCalc.pop();
      index.current--;
      phases.operator = true;
    } else {
      toCalc[index.current] = toCalc[index.current].substring(0, toCalc[index.current].length - 1);
      if (toCalc[index.current] === "" && toCalc.length > 1){
        toCalc.pop();
        index.current--;
        phases.operator = false;
      }
    }


    console.log(toCalc);
    display();
  });


  $('#point').click(function() {
    function loadDecimal() {
      //console.log(index.current);
      //console.log(phases.decimal);
      if (isNaN(Number(toCalc[index.current])) && toCalc[index.current] != "-" && toCalc[index.current] != "") {
        index.current++;
      }

      //if a calculation has been completed and the answer already has a
        //decimal point, disable adding anothing decimal point
      if (phases.calcComplete) {
        if (/\./.test(toCalc[0].toString())) {
          phases.decimal = false;
        }
      }

      if (phases.decimal) {
        if (toCalc[index.current] || toCalc[index.current] == "0") {
          toCalc[index.current] = toCalc[index.current] + ".";
        } else if (toCalc[index.current] == "-" || toCalc[index.current] == '') {
          toCalc[index.current] = toCalc[index.current] + "0."
        } else {
          toCalc.push("0.");
        }
      }
      console.log(toCalc);
      display();
    }
    loadDecimal();
    phases.decimal = false;
    phases.calcComplete = false;
  });



//========================================
//OPERATORS
//========================================
function operate(operator) {
  //if there's already an operator in place, change that operator
  //console.log(phases.operator);
  if (!phases.operator && /&/.test(toCalc[index.current])) {
    toCalc[index.current] = operator;
  } else if (phases.operator && toCalc[index.current] !== "-") {
    //if the number before the operator ends in a decimal point, add a zero at the end
    if (/\.$/.test(toCalc[index.current])) {
      toCalc[index.current] = toCalc[index.current] + "0";
    }
    index.current ++;
    toCalc.push(operator);
    phases.operator = false;
    phases.decimal = true;
  }

  display();
}

  $('#divide').click(function() {
    phases.calcComplete = false;
    operate(' &divide; ');
  });

  $('#times').click(function() {
    phases.calcComplete = false;
    operate(' &times; ');
  });

  $('#minus').click(function() {
    phases.calcComplete = false;
    operate(' &minus; ');
  });

  $('#plus').click(function() {
    phases.calcComplete = false;
    operate(' &plus; ');
  });



  $('#equals').click(function() {

    const operations = {
      mainOperations: {
        //math performed on indices in front of and behind the index.current (operator) index
        add: function() {
          toCalc[(i-1)] = parseFloat(toCalc[(i-1)]) + parseFloat(toCalc[(i+1)]);
          toCalc.splice(i, 2);
          i--;
        },

        subtract: function() {
          toCalc[(i-1)] = toCalc[(i-1)] - toCalc[(i+1)];
          toCalc.splice(i, 2);
          i--;
        },

        multiply: function() {
          toCalc[(i-1)] = toCalc[(i-1)] * toCalc[(i+1)];
          toCalc.splice(i, 2);
          i--;
        },

        divide: function() {
          toCalc[(i-1)] = toCalc[(i-1)] / toCalc[(i+1)];
          toCalc.splice(i, 2);
          i--;
        }
      },

      multiplyAndDivide: function() {
        if (toCalc[i] === " &times; ") {
          this.mainOperations.multiply();
        } else if (toCalc[i] === " &divide; ") {
          this.mainOperations.divide();
        }
      },

      addAndSubtract: function() {
        if (toCalc[i] === " &minus; ") {
          this.mainOperations.subtract();
        } else if (toCalc[i] === " &plus; ") {
          this.mainOperations.add();
        }
      }
    }

    function flashParentheses() {

      let openParIndices = [];
      (function scanForUnclosed() {
        for (i = 0; i < toCalcForDisplay.length; i++) {
          if (toCalc[i] === "( ") {
            openParIndices.push(i);
          } else if (toCalc[i] === " )") {
            //console.log("Popping!");
            openParIndices.pop();
          }
        }
      })();


      for (let i = 0; i < toCalcForDisplay.length; i++) {

        if (openParIndices.includes(i)) {
          toCalcForDisplay[i] = "<span class='unclosed-par'>" + toCalcForDisplay[i] + "</span>";
          /*the inline-block display collapses the space after the parenthesis,
          so add in another*/

          if (toCalcForDisplay[i + 1] !== " ") {
            toCalcForDisplay.splice(i + 1, 0, " ");

            //adding that space invalidates all the other indices, so add one to all indices
            //(the openParIndices gets reset each time flashParentheses runs, so we can use Array.map)
            openParIndices = openParIndices.map(index => index +1);
            i++; //to prevent infinite loop!!!!
          }

        }
      }
      /*
      openParIndices.forEach(function(index) {
        toCalcForDisplay[index] = "<span class='unclosed-par'>" + toCalcForDisplay[index] + "</span>";

        if (toCalcForDisplay[index + 1] !== " ") {
          toCalcForDisplay.splice(index + 1, 0, " ");

          openParIndices = openParIndices.map(i => i +1);
        }

      })*/

      console.log(toCalcForDisplay);

      $('#output').empty();
      $('#output').append(toCalcForDisplay.join(''));

      /*toCalcForDisplay.forEach(function(index) {
        console.log(toCalcForDisplay[index]);
        if (toCalcForDisplay[index] === "<span class='unclosed-par'>( </span>") {
          console.log("Found one!");
          toCalcForDisplay[index] = "( ";
        }*/

      for (let i = 0; i < toCalcForDisplay.length; i++) {
        if (toCalcForDisplay[i] === "<span class='unclosed-par'>( </span>") {
          toCalcForDisplay[i] = "( ";
          toCalcForDisplay.splice(i + 1, 1);
          console.log(toCalcForDisplay);
          //display();
        }
      }
    }



    if (phases.parCount) {
      flashParentheses();
    } else if (phases.calculate) {

      console.log(toCalc);

      //multiplication and division first
      for (i = 0; i < toCalc.length; i ++) {
        if (toCalc[i] === " &times; " || toCalc[i] === " &divide; ") {
          operations.multiplyAndDivide();
        }
      }

      //after multipication and division are complete, perform addition and subtraction
      for (i = 0; i < toCalc.length; i ++) {
        if (toCalc[i] === " &minus; " || toCalc[i] === " &plus; ") {
          operations.addAndSubtract();
        }
      }

      console.log(toCalc);

      //Trim answer to seven decimal places and split each digit
      var untrimmed = toCalc[0].toPrecision(7).toString().split('');

      //Chop off any zeros at the end of the answer
      function trim() {
        if (untrimmed[(untrimmed.length-1)] === 0) {
          untrimmed.splice(-1, 1);
          trim();
        }
      }

      var answer = untrimmed.join('');
      $('#output').empty();
      toCalc = [answer];
      output = answer;

      $('#output').append(output);
      phases.operator = true;
      phases.decimal = true;
      phases.calcComplete = true;
      phases.calculate = false;
      index.current = 0;
    }


  });

});

/*parBlockState legacy code (probably unnecessary, but just in case I'm wrong...)
isEmpty: false,
currentParBlock: [],
findOperator: function() {
  for (i = 0; i < this.currentParBlock.length; i++) {
    if (/&/.test(this.currentParBlock[i])) {
      return true;
    }
  }
},

if (this.currentParBlock === ["( "]) {
  this.isEmpty = true;
} else if (!this.findOperator()) {
  this.hasNoOperator = true;
} else if (this.findOperator()) {
  this.hasOperatorAndReagent = true;
}
},
scan: function() {
let openParIndices = [];
for (i = 0; i < toCalc.length; i++) {
  if (toCalc[i] === "( ") {
    openParIndices.push(i);
  } else if (toCalc[i] === ") ") {
    openParIndices.pop();
  }
}

if (openParIndices) {
  this.currentParBlock = toCalc.slice(openParIndices.pop());
}
*/

/*
function closeParAutoComplete() {

  let parBlockState = {
    //states to be used in conditionals later on:

    hasNoOperator: false,
    hasOperatorAndReagent: false,

    //determine states:
    assign: function() {
      if (/&/.test(toCalc[index.previous()])) {
        this.hasOperatorAndReagent = true;
      } else {
        this.hasNoOperator = true;
      }
      console.log("hasNoOperator is " + this.hasNoOperator);
      console.log("hasOperatorAndReagent is " + this.hasOperatorAndReagent);
    },
  };
  parBlockState.assign();
  if(parBlockState.hasOperatorAndReagent){
    while (phases.parCount) {
      index.current++;
      toCalc.push(" )");
      phases.parCount--;
      phases.operator = true;
      equalsToggle();
      display();
    }
  }
}
*/
