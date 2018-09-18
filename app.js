$(document).ready(function() {

  var parOpen = true;
  var output = '0';
  var toCalc = [];

  var states = {
    initial: true,
    operator: false,
    calculate: false,
    calcComplete: false,
    decimal: true
  }

  var current = 0;

  $('#output').append(output);

  function clear() {
    parOpen = true;
    $('#output').empty();
    output = "0";
    $('#output').append(output);
    toCalc = [];
    current = 0;
  }

  $('#clear').click(function() {
    clear();
    states.operator = false;
  });

  function display(value) {
    $('#output').empty();
    if (output === '0') {
      output = value;
    } else {
      output += value;
    }
    $('#output').append(output);
  }

  function load(integer) {
    //if a calculation has just been performed, clear it and start a new array
    if (states.calcComplete) {
      clear();
      states.calcComplete = false;
    }
    //if index 'current' doesn't exist, push a new array with integer inside
    //else, push integer into existing array
    if (!toCalc[current]) {
      toCalc.push([integer]);
    } else {
      toCalc[current].push(integer);
    }
    console.log(toCalc);
  }

  function operate(operator) {
    current += 2;
    toCalc.push(operator);
    states.operator = false;
    states.decimal = true;
    console.log(toCalc);
  }

  //========================================
  //INTEGERS
  //========================================

  $("#1").click(function() {
    states.operator = true;
    load(1);
    display("1");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#2").click(function() {
    states.operator = true;
    load(2);
    display("2");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#3").click(function() {
    states.operator = true;
    load(3);
    display("3");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#4").click(function() {
    states.operator = true;
    load(4);
    display("4");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#5").click(function() {
    states.operator = true;
    load(5);
    display("5");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#6").click(function() {
    states.operator = true;
    load(6);
    display("6");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#7").click(function() {
    states.operator = true;
    load(7);
    display("7");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#8").click(function() {
    states.operator = true;
    load(8);
    display("8");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#9").click(function() {
    states.operator = true;
    load(9);
    display("9");
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });

  $("#0").click(function() {
    states.operator = true;
    if (output !== '0') {
      load(0);
      $('#output').empty();
      output += '0';
      $('#output').append(output);
    }
    if (toCalc.length > 2) {
      states.calculate = true;
    }
  });



  $('#parentheses').click(function() {
    if (parOpen) {
      parOpen = false;
      display("(");
    } else {
      parOpen = true;
      display(")");
    }
  });

  $('#percent').click(function() {
    display('&percnt;');
  });

  $('#point').click(function() {
    if (states.decimal) {
      $('#output').empty();
      output += ".";
      $('#output').append(output);
      load(".");
      states.decimal = false;
    }
  });

//========================================
//OPERATORS
//========================================


  $('#divide').click(function() {
    states.calcComplete = false;
    if(states.operator) {
      display(' &divide; ');
      operate('divide');
    }
  });

  $('#times').click(function() {
    states.calcComplete = false;
    if(states.operator) {
      display(' &times; ');
      operate('times');
    }
  });

  $('#minus').click(function() {
    states.calcComplete = false;
    if(states.operator) {
      display(' &minus; ');
      operate('minus');
    }
  });

  $('#plus').click(function() {
    states.calcComplete = false;
    if(states.operator) {
      display(' &plus; ');
      operate('plus');
    }
  });



  $('#equals').click(function() {
    if (states.calculate) {
      for (i = 0; i < toCalc.length; i ++) {
        if (Array.isArray(toCalc[i])) {
          toCalc[i] = toCalc[i].join('');
        }
      }
      console.log(toCalc);

      for (i = 0; i < toCalc.length; i ++) {
        if (toCalc[i] === "times" || toCalc[i] === "divide") {
          if (toCalc[i] === "times") {
            toCalc[(i-1)] = toCalc[(i-1)] * toCalc[(i+1)];
            toCalc.splice(i, 2);
            i--;
          } else if (toCalc[i] === "divide") {
            toCalc[(i-1)] = toCalc[(i-1)] / toCalc[(i+1)];
            toCalc.splice(i, 2);
            i--;
          }
        }
      }

      for (i = 0; i < toCalc.length; i ++) {
        if (toCalc[i] === "minus" || toCalc[i] === "plus") {
          if (toCalc[i] === "minus") {
            toCalc[(i-1)] = toCalc[(i-1)] - toCalc[(i+1)];
            toCalc.splice(i, 2);
            i--;
          } else if (toCalc[i] === "plus") {
            toCalc[(i-1)] = parseFloat(toCalc[(i-1)]) + parseFloat(toCalc[(i+1)]);
            toCalc.splice(i, 2);
            i--;
          }
        }
      }

    console.log(toCalc);

    var untrimmed = toCalc[0].toPrecision(7).toString().split('');

    function trim() {
      if (untrimmed[(untrimmed.length-1)] === 0) {
        untrimmed.splice(-1, 1);
        trim();
      }
    }

    var answer = parseFloat(untrimmed.join(''));
    $('#output').empty();
    output = answer;
    toCalc = [[answer]];
    $('#output').append(output);
    states.operator = true;
    states.decimal = true;
    states.calcComplete = true;
    states.calculate = false;
    current = 0;
  }


  });


});
