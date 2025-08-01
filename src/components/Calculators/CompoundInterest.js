// src/components/Calculators/CompoundInterest.js
import React, { useState, useEffect } from 'react'; // ✅ Correct imports
import CalculatorBase from './CalculatorBase';

const CompoundInterest = () => {
  const [inputs, setInputs] = useState({
    principal: '',
    rate: '',
    time: '',
    compounding: 'yearly'
  });

  const [result, setResult] = useState(null); // ✅ Declare result state
  const [formulaPreview, setFormulaPreview] = useState('');

  const examples = [
    {
      title: "Annual Compounding",
      problem: "Principal: $1000, Rate: 5%, Time: 10 years, Compounded yearly",
      formula: "A = P(1 + r/n)^(nt)",
      solution: "$1000 × (1 + 0.05/1)^(1×10) = $1628.89",
      onTry: () => {
        setInputs({
          principal: '1000',
          rate: '5',
          time: '10',
          compounding: 'yearly'
        });
      }
    },
    {
      title: "Monthly Compounding",
      problem: "Principal: $5000, Rate: 7%, Time: 5 years, Compounded monthly",
      formula: "A = P(1 + r/n)^(nt)",
      solution: "$5000 × (1 + 0.07/12)^(12×5) = $7088.04",
      onTry: () => {
        setInputs({
          principal: '5000',
          rate: '7',
          time: '5',
          compounding: 'monthly'
        });
      }
    },
    {
      title: "Daily Compounding",
      problem: "Principal: $2000, Rate: 10%, Time: 3 years, Compounded daily",
      formula: "A = P(1 + r/n)^(nt)",
      solution: "$2000 × (1 + 0.10/365)^(365×3) = $2699.72",
      onTry: () => {
        setInputs({
          principal: '2000',
          rate: '10',
          time: '3',
          compounding: 'daily'
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    const P = inputs.principal || 'P';
    const r = inputs.rate ? (parseFloat(inputs.rate) / 100) : 'r';
    const t = inputs.time || 't';

    let n = 1;
    let compoundingLabel = 'annually';

    switch (inputs.compounding) {
      case 'semi-annually': n = 2; compoundingLabel = 'semi-annually'; break;
      case 'quarterly': n = 4; compoundingLabel = 'quarterly'; break;
      case 'monthly': n = 12; compoundingLabel = 'monthly'; break;
      case 'daily': n = 365; compoundingLabel = 'daily'; break;
      default: break;
    }

    setFormulaPreview(`A = ${P}(1 + ${r}/${n})^(${n}×${t}) [Compounded ${compoundingLabel}]`);
  };

  const calculateCI = (addToHistory) => {
    const principal = parseFloat(inputs.principal);
    const rate = parseFloat(inputs.rate) / 100;
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

    let n = 1;
    let compoundingLabel = 'annually';
    switch (inputs.compounding) {
      case 'semi-annually': n = 2; compoundingLabel = 'semi-annually'; break;
      case 'quarterly': n = 4; compoundingLabel = 'quarterly'; break;
      case 'monthly': n = 12; compoundingLabel = 'monthly'; break;
      case 'daily': n = 365; compoundingLabel = 'daily'; break;
      default: break;
    }

    const amount = principal * Math.pow(1 + (rate / n), n * time);
    const interest = amount - principal;

    const steps = [
      `Step 1: Convert rate to decimal and determine compounding periods`,
      `Rate (r) = ${inputs.rate}% = ${rate.toFixed(4)}`,
      `Compounding periods per year (n) = ${n}`,
      `Step 2: Calculate total compounding periods`,
      `Total periods = n × t = ${n} × ${time} = ${n * time}`,
      `Step 3: Apply compound interest formula`,
      `A = P(1 + r/n)^(nt) = ${principal}(1 + ${rate.toFixed(4)}/${n})^(${n * time})`,
      `Step 4: Calculate final amount`,
      `A = $${amount.toFixed(2)}`,
      `Step 5: Calculate interest earned`,
      `Interest = A - P = $${amount.toFixed(2)} - $${principal} = $${interest.toFixed(2)}`
    ];

    setResult({
      principal,
      rate: inputs.rate,
      time,
      compounding: compoundingLabel,
      amount: amount.toFixed(2),
      interest: interest.toFixed(2),
      steps
    });

    addToHistory({
      description: `CI: P=$${principal}, r=${inputs.rate}%, t=${time} years, ${compoundingLabel}`,
      result: `Amount: $${amount.toFixed(2)}, Interest: $${interest.toFixed(2)}`
    });
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs]);

  return (
    <CalculatorBase
      title="Compound Interest Calculator"
      description="Calculate compound interest with different compounding frequencies (yearly, quarterly, monthly, daily)."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Principal Amount ($):</label>
            <input
              type="number"
              value={inputs.principal}
              onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
              placeholder="e.g., 1000"
            />
          </div>

          <div className="input-group">
            <label>Annual Interest Rate (%):</label>
            <input
              type="number"
              value={inputs.rate}
              onChange={(e) => setInputs({ ...inputs, rate: e.target.value })}
              placeholder="e.g., 5"
            />
          </div>

          <div className="input-group">
            <label>Time Period (years):</label>
            <input
              type="number"
              value={inputs.time}
              onChange={(e) => setInputs({ ...inputs, time: e.target.value })}
              placeholder="e.g., 10"
            />
          </div>

          <div className="input-group">
            <label>Compounding Frequency:</label>
            <select
              value={inputs.compounding}
              onChange={(e) => setInputs({ ...inputs, compounding: e.target.value })}
            >
              <option value="yearly">Yearly</option>
              <option value="semi-annually">Semi-Annually</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculateCI(addToHistory)} className="calculate-btn">
            Calculate Compound Interest
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p>Principal: <strong>${result.principal.toFixed(2)}</strong></p>
              <p>Rate: <strong>{result.rate}%</strong></p>
              <p>Time: <strong>{result.time} years</strong></p>
              <p>Compounding: <strong>{result.compounding}</strong></p>
              <p>Final Amount: <strong>${result.amount}</strong></p>
              <p>Interest Earned: <strong>${result.interest}</strong></p>

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

export default CompoundInterest;
