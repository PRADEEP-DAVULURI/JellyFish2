import React, { useState } from 'react';
import '../../styles/calculator.css';

const SurdsAndIndices = () => {
  const [inputs, setInputs] = useState({
    base: '',
    exponent: '',
    root: '',
    expression: ''
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const calculateBasic = () => {
    const base = parseFloat(inputs.base);
    const exponent = parseFloat(inputs.exponent);
    const root = parseFloat(inputs.root);
    
    if (isNaN(base)) {
      alert('Please enter a valid base number');
      return;
    }

    let exponentResult = null;
    let rootResult = null;
    let simplifiedSurd = null;
    let rationalized = null;

    if (!isNaN(exponent)) {
      exponentResult = Math.pow(base, exponent);
    }

    if (!isNaN(root) && root !== 0) {
      rootResult = Math.pow(base, 1/root);
      
      // Surd simplification (for square roots)
      if (root === 2) {
        let remaining = base;
        let factor = 1;
        for (let i = Math.floor(Math.sqrt(base)); i > 1; i--) {
          if (remaining % (i*i) === 0) {
            factor *= i;
            remaining /= (i*i);
            break;
          }
        }
        if (factor !== 1 || remaining !== base) {
          simplifiedSurd = remaining === 1 
            ? `${factor}`
            : `${factor}√${remaining}`;
        }
      }
      
      // Rationalization
      rationalized = `${base}^(1/${root})`;
    }

    setResult({
      exponentiation: exponentResult !== null ? `${base}^${exponent} = ${exponentResult.toFixed(4)}` : null,
      root: rootResult !== null ? `${root}√${base} = ${rootResult.toFixed(4)}` : null,
      simplifiedSurd,
      rationalized,
      exactValue: rootResult !== null ? rootResult : exponentResult
    });
  };

  const calculateExpression = () => {
    try {
      // Handle basic surd and index expressions
      let expr = inputs.expression
        .replace(/√(\d+)/g, 'Math.sqrt($1)') // √n → sqrt(n)
        .replace(/(\d+)\^\((\d+)\/(\d+)\)/g, 'Math.pow($1,$2/$3)') // a^(b/c)
        .replace(/(\d+)\^(\d+)/g, 'Math.pow($1,$2)'); // a^b

      // Evaluate safely
      const value = new Function(`return ${expr}`)();
      
      setResult({
        expressionResult: {
          input: inputs.expression,
          value: value.toFixed(4)
        }
      });
    } catch (error) {
      alert('Invalid expression. Please use format like "2^3" or "√9" or "8^(1/3)"');
    }
  };

  const resetCalculator = () => {
    setInputs({
      base: '',
      exponent: '',
      root: '',
      expression: ''
    });
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <h2>Surds and Indices Calculator</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Calculator
        </button>
        <button 
          className={`tab ${activeTab === 'expression' ? 'active' : ''}`}
          onClick={() => setActiveTab('expression')}
        >
          Expression Evaluator
        </button>
      </div>
      
      {activeTab === 'basic' ? (
        <>
          <div className="input-group">
            <label>Base Number:</label>
            <input
              type="number"
              value={inputs.base}
              onChange={(e) => setInputs({...inputs, base: e.target.value})}
              placeholder="e.g., 8"
              step="any"
            />
          </div>
          <div className="input-group">
            <label>Exponent (for indices):</label>
            <input
              type="number"
              value={inputs.exponent}
              onChange={(e) => setInputs({...inputs, exponent: e.target.value})}
              placeholder="e.g., 3 (leave blank if not needed)"
              step="any"
            />
          </div>
          <div className="input-group">
            <label>Root (for surds):</label>
            <input
              type="number"
              value={inputs.root}
              onChange={(e) => setInputs({...inputs, root: e.target.value})}
              placeholder="e.g., 3 for cube root (leave blank if not needed)"
              step="any"
              min="1"
            />
          </div>
          
          <div className="button-group">
            <button onClick={calculateBasic} className="calculate-btn">
              Calculate
            </button>
            <button onClick={resetCalculator} className="reset-btn">
              Reset
            </button>
          </div>
          
          {result && (
            <div className="result">
              <h3>Results:</h3>
              {result.exponentiation && (
                <p>Exponentiation: <strong>{result.exponentiation}</strong></p>
              )}
              {result.root && (
                <>
                  <p>Root: <strong>{result.root}</strong></p>
                  {result.simplifiedSurd && (
                    <p>Simplified Surd Form: <strong>{result.simplifiedSurd}</strong></p>
                  )}
                  <p>Rationalized Form: <strong>{result.rationalized} = {result.exactValue.toFixed(4)}</strong></p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="input-group">
            <label>Enter Expression:</label>
            <input
              type="text"
              value={inputs.expression}
              onChange={(e) => setInputs({...inputs, expression: e.target.value})}
              placeholder="e.g., 2^3 + √9 - 8^(1/3)"
            />
          </div>
          <div className="examples">
            <p><strong>Examples:</strong></p>
            <ul>
              <li>2^3 → 8</li>
              <li>√16 → 4</li>
              <li>8^(1/3) → 2</li>
              <li>2^3 * 3^2 → 72</li>
            </ul>
          </div>
          
          <div className="button-group">
            <button onClick={calculateExpression} className="calculate-btn">
              Evaluate Expression
            </button>
            <button onClick={resetCalculator} className="reset-btn">
              Reset
            </button>
          </div>
          
          {result?.expressionResult && (
            <div className="result">
              <h3>Result:</h3>
              <p>Expression: <strong>{result.expressionResult.input}</strong></p>
              <p>Value: <strong>{result.expressionResult.value}</strong></p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SurdsAndIndices;