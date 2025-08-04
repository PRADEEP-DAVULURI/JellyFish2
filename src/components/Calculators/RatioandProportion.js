// src/components/Calculators/RatioAndProportion.js
import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import { PieChart, BarChart, ScatterChart } from './VisualizationComponents';

const RatioAndProportion = () => {
  const [inputs, setInputs] = useState({
    ratio1: '',
    ratio2: '',
    value1: '',
    value2: '',
    total: ''
  });

  const [calcType, setCalcType] = useState('simplify');
  const [formulaPreview, setFormulaPreview] = useState('');
  const [result, setResult] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);

  const examples = [
    {
      title: "Simplify Ratio",
      problem: "Simplify the ratio 10:15",
      formula: "Divide both terms by their GCD",
      solution: "10:15 → 2:3",
      onTry: () => {
        setCalcType('simplify');
        setInputs({ ratio1: '10', ratio2: '15', value1: '', value2: '', total: '' });
      }
    },
    {
      title: "Share by Ratio",
      problem: "Share $100 in the ratio 2:3",
      formula: "Part = (Ratio × Total) / Sum of ratios",
      solution: "First part = $40, Second part = $60",
      onTry: () => {
        setCalcType('share');
        setInputs({ ratio1: '2', ratio2: '3', total: '100', value1: '', value2: '' });
      }
    },
    {
      title: "Find Proportional Value",
      problem: "2:5 as 10:x",
      formula: "a:b = c:d → d = (b × c) / a",
      solution: "x = 25",
      onTry: () => {
        setCalcType('proportion');
        setInputs({ ratio1: '2', ratio2: '5', value1: '10', value2: '', total: '' });
      }
    }
  ];

  const updateFormulaPreview = () => {
    switch (calcType) {
      case 'simplify':
        const num1 = inputs.ratio1 || 'a';
        const num2 = inputs.ratio2 || 'b';
        setFormulaPreview(`GCD(${num1}, ${num2}) → ${num1}/GCD : ${num2}/GCD`);
        break;
      case 'share':
        const part1 = inputs.ratio1 || 'a';
        const part2 = inputs.ratio2 || 'b';
        const total = inputs.total || 'Total';
        setFormulaPreview(`First share = (${part1} × ${total}) / (${part1} + ${part2})`);
        break;
      case 'proportion':
        const a = inputs.ratio1 || 'a';
        const b = inputs.ratio2 || 'b';
        const c = inputs.value1 || 'c';
        setFormulaPreview(`${a}:${b} = ${c}:x → x = (${b} × ${c}) / ${a}`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    let resultObj = {};
    let steps = [];
    let visData = null;

    if (calcType === 'simplify') {
      const num1 = parseInt(inputs.ratio1);
      const num2 = parseInt(inputs.ratio2);

      if (num1 === 0 && num2 === 0) {
        alert('Both ratio values cannot be zero');
        return;
      }

      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(num1, num2);
      const simplified1 = num1 / divisor;
      const simplified2 = num2 / divisor;

      steps = [
        `Step 1: Find GCD of ${num1} and ${num2}`,
        `GCD(${num1}, ${num2}) = ${divisor}`,
        `Step 2: Divide both terms by GCD`,
        `${num1} ÷ ${divisor} = ${simplified1}`,
        `${num2} ÷ ${divisor} = ${simplified2}`
      ];

      // Visualization data for simplified ratio
      visData = {
        type: 'bar',
        data: {
          labels: ['Original Ratio', 'Simplified Ratio'],
          datasets: [
            {
              label: 'First Value',
              data: [num1, simplified1],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Second Value',
              data: [num2, simplified2],
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      };

      resultObj = {
        type: 'Simplified Ratio',
        result: `${simplified1}:${simplified2}`,
        steps
      };
    } else if (calcType === 'share') {
      const ratio1 = parseInt(inputs.ratio1);
      const ratio2 = parseInt(inputs.ratio2);
      const total = parseFloat(inputs.total);

      if ((ratio1 + ratio2) === 0) {
        alert('Sum of ratio values cannot be zero');
        return;
      }

      const share1 = (total * ratio1) / (ratio1 + ratio2);
      const share2 = (total * ratio2) / (ratio1 + ratio2);

      steps = [
        `Step 1: Calculate sum of ratio parts`,
        `${ratio1} + ${ratio2} = ${ratio1 + ratio2}`,
        `Step 2: Calculate first share`,
        `(${total} × ${ratio1}) / ${ratio1 + ratio2} = ${share1.toFixed(2)}`,
        `Step 3: Calculate second share`,
        `(${total} × ${ratio2}) / ${ratio1 + ratio2} = ${share2.toFixed(2)}`
      ];

      // Visualization data for ratio sharing
      visData = {
        type: 'pie',
        data: {
          labels: [`First Share (${ratio1}:${ratio2})`, `Second Share (${ratio2}:${ratio1})`],
          datasets: [{
            data: [share1, share2],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value.toFixed(2)} (${percentage}%)`;
                }
              }
            }
          }
        }
      };

      resultObj = {
        type: 'Ratio Sharing',
        share1: share1.toFixed(2),
        share2: share2.toFixed(2),
        steps
      };
    } else if (calcType === 'proportion') {
      const ratio1 = parseFloat(inputs.ratio1);
      const ratio2 = parseFloat(inputs.ratio2);
      const value1 = parseFloat(inputs.value1);

      if (ratio1 === 0) {
        alert('First ratio value cannot be zero');
        return;
      }

      const value2 = (value1 * ratio2) / ratio1;

      steps = [
        `Step 1: Set up proportion`,
        `${ratio1}:${ratio2} = ${value1}:x`,
        `Step 2: Cross-multiply to solve for x`,
        `x = (${ratio2} × ${value1}) / ${ratio1}`,
        `x = ${value2.toFixed(2)}`
      ];

      // Visualization data for proportion
      visData = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Original Ratio',
              data: [{x: ratio1, y: ratio2}],
              backgroundColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 10
            },
            {
              label: 'Proportional Values',
              data: [{x: value1, y: value2}],
              backgroundColor: 'rgba(54, 162, 235, 1)',
              pointRadius: 10
            },
            {
              label: 'Proportional Line',
              data: [
                {x: 0, y: 0},
                {x: value1 * 1.2, y: value2 * 1.2}
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              pointRadius: 0,
              type: 'line'
            }
          ]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'X Values'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Y Values'
              }
            }
          }
        }
      };

      resultObj = {
        type: 'Proportional Value',
        result: value2.toFixed(2),
        steps
      };
    }

    setResult(resultObj);
    setVisualizationData(visData);

    addToHistory({
      description: `${resultObj.type} calculation`,
      result: calcType === 'simplify' ? resultObj.result :
              calcType === 'share' ? `Shares: ${resultObj.share1} & ${resultObj.share2}` :
              `Value: ${resultObj.result}`
    });
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [inputs, calcType]);

  const renderInputs = () => {
    switch (calcType) {
      case 'simplify':
        return (
          <>
            <div className="input-group">
              <label>First Ratio Value:</label>
              <input
                type="number"
                value={inputs.ratio1}
                onChange={(e) => setInputs({ ...inputs, ratio1: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
            <div className="input-group">
              <label>Second Ratio Value:</label>
              <input
                type="number"
                value={inputs.ratio2}
                onChange={(e) => setInputs({ ...inputs, ratio2: e.target.value })}
                placeholder="e.g., 15"
              />
            </div>
          </>
        );
      case 'share':
        return (
          <>
            <div className="input-group">
              <label>First Ratio Part:</label>
              <input
                type="number"
                value={inputs.ratio1}
                onChange={(e) => setInputs({ ...inputs, ratio1: e.target.value })}
                placeholder="e.g., 2"
              />
            </div>
            <div className="input-group">
              <label>Second Ratio Part:</label>
              <input
                type="number"
                value={inputs.ratio2}
                onChange={(e) => setInputs({ ...inputs, ratio2: e.target.value })}
                placeholder="e.g., 3"
              />
            </div>
            <div className="input-group">
              <label>Total Amount to Share:</label>
              <input
                type="number"
                value={inputs.total}
                onChange={(e) => setInputs({ ...inputs, total: e.target.value })}
                placeholder="e.g., 100"
              />
            </div>
          </>
        );
      case 'proportion':
        return (
          <>
            <div className="input-group">
              <label>First Ratio Value:</label>
              <input
                type="number"
                value={inputs.ratio1}
                onChange={(e) => setInputs({ ...inputs, ratio1: e.target.value })}
                placeholder="e.g., 2"
              />
            </div>
            <div className="input-group">
              <label>Second Ratio Value:</label>
              <input
                type="number"
                value={inputs.ratio2}
                onChange={(e) => setInputs({ ...inputs, ratio2: e.target.value })}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>First Actual Value:</label>
              <input
                type="number"
                value={inputs.value1}
                onChange={(e) => setInputs({ ...inputs, value1: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderVisualization = () => {
    if (!visualizationData) return null;

    switch (visualizationData.type) {
      case 'pie':
        return (
          <div className="visualization-container">
            <h4>Distribution Visualization</h4>
            <PieChart data={visualizationData.data} options={visualizationData.options} />
            <p className="visualization-caption">
              This pie chart shows how the total amount is divided according to the given ratio.
            </p>
          </div>
        );
      case 'bar':
        return (
          <div className="visualization-container">
            <h4>Ratio Comparison</h4>
            <BarChart data={visualizationData.data} options={visualizationData.options} />
            <p className="visualization-caption">
              This bar chart compares the original ratio values with the simplified version.
            </p>
          </div>
        );
      case 'scatter':
        return (
          <div className="visualization-container">
            <h4>Proportional Relationship</h4>
            <ScatterChart data={visualizationData.data} options={visualizationData.options} />
            <p className="visualization-caption">
              This scatter plot shows the proportional relationship between the values.
              The line demonstrates how the values maintain the same ratio.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <CalculatorBase
      title="Ratio and Proportion Calculator"
      description="Simplify ratios, share amounts by ratio, and find proportional values."
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
              <option value="simplify">Simplify Ratio</option>
              <option value="share">Share by Ratio</option>
              <option value="proportion">Find Proportional Value</option>
            </select>
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            {calcType === 'simplify' ? 'Simplify Ratio' :
              calcType === 'share' ? 'Calculate Shares' : 'Find Proportion'}
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              {result.type === 'Simplified Ratio' && (
                <p>Simplified Ratio: <strong>{result.result}</strong></p>
              )}
              {result.type === 'Ratio Sharing' && (
                <>
                  <p>First Share: <strong>{result.share1}</strong></p>
                  <p>Second Share: <strong>{result.share2}</strong></p>
                </>
              )}
              {result.type === 'Proportional Value' && (
                <p>Second Value: <strong>{result.result}</strong></p>
              )}

              {result.steps && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {result.steps.map((step, index) => (
                    <p key={index} className="step">{step}</p>
                  ))}
                </div>
              )}

              {renderVisualization()}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default RatioAndProportion;