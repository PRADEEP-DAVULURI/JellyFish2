import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

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
  const [result, setResult] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);

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
    let vizData = {};

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

      vizData = {
        type: profit >= 0 ? 'profit' : 'loss',
        costPrice: cp,
        sellingPrice: sp,
        amount: Math.abs(profit >= 0 ? profit : loss),
        percentage: Math.abs(profit >= 0 ? profitPercent : lossPercent)
      };

      resultObj = {
        type: profit >= 0 ? 'Profit' : 'Loss',
        amount: vizData.amount.toFixed(2),
        percentage: vizData.percentage.toFixed(2) + '%',
        steps,
        vizData
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

        vizData = {
          type: 'reverse-profit',
          costPrice: cp,
          sellingPrice: sp,
          profit,
          profitPercent
        };

        resultObj = {
          type: 'Reverse Profit',
          costPrice: cp.toFixed(2),
          sellingPrice: sp.toFixed(2),
          steps,
          vizData
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

        vizData = {
          type: 'reverse-loss',
          costPrice: cp,
          sellingPrice: sp,
          loss,
          lossPercent
        };

        resultObj = {
          type: 'Reverse Loss',
          costPrice: cp.toFixed(2),
          sellingPrice: sp.toFixed(2),
          steps,
          vizData
        };
      }
    }

    setResult(resultObj);
    setAnimationPhase(1); // Start animations immediately

    addToHistory({
      description: `${resultObj.type} calculation`,
      result: calcType === 'basic'
        ? `${resultObj.type}: ${resultObj.amount} (${resultObj.percentage})`
        : `CP: ${resultObj.costPrice}, SP: ${resultObj.sellingPrice}`
    });
  };

  useEffect(() => {
    if (result && animationPhase > 0) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, result]);

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, calcType, updateFormulaPreview]);

  const renderVisualization = () => {
    if (!result || !result.vizData) return null;

    return (
      <div className="profit-loss-visualization" data-phase={animationPhase}>
        {result.vizData.type === 'profit' && (
          <div className="profit-chart">
            <div className="price-bars">
              <div className="price-bar cp-bar">
                <div className="price-label">CP: ₹{result.vizData.costPrice}</div>
                <div className="bar-fill" style={{ height: '100%' }}></div>
              </div>
              <div className="price-bar sp-bar">
                <div className="price-label">SP: ₹{result.vizData.sellingPrice}</div>
                <div className="bar-fill" style={{ height: '100%' }}></div>
              </div>
            </div>
            <div className="profit-indicator">
              <div className="arrow-up">↑</div>
              <div className="profit-amount">
                Profit: ₹{result.vizData.amount} ({result.vizData.percentage.toFixed(2)}%)
              </div>
            </div>
            {animationPhase >= 2 && (
              <div className="profit-explanation">
                <p>You gained ₹{result.vizData.amount} ({result.vizData.percentage.toFixed(2)}%) on this transaction</p>
              </div>
            )}
          </div>
        )}

        {result.vizData.type === 'loss' && (
          <div className="loss-chart">
            <div className="price-bars">
              <div className="price-bar cp-bar">
                <div className="price-label">CP: ₹{result.vizData.costPrice}</div>
                <div className="bar-fill" style={{ height: '100%' }}></div>
              </div>
              <div className="price-bar sp-bar">
                <div className="price-label">SP: ₹{result.vizData.sellingPrice}</div>
                <div className="bar-fill" style={{ height: '100%' }}></div>
              </div>
            </div>
            <div className="loss-indicator">
              <div className="arrow-down">↓</div>
              <div className="loss-amount">
                Loss: ₹{result.vizData.amount} ({result.vizData.percentage.toFixed(2)}%)
              </div>
            </div>
            {animationPhase >= 2 && (
              <div className="loss-explanation">
                <p>You lost ₹{result.vizData.amount} ({result.vizData.percentage.toFixed(2)}%) on this transaction</p>
              </div>
            )}
          </div>
        )}

        {result.vizData.type === 'reverse-profit' && (
          <div className="reverse-profit-chart">
            <div className="calculation-flow">
              <div className="flow-item">
                <div className="flow-label">Profit</div>
                <div className="flow-value">₹{result.vizData.profit}</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">Profit%</div>
                <div className="flow-value">{result.vizData.profitPercent}%</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">CP</div>
                <div className="flow-value">₹{result.vizData.costPrice.toFixed(2)}</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">SP</div>
                <div className="flow-value">₹{result.vizData.sellingPrice.toFixed(2)}</div>
              </div>
            </div>
            {animationPhase >= 2 && (
              <div className="reverse-calculation">
                <p>With {result.vizData.profitPercent}% profit, you need to sell at ₹{result.vizData.sellingPrice.toFixed(2)} when buying at ₹{result.vizData.costPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {result.vizData.type === 'reverse-loss' && (
          <div className="reverse-loss-chart">
            <div className="calculation-flow">
              <div className="flow-item">
                <div className="flow-label">Loss</div>
                <div className="flow-value">₹{result.vizData.loss}</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">Loss%</div>
                <div className="flow-value">{result.vizData.lossPercent}%</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">CP</div>
                <div className="flow-value">₹{result.vizData.costPrice.toFixed(2)}</div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-item">
                <div className="flow-label">SP</div>
                <div className="flow-value">₹{result.vizData.sellingPrice.toFixed(2)}</div>
              </div>
            </div>
            {animationPhase >= 2 && (
              <div className="reverse-calculation">
                <p>With {result.vizData.lossPercent}% loss, you need to sell at ₹{result.vizData.sellingPrice.toFixed(2)} when buying at ₹{result.vizData.costPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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

          {renderVisualization()}

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