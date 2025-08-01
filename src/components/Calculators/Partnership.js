import React, { useState } from 'react';

const PartnershipCalculator = () => {
  const [partners, setPartners] = useState([
    { name: 'A', investment: '', time: '' },
    { name: 'B', investment: '', time: '' }
  ]);
  const [profit, setProfit] = useState('');
  const [result, setResult] = useState(null);

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
    if (isNaN(profitValue) || profitValue <= 0) {
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
      profit: profitValue.toFixed(2)
    });
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

      <div className="example-card">
        <h4>Example Calculation</h4>
        <p>Partner A invests ₹1000 for 6 months</p>
        <p>Partner B invests ₹2000 for 3 months</p>
        <p>Total profit ₹900 → A gets ₹600, B gets ₹300 (ratio 2:1)</p>
      </div>

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
          <div className="result-detail">
            <p>Total Profit: <strong>₹{result.profit}</strong></p>
            <p>Investment Ratio: <strong>{result.ratios.map(r => r.toFixed(0)).join(':')}</strong></p>
          </div>
          <div className="shares-container">
            {partners.map((partner, index) => (
              <div key={index} className="share-item">
                Partner {partner.name} gets: <span className="share-amount">₹{result.shares[index]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipCalculator;