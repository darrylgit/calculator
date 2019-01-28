$(document).ready(function() {

  let init = "0";
  let output = init;
  let toCalc = [""];
  let terminalCalculation = [];

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


  $('#inputDisplay').append(output);
  $('#preview').append(output);

  //========================================
  //DISPLAY
  //========================================


  function clear() {
    $('#preview').empty();
    $('#inputDisplay').empty();
    output = init;
    $('#preview').append(output);
    $('#inputDisplay').append(output);
    $('#inputDisplay').css("color", "rgba(255, 255, 255, 0.0)")
    toCalc = [""];
    index.current = 0;
    phases.parCount = 0;
    phases.calcComplete = false;
  }

  function clearAll(){
    clear();
    phases.operator = false;
    phases.initial = true;
    phases.decimal = true;
    equalsToggle();
  }

  $('#clear').click(function() {
    clearAll();
  });


  let toCalcForDisplay = [];

  function displayInput() {
    $('#inputDisplay').empty();

    toCalcForDisplay = [...toCalc];

    if (toCalcForDisplay.length === 1 && toCalcForDisplay[0] === "") {
      toCalcForDisplay = [init];
      toCalc = [""];
      phases.operator = false;
      phases.initial = true;
    }


    (function trimMultiplication(){
      for (i = 0; i < toCalcForDisplay.length; i++) {
        if (toCalcForDisplay[i] === " &times; " && toCalcForDisplay[i + 1] === "( ") {
          toCalcForDisplay[i] = " ";
        }
      }
    })();

    $('#inputDisplay').append(toCalcForDisplay.join(''));
  }


  function displayPreview() {
    let outputBackup = output;
    let toCalcBackup = [...toCalc];
    let toCalcForDisplayBackup = [...toCalcForDisplay];
    evaluationManager();
    console.log("output is");
    console.log(output);
    $('#preview').append(output);
    output = outputBackup;
    toCalc = toCalcBackup;
    toCalcForDisplay = toCalcForDisplayBackup;
  }



  function display() {
    console.log(phases);
    displayInput();
    if (toCalc.length === 1 && toCalc[0] !== "( ") {
      $('#preview').empty();
      $('#preview').append(toCalcForDisplay.join(''));
    }
  }


  function load(value) {
    phases.initial = false;
    $('#inputDisplay').css("color", "rgba(255, 255, 255, 1.0)")

    //if a calculation has just been performed, clear it and start a new array
    if (phases.calcComplete) {
      clear();
    }

    //if the current index is a closing par, push a visible multiplication sign
    if (/\)/.test(toCalc[index.current])) {
      phases.calcComplete = false;
      operate(' &times; ');
    }


    /*if the current index is NaN (i.e. if it's an operator), begin a new array index
    UNLESS IT'S A NEGATIVE SIGN*/
    if (toCalc[index.current] &&
        isNaN(Number(toCalc[index.current])) &&
        toCalc[index.current] != "-") {

          index.current++;
          toCalc.push('');

          }

    console.log(toCalc);

    /*if the current index is falsy (an empty string or zero), and it's also not
    a negative sign or a decimal point, it now equals value*/
    if (!Number(toCalc[index.current]) &&
        toCalc[index.current] != "-" &&
        !/./.test(toCalc[index.current]) ||
        toCalc[index.current] == undefined) {

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

  $(".natural").click(function() {
    phases.operator = true;
    let val = $(this).data('value').toString();
    load(val);
    if (toCalc.length > 2 && phases.parCount === 0) {
      phases.calculate = true;
      displayPreview();
    }
  });

  $("#zero").click(function() {
    if (toCalc[index.current] != "0") {
      phases.operator = true;
      load("0");
      if (toCalc.length > 2 && phases.parCount === 0) {
        phases.calculate = true;
        displayPreview();
      }
    }
  });


//========================================
// NEGATIVE
//========================================

  $('#negative').click(function(){

    /*the the current index in an operator or parentheses, prepare to insert the
    negative sign at the next array index*/
    if (isNaN(Number(toCalc[index.current]))) {
      index.current++;
    }
    console.log("current index is:");
    console.log(toCalc[index.current]);
    console.log(!toCalc[index.current]);

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
    if (toCalc[index.current] != "0" && !phases.initial) {

      //if there's nothing in this index, just add the negative sign
      if(!toCalc[index.current]) {
        console.log("Load negative!");
        load("-");
      } else {
        addOrRemoveNegative();
      }
    }

    console.log(toCalc);
    display();
  })

  //========================================
  // PARENTHESES AND BACKSPACE
  //========================================

  /*the parentheses and backspace functions need to track how many unclosed parentheses
  there are. They'll both use this function.*/
  let equalsToggle = function() {
    let equalsEntity = '&equals;';

    function setEquals() {
      $('#equals').html('<span class="equals">&equals;</span>').text();
    }

    function setUnclosedWarning() {
      $('#equals').text(") !");
    }

    if (phases.parCount) {
      setUnclosedWarning();
    } else {
      setEquals();
    }
  }

  //========================================
  // PARENTHESES
  //========================================


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
        console.log("Closed at parCount" + phases.parCount)
        phases.parCount--;
        phases.operator = true;

      },
    };

    $('#inputDisplay').css("color", "rgba(255, 255, 255, 1.0)")
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
      equalsToggle();
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
          console.log('hasOperatorAndReagent, so close');
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
        pushPar.close();
      } else {
        pushPar.openMultiplication();
      }
    }

    //if there are unclosed parentheses, change the equals button
    equalsToggle();

    console.log("parCount is " + phases.parCount);
    console.log(toCalc);
    display();
    if (toCalc[index.current] === " )" && !phases.parCount) {
      displayPreview();
      phases.calculate = true;
    }
  });

  //========================================
  // BACKSPACE
  //========================================

  $('#backspace').click(function() {
    phases.calcComplete = false;
    console.log("current index is:")
    console.log(index.current);
    //if there is only one digit left in the entire array, make it a zero
    //if that number is already a zero, ABORT MISSION
    if (toCalc[0] == "" && index.current == 0){
      phases.initial = true;
      return true;
    } else if (toCalc[index.current].length == 1 && index.current === 0) {
      toCalc[index.current] = "";
      display();
      return true;
    }

    //if the current index is an exponential expression, remove the exponent
    if (/e/.test(toCalc[index.current]) && !/\&/.test(toCalc[index.current])) {
      let splitExp = toCalc[index.current].split('');
      let indexOfE = 0;

      for(i = 0; i < splitExp.length; i++) {
        if (splitExp[i] === "e") {
          indexOfE = i;
        }
      }

      toCalc[index.current] = splitExp.slice(0, indexOfE).join('');
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
      if (toCalc.length > 0) {
        console.log("toCalc after open par removal:");
        console.log(toCalc);
        index.current--;
      } else {
        toCalc = [""];
        phases.initial = true;
      }

      phases.parCount--;
      console.log("parCount after deletion is " + phases.parCount);
      equalsToggle();

      //if there is an implicit multiplication symbol, remove that as well
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

    /*If the current index is an HTML entity (an operator), remove the entire index
    and make it so you can't add another decimal point to the number before
    the operator, should a decimal point already exist.*/
    if (/&/.test(toCalc[index.current])) {
      if (/\./.test(toCalc[index.previous()])) {
        phases.decimal = false;
      }
      toCalc.pop();
      index.current--;
      phases.operator = true;
    //else, normal backspace
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

  //========================================
  // DECIMAL
  //========================================

  $('#decimal').click(function() {
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
  $('#inputDisplay').css("color", "rgba(255, 255, 255, 1.0)");
  phases.calculate = false;

  if (!phases.operator) {
    //if there's already an operator in place, change that operator
    if (/&/.test(toCalc[index.current])) {
      toCalc[index.current] = operator;
    //else, if at initial phase, load a zero and restart function to add operator
    } else if (phases.initial) {
      phases.initial = false;
      phases.operator = true;
      load("0");
      operate(operator);
    }
  } else if (phases.operator && toCalc[index.current] !== "-") {
    //if the number before the operator ends in a decimal point, add a zero at the end
    if (/\.$/.test(toCalc[index.current])) {
      toCalc[index.current] = toCalc[index.current] + "0";
    }
    index.current ++;
    toCalc.push(operator);
    phases.operator = false;
    phases.decimal = true;
    phases.initial = false;
  }

  console.log(toCalc);
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


//========================================
//CALCULATE
//========================================


  const operations = {
    mainOperations: {
      /*math performed on indices in front of and behind the index.current (operator) index,
      then clear operator and reagent*/
      add: function(arr, index) {
        arr[(index-1)] = parseFloat(arr[(index-1)]) + parseFloat(arr[(index+1)]);
        arr.splice(index, 2);
      },

      subtract: function(arr, index) {
        arr[(index-1)] = arr[(index-1)] - arr[(index+1)];
        arr.splice(index, 2);
      },

      multiply: function(arr, index) {
        arr[(index-1)] = arr[(index-1)] * arr[(index+1)];
        arr.splice(index, 2);
      },

      divide: function(arr, index) {
        arr[(index-1)] = arr[(index-1)] / arr[(index+1)];
        arr.splice(index, 2);
      }
    },

    multiplyAndDivide: function(arr, index) {
      if (arr[index] === " &times; ") {
        this.mainOperations.multiply(arr, index);
      } else if (arr[index] === " &divide; ") {
        this.mainOperations.divide(arr, index);
      }
    },

    addAndSubtract: function(arr, index) {
      if (arr[index] === " &minus; ") {
        this.mainOperations.subtract(arr, index);
      } else if (arr[index] === " &plus; ") {
        this.mainOperations.add(arr, index);
      }
    }
  };


  function evaluate(arr) {
    //multiplication and division first
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === " &times; " || arr[i] === " &divide; ") {
        operations.multiplyAndDivide(arr, i);
        i--;
      }
    }

    //after multipication and division are complete, perform addition and subtraction
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === " &minus; " || arr[i] === " &plus; ") {
        operations.addAndSubtract(arr, i);
        i--;
      }
    }
  }


  function evaluateByBlock(array) {
    let start = 0;
    let end = array.length;

    function determineBlockForEvaluation(arr) {
      console.log(start)
      console.log(end)
      let parExists = false;
      (function scanForClosingPar() {
        for (let i = 0; i < arr.length; i++) {
          if (toCalc[i] === " )") {
            end = i;
            parExists = true;
            return true;
          }
        }
      })();

      //console.log(end);
      if (parExists) {
        (function findCorrespondingOpenPar() {
          for (i = end; i > -1; i--) {
            if (arr[i] === "( ") {
              start = i + 1;
              return true;
            }
          }
        })();
      }
      console.log(start);
      console.log(end);
    }

    determineBlockForEvaluation(array);
    let block = array.slice(start, end);
    let lengthToClear = block.length;
    console.log("Block is:")
    console.log(block);

    evaluate(block);
    console.log(block);

    /*set the first value in the toCalc block equal to the result of the evaluated
    block, then clear all other values in the block */
    array[start] = block[0];
    array.splice(start + 1, lengthToClear);
    if (array[start - 1] === "( ") {
      array.splice(start - 1, 1);
    }

    console.log("toCalc at end of evaluateByBlock is:");
    console.log(toCalc);
  }


  function evaluationManager() {
    if (toCalc.length > 1) {
      evaluateByBlock(toCalc);
      evaluationManager();
    } else {
      let calculated = toCalc[0];
      console.log("calculated:");
      console.log(calculated);
      roundAndTrim(calculated);
    }
  }


  function roundAndTrim(input) {
    console.log("input is:");
    console.log(input);
    //Trim answer to seven decimal places and split each digit
    let untrimmed = input.toPrecision(7).toString().split('');
    console.log("untrimmed before trim:");
    console.log(untrimmed);

    //Chop off any zeros at the end of the answer
    (function trim() {
      if (untrimmed[(untrimmed.length-1)] === ".") {
        untrimmed.splice(-1, 1);
        return true;
      } else if (untrimmed[(untrimmed.length-1)] === "0"
      && untrimmed.includes(".")
      && !untrimmed.includes("e")) {
        untrimmed.splice(-1, 1);
        trim();
      }
    })();

    console.log("untrimmed after trim:");
    console.log(untrimmed);


    let answer = untrimmed.join('');
    console.log("answer is:")
    console.log(answer);
    $('#preview').empty();
    toCalc = [answer];
    output = answer.toString();
  }


  function displayCalculation() {
    $('#preview').append(output);
    $('#inputDisplay').css("color", "rgba(255, 255, 255, 0.0)")
    phases.operator = true;
    phases.decimal = true;
    phases.calcComplete = true;
    phases.calculate = false;
    index.current = 0;

    if (/\./.test(output)) {
      phases.decimal = false;
    }
  }


  $('#equals').click(function() {

    //========================================
    //CONDITIONAL EXECUTION
    //========================================

    if (phases.parCount) {
      (function flashParentheses() {

        //determine the indices of unclosed parentheses
        let unclosedParIndices = [];
        (function scanForUnclosed() {
          for (i = 0; i < toCalcForDisplay.length; i++) {
            if (toCalc[i] === "( ") {
              unclosedParIndices.push(i);
            } else if (toCalc[i] === " )") {
              unclosedParIndices.pop();
            }
          }
        })();

        //add class 'unclosed-par' (the "flash") to each open parenthesis
        for (let i = 0; i < toCalcForDisplay.length; i++) {
          if (unclosedParIndices.includes(i)) {
            toCalcForDisplay[i] = "<span class='unclosed-par'>" + toCalcForDisplay[i] + "</span>";

            /*the inline-block display collapses the space after the parenthesis,
            so add in another*/
            if (toCalcForDisplay[i + 1] !== " ") {
              toCalcForDisplay.splice(i + 1, 0, " ");

              //adding that space invalidates all the other indices, so add one to each index
              unclosedParIndices = unclosedParIndices.map(index => index +1);
              i++; //to prevent infinite loop
            }
          }
        }

        console.log(toCalcForDisplay);

        //skeleton of a display function:
        $('#inputDisplay').empty();
        $('#inputDisplay').append(toCalcForDisplay.join(''));

        /*change everything back to normal (but don't display it just yet-- we want
        our animation to finish playing first)*/
        (function resetToCalcForDisplay() {
          for (let i = 0; i < toCalcForDisplay.length; i++) {
            if (toCalcForDisplay[i] === "<span class='unclosed-par'>( </span>") {
              toCalcForDisplay[i] = "( ";
              toCalcForDisplay.splice(i + 1, 1);
              console.log(toCalcForDisplay);
            }
          }
        })();

      })();


    } else if (phases.calculate) {

      console.log(toCalc);
      /*
      If the user calculates the input, we need to determine the "terminal
      calculation" of that input. Having done so, should the user press '=' again
      immediately after performing a calculation, the calculator will display the
      previously calculated value evaluated by this terminal calculation. For
      example:

      '100 - 2 + 6'   ------> terminal calcuation is '+ 6'
      '='             ------> output is 104
      '='             ------> output is 110
      '='             ------> output is 116
      etc.

      */

      (function determineTerminalCalculation() {

        /* "normal" case with no parentheses involved. The last two indices are
        returned */
        if (!isNaN(Number(toCalc.slice(-1)))) {

          terminalCalculation = toCalc.slice(-2);

        //otherwise, if a closing parenthesis is involved:
        } else if (toCalc.slice(-1)[0] === " )") {

          let localParCount = 0;
          let start = 0;
          (function findCorrespondingOpenPar() {
            for (i = toCalc.length - 2; i > -1; i--) {
              if (toCalc[i] === " )") {
                localParCount--;
              } else if (toCalc[i] === "( ") {
                localParCount++;
              }

              if (localParCount > 0) {
                start = i;
                console.log(start);
                return true;
              }
            }
          })();

          if(/&/.test(toCalc[start -1])) {
            terminalCalculation = toCalc.slice(start-1);
          } else {
            terminalCalculation = [];
          }
        }
      })();

      //with the terminal calculation set, simply evaluate as normal:

      evaluationManager();
      displayCalculation();

      /* If the user has just pressed equals, then evaluate again using the previously
      set terminal calculation:*/
    } else if (phases.calcComplete) {

      toCalc = [...toCalc, ...terminalCalculation];

      evaluationManager();
      displayCalculation();

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
