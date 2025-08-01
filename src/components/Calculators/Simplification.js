import React, { useState } from 'react';
import '../../styles/calculator.css';

const Simplification = () => {
  const [inputs, setInputs] = useState({
    expression: '',
    variable: 'x'
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('simplify');
  const [history, setHistory] = useState([]);
  const [showSymbols, setShowSymbols] = useState(false);

  // Symbol buttons for easy input
  const symbols = [
    { display: '+', value: '+' },
    { display: '-', value: '-' },
    { display: '×', value: '*' },
    { display: '÷', value: '/' },
    { display: '^', value: '^' },
    { display: '(', value: '(' },
    { display: ')', value: ')' },
    { display: '√', value: 'sqrt(' },
    { display: 'x²', value: '^2' },
    { display: 'π', value: 'pi' },
    { display: 'e', value: 'e' },
    { display: 'log', value: 'log(' }
  ];

  const insertSymbol = (symbol) => {
    const textarea = document.getElementById('expressionInput');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = inputs.expression;
    
    setInputs({
      ...inputs,
      expression: current.substring(0, start) + symbol + current.substring(end)
    });
    
    // Set cursor position after inserted symbol
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
      textarea.focus();
    }, 0);
  };

  const simplifyExpression = () => {
    try {
      // In a real app, you would use a proper math parser like math.js
      // This is a simplified version for demonstration
      let simplified;
      let steps = [];
      
      const expr = inputs.expression
        .replace(/\s+/g, '')
        .replace(/\^/g, '**')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Evaluation step
      steps.push(`Evaluating: ${inputs.expression}`);
      simplified = eval(expr);
      steps.push(`Result: ${simplified}`);

      const newResult = {
        original: inputs.expression,
        simplified: simplified,
        steps: steps,
        timestamp: new Date().toLocaleString()
      };

      setResult(newResult);
      setHistory([newResult, ...history].slice(0, 10));
    } catch (error) {
      alert('Invalid expression. Please check your input.');
    }
  };

  const expandExpression = () => {
    // This would use a proper algebra system in a real implementation
    // Simple demonstration for binomial expansion
    const expr = inputs.expression;
    let expanded;
    let steps = [];
    
    if (expr.match(/\([a-z]\+\d\)\^2/)) {
      const match = expr.match(/\(([a-z])\+(\d)\)\^2/);
      const variable = match[1];
      const num = parseInt(match[2]);
      
      steps.push(`Recognized binomial square: (${variable} + ${num})²`);
      expanded = `${variable}^2 + ${2*num}${variable} + ${num*num}`;
      steps.push(`Applied formula: (a + b)² = a² + 2ab + b²`);
      steps.push(`Result: ${expanded}`);
    } else {
      expanded = "Could not automatically expand this expression";
    }

    const newResult = {
      original: expr,
      simplified: expanded,
      steps: steps,
      timestamp: new Date().toLocaleString()
    };

    setResult(newResult);
    setHistory([newResult, ...history].slice(0, 10));
  };

  const factorExpression = () => {
    // Simple demonstration for factoring
    const expr = inputs.expression;
    let factored;
    let steps = [];
    
    if (expr.match(/[a-z]\^2\+\d+[a-z]\+\d+/)) {
      const match = expr.match(/([a-z])\^2\+(\d+)([a-z])\+(\d+)/);
      const variable = match[1];
      const a = parseInt(match[2]);
      const b = parseInt(match[4]);
      
      // Check if it's a perfect square
      const root = Math.sqrt(b);
      if (a === 2*root && root === Math.floor(root)) {
        steps.push(`Recognized perfect square trinomial`);
        factored = `(${variable} + ${root})^2`;
        steps.push(`Applied formula: a² + 2ab + b² = (a + b)²`);
      } else {
        factored = "Could not automatically factor this expression";
      }
    } else {
      factored = "Could not automatically factor this expression";
    }

    const newResult = {
      original: expr,
      simplified: factored,
      steps: steps,
      timestamp: new Date().toLocaleString()
    };

    setResult(newResult);
    setHistory([newResult, ...history].slice(0, 10));
  };

  const resetCalculator = () => {
    setInputs({
      expression: '',
      variable: 'x'
    });
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <h2>Expression Simplification</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'simplify' ? 'active' : ''}`}
          onClick={() => setActiveTab('simplify')}
        >
          Simplify
        </button>
        <button 
          className={`tab ${activeTab === 'expand' ? 'active' : ''}`}
          onClick={() => setActiveTab('expand')}
        >
          Expand
        </button>
        <button 
          className={`tab ${activeTab === 'factor' ? 'active' : ''}`}
          onClick={() => setActiveTab('factor')}
        >
          Factor
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      
      {activeTab !== 'history' && (
        <>
          <div className="input-group">
            <label>Enter Expression:</label>
            <textarea
              id="expressionInput"
              value={inputs.expression}
              onChange={(e) => setInputs({...inputs, expression: e.target.value})}
              placeholder={
                activeTab === 'simplify' ? "e.g., (2+3)*5 or 2x + 3x" :
                activeTab === 'expand' ? "e.g., (x+2)^2" :
                "e.g., x^2 + 4x + 4"
              }
              rows="3"
            />
          </div>
          
          <div className="input-group">
            <label>Variable (for algebra):</label>
            <input
              type="text"
              value={inputs.variable}
              onChange={(e) => setInputs({...inputs, variable: e.target.value})}
              placeholder="e.g., x"
              maxLength="1"
            />
          </div>
          
          <div className="symbol-buttons">
            <button 
              onClick={() => setShowSymbols(!showSymbols)}
              className="toggle-symbols"
            >
              {showSymbols ? 'Hide Symbols' : 'Show Symbols'}
            </button>
            
            {showSymbols && (
              <div className="symbol-grid">
                {symbols.map((symbol, index) => (
                  <button
                    key={index}
                    onClick={() => insertSymbol(symbol.value)}
                    className="symbol-btn"
                  >
                    {symbol.display}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="examples">
            <p><strong>Examples:</strong></p>
            <ul>
              {activeTab === 'simplify' && (
                <>
                  <li><code>2 + 3 * 5</code> → 17</li>
                  <li><code>3x + 2x - x</code> → 4x</li>
                  <li><code>sqrt(16) + log(100)</code> → 6</li>
                </>
              )}
              {activeTab === 'expand' && (
                <>
                  <li><code>(x + 2)^2</code> → x² + 4x + 4</li>
                  <li><code>2(x + 3)</code> → 2x + 6</li>
                </>
              )}
              {activeTab === 'factor' && (
                <>
                  <li><code>x^2 + 4x + 4</code> → (x + 2)²</li>
                  <li><code>2x + 6</code> → 2(x + 3)</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="button-group">
            <button 
              onClick={
                activeTab === 'simplify' ? simplifyExpression :
                activeTab === 'expand' ? expandExpression :
                factorExpression
              }
              className="calculate-btn"
            >
              {activeTab === 'simplify' ? 'Simplify' :
               activeTab === 'expand' ? 'Expand' : 'Factor'}
            </button>
            <button onClick={resetCalculator} className="reset-btn">
              Reset
            </button>
          </div>
        </>
      )}
      
      {activeTab === 'history' && (
        <div className="history">
          <h3>Calculation History</h3>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <div className="history-expression">{item.original}</div>
                  <div className="history-result">→ {item.simplified}</div>
                  <div className="history-time">{item.timestamp}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No calculations in history yet.</p>
          )}
        </div>
      )}
      
      {result && activeTab !== 'history' && (
        <div className="result">
          <h3>Result:</h3>
          <p>Original: <code>{result.original}</code></p>
          <p>Simplified: <strong>{result.simplified}</strong></p>
          
          {result.steps && result.steps.length > 0 && (
            <div className="steps">
              <h4>Steps:</h4>
              <ol>
                {result.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Simplification;