import React, { Component } from 'react'
import "../styles/Calculator.css";

class Operators extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      operators: {
        clear: "",
        add: {
          class: "fas fa-plus",
          symbol: "+"
        },
        subtract: {
          class: "fas fa-minus",
          symbol: "-"
        },
        multiply: {
          class: "fas fa-times",
          symbol: "*"
        },
        divide: {
          class: "fas fa-divide",
          symbol: "/"
        },
        equals: {
          symbol: "="
        }
      }
    }
  }
  
  render() {
    const { operators } = this.state;
    const { clear, processInput } = this.props;
    return (
      <div id="operators">
        {
          Object.keys(operators).map(operator => {
            if (operator === "clear") {
              return <button key={operator} onClick={clear} id="clear" className="operator">Clear</button>;
            } 
            else if (operator === "equals") {
              return <button key={operator} onClick={() => processInput(operators[operator].symbol, 'operator')} id={operator} className="operator">=</button>;
            } 
            else {
              return (
                <button id={operator} className="operator"
                  key={operator}
                  onClick={() => processInput(operators[operator].symbol, 'operator')}>
                  <i className={operators[operator].class}></i>
                </button>
              );
            }
          })
        }
      </div>
    );
  }
}

class Operands extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      operands: {
        seven: 7,
        eight: 8,
        nine: 9,
        four: 4,
        five: 5,
        six: 6,
        one: 1,
        two: 2,
        three: 3,
        zero: 0,
        decimal: '.'
      }
    }
  }
  
  render() {
    const { operands } = this.state;
    const { processInput } = this.props;
    
    return (
      <div id="operands">
        {
          Object.keys(operands).map(operand => {
            return (
              <button id={operand} className="operand"
                key={operand}
                onClick={() => processInput(operands[operand], 'operand')}>
                {operands[operand]}
              </button>
            );
          })
        }
      </div>
    );
  }
}

const Display = (props) => {
  return (
    <div id="calculator-display">
      {props.output}
    </div>
  );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      input: [],
      output: "0",
      lastInputType: "",
      result: ""
    }
    
    this.clearCalculator = this.clearCalculator.bind(this);
    this.processInput = this.processInput.bind(this);
    this.processOperand = this.processOperand.bind(this);
    this.processOperator = this.processOperator.bind(this);
    this.calculate = this.calculate.bind(this);
  }
  
  clearCalculator() {
    this.setState({
      input: [],
      output: "0",
      lastInputType: "",
      result: ""
    })
  }
  
  processInput(value, type) {
    // Check if operand or operator
    if (type === 'operand') {
      this.processOperand(value);
    } 
    else if (type === 'operator') {
      this.processOperator(value);
    }
  }
  
  processOperand(value) {
    const { lastInputType } = this.state;
    
    if (lastInputType === "operand") {
      let input = this.state.input;
      let lastValue = input[input.length-1];
      
      if (lastValue === "0" && lastValue.length === 1
          && value === 0) 
        return;
      
      if (value === "." && lastValue.includes("."))
        return;
      
      input[input.length-1] += `${value}`;
      
      if (!input[input.length-1].includes(".")) {
        let parsedVal = parseInt(input[input.length-1]);
        input[input.length-1] = `${parsedVal}`;
      }
      
      this.setState({
        input: input,
        output: input[input.length-1]
      });
    } else {
      if (this.state.input.length === 0 && value === ".")
        return;
      
      this.setState({
        input: [...this.state.input, `${value}`],
        output: value
      })
    } 
    
    this.setState({
      lastInputType: "operand"
    })
  }
  
  processOperator(value) {
    if (value === "=") {
      this.calculate();
    } else {
      let input = this.state.input;
      let operations = ["+", "-", "*", "/"];
      
      let lastValue = input[input.length - 1];
      let secondLastValue = input[input.length - 2];
      
     if (this.state.lastInputType === "operator") {
       if (lastValue === "-") {
         if (operations.includes(secondLastValue)) {
           input.pop();
           input.pop();
           input.push(value);
         } else {
           input.pop();
           input.push(value);
         }
       } else {
         if (value === "-") {
           input.push(value);
         } else {
           input.pop();
           input.push(value);
         }
       }
     } else {
       input.push(value);
     }
      
      this.setState({
        input: input,
        output: value,
        lastInputType: "operator"
      })
    }
  }
  
  calculate() {
    let input = this.state.input;
    let operations = { 
      add: "+",
      subtract: "-",
      multiply: "*",
      divide: "/"
    };
    
    let inputArr = input.map(item => {
      if (Object.keys(operations).includes(item)) {
        return operations[item];
      } else {
        return item;
      }
    })
    
    let result = eval(inputArr.join(""));
    
    this.setState({
      result: result,
      output: result,
      input: [`${result}`],
      lastInputType: ""
    })
  }
  
  render() {
    return (
      <div id="calculator">
        <Display output={this.state.output} />
        <Operands processInput={this.processInput} />
        <Operators clear={this.clearCalculator} processInput={this.processInput} />
      </div>
    );
  }
}

export default Calculator
