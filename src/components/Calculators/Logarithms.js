import React, { useState } from 'react';
import '../../styles/calculator.css';

const Logarithms = () => {
  const [inputs, setInputs] = useState({
    number: '',
    base: '10',
    customBase: '',
    operation: 'log',
    expression: ''
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [history, setHistory] = useState([]);

  const calculateLog = () => {
    const number = parseFloat(inputs.number);
    let base = inputs.base === 'Math.E' ? Math.E : 
              parseFloat(inputs.base === 'custom' ? inputs.customBase : inputs.base);

    if (number <= 0 || base <= 0 || base === 1) {
      alert('Number must be positive and base must be positive and not equal to 1');
      return;
    }

    let logValue, lnValue, log10Value, antilog, powerValue;
    const operations = [];

    // Calculate all three common log types regardless of operation
    logValue = Math.log(number) / Math.log(base);
    lnValue = Math.log(number);
    log10Value = Math.log10(number);
    antilog = Math.pow(base, logValue);

    if (inputs.operation === 'antilog') {
      powerValue = Math.pow(base, number);
      operations.push({
        type: 'antilog',
        expression: `${base}^${number}`,
        value: powerValue.toFixed(4)
      });
    } else if (inputs.operation === 'change-base') {
      const newBase = parseFloat(inputs.customBase);
      if (newBase <= 0 || newBase === 1) {
        alert('New base must be positive and not equal to 1');
        return;
      }
      const newLogValue = Math.log(number) / Math.log(newBase);
      operations.push({
        type: 'change-base',
        expression: `log_${newBase}(${number})`,
        value: newLogValue.toFixed(4),
        fromBase: base,
        toBase: newBase
      });
    }

    const newResult = {
      number,
      base,
      logValue: logValue.toFixed(4),
      lnValue: lnValue.toFixed(4),
      log10Value: log10Value.toFixed(4),
      antilog: antilog.toFixed(4),
      operations,
      timestamp: new Date().toLocaleString()
    };

    setResult(newResult);
    setHistory([newResult, ...history].slice(0, 10));
  };

  const calculateExpression = () => {
    try {
      // Handle logarithmic expressions
      let expr = inputs.expression
        .replace(/log_(\d+)\(([^)]+)\)/g, '(Math.log($2)/Math.log($1))') // log_b(x)
        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)') // ln(x)
        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)'); // log(x)

      // Evaluate safely
      const value = new Function(`return ${expr}`)();
      
      setResult({
        expressionResult: {
          input: inputs.expression,
          value: value.toFixed(4)
        }
      });
    } catch (error) {
      alert('Invalid expression. Use formats like: log_2(8), ln(e^2), log(100)+log(1000)');
    }
  };

  const resetCalculator = () => {
    setInputs({
      number: '',
      base: '10',
      customBase: '',
      operation: 'log',
      expression: ''
    });
    setResult(null);
  };

  const renderBasicCalculator = () => (
    <>
      <div className="input-group">
        <label>Operation:</label>
        <select
          value={inputs.operation}
          onChange={(e) => setInputs({...inputs, operation: e.target.value})}
        >
          <option value="log">Logarithm</option>
          <option value="antilog">Antilogarithm</option>
          <option value="change-base">Change of Base</option>
        </select>
      </div>

      <div className="input-group">
        <label>{inputs.operation === 'antilog' ? 'Exponent' : 'Number (x)'}:</label>
        <input
          type="number"
          value={inputs.number}
          onChange={(e) => setInputs({...inputs, number: e.target.value})}
          placeholder={inputs.operation === 'antilog' ? 'e.g., 3' : 'e.g., 100'}
          step="any"
        />
      </div>

      <div className="input-group">
        <label>Base:</label>
        <select
          value={inputs.base}
          onChange={(e) => setInputs({...inputs, base: e.target.value})}
        >
          <option value="10">Base 10 (log)</option>
          <option value="2">Base 2 (lb)</option>
          <option value="Math.E">Base e (ln)</option>
          <option value="custom">Custom Base</option>
        </select>
      </div>

      {inputs.base === 'custom' && (
        <div className="input-group">
          <label>Custom Base:</label>
          <input
            type="number"
            value={inputs.customBase}
            onChange={(e) => setInputs({...inputs, customBase: e.target.value})}
            placeholder="e.g., 5"
            step="any"
          />
        </div>
      )}

      {inputs.operation === 'change-base' && inputs.base !== 'custom' && (
        <div className="input-group">
          <label>New Base:</label>
          <input
            type="number"
            value={inputs.customBase}
            onChange={(e) => setInputs({...inputs, customBase: e.target.value})}
            placeholder="e.g., 5"
            step="any"
          />
        </div>
      )}

      <div className="button-group">
        <button onClick={calculateLog} className="calculate-btn">
          {inputs.operation === 'antilog' ? 'Calculate Antilog' : 
           inputs.operation === 'change-base' ? 'Change Base' : 'Calculate Logarithm'}
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>
    </>
  );

  const renderExpressionEvaluator = () => (
    <>
      <div className="input-group">
        <label>Enter Logarithmic Expression:</label>
        <textarea
          value={inputs.expression}
          onChange={(e) => setInputs({...inputs, expression: e.target.value})}
          placeholder="e.g., log_2(8) + ln(e^2) - log(100)"
          rows="3"
        />
      </div>

      <div className="examples">
        <p><strong>Accepted Formats:</strong></p>
        <ul>
          <li><code>log_b(x)</code> - Logarithm base b of x</li>
          <li><code>ln(x)</code> - Natural logarithm</li>
          <li><code>log(x)</code> - Base 10 logarithm</li>
          <li><code>2^3</code> - Antilogarithm (2³)</li>
          <li>Combinations: <code>log_2(8) + ln(e^2)</code></li>
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
    </>
  );

  return (
    <div className="calculator-container">
      <h2>Logarithms Calculator</h2>
      
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
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      
      {activeTab === 'basic' && renderBasicCalculator()}
      {activeTab === 'expression' && renderExpressionEvaluator()}
      {activeTab === 'history' && (
        <div className="history">
          <h3>Calculation History</h3>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <div className="history-calculation">
                    {item.operations.length > 0 ? (
                      <span>{item.operations[0].expression} = {item.operations[0].value}</span>
                    ) : (
                      <span>log_{item.base}({item.number}) = {item.logValue}</span>
                    )}
                  </div>
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
          <h3>Results:</h3>
          
          {activeTab === 'basic' ? (
            <>
              {result.operations.length > 0 ? (
                result.operations.map((op, i) => (
                  <p key={i}>
                    {op.type === 'change-base' ? (
                      <>log<sub>{op.fromBase}</sub>({result.number}) → log<sub>{op.toBase}</sub>({result.number}) = <strong>{op.value}</strong></>
                    ) : (
                      <>{op.expression} = <strong>{op.value}</strong></>
                    )}
                  </p>
                ))
              ) : (
                <>
                  <p>log<sub>{result.base}</sub>({result.number}) = <strong>{result.logValue}</strong></p>
                  <p>Natural log (ln) = <strong>{result.lnValue}</strong></p>
                  <p>Log base 10 = <strong>{result.log10Value}</strong></p>
                  <p>Antilog (base^{result.logValue}) = <strong>{result.antilog}</strong></p>
                </>
              )}
            </>
          ) : (
            <>
              <p>Expression: <code>{result.expressionResult.input}</code></p>
              <p>Result: <strong>{result.expressionResult.value}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Logarithms;