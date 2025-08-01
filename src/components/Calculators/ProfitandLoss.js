// src/components/Calculators/ProfitandLoss.js
import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';

const ProfitAndLoss = () => {
  const [inputs, setInputs] = useState({
    costPrice: '',
    sellingPrice: '',
    profit: '',
    loss: '',
    profitPercent: '',
    lossPercent: ''
  });
  const [calcType, setCalcType] = useState('basic');
  const [formulaPreview, setFormulaPreview] = useState('');
  const [result, setResult] = useState(null); // ✅ ADDED THIS LINE

  const examples = [
    {
      title: "Basic Profit Calculation",
      problem: "CP = 100, SP = 120",
      formula: "Profit = SP - CP, Profit% = (Profit/CP)×100",
      solution: "Profit = 20 (20%)",
      onTry: () => {
        setCalcType('basic');
        setInputs({
          costPrice: '100',
          sellingPrice: '120',
          profit: '',
          loss: '',
          profitPercent: '',
          lossPercent: ''
        });
      }
    },
    {
      title: "Basic Loss Calculation",
      problem: "CP = 100, SP = 80",
      formula: "Loss = CP - SP, Loss% = (Loss/CP)×100",
      solution: "Loss = 20 (20%)",
      onTry: () => {
        setCalcType('basic');
        setInputs({
          costPrice: '100',
          sellingPrice: '80',
          profit: '',
          loss: '',
          profitPercent: '',
          lossPercent: ''
        });
      }
    },
    {
      title: "Reverse Profit Calculation",
      problem: "Profit = 20 (20%)",
      formula: "CP = Profit / Profit%, SP = CP + Profit",
      solution: "CP = 100, SP = 120",
      onTry: () => {
        setCalcType('reverse');
        setInputs({
          profit: '20',
          profitPercent: '20',
          costPrice: '',
          sellingPrice: '',
          loss: '',
          lossPercent: ''
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    if (calcType === 'basic') {
      const CP = inputs.costPrice || 'CP';
      const SP = inputs.sellingPrice || 'SP';
      setFormulaPreview(`Profit = ${SP} - ${CP}, Loss = ${CP} - ${SP}`);
    } else {
      if (inputs.profit) {
        const profit = inputs.profit || 'Profit';
        const profitPercent = inputs.profitPercent || 'Profit%';
        setFormulaPreview(`CP = ${profit} / (${profitPercent}/100), SP = CP + ${profit}`);
      } else {
        const loss = inputs.loss || 'Loss';
        const lossPercent = inputs.lossPercent || 'Loss%';
        setFormulaPreview(`CP = ${loss} / (${lossPercent}/100), SP = CP - ${loss}`);
      }
    }
  };

  const calculate = (addToHistory) => {
    let resultObj = {};
    let steps = [];

    if (calcType === 'basic') {
      const cp = parseFloat(inputs.costPrice);
      const sp = parseFloat(inputs.sellingPrice);

      if (isNaN(cp)) {
        alert('Please enter cost price');
        return;
      }
      if (isNaN(sp)) {
        alert('Please enter selling price');
        return;
      }

      const profit = sp - cp;
      const profitPercent = (profit / cp) * 100;
      const loss = cp - sp;
      const lossPercent = (loss / cp) * 100;

      if (profit >= 0) {
        steps = [
          `Step 1: Calculate profit`,
          `Profit = SP - CP = ${sp} - ${cp} = ${profit}`,
          `Step 2: Calculate profit percentage`,
          `Profit% = (Profit / CP) × 100 = (${profit} / ${cp}) × 100 = ${profitPercent.toFixed(2)}%`
        ];
      } else {
        steps = [
          `Step 1: Calculate loss`,
          `Loss = CP - SP = ${cp} - ${sp} = ${loss}`,
          `Step 2: Calculate loss percentage`,
          `Loss% = (Loss / CP) × 100 = (${loss} / ${cp}) × 100 = ${lossPercent.toFixed(2)}%`
        ];
      }

      resultObj = {
        type: profit >= 0 ? 'Profit' : 'Loss',
        amount: Math.abs(profit >= 0 ? profit : loss).toFixed(2),
        percentage: Math.abs(profit >= 0 ? profitPercent : lossPercent).toFixed(2) + '%',
        steps
      };
    } else {
      let cp, sp;

      if (inputs.profit) {
        const profit = parseFloat(inputs.profit);
        const profitPercent = parseFloat(inputs.profitPercent);

        if (isNaN(profit)) {
          alert('Please enter profit amount');
          return;
        }

        if (isNaN(profitPercent) || profitPercent === 0) {
          alert('Please enter valid profit percentage');
          return;
        }

        cp = (profit / profitPercent) * 100;
        sp = cp + profit;

        steps = [
          `Step 1: Calculate cost price`,
          `CP = Profit / (Profit% / 100) = ${profit} / (${profitPercent} / 100) = ${cp.toFixed(2)}`,
          `Step 2: Calculate selling price`,
          `SP = CP + Profit = ${cp.toFixed(2)} + ${profit} = ${sp.toFixed(2)}`
        ];

        resultObj = {
          type: 'Reverse Profit',
          costPrice: cp.toFixed(2),
          sellingPrice: sp.toFixed(2),
          steps
        };
      } else {
        const loss = parseFloat(inputs.loss);
        const lossPercent = parseFloat(inputs.lossPercent);

        if (isNaN(loss)) {
          alert('Please enter loss amount');
          return;
        }

        if (isNaN(lossPercent) || lossPercent === 0) {
          alert('Please enter valid loss percentage');
          return;
        }

        cp = (loss / lossPercent) * 100;
        sp = cp - loss;

        steps = [
          `Step 1: Calculate cost price`,
          `CP = Loss / (Loss% / 100) = ${loss} / (${lossPercent} / 100) = ${cp.toFixed(2)}`,
          `Step 2: Calculate selling price`,
          `SP = CP - Loss = ${cp.toFixed(2)} - ${loss} = ${sp.toFixed(2)}`
        ];

        resultObj = {
          type: 'Reverse Loss',
          costPrice: cp.toFixed(2),
          sellingPrice: sp.toFixed(2),
          steps
        };
      }
    }

    setResult(resultObj);

    addToHistory({
      description: `${resultObj.type} calculation`,
      result: calcType === 'basic'
        ? `${resultObj.type}: ${resultObj.amount} (${resultObj.percentage})`
        : `CP: ${resultObj.costPrice}, SP: ${resultObj.sellingPrice}`
    });
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, calcType]);

  const renderInputs = () => {
    if (calcType === 'basic') {
      return (
        <>
          <div className="input-group">
            <label>Cost Price:</label>
            <input
              type="number"
              value={inputs.costPrice}
              onChange={(e) => setInputs({ ...inputs, costPrice: e.target.value })}
              placeholder="e.g., 100"
            />
          </div>
          <div className="input-group">
            <label>Selling Price:</label>
            <input
              type="number"
              value={inputs.sellingPrice}
              onChange={(e) => setInputs({ ...inputs, sellingPrice: e.target.value })}
              placeholder="e.g., 120"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="input-group">
            <label>Profit Amount (optional):</label>
            <input
              type="number"
              value={inputs.profit}
              onChange={(e) => setInputs({ ...inputs, profit: e.target.value, loss: '' })}
              placeholder="e.g., 20"
            />
          </div>
          <div className="input-group">
            <label>Profit Percentage (optional):</label>
            <input
              type="number"
              value={inputs.profitPercent}
              onChange={(e) => setInputs({ ...inputs, profitPercent: e.target.value })}
              placeholder="e.g., 20"
            />
          </div>
          <div className="input-group">
            <label>Loss Amount (optional):</label>
            <input
              type="number"
              value={inputs.loss}
              onChange={(e) => setInputs({ ...inputs, loss: e.target.value, profit: '' })}
              placeholder="e.g., 20"
            />
          </div>
          <div className="input-group">
            <label>Loss Percentage (optional):</label>
            <input
              type="number"
              value={inputs.lossPercent}
              onChange={(e) => setInputs({ ...inputs, lossPercent: e.target.value })}
              placeholder="e.g., 20"
            />
          </div>
        </>
      );
    }
  };

  return (
    <CalculatorBase
      title="Profit and Loss Calculator"
      description="Calculate profit/loss percentages or determine cost/selling prices from profit/loss percentages."
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
              <option value="basic">Basic Calculation</option>
              <option value="reverse">Reverse Calculation</option>
            </select>
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate {calcType === 'basic' ? 'Profit/Loss' : 'Cost/Selling Price'}
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              {calcType === 'basic' ? (
                <>
                  <p>Type: <strong>{result.type}</strong></p>
                  <p>Amount: <strong>₹{result.amount}</strong></p>
                  <p>Percentage: <strong>{result.percentage}</strong></p>
                </>
              ) : (
                <>
                  <p>Cost Price: <strong>₹{result.costPrice}</strong></p>
                  <p>Selling Price: <strong>₹{result.sellingPrice}</strong></p>
                </>
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

export default ProfitAndLoss;
