import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const PermutationCombinationCalculator = () => {
  const [inputs, setInputs] = useState({
    n: '',
    r: '',
    withRepetition: false,
    items: '',
    selectedItems: ''
  });
  const [result, setResult] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [calcType, setCalcType] = useState('permutation');

  const examples = [
    {
      title: "Basic Permutation",
      problem: "5 items taken 2 at a time",
      formula: "P(5,2) = 5! / (5-2)!",
      solution: "20 arrangements",
      onTry: () => {
        setCalcType('permutation');
        setInputs({...inputs, n: '5', r: '2'});
      }
    },
    {
      title: "Basic Combination",
      problem: "5 items taken 2 at a time",
      formula: "C(5,2) = 5! / (2! × (5-2)!)",
      solution: "10 combinations",
      onTry: () => {
        setCalcType('combination');
        setInputs({...inputs, n: '5', r: '2'});
      }
    },
    {
      title: "Permutation with Repetition",
      problem: "3 items with repetition",
      formula: "n^r = 3^2",
      solution: "9 arrangements",
      onTry: () => {
        setCalcType('permutation');
        setInputs({...inputs, n: '3', r: '2', withRepetition: true});
      }
    }
  ];

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculate = (addToHistory) => {
    const steps = [];
    let resultObj = { type: '' };

    try {
      const n = parseInt(inputs.n);
      const r = parseInt(inputs.r);

      if (isNaN(n) || isNaN(r)) {
        throw new Error('Please enter valid numbers for n and r');
      }

      if (n < r) {
        throw new Error('n must be greater than or equal to r');
      }

      if (n < 0 || r < 0) {
        throw new Error('Values must be non-negative');
      }

      steps.push(`Calculation Type: ${calcType === 'permutation' ? 'Permutation' : 'Combination'}`);
      steps.push(`Total items (n): ${n}`);
      steps.push(`Selected items (r): ${r}`);
      steps.push(`Repetition allowed: ${inputs.withRepetition ? 'Yes' : 'No'}`);

      if (calcType === 'permutation') {
        if (inputs.withRepetition) {
          const p = Math.pow(n, r);
          steps.push(`Permutation with repetition formula: n^r`);
          steps.push(`Calculation: ${n}^${r} = ${p}`);
          
          resultObj = {
            type: 'Permutation with Repetition',
            calculation: `${n}^${r}`,
            result: p,
            explanation: `Number of possible arrangements of ${n} items taken ${r} at a time with repetition`
          };
        } else {
          const p = factorial(n) / factorial(n - r);
          steps.push(`Permutation formula: P(n,r) = n! / (n-r)!`);
          steps.push(`Calculation: ${n}! / (${n}-${r})!`);
          steps.push(`Numerator (${n}!): ${factorial(n)}`);
          steps.push(`Denominator (${n-r}!): ${factorial(n - r)}`);
          steps.push(`Result: ${p}`);
          
          resultObj = {
            type: 'Permutation',
            calculation: `P(${n},${r}) = ${n}! / (${n}-${r})!`,
            result: p,
            explanation: `Number of possible arrangements of ${n} items taken ${r} at a time without repetition`
          };
        }
      } else {
        if (inputs.withRepetition) {
          const c = factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
          steps.push(`Combination with repetition formula: C(n+r-1, r)`);
          steps.push(`Calculation: (${n}+${r}-1)! / (${r}! × (${n}-1)!)`);
          steps.push(`Numerator (${n+r-1}!): ${factorial(n + r - 1)}`);
          steps.push(`Denominator (${r}! × ${n-1}!): ${factorial(r) * factorial(n - 1)}`);
          steps.push(`Result: ${c}`);
          
          resultObj = {
            type: 'Combination with Repetition',
            calculation: `C(${n}+${r}-1, ${r}) = (${n}+${r}-1)! / (${r}! × (${n}-1)!)`,
            result: c,
            explanation: `Number of possible combinations of ${n} items taken ${r} at a time with repetition`
          };
        } else {
          const c = factorial(n) / (factorial(r) * factorial(n - r));
          steps.push(`Combination formula: C(n,r) = n! / (r! × (n-r)!)`);
          steps.push(`Calculation: ${n}! / (${r}! × (${n}-${r})!)`);
          steps.push(`Numerator (${n}!): ${factorial(n)}`);
          steps.push(`Denominator (${r}! × ${n-r}!): ${factorial(r) * factorial(n - r)}`);
          steps.push(`Result: ${c}`);
          
          resultObj = {
            type: 'Combination',
            calculation: `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`,
            result: c,
            explanation: `Number of possible combinations of ${n} items taken ${r} at a time without repetition`
          };
        }
      }

      setResult(resultObj);
      setCalculationSteps(steps);

      addToHistory({
        description: `${resultObj.type} for n=${n}, r=${r}`,
        result: `Result: ${resultObj.result}`
      });

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CalculatorBase 
      title="Permutation & Combination Calculator" 
      description="Calculate permutations and combinations with or without repetition for various combinatorial problems."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Calculation Type:</label>
            <select
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
              className="calc-type-selector"
            >
              <option value="permutation">Permutation (P)</option>
              <option value="combination">Combination (C)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Total Items (n):</label>
            <input
              type="number"
              value={inputs.n}
              onChange={(e) => setInputs({...inputs, n: e.target.value})}
              placeholder="e.g., 5"
              min="0"
            />
          </div>

          <div className="input-group">
            <label>Selected Items (r):</label>
            <input
              type="number"
              value={inputs.r}
              onChange={(e) => setInputs({...inputs, r: e.target.value})}
              placeholder="e.g., 2"
              min="0"
            />
          </div>

          <div className="input-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={inputs.withRepetition}
                onChange={(e) => setInputs({...inputs, withRepetition: e.target.checked})}
              />
              Allow Repetition
            </label>
          </div>

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate {calcType === 'permutation' ? 'Permutation' : 'Combination'}
          </button>

          {result && (
            <div className="result">
              <h3>Results</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Type:</span>
                  <span className="result-value">{result.type}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Calculation:</span>
                  <span className="result-value">{result.calculation}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Result:</span>
                  <span className="result-value">{result.result}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Explanation:</span>
                  <span className="result-value">{result.explanation}</span>
                </div>
              </div>

              {calculationSteps.length > 0 && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {calculationSteps.map((step, index) => (
                    <div key={index} className="step">{step}</div>
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

export default PermutationCombinationCalculator;