$(document).ready(function() {


  var output = '0';
  var toCalc = [''];

  var phases = {
    initial: true,
    operator: false,
    calculate: false,
    calcComplete: false,
    decimal: true,
    //parentheses
    parHasBeenOpened: false,
    parOperatorAdded: false,
    parCanClose: false,
    openParCount: 0,
  }

  var current = 0;

  $('#output').append(output);

  function clear() {
    $('#output').empty();
    output = "0";
    $('#output').append(output);
    toCalc = [''];
    current = 0;
    phases.calcComplete = false;
  }

  $('#clear').click(function() {
    clear();
    phases.operator = false;
  });


  function display() {
    $('#output').empty();
    $('#output').append(toCalc.join(''));
  }

  function load(value) {
    console.log(phases.calcComplete);
    //if a calculation has just been performed, clear it and start a new array
    if (phases.calcComplete) {
      clear();
    }

    //if current index is NaN (i.e. if it's an operator), begin a new array
      //index UNLESS IT'S A NEGATIVE SIGN
    if (toCalc[current] && isNaN(Number(toCalc[current])) && toCalc[current] != "-") {
      current++;
      toCalc.push('');
    }

    console.log(toCalc);

    //if the current index is falsy (an empty string or zero), and it's also not
      //a negative sign or a decimal point it now equals value
    if (!Number(toCalc[current]) && toCalc[current] != "-" && toCalc[current] != "0.") {
      toCalc[current] = value;
    //otherwise, concatenate
    } else {
      toCalc[current] = toCalc[current] + value;
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
    if (toCalc[current] != "0") {
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
    if (isNaN(Number(toCalc[current]))) {
      current++;
    }

    if (toCalc[current] != "0") {
      if(!toCalc[current]) {
        load("-");
      } else {
        var negRegex = /^-/;
        if (negRegex.test(toCalc[current])) {
          toCalc[current] = toCalc[current].toString().split('');
          toCalc[current].shift();
          toCalc[current] = toCalc[current].join('');
        } else {
          toCalc[current] = toCalc[current].toString().split('');
          toCalc[current].unshift("-");
          toCalc[current] = toCalc[current].join('');
        }
      }
    }
    console.log(toCalc);
    display();
  })


  $('#parentheses').click(function() {
    // if user selects parentheses immmediately after a calculation, start multiplication
    if (phases.calcComplete) {
      phases.calcComplete = false;
      operate(' &times; ');
      current++;
      toCalc.push("( ");
      phases.parHasBeenOpened = true;
      phases.openParCount ++;
    }

    // if after operator, push open parentheses
    if (/&/.test(toCalc[current])) {
      current++;
      toCalc.push("( ")
      phases.openParCount ++;
    }

    //PSEUDOCODE INCOMING
    /*
    5 => 5, x, (
    -, => -1, x, (
    5, x => 5, x, (
    5., => 5.0, x, (
    5.5 => 5.5, x, (
    (, 5 => (, 5, x, (         ----- parCount but no operator
    (, 5, x => (, 5, x, (         -----parCount with operator only
    (, 5, x, 5 => (, 5, x, 5, )   ---------parCount with operator and number
    (, (, 5, x, 5, ) => (, (, 5, x, 5, ) -------parCount, prev is )
    (, => ------parCount, prev is (
    (, 5, x, 5, ) => (, 5, x, 5, ), x, ( ----------- !parCount, prev is )
    (, (, 5, x, 5, ), x, 5 =>  ------------ parCount, prev is number
    */
    //END PSEUDOCODE
    console.log(toCalc);
    display();
  });


  $('#backspace').click(function() {
    phases.calcComplete = false;
    //if there is only one number left in the entire array, make it a zero
    //if that number is already a zero, ABORT MISSION
    if (toCalc[0] == "0" && current == 0){
      return false;
    } else if (toCalc[current].length == 1 && current === 0) {
      toCalc[current] = "0";
      display();
      return false;
    }

    //if you delete a decimal point, make it so you can add one back in again
    if (toCalc[current].substr(-1, 1) == ".") {
      phases.decimal = true;
    }

    //if current index is an HTML entity (an operator), remove the entire index
    //and make it so you can't add another decimal point to the number before
      //the operator, should a decimal point already exist
    if (/&/.test(toCalc[current])) {
      if (/\./.test(toCalc[current-1])) {
        phases.decimal = false;
      }
      toCalc.pop();
      current--;
      phases.operator = true;
    } else {
      toCalc[current] = toCalc[current].substring(0, toCalc[current].length - 1);
      if (toCalc[current] === "" && toCalc.length > 1){
        toCalc.pop();
        current--;
        phases.operator = false;
      }
    }

    console.log(toCalc);
    display();
  });


  $('#point').click(function() {
    function loadDecimal() {
      console.log(current);
      console.log(phases.decimal);
      if (isNaN(Number(toCalc[current])) && toCalc[current] != "-" && toCalc[current] != "") {
        current++;
      }

      //if a calculation has been completed and the answer already has a
        //decimal point, disable adding anothing decimal point
      if (phases.calcComplete) {
        if (/\./.test(toCalc[0].toString())) {
          phases.decimal = false;
        }
      }

      if (phases.decimal) {
        if (toCalc[current] || toCalc[current] == "0") {
          toCalc[current] = toCalc[current] + ".";
        } else if (toCalc[current] == "-" || toCalc[current] == '') {
          toCalc[current] = toCalc[current] + "0."
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
  if (!phases.operator) {
    toCalc[current] = operator;
  } else {
    //if the number before the operator ends in a decimal point, add a zero at the end
    if (/\.$/.test(toCalc[current])) {
      toCalc[current] = toCalc[current] + "0";
    }
    current ++;
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
        //math performed on indices in front of and behind the current (operator) index
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



    if (phases.calculate) {

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
    current = 0;
  }


  });

});
