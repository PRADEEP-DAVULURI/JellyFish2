// src/components/Calculators/CalculatorBase.js
import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';

const CalculatorBase = ({ title, description, examples, children }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [history, setHistory] = useState([]);

  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev].slice(0, 5));
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>{title}</h2>
        <p className="calculator-description">{description}</p>
        
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
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'calculator' && (
        <div className="calculator-content">
          {children(addToHistory)}
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="examples-container">
          <h3>Common Examples</h3>
          {examples.map((example, index) => (
            <div key={index} className="example-card">
              <h4>{example.title}</h4>
              <p>{example.problem}</p>
              <div className="formula-preview">
                <p>Formula: {example.formula}</p>
                <p>Solution: {example.solution}</p>
              </div>
              <button 
                className="try-example-btn"
                onClick={example.onTry}
              >
                Try this example
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-container">
          <h3>Recent Calculations</h3>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <p>{item.description}</p>
                  <p className="history-result">Result: {item.result}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No calculation history yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorBase;