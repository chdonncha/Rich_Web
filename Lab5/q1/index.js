import {Observable} from 'rxjs/Rx';

var Rx = require('rxjs/Rx');


function calculator() {

    // use a constant to allow for index lookup. In the event
    // an index value is changed this saves having to change it in multiple places.
    const STYLE_FLEX_CONTAINER = "flex-container";
    const STYLE_FLEX_ITEM = "flex-item";
    const STYLE_INPUT_TEXT = "input-text";
    const STYLE_BUTTON = "button";
    const STYLE_CALCULATOR = "calculator";

    var calculatorStyles = {
        "flex-container":
        {
            "display": "inline-flex",
            "flex-flow": "row wrap",
            "justify-content": "space-between"
        },
        "flex-item": {
            "text-align": "center",
            "padding": ".5em",
            "font-size": "1em",
            "flex-grow": "1",
            "margin": "0 5px 5px 0"
        },
        "input-text":
        {
            "font-size": "2em",
            "text-align": "right",
            "border-radius": "5px",
            "width": "240px",
            "height": "35px",
            "margin-bottom": "10px",
            "padding": "1%"
        },
        "button": {
            "font-size": "1.1em",
            "border-radius": "5px",
            "width": "50px"
        },
        "calculator": {
            "width": "250px",
            "font-size": "100%",
            "border": "1px solid black",
            "padding": "10px",
            "border-radius": "7px",
            "margin-left": "auto",
            "margin-right": "auto",
            "font-family": "Verdana"
        }
    };
    // The display of the equation.
    var displayInput;
    // The symbols we will use in association with the buttons.
    var buttonSymbols = [
        '(', ')', '±', '÷', '7', '8', '9',
        'x', '4', '5', '6', '-', '1', '2',
        '3', '+', '0', '.', 'C', '='
    ];
    // The key transformation of calculator symbols. 
    // Note I is for inverse.
    var keyboardSymbols = [
        '(', ')', 'I', '/', '7', '8', '9',
        '*', '4', '5', '6', '-', '1', '2',
        '3', '+', '0', '.', 'C', '='
    ];
    // Allow only once per in between numbers
    var operators = [
        '±', '÷', '-', '*', '+', '.', 'C', '=', '/'
    ];
    // Since styles are stored in a style array we use this as a lookup to get the style
    // from that array. This return an array with all the style properties and their values.
    // For example array index "width" could equal 250px. "width" in this example is the index
    // and 250px is the value.
    function getStyle(id) {
        if (calculatorStyles.hasOwnProperty(id)) {
            return calculatorStyles[id];
        }
        return null;
    }
    // Helper function to easily add styles to an element.
    function setStyle(element, styleId) {
        var style = getStyle(styleId);
        for (var index in style) {
            // iterate through the array and use the index to find the value as well as the style.
            if (style.hasOwnProperty(index)) {
                element.style[index] = style[index];
            }
        }
    }
    // Helper function to easily add attributes to an element.
    function setAttributes(element, attributes) {
        for (var index in attributes) {
            if (attributes.hasOwnProperty(index)) {
                element.setAttribute(index, attributes[index]);
            }
        }
    }
    // Helper function to easily create elements with styles and attributes.
    function createElement(tag, styleIds, attributes) {
        var element = document.createElement(tag);
        setStyle(element, styleIds);
        setAttributes(element, attributes);
        return element;
    }

    this.generateCalculator = function (parentElement) {
        // Create the container for our calculator
        var calculatorContainer = createElement("div", STYLE_CALCULATOR, { "id": "calculator" });
        // Create the input place holder text
        displayInput = createElement("input", STYLE_INPUT_TEXT, { "type": "text", "placeholder": "0", "disabled": "" });
        var flexContainer = createElement("div", STYLE_FLEX_CONTAINER, { "class": "flex-container" });

        // Add the previous two elements. Add the calculator container to the parent element
        // which in the context of this assesement will always be body but this allows for reuse in actual production code.
        // and add the placeholder text to the container.
        parentElement.appendChild(calculatorContainer);
        calculatorContainer.appendChild(displayInput);
        calculatorContainer.appendChild(flexContainer);


        var keyDowns = Rx.Observable.fromEvent(document, 'keypress').map(resolveKey);

        var buttonEvents = generateButtons(keyDowns, flexContainer);

        var stream = Rx.Observable
            .merge(keyDowns);

        for (var index in buttonEvents) {
            stream = stream.merge(buttonEvents[index]);
        }

        stream
            .subscribe(function (e) {
                try {
                    handleSymbolEvent(e);
                } catch (e) {
                    console.log("invalid operation");
                }
            });

        // No longer using key pressed events using RxJS instead
        //document.addEventListener('keypress', keyPressedEvent);

    };

    function resolveKey(event) {
        var keyChar = String.fromCharCode(event.charCode);
        // To upper case in the event of 'C'. A lower case c won't work the same way.
        // and rather than adding code to deal with that we can just force all alphabetical characters to uppercase.
        keyChar = keyChar.toUpperCase();
        return keyChar;
    }

    function handleSymbolEvent(symbol) {
        if (isValidButtonSymbol(symbol) || isValidKeyboardSymbol(symbol)) {
            switch (symbol) {
                case 'x':
                    addOperatorToDisplay('*');;
                    break;
                case '÷':
                    addOperatorToDisplay('/');;
                    break;                            
                case '=':
                    evaluateDisplay();
                    break;
                case 'C':
                    resetDisplay();
                    break;
                case 'I':
                case '±':
                    inverseDisplay();
                    break;
                default:
                    if (isOperator(symbol)) {
                        addOperatorToDisplay(symbol);
                    } else {
                        addNumberToDisplay(symbol);
                    }
                    break;
            }
        }
    }

    // Create all the buttons for the calculator. Create a button for every symbol.
    function generateButtons(eventContainer, parentElement) {
        var evnts = new Array();

        for (var index in buttonSymbols) {
            // create an element with the button style.
            var element = createElement("button", STYLE_BUTTON, { "class": "flex-item" });
            setStyle(element, STYLE_FLEX_ITEM);
            // Set the text of the element i.e. the button symbol.
            //console.log(calculatorSymbols[index]);
            element.innerHTML = buttonSymbols[index];
            // add the element to the parent i.e. the container.
            var evnt = assignButtonFunctionality(element);
            evnts.push(evnt);
            parentElement.appendChild(element);
        }
        return evnts;
    }

    // One time call to assign responsibilities to each specific button. 
    // We check what each button should do and assign it a specific function appropriate to it.
    function assignButtonFunctionality(button) {

        var value = button.innerHTML.toString();

        if (!isValidButtonSymbol(value)) {
            console.log("invalid symbol: " + value);
            return;
        }
        var buttonEvent = Rx.Observable.fromEvent(button, 'click').map(function () { return value; });
        return buttonEvent;
    }

    // Adds an operator to the display input. This checks the current state of the equation and will only add the request operator if allowed.
    function addOperatorToDisplay(operator) {
        var lastChar = displayInput.value[displayInput.value.length - 1];

        // If the last character is already a binary operator, don't add another.
        if (!isOperator(lastChar)) {
            displayInput.value += operator;
        }
    }
    // Adds a number to the display input. 
    function addNumberToDisplay(number) {
        displayInput.value += number;
    }

    function isOperator(character) {
        return operators.indexOf(character) !== -1;
    }
    // Checks if the given symbol is a valid symbol for use with button events.
    function isValidButtonSymbol(symbol) {
        return buttonSymbols.indexOf(symbol) !== -1;
    }
    // Checks if the given symbol is a valid keyboard symbol for use with keyboard events.
    function isValidKeyboardSymbol(symbol) {
        return keyboardSymbols.indexOf(symbol) !== -1;
    }
    // Resets the display to a blank value.
    function resetDisplay() {
        displayInput.value = '';
    }
    // Evaluates the equation within display input and display the output within display input.
    function evaluateDisplay() {
        var value = parseEquation(displayInput.value);
        displayInput.value = value;
    }
    function inverseDisplay() {
        var inversed = "-(" + displayInput.value + ")";
        displayInput.value = inversed;
    }
    // Takes and equation and solves it.
    function parseEquation(inputString) {
        var equation = inputString;

        // First evaluate everything within the brackets
        while (true) {
            // Get the first equation within the brackets.
            var withinBrackets = subStringWithinBrackets(equation);
            // If no sub equation exists just break from the loop and solve.
            if (withinBrackets[0].length > 0) {
                var evaluatedWithin = parseEquation(withinBrackets[0]);
                equation = replaceBetween(equation, withinBrackets[1] - 1, withinBrackets[2] + 1, evaluatedWithin);
            } else {
                // Break the loop if no other brackets were found.
                // Specifically use break in an infinite loop so we do not
                // have to setup code outside the loop to do the same thing we are doing within the loop.
                // This would just cause repeating code and would be less manageable.
                break;
            }
        }

        var evaluatedEquation = eval(equation, 0, equation.length - 1);
        return evaluatedEquation;
    }
    // Gets a substring within the brackets.
    // Returns an array in the form of
    // 0 - the substring. Will be length 0 is no appropriate string is found.
    // 1 - from the original string this is the index of the opening bracket.s
    // 2 - from the original string this is the index of the closing bracket.
    function subStringWithinBrackets(string) {
        // find the first occurence of an opening bracket.
        var startIndex = string.indexOf('(') + 1;
        var endIndex = 0;
        var openBracketCount = 0;

        for (var i = startIndex; i < string.length; i++) {
            // If we find another opening bracket increase the open bracket count
            // meaning we now have to find another closing bracket before we can find
            // the initial bracket's closing bracket.
            if (string[i] === '(') {
                openBracketCount++;
            }
            else if (string[i] === ')') {
                // We found a closing bracket but we already have another open bracket.
                // This closing bracket cannot be associated with our first one but we
                // can subtract the amount of closing brackets left to find.
                if (openBracketCount > 0) {
                    openBracketCount--;
                } else {
                    // No open brackets left, this is the end ouf our brackets.
                    endIndex = i;
                    break;
                }
            }
        }
        var substring = string.substring(startIndex, endIndex);
        return [substring, startIndex, endIndex];
    }

    // Replace the string from a start and an end index. Found on stack overflow and modified.
    //http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
    function replaceBetween(string, start, end, replaceWith) {
        return string.substring(0, start) + replaceWith + string.substring(end);
    }
}

(function () {

    // Create a calculator on page load. Encapsulating the calculator as an object allows us to easily
    // create and associate it with an element.
    var calc = new calculator();
    var body = document.querySelector('body');
    calc.generateCalculator(body);
})();