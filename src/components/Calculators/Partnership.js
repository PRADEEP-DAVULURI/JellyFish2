import React, { useState } from 'react';
import './PartnershipCalculator.css';

const PartnershipCalculator = () => {
  const [partners, setPartners] = useState([
    { name: 'A', investment: '', time: '' },
    { name: 'B', investment: '', time: '' }
  ]);
  const [profit, setProfit] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const addPartner = () => {
    setPartners([...partners, { name: String.fromCharCode(65 + partners.length), investment: '', time: '' }]);
  };

  const removePartner = (index) => {
    if (partners.length <= 2) return;
    const updated = [...partners];
    updated.splice(index, 1);
    setPartners(updated);
  };

  const handlePartnerChange = (index, field, value) => {
    const updated = [...partners];
    updated[index][field] = value;
    setPartners(updated);
  };

  const calculateShares = () => {
    const profitValue = parseFloat(profit);
    if (isNaN(profitValue)) {
      alert('Please enter a valid profit amount');
      return;
    }

    const ratios = partners.map(p => {
      const inv = parseFloat(p.investment) || 0;
      const t = parseFloat(p.time) || 1;
      return inv * t;
    });

    const totalRatio = ratios.reduce((sum, r) => sum + r, 0);
    if (totalRatio === 0) {
      alert('Please enter valid investment amounts');
      return;
    }

    const shares = ratios.map(r => (r / totalRatio) * profitValue);

    setResult({
      ratios,
      shares: shares.map(s => s.toFixed(2)),
      totalRatio,
      profit: profitValue.toFixed(2),
      calculationSteps: generateCalculationSteps(ratios, totalRatio, profitValue, shares)
    });
  };

  const generateCalculationSteps = (ratios, totalRatio, profitValue, shares) => {
    const steps = [];
    
    // Step 1: Calculate investment-time products
    steps.push({
      title: "Calculate Investment × Time for each partner",
      details: partners.map((p, i) => (
        `Partner ${p.name}: ₹${p.investment || 0} × ${p.time || 1} = ${ratios[i]}`
      ))
    });
    
    // Step 2: Sum of all ratios
    steps.push({
      title: "Calculate Total Investment Ratio",
      details: [`${ratios.map(r => r).join(' + ')} = ${totalRatio}`]
    });
    
    // Step 3: Calculate share ratios
    steps.push({
      title: "Calculate Share Ratios",
      details: ratios.map((r, i) => (
        `Partner ${partners[i].name}: ${r}/${totalRatio} = ${(r/totalRatio).toFixed(4)}`
      ))
    });
    
    // Step 4: Calculate profit shares
    steps.push({
      title: "Calculate Profit Distribution",
      details: shares.map((s, i) => (
        `Partner ${partners[i].name}: ${(ratios[i]/totalRatio).toFixed(4)} × ₹${profitValue} = ₹${s}`
      ))
    });
    
    return steps;
  };

  const resetCalculator = () => {
    setPartners([
      { name: 'A', investment: '', time: '' },
      { name: 'B', investment: '', time: '' }
    ]);
    setProfit('');
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Partnership Calculator</h2>
        <p className="calculator-description">
          Calculate profit distribution based on partners' investments and time periods
        </p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          Calculator
        </button>
        <button 
          className={`tab ${activeTab === 'examples' ? 'active' : ''}`}
          onClick={() => setActiveTab('examples')}
        >
          Examples
        </button>
      </div>

      {activeTab === 'calculator' ? (
        <>
          <div className="partners-container">
            {partners.map((partner, index) => (
              <div key={index} className="partner-group">
                <h3>Partner {partner.name}</h3>
                <div className="input-group">
                  <label>Investment (₹):</label>
                  <input
                    type="number"
                    value={partner.investment}
                    onChange={(e) => handlePartnerChange(index, 'investment', e.target.value)}
                    placeholder="e.g., 1000"
                    min="0"
                  />
                </div>
                <div className="input-group">
                  <label>Time (months):</label>
                  <input
                    type="number"
                    value={partner.time}
                    onChange={(e) => handlePartnerChange(index, 'time', e.target.value)}
                    placeholder="e.g., 6"
                    min="1"
                  />
                </div>
                {partners.length > 2 && (
                  <button 
                    onClick={() => removePartner(index)}
                    className="remove-btn"
                  >
                    Remove Partner
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button onClick={addPartner} className="add-btn">
              Add Partner
            </button>
          </div>

          <div className="input-group">
            <label>Total Profit (₹):</label>
            <input
              type="number"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="e.g., 900"
              min="0"
            />
          </div>

          <div className="action-buttons">
            <button onClick={calculateShares} className="calculate-btn">
              Calculate Profit Shares
            </button>
            <button onClick={resetCalculator} className="reset-btn">
              Reset Calculator
            </button>
          </div>

          {result && (
            <div className="result animate">
              <h3>Profit Distribution Results</h3>
              
              <div className="visualization">
                <div className="pie-chart">
                  <div className="pie-container">
                    {partners.map((partner, index) => {
                      const percentage = (result.ratios[index] / result.totalRatio) * 100;
                      const rotation = partners.slice(0, index).reduce((sum, _, i) => 
                        sum + (result.ratios[i] / result.totalRatio) * 360, 0);
                      
                      return (
                        <div 
                          key={index}
                          className="pie-slice"
                          style={{
                            backgroundColor: `hsl(${index * 120}, 70%, 60%)`,
                            transform: `rotate(${rotation}deg)`,
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((percentage * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((percentage * 3.6 - 90) * Math.PI / 180)}%)`
                          }}
                        ></div>
                      );
                    })}
                    <div className="pie-center">
                      <div>₹{result.profit}</div>
                    </div>
                  </div>
                  
                  <div className="pie-legend">
                    {partners.map((partner, index) => (
                      <div key={index} className="legend-item">
                        <div 
                          className="color-box" 
                          style={{ backgroundColor: `hsl(${index * 120}, 70%, 60%)` }}
                        ></div>
                        <span>Partner {partner.name}: ₹{result.shares[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bar-chart">
                  <div className="bars-container">
                    {partners.map((partner, index) => (
                      <div key={index} className="bar-group">
                        <div 
                          className="bar"
                          style={{
                            height: `${(result.ratios[index] / result.totalRatio) * 100}%`,
                            backgroundColor: `hsl(${index * 120}, 70%, 60%)`
                          }}
                        >
                          <div className="bar-value">₹{result.shares[index]}</div>
                        </div>
                        <div className="bar-label">Partner {partner.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="result-detail">
                <p>Total Profit: <strong>₹{result.profit}</strong></p>
                <p>Investment Ratio: <strong>{result.ratios.map(r => r.toFixed(0)).join(':')}</strong></p>
              </div>
              
              <div className="calculation-steps">
                <h4>Calculation Steps</h4>
                {result.calculationSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="step">
                    <h5>{step.title}</h5>
                    {step.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="step-detail">
                        {detail}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="examples-container">
          <div className="example-card">
            <h4>Example 1: Equal Time, Different Investments</h4>
            <p>Partner A invests ₹1000 for 12 months</p>
            <p>Partner B invests ₹2000 for 12 months</p>
            <p>Total profit ₹3000 → A gets ₹1000, B gets ₹2000 (ratio 1:2)</p>
            <button 
              className="try-example-btn"
              onClick={() => {
                setPartners([
                  { name: 'A', investment: '1000', time: '12' },
                  { name: 'B', investment: '2000', time: '12' }
                ]);
                setProfit('3000');
                setActiveTab('calculator');
              }}
            >
              Try This Example
            </button>
          </div>
          
          <div className="example-card">
            <h4>Example 2: Different Time Periods</h4>
            <p>Partner A invests ₹1000 for 6 months</p>
            <p>Partner B invests ₹2000 for 3 months</p>
            <p>Total profit ₹900 → A gets ₹600, B gets ₹300 (ratio 2:1)</p>
            <button 
              className="try-example-btn"
              onClick={() => {
                setPartners([
                  { name: 'A', investment: '1000', time: '6' },
                  { name: 'B', investment: '2000', time: '3' }
                ]);
                setProfit('900');
                setActiveTab('calculator');
              }}
            >
              Try This Example
            </button>
          </div>
          
          <div className="example-card">
            <h4>Example 3: Three Partners</h4>
            <p>Partner A invests ₹5000 for 4 months</p>
            <p>Partner B invests ₹3000 for 6 months</p>
            <p>Partner C invests ₹2000 for 12 months</p>
            <p>Total profit ₹10000 → A gets ₹2000, B gets ₹2250, C gets ₹5750 (ratio 8:9:23)</p>
            <button 
              className="try-example-btn"
              onClick={() => {
                setPartners([
                  { name: 'A', investment: '5000', time: '4' },
                  { name: 'B', investment: '3000', time: '6' },
                  { name: 'C', investment: '2000', time: '12' }
                ]);
                setProfit('10000');
                setActiveTab('calculator');
              }}
            >
              Try This Example
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipCalculator;