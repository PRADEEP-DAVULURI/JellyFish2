import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/calculator.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MixtureAndAlligation = () => {
  const [inputs, setInputs] = useState({
    item1: { price: '', quantity: '', name: 'Item A' },
    item2: { price: '', quantity: '', name: 'Item B' },
    desiredPrice: '',
    desiredQuantity: ''
  });
  const [mode, setMode] = useState('mixture');
  const [result, setResult] = useState(null);
  const [visualization, setVisualization] = useState(null);
  const [history, setHistory] = useState([]);
  const [animation, setAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('mixture');

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const problemTypes = {
    mixture: {
      name: "Mixture Calculation",
      description: "Calculate average price when mixing two components",
      color: '#3498db'
    },
    alligation: {
      name: "Alligation Rule",
      description: "Find the mixing ratio to achieve a desired price",
      color: '#e74c3c'
    },
    findQuantity: {
      name: "Find Quantity Needed",
      description: "Calculate how much of each component to use",
      color: '#2ecc71'
    }
  };

  const examples = [
    {
      title: "Basic Mixture",
      description: "5kg at ₹30/kg + 10kg at ₹20/kg",
      type: "mixture",
      inputs: {
        item1: { price: '30', quantity: '5', name: 'Premium' },
        item2: { price: '20', quantity: '10', name: 'Standard' },
        desiredPrice: '',
        desiredQuantity: ''
      }
    },
    {
      title: "Alligation Ratio",
      description: "Find ratio to mix ₹30 and ₹20 items to get ₹25",
      type: "alligation",
      inputs: {
        item1: { price: '30', quantity: '', name: 'Premium' },
        item2: { price: '20', quantity: '', name: 'Standard' },
        desiredPrice: '25',
        desiredQuantity: ''
      }
    },
    {
      title: "Quantity Calculation",
      description: "Make 15kg mixture at ₹25 using ₹30 and ₹20 items",
      type: "findQuantity",
      inputs: {
        item1: { price: '30', quantity: '', name: 'Premium' },
        item2: { price: '20', quantity: '', name: 'Standard' },
        desiredPrice: '25',
        desiredQuantity: '15'
      }
    }
  ];

  const calculate = () => {
    const p1 = parseFloat(inputs.item1.price);
    const q1 = parseFloat(inputs.item1.quantity) || 0;
    const p2 = parseFloat(inputs.item2.price);
    const q2 = parseFloat(inputs.item2.quantity) || 0;
    const dp = parseFloat(inputs.desiredPrice);
    const dq = parseFloat(inputs.desiredQuantity) || 0;

    try {
      let resultObj = {};
      let vizData = {};
      let steps = [];

      if (mode === 'mixture') {
        // Mixture calculation
        const totalCost = (p1 * q1) + (p2 * q2);
        const totalQuantity = q1 + q2;
        const averagePrice = totalCost / totalQuantity;

        steps = [
          `Total Cost = (Price1 × Quantity1) + (Price2 × Quantity2)`,
          `= (${p1} × ${q1}) + (${p2} × ${q2}) = ₹${totalCost}`,
          `Total Quantity = Quantity1 + Quantity2 = ${q1} + ${q2} = ${totalQuantity} units`,
          `Average Price = Total Cost / Total Quantity = ₹${totalCost} / ${totalQuantity} = ₹${averagePrice.toFixed(2)}/unit`
        ];

        vizData = {
          type: 'mixture',
          chartData: {
            labels: [inputs.item1.name, inputs.item2.name, 'Mixture'],
            datasets: [
              {
                label: 'Price per Unit (₹)',
                data: [p1, p2, averagePrice],
                backgroundColor: [
                  'rgba(231, 76, 60, 0.7)',
                  'rgba(52, 152, 219, 0.7)',
                  'rgba(46, 204, 113, 0.7)'
                ],
                borderColor: [
                  'rgba(231, 76, 60, 1)',
                  'rgba(52, 152, 219, 1)',
                  'rgba(46, 204, 113, 1)'
                ],
                borderWidth: 1
              }
            ]
          },
          components: [
            { name: inputs.item1.name, price: p1, quantity: q1, color: '#e74c3c' },
            { name: inputs.item2.name, price: p2, quantity: q2, color: '#3498db' }
          ],
          result: averagePrice
        };

        resultObj = {
          type: 'mixture',
          totalCost: totalCost.toFixed(2),
          totalQuantity: totalQuantity.toFixed(2),
          averagePrice: averagePrice.toFixed(2),
          steps
        };
      } 
      else if (mode === 'alligation' || mode === 'findQuantity') {
        // Alligation rule calculation
        const cheaper = Math.min(p1, p2);
        const dearer = Math.max(p1, p2);
        const cheaperName = p1 <= p2 ? inputs.item1.name : inputs.item2.name;
        const dearerName = p1 > p2 ? inputs.item1.name : inputs.item2.name;
        const mean = dp;

        if (mean < cheaper || mean > dearer) {
          throw new Error('Desired price must be between the two component prices');
        }

        const ratioNumerator = dearer - mean;
        const ratioDenominator = mean - cheaper;
        const ratio = simplifyRatio(ratioNumerator, ratioDenominator);

        steps = [
          `Alligation Rule: (Dearer - Mean) : (Mean - Cheaper)`,
          `= (${dearer} - ${mean}) : (${mean} - ${cheaper})`,
          `= ${ratioNumerator} : ${ratioDenominator}`,
          `Simplified Ratio = ${ratio}`
        ];

        if (mode === 'findQuantity' && dq > 0) {
          const totalParts = ratioNumerator + ratioDenominator;
          const qty1 = (ratioNumerator / totalParts) * dq;
          const qty2 = (ratioDenominator / totalParts) * dq;

          steps.push(
            `Total Parts = ${ratioNumerator} + ${ratioDenominator} = ${totalParts}`,
            `Quantity of ${dearerName} = (${ratioNumerator}/${totalParts}) × ${dq} = ${qty1.toFixed(2)} units`,
            `Quantity of ${cheaperName} = (${ratioDenominator}/${totalParts}) × ${dq} = ${qty2.toFixed(2)} units`
          );

          vizData = {
            type: 'quantity',
            chartData: {
              labels: [dearerName, cheaperName],
              datasets: [
                {
                  label: 'Quantity Needed (units)',
                  data: [qty1, qty2],
                  backgroundColor: [
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(52, 152, 219, 0.7)'
                  ],
                  borderColor: [
                    'rgba(231, 76, 60, 1)',
                    'rgba(52, 152, 219, 1)'
                  ],
                  borderWidth: 1
                }
              ]
            },
            dearer: { name: dearerName, price: dearer, quantity: qty1 },
            cheaper: { name: cheaperName, price: cheaper, quantity: qty2 },
            desiredPrice: mean,
            desiredQuantity: dq,
            ratio
          };

          resultObj = {
            type: 'quantity',
            ratio,
            quantity1: qty1.toFixed(2),
            quantity2: qty2.toFixed(2),
            steps
          };
        } else {
          vizData = {
            type: 'ratio',
            chartData: {
              labels: ['Price Difference'],
              datasets: [
                {
                  label: 'Dearer - Mean',
                  data: [dearer - mean],
                  backgroundColor: 'rgba(231, 76, 60, 0.7)',
                  borderColor: 'rgba(231, 76, 60, 1)',
                  borderWidth: 1
                },
                {
                  label: 'Mean - Cheaper',
                  data: [mean - cheaper],
                  backgroundColor: 'rgba(52, 152, 219, 0.7)',
                  borderColor: 'rgba(52, 152, 219, 1)',
                  borderWidth: 1
                }
              ]
            },
            dearer: { name: dearerName, price: dearer },
            cheaper: { name: cheaperName, price: cheaper },
            ratio,
            desiredPrice: mean
          };

          resultObj = {
            type: 'ratio',
            ratio,
            steps
          };
        }
      }

      setResult(resultObj);
      setVisualization(vizData);
      setAnimation(true);

      // Add to history
      setHistory(prev => [{
        inputs: {...inputs},
        mode,
        result: resultObj,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const simplifyRatio = (a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    const divisor = gcd(a, b);
    return `${a / divisor}:${b / divisor}`;
  };

  const resetCalculator = () => {
    setInputs({
      item1: { price: '', quantity: '', name: 'Item A' },
      item2: { price: '', quantity: '', name: 'Item B' },
      desiredPrice: '',
      desiredQuantity: ''
    });
    setResult(null);
    setVisualization(null);
  };

  const loadExample = (example) => {
    setInputs(example.inputs);
    setMode(example.type);
    setActiveTab(example.type);
  };

  const renderMixtureVisualization = () => {
    if (!visualization || visualization.type !== 'mixture') return null;

    return (
      <div className="visualization-section">
        <div className="chart-container">
          <Bar 
            data={visualization.chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Price Comparison (₹/unit)',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Price per Unit (₹)'
                  }
                }
              }
            }}
          />
        </div>
        <div className="mixture-composition">
          <h4>Mixture Composition:</h4>
          <div className="composition-bars">
            {visualization.components.map((comp, index) => (
              <div key={index} className="composition-item">
                <div className="color-box" style={{ backgroundColor: comp.color }}></div>
                <div className="item-details">
                  <span className="item-name">{comp.name}</span>
                  <span className="item-specs">{comp.quantity} units × ₹{comp.price}/unit</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mixture-result">
            <div className="color-box" style={{ backgroundColor: '#2ecc71' }}></div>
            <div className="result-details">
              <span className="result-label">Resulting Mixture</span>
              <span className="result-value">₹{visualization.result.toFixed(2)}/unit</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAlligationVisualization = () => {
    if (!visualization || (visualization.type !== 'ratio' && visualization.type !== 'quantity')) return null;

    return (
      <div className="visualization-section">
        <div className="chart-container">
          <Bar 
            data={visualization.chartData}
            options={{
              responsive: true,
              indexAxis: 'y',
              plugins: {
                title: {
                  display: true,
                  text: visualization.type === 'ratio' ? 
                    'Alligation Rule Components' : 
                    'Required Quantities'
                },
              },
              scales: {
                x: {
                  stacked: true,
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: visualization.type === 'ratio' ? 
                      'Price Difference (₹)' : 
                      'Quantity (units)'
                  }
                },
                y: {
                  stacked: true
                }
              }
            }}
          />
        </div>
        <div className="alligation-details">
          <div className="alligation-ratio">
            <h4>Mixing Ratio:</h4>
            <div className="ratio-display">
              {visualization.dearer.name} : {visualization.cheaper.name} = {visualization.ratio}
            </div>
          </div>
          {visualization.type === 'quantity' && (
            <div className="quantity-details">
              <h4>Required Quantities:</h4>
              <div className="quantity-item">
                <span className="item-name">{visualization.dearer.name}:</span>
                <span className="item-value">{visualization.dearer.quantity.toFixed(2)} units</span>
              </div>
              <div className="quantity-item">
                <span className="item-name">{visualization.cheaper.name}:</span>
                <span className="item-value">{visualization.cheaper.quantity.toFixed(2)} units</span>
              </div>
              <div className="total-quantity">
                <span>Total Mixture:</span>
                <strong>{visualization.desiredQuantity} units at ₹{visualization.desiredPrice}/unit</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`calculator-container ${animation ? 'animate' : ''}`}>
      <h2>Mixture and Alligation Calculator</h2>
      
      <div className="mode-selector">
        {Object.keys(problemTypes).map(type => (
          <button
            key={type}
            className={`tab ${activeTab === type ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(type);
              setMode(type);
            }}
            style={{ backgroundColor: problemTypes[type].color }}
          >
            {problemTypes[type].name}
          </button>
        ))}
      </div>

      <div className="problem-description">
        <p>{problemTypes[mode].description}</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <h3>First Component</h3>
          <label>Name:</label>
          <input
            type="text"
            value={inputs.item1.name}
            onChange={(e) => setInputs({
              ...inputs,
              item1: { ...inputs.item1, name: e.target.value }
            })}
            placeholder="e.g., Premium"
          />
          <label>Price per unit (₹):</label>
          <input
            type="number"
            value={inputs.item1.price}
            onChange={(e) => setInputs({
              ...inputs,
              item1: { ...inputs.item1, price: e.target.value }
            })}
            placeholder="e.g., 30"
            min="0"
          />
          {(mode === 'mixture' || mode === 'findQuantity') && (
            <>
              <label>Quantity:</label>
              <input
                type="number"
                value={inputs.item1.quantity}
                onChange={(e) => setInputs({
                  ...inputs,
                  item1: { ...inputs.item1, quantity: e.target.value }
                })}
                placeholder={mode === 'findQuantity' ? 'Calculate' : 'e.g., 5'}
                min="0"
              />
            </>
          )}
        </div>

        <div className="input-group">
          <h3>Second Component</h3>
          <label>Name:</label>
          <input
            type="text"
            value={inputs.item2.name}
            onChange={(e) => setInputs({
              ...inputs,
              item2: { ...inputs.item2, name: e.target.value }
            })}
            placeholder="e.g., Standard"
          />
          <label>Price per unit (₹):</label>
          <input
            type="number"
            value={inputs.item2.price}
            onChange={(e) => setInputs({
              ...inputs,
              item2: { ...inputs.item2, price: e.target.value }
            })}
            placeholder="e.g., 20"
            min="0"
          />
          {(mode === 'mixture' || mode === 'findQuantity') && (
            <>
              <label>Quantity:</label>
              <input
                type="number"
                value={inputs.item2.quantity}
                onChange={(e) => setInputs({
                  ...inputs,
                  item2: { ...inputs.item2, quantity: e.target.value }
                })}
                placeholder={mode === 'findQuantity' ? 'Calculate' : 'e.g., 10'}
                min="0"
              />
            </>
          )}
        </div>

        {(mode === 'alligation' || mode === 'findQuantity') && (
          <div className="input-group">
            <h3>Desired Mixture</h3>
            <label>Target Price (₹):</label>
            <input
              type="number"
              value={inputs.desiredPrice}
              onChange={(e) => setInputs({
                ...inputs,
                desiredPrice: e.target.value
              })}
              placeholder="e.g., 25"
              min="0"
            />
            {mode === 'findQuantity' && (
              <>
                <label>Total Quantity Needed:</label>
                <input
                  type="number"
                  value={inputs.desiredQuantity}
                  onChange={(e) => setInputs({
                    ...inputs,
                    desiredQuantity: e.target.value
                  })}
                  placeholder="e.g., 15"
                  min="0"
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>Example Problems:</h3>
        <div className="examples-grid">
          {examples.filter(ex => ex.type === mode).map((example, index) => (
            <div key={index} className="example-card" 
                 style={{ borderColor: problemTypes[mode].color }}>
              <h4>{example.title}</h4>
              <p>{example.description}</p>
              <button 
                onClick={() => loadExample(example)}
                className="try-example-btn"
                style={{ backgroundColor: problemTypes[mode].color }}
              >
                Try This Example
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button 
          onClick={calculate} 
          className="calculate-btn"
          style={{ backgroundColor: problemTypes[mode].color }}
        >
          Calculate {mode === 'mixture' ? 'Average Price' : 
                   mode === 'alligation' ? 'Mixing Ratio' : 'Quantities'}
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      {visualization && (
        <>
          {visualization.type === 'mixture' && renderMixtureVisualization()}
          {(visualization.type === 'ratio' || visualization.type === 'quantity') && 
            renderAlligationVisualization()}
        </>
      )}

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          {result.type === 'mixture' && (
            <>
              <p>Total Cost: <strong>₹{result.totalCost}</strong></p>
              <p>Total Quantity: <strong>{result.totalQuantity} units</strong></p>
              <p>Average Price: <strong>₹{result.averagePrice} per unit</strong></p>
            </>
          )}
          {(result.type === 'ratio' || result.type === 'quantity') && (
            <p>Mixing Ratio: <strong>{result.ratio}</strong></p>
          )}
          {result.type === 'quantity' && (
            <>
              <p>Quantity of {inputs.item1.price >= inputs.item2.price ? inputs.item1.name : inputs.item2.name}: <strong>{result.quantity1} units</strong></p>
              <p>Quantity of {inputs.item1.price < inputs.item2.price ? inputs.item1.name : inputs.item2.name}: <strong>{result.quantity2} units</strong></p>
            </>
          )}
          
          <div className="calculation-steps">
            <h4>Calculation Steps:</h4>
            <ol>
              {result.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>Recent Calculations:</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <button 
                  onClick={() => {
                    setInputs(item.inputs);
                    setMode(item.mode);
                    setActiveTab(item.mode);
                  }}
                  style={{ color: problemTypes[item.mode].color }}
                >
                  {problemTypes[item.mode].name} - {item.result.type === 'mixture' ? 
                    `Avg: ₹${item.result.averagePrice}` : 
                    `Ratio: ${item.result.ratio}`}
                </button>
                <span>{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MixtureAndAlligation;