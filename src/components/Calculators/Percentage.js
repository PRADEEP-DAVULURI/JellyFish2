// src/components/Calculators/Percentage.js
import React, { useState, useEffect } from 'react'; // ✅ Import useState and useEffect
import CalculatorBase from './CalculatorBase';

const Percentage = () => {
  const [inputs, setInputs] = useState({
    value: '',
    percentage: '',
    resultValue: '',
    originalValue: '',
    finalValue: ''
  });
  const [calcType, setCalcType] = useState('findPercentage');
  const [formulaPreview, setFormulaPreview] = useState('');
  const [result, setResult] = useState(null); // ✅ Fix: Declare result state

  const examples = [
    {
      title: "Find Percentage",
      problem: "What is 25 as a percentage of 200?",
      formula: "(Part / Whole) × 100",
      solution: "(25 / 200) × 100 = 12.5%",
      onTry: () => {
        setCalcType('findPercentage');
        setInputs({
          value: '200',
          resultValue: '25',
          percentage: '',
          originalValue: '',
          finalValue: ''
        });
      }
    },
    {
      title: "Find Value",
      problem: "What is 25% of 200?",
      formula: "(Percentage / 100) × Whole",
      solution: "(25 / 100) × 200 = 50",
      onTry: () => {
        setCalcType('findValue');
        setInputs({
          value: '200',
          percentage: '25',
          resultValue: '',
          originalValue: '',
          finalValue: ''
        });
      }
    },
    {
      title: "Increase/Decrease",
      problem: "100 increased to 150 - what's the percentage increase?",
      formula: "((Final - Original) / Original) × 100",
      solution: "((150 - 100) / 100) × 100 = 50%",
      onTry: () => {
        setCalcType('increaseDecrease');
        setInputs({
          originalValue: '100',
          finalValue: '150',
          value: '',
          percentage: '',
          resultValue: ''
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    switch(calcType) {
      case 'findPercentage':
        const part = inputs.resultValue || 'Part';
        const whole = inputs.value || 'Whole';
        setFormulaPreview(`(${part} / ${whole}) × 100`);
        break;
      case 'findValue':
        const percentage = inputs.percentage || 'Percentage';
        const ofValue = inputs.value || 'Value';
        setFormulaPreview(`(${percentage} / 100) × ${ofValue}`);
        break;
      case 'increaseDecrease':
        const original = inputs.originalValue || 'Original';
        const final = inputs.finalValue || 'Final';
        setFormulaPreview(`((${final} - ${original}) / ${original}) × 100`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    let resultObj = {};
    let steps = [];

    if (calcType === 'findPercentage') {
      const value = parseFloat(inputs.value);
      const resultValue = parseFloat(inputs.resultValue);

      if (isNaN(value) || value === 0) {
        alert('Please enter a valid value');
        return;
      }

      if (isNaN(resultValue)) {
        alert('Please enter a valid result value');
        return;
      }

      const percentage = (resultValue / value) * 100;

      steps = [
        `Step 1: Divide part by whole`,
        `${resultValue} / ${value} = ${(resultValue / value).toFixed(4)}`,
        `Step 2: Multiply by 100 to get percentage`,
        `${(resultValue / value).toFixed(4)} × 100 = ${percentage.toFixed(2)}%`
      ];

      resultObj = {
        type: 'Percentage',
        calculation: `(${resultValue} / ${value}) × 100`,
        result: percentage.toFixed(2) + '%',
        steps
      };
    } else if (calcType === 'findValue') {
      const percentage = parseFloat(inputs.percentage);
      const value = parseFloat(inputs.value);

      if (isNaN(percentage)) {
        alert('Please enter a valid percentage');
        return;
      }

      if (isNaN(value)) {
        alert('Please enter a valid value');
        return;
      }

      const resultValue = (percentage / 100) * value;

      steps = [
        `Step 1: Convert percentage to decimal`,
        `${percentage}% = ${percentage / 100}`,
        `Step 2: Multiply by the whole value`,
        `${(percentage / 100).toFixed(4)} × ${value} = ${resultValue.toFixed(2)}`
      ];

      resultObj = {
        type: 'Value',
        calculation: `${percentage}% × ${value}`,
        result: resultValue.toFixed(2),
        steps
      };
    } else if (calcType === 'increaseDecrease') {
      const originalValue = parseFloat(inputs.originalValue);
      const finalValue = parseFloat(inputs.finalValue);

      if (isNaN(originalValue) || originalValue === 0) {
        alert('Please enter a valid original value');
        return;
      }

      if (isNaN(finalValue)) {
        alert('Please enter a valid final value');
        return;
      }

      const difference = finalValue - originalValue;
      const percentage = (difference / originalValue) * 100;

      steps = [
        `Step 1: Calculate difference`,
        `${finalValue} - ${originalValue} = ${difference.toFixed(2)}`,
        `Step 2: Divide difference by original value`,
        `${difference.toFixed(2)} / ${originalValue} = ${(difference / originalValue).toFixed(4)}`,
        `Step 3: Multiply by 100 to get percentage`,
        `${(difference / originalValue).toFixed(4)} × 100 = ${percentage.toFixed(2)}%`
      ];

      resultObj = {
        type: difference >= 0 ? 'Increase' : 'Decrease',
        calculation: `((${finalValue} - ${originalValue}) / ${originalValue}) × 100`,
        result: Math.abs(percentage).toFixed(2) + '%',
        difference: difference.toFixed(2),
        steps
      };
    }

    setResult(resultObj);

    addToHistory({
      description: `${resultObj.type} calculation: ${resultObj.calculation}`,
      result: resultObj.result
    });
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, calcType]);

  const renderInputs = () => {
    switch(calcType) {
      case 'findPercentage':
        return (
          <>
            <div className="input-group">
              <label>Whole Value:</label>
              <input
                type="number"
                value={inputs.value}
                onChange={(e) => setInputs({...inputs, value: e.target.value})}
                placeholder="e.g., 200"
              />
            </div>
            <div className="input-group">
              <label>Part Value:</label>
              <input
                type="number"
                value={inputs.resultValue}
                onChange={(e) => setInputs({...inputs, resultValue: e.target.value})}
                placeholder="e.g., 25"
              />
            </div>
          </>
        );
      case 'findValue':
        return (
          <>
            <div className="input-group">
              <label>Percentage:</label>
              <input
                type="number"
                value={inputs.percentage}
                onChange={(e) => setInputs({...inputs, percentage: e.target.value})}
                placeholder="e.g., 25"
              />
            </div>
            <div className="input-group">
              <label>Of Value:</label>
              <input
                type="number"
                value={inputs.value}
                onChange={(e) => setInputs({...inputs, value: e.target.value})}
                placeholder="e.g., 200"
              />
            </div>
          </>
        );
      case 'increaseDecrease':
        return (
          <>
            <div className="input-group">
              <label>Original Value:</label>
              <input
                type="number"
                value={inputs.originalValue}
                onChange={(e) => setInputs({...inputs, originalValue: e.target.value})}
                placeholder="e.g., 100"
              />
            </div>
            <div className="input-group">
              <label>Final Value:</label>
              <input
                type="number"
                value={inputs.finalValue}
                onChange={(e) => setInputs({...inputs, finalValue: e.target.value})}
                placeholder="e.g., 150"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <CalculatorBase 
      title="Percentage Calculator" 
      description="Calculate percentages, find values from percentages, and determine percentage increases/decreases."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Calculation Type:</label>
            <select
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
            >
              <option value="findPercentage">Find Percentage</option>
              <option value="findValue">Find Value</option>
              <option value="increaseDecrease">Calculate Increase/Decrease</option>
            </select>
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate {calcType === 'findPercentage' ? 'Percentage' : 
                       calcType === 'findValue' ? 'Value' : 'Change'}
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p>Type: <strong>{result.type}</strong></p>
              <p>Calculation: <strong>{result.calculation}</strong></p>
              <p>Result: <strong>{result.result}</strong></p>
              {result.difference && (
                <p>Difference: <strong>{result.difference}</strong></p>
              )}

              {result.steps && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {result.steps.map((step, index) => (
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

export default Percentage;
