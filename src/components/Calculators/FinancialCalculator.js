import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const FinancialCalculator = () => {
  const [activeTab, setActiveTab] = useState('simple');
  const [inputs, setInputs] = useState({
    principal: '',
    rate: '',
    time: '',
    frequency: '1',
    payment: '',
    futureValue: '',
    inflationRate: ''
  });
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');

  const tabs = [
    { id: 'simple', label: 'Simple Interest' },
    { id: 'compound', label: 'Compound Interest' },
    { id: 'future', label: 'Future Value' },
    { id: 'present', label: 'Present Value' },
    { id: 'inflation', label: 'Inflation Calculator' }
  ];

  const frequencyOptions = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-Annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '365', label: 'Daily' }
  ];

  const examples = {
    simple: [
      {
        title: "Basic Simple Interest",
        problem: "Principal: $1000, Rate: 5%, Time: 2 years",
        formula: "(P × R × T) / 100",
        solution: "(1000 × 5 × 2) / 100 = $100",
        onTry: () => {
          setInputs({
            ...inputs,
            principal: '1000',
            rate: '5',
            time: '2'
          });
        }
      }
    ],
    compound: [
      {
        title: "Compound Interest Growth",
        problem: "Principal: $5000, Rate: 5%, Time: 10 years, Compounded Annually",
        formula: "P(1 + r/n)^(nt)",
        solution: "5000(1 + 0.05/1)^(10) = $8144.47",
        onTry: () => {
          setInputs({
            ...inputs,
            principal: '5000',
            rate: '5',
            time: '10',
            frequency: '1'
          });
        }
      }
    ],
    future: [
      {
        title: "Future Value of Investment",
        problem: "Monthly Payment: $100, Rate: 7%, Time: 30 years",
        formula: "PMT × [(1 + r)^n - 1]/r",
        solution: "100 × [(1 + 0.07)^30 - 1]/0.07 = $113,989.46",
        onTry: () => {
          setInputs({
            ...inputs,
            payment: '100',
            rate: '7',
            time: '30'
          });
        }
      }
    ]
  };

  // Update formula preview in real-time
  const updateFormulaPreview = () => {
    const P = inputs.principal || 'P';
    const r = inputs.rate || 'r';
    const t = inputs.time || 't';
    const n = inputs.frequency || 'n';
    const PMT = inputs.payment || 'PMT';
    const FV = inputs.futureValue || 'FV';

    switch(activeTab) {
      case 'simple':
        setFormulaPreview(`(${P} × ${r} × ${t}) / 100`);
        break;
      case 'compound':
        setFormulaPreview(`${P}(1 + ${r}/${n})^(${n}×${t})`);
        break;
      case 'future':
        setFormulaPreview(`${PMT} × [(1 + ${r})^${t} - 1]/${r}`);
        break;
      case 'present':
        setFormulaPreview(`${FV} / (1 + ${r})^${t}`);
        break;
      case 'inflation':
        setFormulaPreview(`${P} / (1 + ${r})^${t}`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    const principal = parseFloat(inputs.principal);
    const rate = parseFloat(inputs.rate) / 100;
    const time = parseFloat(inputs.time);
    const frequency = parseFloat(inputs.frequency);
    const payment = parseFloat(inputs.payment);
    const futureValue = parseFloat(inputs.futureValue);
    const inflationRate = parseFloat(inputs.inflationRate) / 100;

    let calculationResult = {};
    let steps = [];
    let vizData = {};

    try {
      switch(activeTab) {
        case 'simple':
          if (isNaN(principal) || principal <= 0) throw new Error('Invalid principal amount');
          if (isNaN(rate) || rate <= 0) throw new Error('Invalid interest rate');
          if (isNaN(time) || time <= 0) throw new Error('Invalid time period');

          const interest = (principal * rate * 100 * time) / 100;
          const total = principal + interest;
          
          steps = [
            `Step 1: Calculate simple interest`,
            `(${principal} × ${rate*100} × ${time}) / 100 = ${interest.toFixed(2)}`,
            `Step 2: Calculate total amount`,
            `${principal} + ${interest.toFixed(2)} = ${total.toFixed(2)}`
          ];
          
          calculationResult = {
            interest: interest.toFixed(2),
            total: total.toFixed(2),
            steps
          };

          vizData = {
            type: 'simple',
            principal,
            interest,
            total,
            time
          };
          break;

        case 'compound':
          if (isNaN(principal) || principal <= 0) throw new Error('Invalid principal amount');
          if (isNaN(rate) || rate <= 0) throw new Error('Invalid interest rate');
          if (isNaN(time) || time <= 0) throw new Error('Invalid time period');
          if (isNaN(frequency) || frequency <= 0) throw new Error('Invalid compounding frequency');

          const compoundInterest = principal * Math.pow(1 + rate/frequency, frequency*time) - principal;
          const compoundTotal = principal + compoundInterest;
          
          steps = [
            `Step 1: Calculate compound interest`,
            `${principal} × (1 + ${rate}/${frequency})^(${frequency}×${time}) - ${principal} = ${compoundInterest.toFixed(2)}`,
            `Step 2: Calculate total amount`,
            `${principal} + ${compoundInterest.toFixed(2)} = ${compoundTotal.toFixed(2)}`
          ];
          
          calculationResult = {
            interest: compoundInterest.toFixed(2),
            total: compoundTotal.toFixed(2),
            steps
          };

          vizData = {
            type: 'compound',
            principal,
            interest: compoundInterest,
            total: compoundTotal,
            time,
            frequency
          };
          break;

        case 'future':
          if (isNaN(payment) || payment <= 0) throw new Error('Invalid payment amount');
          if (isNaN(rate) || rate <= 0) throw new Error('Invalid interest rate');
          if (isNaN(time) || time <= 0) throw new Error('Invalid time period');

          const futureValue = payment * (Math.pow(1 + rate, time) - 1) / rate;
          
          steps = [
            `Step 1: Calculate future value of annuity`,
            `${payment} × [(1 + ${rate})^${time} - 1]/${rate} = ${futureValue.toFixed(2)}`
          ];
          
          calculationResult = {
            futureValue: futureValue.toFixed(2),
            steps
          };

          vizData = {
            type: 'future',
            payment,
            rate,
            time,
            futureValue
          };
          break;

        case 'present':
          if (isNaN(futureValue) || futureValue <= 0) throw new Error('Invalid future value');
          if (isNaN(rate) || rate <= 0) throw new Error('Invalid discount rate');
          if (isNaN(time) || time <= 0) throw new Error('Invalid time period');

          const presentValue = futureValue / Math.pow(1 + rate, time);
          
          steps = [
            `Step 1: Calculate present value`,
            `${futureValue} / (1 + ${rate})^${time} = ${presentValue.toFixed(2)}`
          ];
          
          calculationResult = {
            presentValue: presentValue.toFixed(2),
            steps
          };

          vizData = {
            type: 'present',
            futureValue,
            rate,
            time,
            presentValue
          };
          break;

        case 'inflation':
          if (isNaN(principal) || principal <= 0) throw new Error('Invalid amount');
          if (isNaN(inflationRate) || inflationRate <= 0) throw new Error('Invalid inflation rate');
          if (isNaN(time) || time <= 0) throw new Error('Invalid time period');

          const inflatedValue = principal * Math.pow(1 + inflationRate, time);
          const purchasingPower = principal / Math.pow(1 + inflationRate, time);
          
          steps = [
            `Step 1: Calculate future value with inflation`,
            `${principal} × (1 + ${inflationRate})^${time} = ${inflatedValue.toFixed(2)}`,
            `Step 2: Calculate current purchasing power`,
            `${principal} / (1 + ${inflationRate})^${time} = ${purchasingPower.toFixed(2)}`
          ];
          
          calculationResult = {
            futureValue: inflatedValue.toFixed(2),
            purchasingPower: purchasingPower.toFixed(2),
            steps
          };

          vizData = {
            type: 'inflation',
            principal,
            inflationRate,
            time,
            futureValue: inflatedValue,
            purchasingPower
          };
          break;
      }

      setResult(calculationResult);
      addToHistory({
        description: `${activeTab} calculation`,
        result: JSON.stringify(calculationResult)
      });

    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, activeTab]);

  const renderInputs = () => {
    switch(activeTab) {
      case 'simple':
        return (
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
              <label>Annual Interest Rate (%):</label>
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
          </>
        );
      case 'compound':
        return (
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
              <label>Annual Interest Rate (%):</label>
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
                placeholder="e.g., 10"
              />
            </div>
            <div className="input-group">
              <label>Compounding Frequency:</label>
              <select
                value={inputs.frequency}
                onChange={(e) => setInputs({...inputs, frequency: e.target.value})}
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </>
        );
      case 'future':
        return (
          <>
            <div className="input-group">
              <label>Regular Payment Amount ($):</label>
              <input
                type="number"
                value={inputs.payment}
                onChange={(e) => setInputs({...inputs, payment: e.target.value})}
                placeholder="e.g., 100"
              />
            </div>
            <div className="input-group">
              <label>Annual Interest Rate (%):</label>
              <input
                type="number"
                value={inputs.rate}
                onChange={(e) => setInputs({...inputs, rate: e.target.value})}
                placeholder="e.g., 7"
              />
            </div>
            <div className="input-group">
              <label>Time Period (years):</label>
              <input
                type="number"
                value={inputs.time}
                onChange={(e) => setInputs({...inputs, time: e.target.value})}
                placeholder="e.g., 30"
              />
            </div>
          </>
        );
      case 'present':
        return (
          <>
            <div className="input-group">
              <label>Future Value ($):</label>
              <input
                type="number"
                value={inputs.futureValue}
                onChange={(e) => setInputs({...inputs, futureValue: e.target.value})}
                placeholder="e.g., 10000"
              />
            </div>
            <div className="input-group">
              <label>Discount Rate (%):</label>
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
                placeholder="e.g., 10"
              />
            </div>
          </>
        );
      case 'inflation':
        return (
          <>
            <div className="input-group">
              <label>Current Amount ($):</label>
              <input
                type="number"
                value={inputs.principal}
                onChange={(e) => setInputs({...inputs, principal: e.target.value})}
                placeholder="e.g., 1000"
              />
            </div>
            <div className="input-group">
              <label>Inflation Rate (%):</label>
              <input
                type="number"
                value={inputs.inflationRate}
                onChange={(e) => setInputs({...inputs, inflationRate: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
            <div className="input-group">
              <label>Time Period (years):</label>
              <input
                type="number"
                value={inputs.time}
                onChange={(e) => setInputs({...inputs, time: e.target.value})}
                placeholder="e.g., 20"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderVisualization = () => {
    if (!result) return null;

    return (
      <div className="finance-visualization">
        {activeTab === 'simple' && (
          <div className="simple-interest-viz">
            <div className="money-bag initial" style={{ '--amount': inputs.principal }}>
              <span className="amount">${inputs.principal}</span>
              <div className="label">Principal</div>
            </div>
            <div className="time-line">
              {Array.from({ length: Math.min(10, inputs.time) }).map((_, i) => (
                <div key={i} className="year">
                  <div className="calendar-icon">📅</div>
                  <div className="year-label">Year {i+1}</div>
                </div>
              ))}
              {inputs.time > 10 && <div className="year">... +{inputs.time-10} more</div>}
            </div>
            <div className="money-bag interest" style={{ '--amount': result.interest }}>
              <span className="amount">${result.interest}</span>
              <div className="label">Interest</div>
            </div>
            <div className="money-bag total" style={{ '--amount': result.total }}>
              <span className="amount">${result.total}</span>
              <div className="label">Total</div>
            </div>
          </div>
        )}

        {activeTab === 'compound' && (
          <div className="compound-growth-viz">
            <div className="growth-chart">
              {Array.from({ length: Math.min(10, inputs.time) }).map((_, i) => {
                const year = i + 1;
                const value = inputs.principal * Math.pow(1 + (inputs.rate/100)/inputs.frequency, inputs.frequency*year);
                return (
                  <div key={i} className="growth-bar-container">
                    <div className="growth-bar" style={{ 
                      height: `${Math.min(100, (value / inputs.principal) * 20)}%`,
                      '--value': value.toFixed(2)
                    }}>
                      <div className="year-label">Year {year}</div>
                      <div className="value-label">${value.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="color-box initial"></div>
                <span>Initial: ${inputs.principal}</span>
              </div>
              <div className="legend-item">
                <div className="color-box interest"></div>
                <span>Interest: ${result.interest}</span>
              </div>
              <div className="legend-item">
                <div className="color-box total"></div>
                <span>Total: ${result.total}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'future' && (
          <div className="future-value-viz">
            <div className="person-saving">
              <div className="person-icon">🧍</div>
              <div className="saving-action">Saving</div>
            </div>
            <div className="payment-flow">
              {Array.from({ length: Math.min(12, inputs.time) }).map((_, i) => (
                <div key={i} className="payment">
                  <div className="dollar-icon">💵</div>
                  <div className="payment-amount">${inputs.payment}</div>
                </div>
              ))}
              {inputs.time > 12 && <div className="payment">... +{inputs.time-12} more</div>}
            </div>
            <div className="future-value">
              <div className="money-stack" style={{ '--height': Math.min(100, result.futureValue/1000) }}>
                <div className="value">${result.futureValue}</div>
              </div>
              <div className="label">Future Value</div>
            </div>
          </div>
        )}

        {activeTab === 'inflation' && (
          <div className="inflation-viz">
            <div className="purchasing-power">
              <div className="current-value">
                <div className="money-icon">💰</div>
                <div className="amount">${inputs.principal}</div>
                <div className="time">Today</div>
              </div>
              <div className="inflation-effect">
                <div className="arrow">↓</div>
                <div className="rate">{inputs.inflationRate}% inflation</div>
                <div className="arrow">↓</div>
              </div>
              <div className="future-value">
                <div className="money-icon">💸</div>
                <div className="amount">${result.futureValue}</div>
                <div className="time">In {inputs.time} years</div>
              </div>
            </div>
            <div className="purchasing-comparison">
              <div className="comparison-item">
                <div className="label">Today's ${inputs.principal} buys:</div>
                <div className="goods">
                  <span>🛒</span>
                  <span>🍎🍎🍎</span>
                  <span>⛽⛽</span>
                </div>
              </div>
              <div className="comparison-item">
                <div className="label">Future buys same items:</div>
                <div className="goods">
                  <span>🛒</span>
                  <span>🍎</span>
                  <span>⛽</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="result">
        <h3>Result:</h3>
        
        {activeTab === 'simple' && (
          <>
            <p>Interest Earned: <strong>${result.interest}</strong></p>
            <p>Total Amount: <strong>${result.total}</strong></p>
          </>
        )}

        {activeTab === 'compound' && (
          <>
            <p>Interest Earned: <strong>${result.interest}</strong></p>
            <p>Total Amount: <strong>${result.total}</strong></p>
          </>
        )}

        {activeTab === 'future' && (
          <p>Future Value: <strong>${result.futureValue}</strong></p>
        )}

        {activeTab === 'present' && (
          <p>Present Value: <strong>${result.presentValue}</strong></p>
        )}

        {activeTab === 'inflation' && (
          <>
            <p>Future Value with Inflation: <strong>${result.futureValue}</strong></p>
            <p>Purchasing Power: <strong>${result.purchasingPower}</strong></p>
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
    );
  };

  return (
    <CalculatorBase 
      title="Financial Calculator" 
      description="Calculate various financial metrics including simple and compound interest, future value, and inflation effects."
      examples={examples[activeTab] || []}
    >
      {(addToHistory) => (
        <>
          <div className="finance-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula: {formulaPreview}</p>
            </div>
          )}

          <button 
            onClick={() => calculate(addToHistory)} 
            className="calculate-btn"
          >
            Calculate
          </button>

          {renderVisualization()}
          {renderResult()}
        </>
      )}
    </CalculatorBase>
  );
};

export default FinancialCalculator;