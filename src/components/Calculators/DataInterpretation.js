import React, { useState } from 'react';
import '../../styles/calculator.css';

const DataInterpretation = () => {
  const [data, setData] = useState('');
  const [result, setResult] = useState(null);

  const calculateStats = () => {
    const dataArray = data.split(',')
      .map(item => parseFloat(item.trim()))
      .filter(item => !isNaN(item));
    
    if (dataArray.length === 0) {
      alert('Please enter valid numbers separated by commas');
      return;
    }

    const sum = dataArray.reduce((a, b) => a + b, 0);
    const mean = sum / dataArray.length;
    const sorted = [...dataArray].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 
      : sorted[Math.floor(sorted.length/2)]; 
    
    // Mode calculation
    const frequency = {};
    dataArray.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);

    // Additional statistical calculations
    const variance = dataArray.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / dataArray.length;
    const stdDev = Math.sqrt(variance);
    const quartiles = calculateQuartiles(sorted);
    const iqr = quartiles.q3 - quartiles.q1;
    const skewness = calculateSkewness(dataArray, mean, stdDev);
    const outliers = detectOutliers(dataArray, quartiles.q1, quartiles.q3, iqr);

    setResult({
      count: dataArray.length,
      sum: sum.toFixed(2),
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      mode: modes.join(', '),
      min: Math.min(...dataArray).toFixed(2),
      max: Math.max(...dataArray).toFixed(2),
      range: (Math.max(...dataArray) - Math.min(...dataArray)).toFixed(2),
      variance: variance.toFixed(2),
      stdDev: stdDev.toFixed(2),
      q1: quartiles.q1.toFixed(2),
      q3: quartiles.q3.toFixed(2),
      iqr: iqr.toFixed(2),
      skewness: skewness.toFixed(2),
      outliers: outliers.join(', ') || 'None'
    });
  };

  const calculateQuartiles = (sortedData) => {
    const mid = Math.floor(sortedData.length / 2);
    const lowerHalf = sortedData.length % 2 === 0 ? sortedData.slice(0, mid) : sortedData.slice(0, mid);
    const upperHalf = sortedData.slice(mid + (sortedData.length % 2 === 0 ? 0 : 1));
    
    return {
      q1: median(lowerHalf),
      q3: median(upperHalf)
    };
  };

  const median = (arr) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };

  const calculateSkewness = (data, mean, stdDev) => {
    if (stdDev === 0) return 0;
    const n = data.length;
    const cubedDeviations = data.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 3), 0);
    return (n / ((n - 1) * (n - 2))) * cubedDeviations;
  };

  const detectOutliers = (data, q1, q3, iqr) => {
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(x => x < lowerBound || x > upperBound);
  };

  const resetCalculator = () => {
    setData('');
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <h2>Data Interpretation Helper</h2>
      <div className="example">
        <p><strong>Example:</strong> 10,20,30,40,50 → Mean=30, Median=30</p>
      </div>

      <div className="input-group">
        <label>Enter Data (comma separated):</label>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="e.g., 10,20,30,40,50"
        />
      </div>

      <div className="button-group">
        <button onClick={calculateStats} className="calculate-btn">
          Calculate Statistics
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      {result && (
        <div className="result">
          <h3>Results:</h3>
          <div className="result-grid">
            <div className="result-card">
              <div className="result-label">Count</div>
              <div className="result-value">{result.count}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Sum</div>
              <div className="result-value">{result.sum}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Mean</div>
              <div className="result-value">{result.mean}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Median</div>
              <div className="result-value">{result.median}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Mode</div>
              <div className="result-value">{result.mode}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Min</div>
              <div className="result-value">{result.min}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Max</div>
              <div className="result-value">{result.max}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Range</div>
              <div className="result-value">{result.range}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Variance</div>
              <div className="result-value">{result.variance}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Std Dev</div>
              <div className="result-value">{result.stdDev}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Q1</div>
              <div className="result-value">{result.q1}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Q3</div>
              <div className="result-value">{result.q3}</div>
            </div>
            <div className="result-card">
              <div className="result-label">IQR</div>
              <div className="result-value">{result.iqr}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Skewness</div>
              <div className="result-value">{result.skewness}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Outliers</div>
              <div className="result-value">{result.outliers}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInterpretation;