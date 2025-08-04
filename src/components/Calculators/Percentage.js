import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

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
  const [result, setResult] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);

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

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 3000); // Slowed down from 1500ms to 3000ms
      return () => clearTimeout(timer);
    }
  }, [animationPhase, result]);

  const calculate = (addToHistory) => {
    let resultObj = {};
    let steps = [];
    let vizData = {};

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

      vizData = {
        type: 'pie',
        whole: value,
        part: resultValue,
        percentage: percentage
      };

      resultObj = {
        type: 'Percentage',
        calculation: `(${resultValue} / ${value}) × 100`,
        result: percentage.toFixed(2) + '%',
        steps,
        vizData
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

      vizData = {
        type: 'bar',
        whole: value,
        percentage: percentage,
        result: resultValue
      };

      resultObj = {
        type: 'Value',
        calculation: `${percentage}% × ${value}`,
        result: resultValue.toFixed(2),
        steps,
        vizData
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

      vizData = {
        type: 'change',
        original: originalValue,
        final: finalValue,
        difference: difference,
        percentage: percentage
      };

      resultObj = {
        type: difference >= 0 ? 'Increase' : 'Decrease',
        calculation: `((${finalValue} - ${originalValue}) / ${originalValue}) × 100`,
        result: Math.abs(percentage).toFixed(2) + '%',
        difference: difference.toFixed(2),
        steps,
        vizData
      };
    }

    setResult(resultObj);
    setAnimationPhase(0);

    addToHistory({
      description: `${resultObj.type} calculation: ${resultObj.calculation}`,
      result: resultObj.result
    });
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, calcType, updateFormulaPreview]);

  const renderVisualization = () => {
    if (!result || !result.vizData) return null;

    return (
      <div className="percentage-visualization" data-phase={animationPhase}>
        {result.vizData.type === 'pie' && (
          <div className="pie-chart">
            <div className="pie-container">
              <div 
                className="pie-slice whole"
                style={{
                  '--percentage': 100,
                  '--hue': 200,
                  '--rotation-speed': '5s'
                }}
              >
                <div className="pie-label">Whole: {result.vizData.whole}</div>
              </div>
              <div 
                className="pie-slice part"
                style={{
                  '--percentage': result.vizData.percentage,
                  '--hue': 120,
                  '--rotation-speed': '5s'
                }}
              >
                <div className="pie-label">Part: {result.vizData.part}</div>
                {animationPhase >= 1 && (
                  <div className="percentage-value">
                    {result.vizData.percentage.toFixed(2)}%
                  </div>
                )}
              </div>
              {animationPhase >= 2 && (
                <div className="pie-legend">
                  <div className="legend-item">
                    <div className="color-box whole"></div>
                    <span>Whole Value</span>
                  </div>
                  <div className="legend-item">
                    <div className="color-box part"></div>
                    <span>Part Value</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {result.vizData.type === 'bar' && (
          <div className="bar-chart">
            <div className="bars-container">
              <div className="bar-group">
                <div className="bar-label">100%</div>
                <div 
                  className="bar whole"
                  style={{ height: '100%' }}
                >
                  <div className="bar-value">{result.vizData.whole}</div>
                </div>
              </div>
              <div className="bar-group">
                <div className="bar-label">{result.vizData.percentage}%</div>
                <div 
                  className="bar part"
                  style={{ height: `${result.vizData.percentage}%` }}
                >
                  <div className="bar-value">{result.vizData.result.toFixed(2)}</div>
                </div>
              </div>
            </div>
            {animationPhase >= 1 && (
              <div className="bar-animation">
                <div className="percentage-line" style={{ bottom: `${result.vizData.percentage}%` }}>
                  <div className="percentage-label">{result.vizData.percentage}%</div>
                </div>
              </div>
            )}
            {animationPhase >= 2 && (
              <div className="calculation-steps">
                <div className="step">
                  {result.vizData.percentage}% of {result.vizData.whole} = {result.vizData.result.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {result.vizData.type === 'change' && (
          <div className="change-chart">
            <div className="change-container">
              <div className="value original">
                <div className="value-label">Original</div>
                <div className="value-number">{result.vizData.original}</div>
              </div>
              <div className="change-arrow">
                {result.vizData.difference >= 0 ? '↑' : '↓'}
                <div className="change-percent">
                  {Math.abs(result.vizData.percentage).toFixed(2)}%
                </div>
              </div>
              <div className="value final">
                <div className="value-label">Final</div>
                <div className="value-number">{result.vizData.final}</div>
              </div>
            </div>
            {animationPhase >= 1 && (
              <div className="difference-bar">
                <div 
                  className="difference-fill"
                  style={{ 
                    width: `${Math.min(100, Math.abs(result.vizData.percentage))}%`,
                    backgroundColor: result.vizData.difference >= 0 ? '#4CAF50' : '#F44336'
                  }}
                >
                  <div className="difference-value">
                    {result.vizData.difference >= 0 ? '+' : ''}{result.vizData.difference.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
            {animationPhase >= 2 && (
              <div className="change-explanation">
                {result.vizData.difference >= 0 ? (
                  <div className="increase-message">
                    Increased by {Math.abs(result.vizData.percentage).toFixed(2)}%
                  </div>
                ) : (
                  <div className="decrease-message">
                    Decreased by {Math.abs(result.vizData.percentage).toFixed(2)}%
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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

          {renderVisualization()}

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