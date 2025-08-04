import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const ProblemsOnNumbers = () => {
  const [problemType, setProblemType] = useState('sumDigits');
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);

  const problemTypes = [
    { value: 'sumDigits', label: 'Sum of Digits' },
    { value: 'reverse', label: 'Reverse Number' },
    { value: 'isPalindrome', label: 'Check Palindrome' },
    { value: 'isArmstrong', label: 'Check Armstrong Number' },
    { value: 'isPrime', label: 'Check Prime Number' },
    { value: 'factorial', label: 'Calculate Factorial' },
    { value: 'fibonacci', label: 'Check Fibonacci Number' },
    { value: 'isPerfect', label: 'Check Perfect Number' },
    { value: 'countDigits', label: 'Count Digits' },
    { value: 'isHarshad', label: 'Check Harshad Number' }
  ];

  const examples = [
    {
      title: "Sum of Digits",
      problem: "Number = 123",
      formula: "1 + 2 + 3",
      solution: "Sum = 6",
      onTry: () => {
        setNumber('123');
        setProblemType('sumDigits');
      }
    },
    {
      title: "Palindrome Check",
      problem: "Number = 121",
      formula: "121 reversed is 121",
      solution: "Yes, it's a palindrome",
      onTry: () => {
        setNumber('121');
        setProblemType('isPalindrome');
      }
    },
    {
      title: "Armstrong Number",
      problem: "Number = 153",
      formula: "1³ + 5³ + 3³ = 1 + 125 + 27",
      solution: "Sum = 153 → Yes",
      onTry: () => {
        setNumber('153');
        setProblemType('isArmstrong');
      }
    },
    {
      title: "Prime Number Check",
      problem: "Number = 17",
      formula: "No divisors other than 1 and 17",
      solution: "Yes, it's prime",
      onTry: () => {
        setNumber('17');
        setProblemType('isPrime');
      }
    }
  ];

  const solveProblem = (addToHistory) => {
    const num = parseInt(number);
    if (isNaN(num)) {
      alert('Please enter a valid number');
      return;
    }

    const steps = [];
    let resultObj = { type: '' };

    switch (problemType) {
      case 'sumDigits': {
        const digits = Math.abs(num).toString().split('').map(Number);
        const sum = digits.reduce((acc, digit) => acc + digit, 0);
        steps.push(`Digits: ${digits.join(', ')}`);
        steps.push(`Calculation: ${digits.join(' + ')} = ${sum}`);
        resultObj = {
          type: 'Sum of Digits',
          calculation: digits.join(' + '),
          result: sum
        };
        break;
      }

      case 'reverse': {
        const reversed = parseInt(Math.abs(num).toString().split('').reverse().join('')) * Math.sign(num);
        steps.push(`Original: ${num}`);
        steps.push(`Reversed: ${reversed}`);
        resultObj = {
          type: 'Reversed Number',
          result: reversed
        };
        break;
      }

      case 'isPalindrome': {
        const str = Math.abs(num).toString();
        const isPal = str === str.split('').reverse().join('');
        steps.push(`Original: ${str}`);
        steps.push(`Reversed: ${str.split('').reverse().join('')}`);
        steps.push(`Is palindrome? ${isPal ? 'Yes' : 'No'}`);
        resultObj = {
          type: 'Palindrome Check',
          result: isPal ? 'Yes' : 'No',
          original: str,
          reversed: str.split('').reverse().join('')
        };
        break;
      }

      case 'isArmstrong': {
        const armStr = Math.abs(num).toString();
        const armDigits = armStr.split('').map(Number);
        const armSum = armDigits.reduce((sum, digit) => {
          return sum + Math.pow(digit, armStr.length);
        }, 0);
        const isArm = armSum === Math.abs(num);
        steps.push(`Digits: ${armDigits.join(', ')}`);
        steps.push(`Calculation: ${armDigits.map(d => `${d}^${armStr.length}`).join(' + ')}`);
        steps.push(`Sum: ${armSum}`);
        steps.push(`Is Armstrong number? ${isArm ? 'Yes' : 'No'}`);
        resultObj = {
          type: 'Armstrong Number Check',
          calculation: armDigits.map(d => `${d}^${armStr.length}`).join(' + '),
          result: isArm ? 'Yes' : 'No',
          sum: armSum
        };
        break;
      }

      case 'isPrime': {
        if (num < 2) {
          resultObj = {
            type: 'Prime Number Check',
            result: 'No',
            explanation: 'Numbers less than 2 are not prime'
          };
          break;
        }
        let isPrime = true;
        const limit = Math.sqrt(num);
        steps.push(`Checking divisors up to ${Math.floor(limit)}`);
        for (let i = 2; i <= limit; i++) {
          if (num % i === 0) {
            isPrime = false;
            steps.push(`Divisible by ${i} → Not prime`);
            break;
          }
          steps.push(`Not divisible by ${i}`);
        }
        resultObj = {
          type: 'Prime Number Check',
          result: isPrime ? 'Yes' : 'No',
          explanation: isPrime ? 'No divisors other than 1 and itself' : 'Has divisors other than 1 and itself'
        };
        break;
      }

      case 'factorial': {
        if (num < 0) {
          resultObj = {
            type: 'Factorial Calculation',
            result: 'Undefined',
            explanation: 'Factorial is not defined for negative numbers'
          };
          break;
        }
        let factorial = 1;
        steps.push(`Calculating ${num}!`);
        for (let i = 2; i <= num; i++) {
          factorial *= i;
          steps.push(`${i} × ${factorial / i} = ${factorial}`);
        }
        resultObj = {
          type: 'Factorial Calculation',
          result: factorial,
          calculation: Array.from({ length: num }, (_, i) => i + 1).join(' × ')
        };
        break;
      }

      case 'fibonacci': {
        const isPerfectSquare = (x) => {
          const s = Math.sqrt(x);
          return s * s === x;
        };
        const isFib = isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
        steps.push(`Checking if ${num} is a Fibonacci number`);
        steps.push(`5 × ${num}² + 4 = ${5 * num * num + 4} (perfect square? ${isPerfectSquare(5 * num * num + 4)})`);
        steps.push(`5 × ${num}² - 4 = ${5 * num * num - 4} (perfect square? ${isPerfectSquare(5 * num * num - 4)})`);
        resultObj = {
          type: 'Fibonacci Number Check',
          result: isFib ? 'Yes' : 'No',
          explanation: isFib ? 'Satisfies Fibonacci number property' : 'Does not satisfy Fibonacci number property'
        };
        break;
      }

      case 'isPerfect': {
        if (num <= 0) {
          resultObj = {
            type: 'Perfect Number Check',
            result: 'No',
            explanation: 'Perfect numbers are positive integers'
          };
          break;
        }
        let perfectSum = 1;
        steps.push(`Proper divisors of ${num}: 1`);
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            const complement = num / i;
            perfectSum += i;
            if (i !== complement) perfectSum += complement;
            steps.push(`Found divisors: ${i}${i !== complement ? ` and ${complement}` : ''}`);
          }
        }
        const isPerfect = perfectSum === num && num !== 1;
        steps.push(`Sum of proper divisors: ${perfectSum}`);
        steps.push(`Is perfect number? ${isPerfect ? 'Yes' : 'No'}`);
        resultObj = {
          type: 'Perfect Number Check',
          result: isPerfect ? 'Yes' : 'No',
          sum: perfectSum,
          explanation: isPerfect ? 'Sum of proper divisors equals the number' : 'Sum of proper divisors does not equal the number'
        };
        break;
      }

      case 'countDigits': {
        const digitCount = Math.abs(num).toString().length;
        steps.push(`Number: ${Math.abs(num)}`);
        steps.push(`Digit count: ${digitCount}`);
        resultObj = {
          type: 'Digit Count',
          result: digitCount,
          number: Math.abs(num)
        };
        break;
      }

      case 'isHarshad': {
        if (num === 0) {
          resultObj = {
            type: 'Harshad Number Check',
            result: 'No',
            explanation: '0 cannot be a Harshad number'
          };
          break;
        }
        const absNum = Math.abs(num);
        const digitSum = absNum.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const isHarshad = absNum % digitSum === 0;
        steps.push(`Digit sum: ${digitSum}`);
        steps.push(`${absNum} ÷ ${digitSum} = ${absNum / digitSum}`);
        steps.push(`Remainder: ${absNum % digitSum}`);
        steps.push(`Is Harshad number? ${isHarshad ? 'Yes' : 'No'}`);
        resultObj = {
          type: 'Harshad Number Check',
          result: isHarshad ? 'Yes' : 'No',
          digitSum: digitSum,
          explanation: isHarshad ? 'Number is divisible by the sum of its digits' : 'Number is not divisible by the sum of its digits'
        };
        break;
      }

      default:
        break;
    }

    setResult(resultObj);
    setCalculationSteps(steps);

    addToHistory({
      description: `${resultObj.type} for ${num}`,
      result: `Result: ${resultObj.result}`
    });
  };

  return (
    <CalculatorBase
      title="Number Problems Calculator"
      description="Solve various number theory problems including digit sums, palindromes, prime checks, and more."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Problem Type:</label>
            <select
              value={problemType}
              onChange={(e) => setProblemType(e.target.value)}
              className="problem-selector"
            >
              {problemTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Enter Number:</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 123, 153, 17, etc."
              className="number-input"
            />
          </div>

          <button onClick={() => solveProblem(addToHistory)} className="calculate-btn">
            Solve Number Problem
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p>Type: <strong>{result.type}</strong></p>
              {result.calculation && <p>Calculation: <strong>{result.calculation}</strong></p>}
              {result.explanation && <p>Explanation: <strong>{result.explanation}</strong></p>}
              <p>Result: <strong>{result.result}</strong></p>
              {result.sum && <p>Sum: <strong>{result.sum}</strong></p>}
              {result.digitSum && <p>Digit Sum: <strong>{result.digitSum}</strong></p>}
              {result.original && result.reversed && (
                <p>Original: <strong>{result.original}</strong>, Reversed: <strong>{result.reversed}</strong></p>
              )}
              {calculationSteps.length > 0 && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {calculationSteps.map((step, index) => (
                    <p key={index} className="step">{step}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default ProblemsOnNumbers;
