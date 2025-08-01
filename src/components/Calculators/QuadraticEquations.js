import React, { useState } from 'react';
import '../../styles/calculator.css';

const QuadraticEquations = () => {
  const [coefficients, setCoefficients] = useState({
    a: '',
    b: '',
    c: ''
  });
  const [result, setResult] = useState(null);

  const solveEquation = () => {
    const a = parseFloat(coefficients.a);
    const b = parseFloat(coefficients.b);
    const c = parseFloat(coefficients.c);

    if (a === 0) {
      alert('Coefficient a cannot be zero for a quadratic equation');
      return;
    }

    const discriminant = b * b - 4 * a * c;
    let roots = [];

    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      roots = [
        { type: 'Real and distinct', value: root1.toFixed(4) },
        { type: 'Real and distinct', value: root2.toFixed(4) }
      ];
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      roots = [
        { type: 'Real and equal', value: root.toFixed(4) },
        { type: 'Real and equal', value: root.toFixed(4) }
      ];
    } else {
      const realPart = (-b / (2 * a)).toFixed(4);
      const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
      roots = [
        { type: 'Complex', value: `${realPart} + ${imaginaryPart}i` },
        { type: 'Complex', value: `${realPart} - ${imaginaryPart}i` }
      ];
    }

    setResult({
      equation: `${a}x² + ${b}x + ${c} = 0`,
      discriminant,
      roots
    });
  };

  return (
    <div className="calculator-container">
      <h2>Quadratic Equation Solver</h2>
      <div className="example">
        <p><strong>Example 1:</strong> x² - 5x + 6 = 0 → Roots: 2 and 3</p>
        <p><strong>Example 2:</strong> x² + 4 = 0 → Roots: ±2i</p>
      </div>

      <div className="input-group">
        <label>Coefficient a (x² term):</label>
        <input
          type="number"
          value={coefficients.a}
          onChange={(e) => setCoefficients({...coefficients, a: e.target.value})}
          placeholder="e.g., 1"
        />
      </div>

      <div className="input-group">
        <label>Coefficient b (x term):</label>
        <input
          type="number"
          value={coefficients.b}
          onChange={(e) => setCoefficients({...coefficients, b: e.target.value})}
          placeholder="e.g., -5"
        />
      </div>

      <div className="input-group">
        <label>Coefficient c (constant):</label>
        <input
          type="number"
          value={coefficients.c}
          onChange={(e) => setCoefficients({...coefficients, c: e.target.value})}
          placeholder="e.g., 6"
        />
      </div>

      <button onClick={solveEquation} className="calculate-btn">
        Solve Quadratic Equation
      </button>

      {result && (
        <div className="result">
          <h3>Results:</h3>
          <p>Equation: <strong>{result.equation}</strong></p>
          <p>Discriminant: <strong>{result.discriminant.toFixed(4)}</strong></p>
          <p>Roots:</p>
          <ul>
            {result.roots.map((root, index) => (
              <li key={index}>
                Root {index + 1}: <strong>{root.value}</strong> ({root.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuadraticEquations;