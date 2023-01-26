var operators = ["+", "-", "/", "%", "x", "sin", "cos", "tan"];
var inputInteger = [];
var inputOperator = [];
var prevInput;
var currentOrPrev = false;


//EventHandler to animate all button and play sound
$("button").click(function () {
    var audio = new Audio("kick-bass.mp3");
    audio.play();
    var pressedButton = $(this);
    pressedButton.addClass("pressed");
    setTimeout(function () {
       pressedButton.removeClass("pressed"); 
    }, 200);
});



//EventHandler to print input on screen
$(".print").click(function () {
    var currentTxt = $(".text").text();
   $(".text").text(currentTxt + this.innerHTML);        //concatinating the new and prev text on screen and updating it
   checkInput(this.innerHTML);      //Calling function to store input
});

//EventHandler to change keyboard
$(".advance").click(function () {
    if(this.innerHTML === "Adv"){       //checking if the we are switching to advance
        this.innerHTML = "Sim";
        $(".sin").text("sin");
        $(".cos").text("cos");
        $(".tan").text("tan");
    } else {                            //if we are switchig from advance to simple
        this.innerHTML = "Adv";     
        $(".sin").text("%");
        $(".cos").text("/");
        $(".tan").text("x");
    }
});

//EventHandler to backspace
$(".backSpace").click(function () {
    backspace();
});

//EventHandler to clear screen
$(".clearScreen").click(function () {
    $(".text").text("");        //clearing the screen and all the arrays and variables that store screen data
    inputInteger = [];
    inputOperator = [];
    prevInput = null;
});

//Event for = key to calculate solution
$(".solution").click(function () {
    $(".history").append("<p class='equation'>" + $(".text").text() + "</p>");
    while (inputOperator.length != 0) {
        var op = precedence();
        solution(op);
    }
    if (inputInteger.length === 1) {
        var sol = inputInteger[0];
        $(".text").text(sol);
        $(".history").append("<p>" + $(".text").text() + "</p>");
    }
});



//Function for Backspace
function backspace() {
    var txt = $(".text").text();            //storing current text on screen
    var len = txt.length;                   //storing test length
    if(txt[len-1] === "n" || txt[len-1] === "s"){       //checking if text ends with n or s for sin,cos,tan to erase them at once
        txt = txt.slice(0, len-3);                      //sin,tan and cos have length of 3 so slicing three entries from end 
        inputOperator.pop();                         //poping last stored operator
        //This condition is for after popping sin,cos and tan then we have an integer of arithmetic operator at end
        if (!operators.includes(txt[txt.length-1])) {           //if after poping, new last text is integer
            prevInput = inputInteger[inputInteger.length-1].toString();         //update prevInput to last input
        } else {
            prevInput = inputOperator[inputOperator.length-1];    //if it is an operator except sin,cos,tan than update prevInput
        }
    } else if(operators.includes(txt[len-1])) {           //if end of text is not sin,cos and tan but arithmetic operator
        txt = txt.slice(0, len-1);                      //truncating one entry from screen text
        inputOperator.pop();                            //deleting latest operator
        if(!operators.includes(txt[txt.length-1])) {        //checking if after slicing the new end entry is an integer
            prevInput = inputInteger[inputInteger.length-1].toString();         //changing prevInput to latest integer entry 
        }
    } else {                                    //if end of text is en integer
        var ret = inputInteger.pop().toString();            //deleting latest integer entery but storing it as string in ret
        ret = ret.slice(0, ret.length-1);                   //slicing ret if latest integer is not single e.g 10 or above 
        if(ret.length === 0) {                              //if ret === 0 then it means integer was from 0 to 9
            prevInput = inputOperator[inputOperator.length-1].toString();       //before single integer there was an operator so updating prevInput
        } else {                        //if ret != 0 
            prevInput = ret;            //then integer was above 9 so after slicing store remaining integer e.g 20 after slicing 2    
            inputInteger.push(Number(ret));             //storing that integer
        }
        txt = txt.slice(0, len-1);          //slicing last single entry of screen text
    }
    $(".text").text(txt);                   //Updating screen text with latest text
}




//Function to store the input in operator and integer array separately
function checkInput(input) {                
    if(operators.includes(input)) {             //if input is an operator
        inputOperator.push(input);              //storing it in input operator array
    } else if (!operators.includes(prevInput) && prevInput != null){        //if not operator than it is an integer this case is for integers greater than 9
        prevInput += input;             //concatinating prevInput with new input e.g prevInput = 2, input = 0 then prevInput = 20 
        input = prevInput;              //assigning previnput to input e.g input = prevInput , input = 20
        inputInteger.pop();             //deleteing that single integer e.g 2 to update it to 20
        inputInteger.push(Number(input));       //inserting integer above 9
    } else {                            //for integers form 0 to 9
        inputInteger.push(Number(input));       //saving that single integer
    }
    prevInput = input;          //updating prevInput to latest input
}



//Function to check precedence
function precedence() {
    var currentOp = inputOperator.pop();        //poping last operator
    var preOp = inputOperator.pop();            //poping second last operator
    if(currentOp === "tan" || currentOp === "sin" || currentOp === "cos") {     //sin, cos and tan has highest priority if they are current operator
        currentOrPrev = true;           //tells if current or prev operator is being returned, true for current
        if (preOp != null) {            //if we input sin90 then sin is only operator there is no prevOp so avoiding pushing null
            inputOperator.push(preOp);
        }
        return currentOp;           //returning current operator
    } else if ((currentOp === "+" || currentOp === "-" || currentOp === "x" || currentOp === "/" || currentOp === "%") && (preOp === "tan" || preOp === "sin" || preOp === "cos")) {  //sin, cos and tan has highest priority even if they are at 2nd last position
        currentOrPrev = false;          //tells if current or prev operator is being returned, false for prev
        inputOperator.push(currentOp);      //Prev operator has high precedence so we are using it, no use of current operator so pushing it back
        return preOp;               //returning prev Operator
    } else if ((currentOp === "x" || currentOp === "/") && (preOp === "+" || preOp === "-")) {      //* and / has high precedence than + and -
        currentOrPrev = true;           //tells if current or prev operator is being returned, true for current
        if (preOp != null) {            //if there is no prevOp so avoiding pushing null
            inputOperator.push(preOp);
        }
        return currentOp;               //returning current Operator
    } else if ((currentOp === "+" || currentOp === "-") && (preOp === "x" || preOp === "/")) {      // * and / has high precedence than + and - even if they are prev Operators
        currentOrPrev = false;              //tells if current or prev operator is being returned, false for prev
        inputOperator.push(currentOp);      //Prev operator has high precedence so we are using it, no use of current operator so pushing it back
        return preOp;                       //returning prev Operator
    } else if ((currentOp === "%") && (preOp === "x" || preOp === "/" || preOp === "+" || preOp === "-")) {     // % has high precedence than other arithmetix operators
        currentOrPrev = true;           //tells if current or prev operator is being returned, true for current
        if (preOp != null) {            //if there is no prevOp so avoiding pushing null
            inputOperator.push(preOp);
        }
        return currentOp;               //returning current Operator
    } else if ((preOp === "%") && (currentOp === "+" || currentOp === "-" || currentOp === "x" || currentOp === "/")) {     // % has high precedence than other arithmetix operators even if they are prev
        currentOrPrev = false;          //tells if current or prev operator is being returned, false for prev
        inputOperator.push(currentOp);          //Prev operator has high precedence so we are using it, no use of current operator so pushing it back
        return preOp;                   //returning prev Operator
    } else {                    //in case of + and - or * and / which have same precedence
        currentOrPrev = true;       //tells if current or prev operator is being returned, true for current
        if (preOp != null) {        //if there is no prevOp so avoiding pushing null
            inputOperator.push(preOp);
        }
        return currentOp;           //returning current Operator
    }
}




//Function to calculate solution
function solution(op) {     //Takes input of operator current or prev
    switch (op) {
        case "+":
            var val1 = inputInteger.pop();
            var val2 = inputInteger.pop();
            var ans = val2 + val1;
            inputInteger.push(ans);
            break;
        case "-":
            var val1 = inputInteger.pop();
            var val2 = inputInteger.pop();
            var ans = val2 - val1;
            inputInteger.push(ans);
            break;
        case "x":
            if(!currentOrPrev){         //if op is prev operator than lat integer is of no use because it is prcedene is left associative e.g 5*2+4, * has more precedence than + bat * is between 5 and 2 so 4 is of no use at the moment
                var unchecked = inputInteger.pop();         //we pop last integer e.g 4
                var val1 = inputInteger.pop();          //we pop 2nd last integer e.g 2
                var val2 = inputInteger.pop();          //we pop 3rd last integer e.g 5
                var ans = val2 * val1;                  //we multiply 5 * 2
                inputInteger.push(ans);                 //we push ans e.g 10
                inputInteger.push(unchecked);           //we push unchecked 4 again now integer array has 10 and 4 same logic is applied on every other case
            } else {
                var val1 = inputInteger.pop();
                var val2 = inputInteger.pop();
                var ans = val2 * val1;
                inputInteger.push(ans);
            }
            break;
        case "/":
            if(!currentOrPrev){
                var unchecked = inputInteger.pop();
                var val1 = inputInteger.pop();
                var val2 = inputInteger.pop();
                var ans = val2 / val1;
                inputInteger.push(ans);
                inputInteger.push(unchecked);
            } else {
                var val1 = inputInteger.pop();
                var val2 = inputInteger.pop();
                var ans = val2 / val1;
                inputInteger.push(ans);
            }
            break;
        case "%":
            if (!currentOrPrev) {
                var unchecked = inputInteger.pop();
                var val1 = inputInteger.pop();
                var ans = val1 / 100;
                inputInteger.push(ans);
                inputInteger.push(unchecked);
            } else {
                var val1 = inputInteger.pop();
                var ans = val1 / 100;
                inputInteger.push(ans);
            }
            break;
        case "sin":
            if (!currentOrPrev) {
                var unchecked = inputInteger.pop();
                var val1 = inputInteger.pop();
                var ans = Math.sin((val1 * Math.PI)/180);
                inputInteger.push(ans);
                inputInteger.push(unchecked);
            } else {
                var val1 = inputInteger.pop();
                var ans = Math.sin((val1 * Math.PI)/180);
                inputInteger.push(ans);
            }
            break;
        case "cos":
            if (!currentOrPrev) {
                var unchecked = inputInteger.pop();
                var val1 = inputInteger.pop();
                var ans = Math.cos((val1 * Math.PI)/180);
                inputInteger.push(ans);
                inputInteger.push(unchecked);
            } else {
                var val1 = inputInteger.pop();
                var ans = Math.cos((val1 * Math.PI)/180);
                inputInteger.push(ans);
            }
            break;
        case "tan":
            if (!currentOrPrev) {
                var unchecked = inputInteger.pop();
                var val1 = inputInteger.pop();
                var ans = Math.tan((val1 * Math.PI)/180);
                inputInteger.push(ans);
                inputInteger.push(unchecked);
            } else {
                var val1 = inputInteger.pop();
                var ans = Math.tan((val1 * Math.PI)/180);
                inputInteger.push(ans);
            }
            break;
        default:
            console.log(op);
            break;
    }
}