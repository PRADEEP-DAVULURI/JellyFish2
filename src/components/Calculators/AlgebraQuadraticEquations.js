import React, { useState } from 'react';
import '../../styles/calculator.css';

const AlgebraQuadraticEquations = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');

  const calculateRoots = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setResult('❌ Error');
      setExplanation('Please enter valid numbers for all coefficients');
      return;
    }

    if (numA === 0) {
      setResult('❌ Not Quadratic');
      setExplanation('Coefficient "a" cannot be zero (this would make it a linear equation)');
      return;
    }

    const discriminant = numB * numB - 4 * numA * numC;
    const denominator = 2 * numA;

    if (discriminant > 0) {
      const sqrtDiscriminant = Math.sqrt(discriminant);
      const root1 = (-numB + sqrtDiscriminant) / denominator;
      const root2 = (-numB - sqrtDiscriminant) / denominator;
      setResult(`✅ Two Real Solutions`);
      setExplanation(
        `The equation has two different real roots because the discriminant (${discriminant.toFixed(2)}) is positive. 
        These are the points where the parabola crosses the x-axis.`
      );
    } else if (discriminant === 0) {
      const root = -numB / denominator;
      setResult(`✅ One Real Solution`);
      setExplanation(
        `The equation has exactly one real solution (a repeated root) because the discriminant is zero. 
        This is where the parabola just touches the x-axis at its vertex.`
      );
    } else {
      const realPart = -numB / denominator;
      const imaginaryPart = Math.sqrt(-discriminant) / denominator;
      setResult(`🌌 Complex Solutions`);
      setExplanation(
        `The equation has no real solutions because the discriminant (${discriminant.toFixed(2)}) is negative. 
        The parabola doesn't cross the x-axis. The solutions involve imaginary numbers.`
      );
    }
  };

  const formatComplexRoots = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    const discriminant = numB * numB - 4 * numA * numC;
    const denominator = 2 * numA;
    const realPart = -numB / denominator;
    const imaginaryPart = Math.sqrt(-discriminant) / denominator;

    return (
      <div className="complex-roots">
        <p><strong>Exact form:</strong></p>
        <p>x = {formatNumber(realPart)} ± {formatNumber(imaginaryPart)}i</p>
        <p><strong>Decimal form:</strong></p>
        <p>x ≈ {realPart.toFixed(4)} ± {imaginaryPart.toFixed(4)}i</p>
        <p className="note">Note: "i" represents √(-1), the imaginary unit</p>
      </div>
    );
  };

  const formatNumber = (num) => {
    const formatted = num.toFixed(4);
    if (formatted.endsWith('.0000')) return formatted.split('.')[0];
    return formatted.replace(/\.?0+$/, '');
  };

  const resetCalculator = () => {
    setA('');
    setB('');
    setC('');
    setResult(null);
    setExplanation('');
  };

  return (
    <div className="calculator">
      <h2>Algebra (Quadratic Equations)</h2>
      <p className="subtitle">Solve equations in the form: ax² + bx + c = 0</p>
      
      <div className="input-section">
        <div className="input-group">
          <label>Coefficient a (x² term):</label>
          <input 
            type="number" 
            value={a} 
            onChange={(e) => setA(e.target.value)} 
            placeholder="Enter a" 
            step="any"
          />
        </div>
        
        <div className="input-group">
          <label>Coefficient b (x term):</label>
          <input 
            type="number" 
            value={b} 
            onChange={(e) => setB(e.target.value)} 
            placeholder="Enter b" 
            step="any"
          />
        </div>
        
        <div className="input-group">
          <label>Coefficient c (constant term):</label>
          <input 
            type="number" 
            value={c} 
            onChange={(e) => setC(e.target.value)} 
            placeholder="Enter c" 
            step="any"
          />
        </div>
      </div>
      
      <div className="button-group">
        <button onClick={calculateRoots}>Calculate Roots</button>
        <button onClick={resetCalculator} className="reset-button">Reset</button>
      </div>
      
      {result && (
        <div className="result-section">
          <div className="result-header">
            <h3>{result}</h3>
            <p className="explanation">{explanation}</p>
          </div>
          
          {result === '🌌 Complex Solutions' && formatComplexRoots()}
          
          <div className="formula-box">
            <h4>Quadratic Formula:</h4>
            <p>x = [−b ± √(b² − 4ac)] / 2a</p>
            <p className="hint">Try different values to see how the solutions change!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgebraQuadraticEquations;