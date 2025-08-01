import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';

const MixtureAndAlligation = () => {
  const [inputs, setInputs] = useState({
    item1: { price: '', quantity: '' },
    item2: { price: '', quantity: '' },
    desiredPrice: '',
    desiredQuantity: ''
  });
  const [mode, setMode] = useState('mixture'); // 'mixture' or 'alligation'
  const [result, setResult] = useState(null);
  const [visualization, setVisualization] = useState(null);
  const [history, setHistory] = useState([]);
  const [animation, setAnimation] = useState(false);

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
      description: "Calculate average price when mixing two components"
    },
    alligation: {
      name: "Alligation Rule",
      description: "Find the mixing ratio to achieve a desired price"
    },
    findQuantity: {
      name: "Find Quantity Needed",
      description: "Calculate how much of each component to use"
    }
  };

  const examples = [
    {
      title: "Basic Mixture",
      description: "5kg at ₹30/kg + 10kg at ₹20/kg",
      type: "mixture",
      inputs: {
        item1: { price: '30', quantity: '5' },
        item2: { price: '20', quantity: '10' },
        desiredPrice: '',
        desiredQuantity: ''
      }
    },
    {
      title: "Alligation Ratio",
      description: "Find ratio to mix ₹30 and ₹20 items to get ₹25",
      type: "alligation",
      inputs: {
        item1: { price: '30', quantity: '' },
        item2: { price: '20', quantity: '' },
        desiredPrice: '25',
        desiredQuantity: ''
      }
    },
    {
      title: "Quantity Calculation",
      description: "Make 15kg mixture at ₹25 using ₹30 and ₹20 items",
      type: "findQuantity",
      inputs: {
        item1: { price: '30', quantity: '' },
        item2: { price: '20', quantity: '' },
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
          `= (${p1} × ${q1}) + (${p2} × ${q2}) = ${totalCost}`,
          `Total Quantity = Quantity1 + Quantity2 = ${q1} + ${q2} = ${totalQuantity}`,
          `Average Price = Total Cost / Total Quantity = ${totalCost} / ${totalQuantity} = ${averagePrice.toFixed(2)}`
        ];

        vizData = {
          type: 'mixture',
          components: [
            { price: p1, quantity: q1, color: '#e74c3c' },
            { price: p2, quantity: q2, color: '#3498db' }
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
        const mean = dp || (p1 + p2) / 2;

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
            `Quantity of Dearer = (${ratioNumerator}/${totalParts}) × ${dq} = ${qty1.toFixed(2)}`,
            `Quantity of Cheaper = (${ratioDenominator}/${totalParts}) × ${dq} = ${qty2.toFixed(2)}`
          );

          vizData = {
            type: 'quantity',
            dearer: { price: dearer, quantity: qty1 },
            cheaper: { price: cheaper, quantity: qty2 },
            desiredPrice: mean,
            desiredQuantity: dq
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
            dearer: p1 > p2 ? p1 : p2,
            cheaper: p1 > p2 ? p2 : p1,
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
      item1: { price: '', quantity: '' },
      item2: { price: '', quantity: '' },
      desiredPrice: '',
      desiredQuantity: ''
    });
    setResult(null);
    setVisualization(null);
  };

  const loadExample = (example) => {
    setInputs(example.inputs);
    setMode(example.type);
  };

  return (
    <div className={`calculator-container ${animation ? 'animate' : ''}`}>
      <h2>Mixture and Alligation Calculator</h2>
      
      <div className="mode-selector">
        {Object.keys(problemTypes).map(type => (
          <button
            key={type}
            className={`tab ${mode === type ? 'active' : ''}`}
            onClick={() => setMode(type)}
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
          <label>Price per unit:</label>
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
          <label>Price per unit:</label>
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
            <label>Target Price:</label>
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
            <div key={index} className="example-card">
              <h4>{example.title}</h4>
              <p>{example.description}</p>
              <button 
                onClick={() => loadExample(example)}
                className="try-example-btn"
              >
                Try This Example
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button onClick={calculate} className="calculate-btn">
          Calculate {mode === 'mixture' ? 'Average Price' : 
                   mode === 'alligation' ? 'Mixing Ratio' : 'Quantities'}
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      {visualization && (
        <div className="visualization">
          <h3>Visualization:</h3>
          {visualization.type === 'mixture' && (
            <div className="mixture-chart">
              <div className="components">
                {visualization.components.map((comp, index) => (
                  <div key={index} className="component-bar" 
                    style={{
                      height: `${comp.quantity * 10}px`,
                      backgroundColor: comp.color,
                      width: '45%'
                    }}>
                    <span>₹{comp.price}/unit × {comp.quantity} units</span>
                  </div>
                ))}
              </div>
              <div className="result-bar" 
                style={{
                  height: `${(visualization.components[0].quantity + visualization.components[1].quantity) * 5}px`,
                  backgroundColor: '#2ecc71'
                }}>
                <span>Average: ₹{visualization.result.toFixed(2)}/unit</span>
              </div>
            </div>
          )}
          {(visualization.type === 'ratio' || visualization.type === 'quantity') && (
            <div className="alligation-diagram">
              <div className="price-labels">
                <span className="dearer">₹{visualization.dearer}</span>
                <span className="cheaper">₹{visualization.cheaper}</span>
              </div>
              <div className="mean-line">
                <span>₹{visualization.desiredPrice}</span>
              </div>
              <div className="ratio-display">
                Ratio: {visualization.ratio}
              </div>
              {visualization.type === 'quantity' && (
                <div className="quantity-display">
                  <p>Quantity of ₹{visualization.dearer}: {visualization.dearer.quantity.toFixed(2)} units</p>
                  <p>Quantity of ₹{visualization.cheaper}: {visualization.cheaper.quantity.toFixed(2)} units</p>
                </div>
              )}
            </div>
          )}
        </div>
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
              <p>Quantity of Dearer: <strong>{result.quantity1} units</strong></p>
              <p>Quantity of Cheaper: <strong>{result.quantity2} units</strong></p>
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
                <button onClick={() => {
                  setInputs(item.inputs);
                  setMode(item.mode);
                }}>
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