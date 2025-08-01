// src/components/Calculators/SimpleInterest.js
import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';

const SimpleInterest = () => {
  const [inputs, setInputs] = useState({
    principal: '',
    rate: '',
    time: ''
  });
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');

  const examples = [
    {
      title: "Basic Simple Interest",
      problem: "Principal: $1000, Rate: 5%, Time: 2 years",
      formula: "(P × R × T) / 100",
      solution: "(1000 × 5 × 2) / 100 = $100",
      onTry: () => {
        setInputs({
          principal: '1000',
          rate: '5',
          time: '2'
        });
      }
    },
    {
      title: "Long-term Investment",
      problem: "Principal: $5000, Rate: 7.5%, Time: 10 years",
      formula: "(P × R × T) / 100",
      solution: "(5000 × 7.5 × 10) / 100 = $3750",
      onTry: () => {
        setInputs({
          principal: '5000',
          rate: '7.5',
          time: '10'
        });
      }
    },
    {
      title: "Short-term Loan",
      problem: "Principal: $2000, Rate: 12%, Time: 6 months (0.5 years)",
      formula: "(P × R × T) / 100",
      solution: "(2000 × 12 × 0.5) / 100 = $120",
      onTry: () => {
        setInputs({
          principal: '2000',
          rate: '12',
          time: '0.5'
        });
      }
    }
  ];

  // Update formula preview in real-time
  const updateFormulaPreview = () => {
    const P = inputs.principal || 'P';
    const R = inputs.rate || 'R';
    const T = inputs.time || 'T';
    setFormulaPreview(`(${P} × ${R} × ${T}) / 100`);
  };

  const calculateSI = (addToHistory) => {
    const principal = parseFloat(inputs.principal);
    const rate = parseFloat(inputs.rate);
    const time = parseFloat(inputs.time);
    
    if (isNaN(principal) || principal <= 0) {
      alert('Please enter a valid principal amount');
      return;
    }
    
    if (isNaN(rate) || rate <= 0) {
      alert('Please enter a valid interest rate');
      return;
    }
    
    if (isNaN(time) || time <= 0) {
      alert('Please enter a valid time period');
      return;
    }
    
    const interest = (principal * rate * time) / 100;
    const total = principal + interest;
    
    const steps = [
      `Step 1: Calculate interest`,
      `(${principal} × ${rate} × ${time}) / 100 = ${interest.toFixed(2)}`,
      `Step 2: Calculate total amount`,
      `${principal} + ${interest.toFixed(2)} = ${total.toFixed(2)}`
    ];
    
    setResult({
      interest: interest.toFixed(2),
      total: total.toFixed(2),
      steps
    });

    addToHistory({
      description: `SI: P=${principal}, R=${rate}%, T=${time} years`,
      result: `Interest: $${interest.toFixed(2)}, Total: $${total.toFixed(2)}`
    });
  };

  // Update formula preview whenever inputs change
  React.useEffect(() => {
    updateFormulaPreview();
  }, [inputs]);

  return (
    <CalculatorBase 
      title="Simple Interest Calculator" 
      description="Calculate simple interest and total amount using principal, rate, and time."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Principal Amount ($):</label>
            <input
              type="number"
              value={inputs.principal}
              onChange={(e) => setInputs({...inputs, principal: e.target.value})}
              placeholder="e.g., 1000"
            />
          </div>

          <div className="input-group">
            <label>Annual Rate (%):</label>
            <input
              type="number"
              value={inputs.rate}
              onChange={(e) => setInputs({...inputs, rate: e.target.value})}
              placeholder="e.g., 5"
            />
          </div>

          <div className="input-group">
            <label>Time Period (years):</label>
            <input
              type="number"
              value={inputs.time}
              onChange={(e) => setInputs({...inputs, time: e.target.value})}
              placeholder="e.g., 2"
            />
          </div>

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button 
            onClick={() => calculateSI(addToHistory)} 
            className="calculate-btn"
          >
            Calculate Simple Interest
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p>Interest Earned: <strong>${result.interest}</strong></p>
              <p>Total Amount: <strong>${result.total}</strong></p>
              
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

export default SimpleInterest;