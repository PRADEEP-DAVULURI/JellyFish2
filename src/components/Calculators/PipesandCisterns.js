import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';

const PipesAndCisterns = () => {
  const [pipes, setPipes] = useState([
    { id: 1, time: '', action: 'fill', name: 'Pipe A' },
    { id: 2, time: '', action: 'fill', name: 'Pipe B' }
  ]);
  const [result, setResult] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [history, setHistory] = useState([]);
  const [cisternCapacity, setCisternCapacity] = useState('1');

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const addPipe = () => {
    const pipeLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newId = pipes.length + 1;
    setPipes([
      ...pipes,
      { 
        id: newId, 
        time: '', 
        action: 'fill', 
        name: `Pipe ${pipeLetters[newId - 1]}` 
      }
    ]);
  };

  const removePipe = (id) => {
    if (pipes.length <= 2) return;
    setPipes(pipes.filter(pipe => pipe.id !== id));
    setAnimation(true);
  };

  const updatePipe = (id, field, value) => {
    setPipes(pipes.map(pipe => 
      pipe.id === id ? { ...pipe, [field]: value } : pipe
    ));
  };

  const calculateTime = () => {
    let netWork = 0;
    const capacity = parseFloat(cisternCapacity) || 1;
    
    // Create visualization data first
    const vizData = pipes.map(pipe => {
      const rate = pipe.time && !isNaN(parseFloat(pipe.time)) 
        ? (capacity / parseFloat(pipe.time)).toFixed(2)
        : 0;
      return {
        name: pipe.name,
        rate,
        action: pipe.action
      };
    });

    // Calculate net work
    pipes.forEach(pipe => {
      if (pipe.time && !isNaN(parseFloat(pipe.time))) {
        const rate = capacity / parseFloat(pipe.time);
        netWork += pipe.action === 'fill' ? rate : -rate;
      }
    });

    let newResult;
    if (netWork <= 0) {
      newResult = {
        status: "The cistern will never be filled",
        netWork: 0,
        time: 0
      };
      setVisualization({ pipes: vizData, outcome: 'never' });
    } else {
      const totalTime = (capacity / netWork).toFixed(2);
      newResult = {
        status: `Time to ${netWork > 0 ? 'fill' : 'empty'} the cistern: ${totalTime} hours`,
        netWork: netWork.toFixed(4),
        time: totalTime
      };
      setVisualization({ pipes: vizData, outcome: netWork > 0 ? 'fill' : 'empty', time: totalTime });
    }

    setResult(newResult);
    
    // Add to history
    setHistory(prev => [{
      pipes: [...pipes],
      result: newResult,
      timestamp: new Date().toLocaleString()
    }, ...prev.slice(0, 4)]);
    
    setAnimation(true);
  };

  const resetCalculator = () => {
    setPipes([
      { id: 1, time: '', action: 'fill', name: 'Pipe A' },
      { id: 2, time: '', action: 'fill', name: 'Pipe B' }
    ]);
    setResult(null);
    setVisualization(null);
    setCisternCapacity('1');
  };

  return (
    <div className={`calculator-container ${animation ? 'animate' : ''}`}>
      <h2>Pipes and Cisterns Calculator</h2>
      
      <div className="capacity-control">
        <label>Cistern Capacity (units):</label>
        <input
          type="number"
          value={cisternCapacity}
          onChange={(e) => setCisternCapacity(e.target.value)}
          min="0.1"
          step="0.1"
        />
      </div>

      <div className="interactive-demo">
        <div className="cistern-visualization">
          {visualization && (
            <>
              <div className="cistern">
                <div className={`water-level ${visualization.outcome}`}
                  style={visualization.time ? { 
                    height: `${Math.min(100, (visualization.time/10)*100)}%` 
                  } : {}}>
                  {visualization.time && visualization.outcome !== 'never' && (
                    <span>{visualization.time} hours</span>
                  )}
                </div>
              </div>
              <div className="pipes-visualization">
                {visualization.pipes.map((pipe, index) => (
                  <div key={index} className={`pipe ${pipe.action}`}>
                    <span>{pipe.name}</span>
                    <span>{pipe.rate} units/hr</span>
                    <div className={`flow ${pipe.action}`}></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pipe-controls">
        {pipes.map(pipe => (
          <div key={pipe.id} className="pipe-group">
            <h3>{pipe.name}</h3>
            <div className="input-group">
              <label>Time (hours):</label>
              <input
                type="number"
                value={pipe.time}
                onChange={(e) => updatePipe(pipe.id, 'time', e.target.value)}
                placeholder={`e.g., ${pipe.id + 1}`}
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="input-group">
              <label>Action:</label>
              <select
                value={pipe.action}
                onChange={(e) => updatePipe(pipe.id, 'action', e.target.value)}
              >
                <option value="fill">Fills the cistern</option>
                <option value="empty">Empties the cistern</option>
              </select>
            </div>
            {pipes.length > 2 && (
              <button 
                onClick={() => removePipe(pipe.id)}
                className="remove-btn"
              >
                Remove Pipe
              </button>
            )}
          </div>
        ))}

        <div className="action-buttons">
          <button onClick={addPipe} className="add-btn">
            Add Pipe (+)
          </button>
          <button onClick={calculateTime} className="calculate-btn">
            Calculate Time
          </button>
          <button onClick={resetCalculator} className="reset-btn">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          <p className="result-status">{result.status}</p>
          {result.netWork != 0 && (
            <p className="result-detail">
              Net flow rate: <strong>{Math.abs(result.netWork)} units/hour</strong> (
              {result.netWork > 0 ? 'filling' : 'emptying'})
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="calculation-history">
          <h3>Recent Calculations:</h3>
          <ul>
            {history.map((calc, index) => (
              <li key={index}>
                <button onClick={() => {
                  setPipes(calc.pipes);
                  setResult(calc.result);
                  setVisualization({
                    pipes: calc.pipes.map(pipe => ({
                      name: pipe.name,
                      rate: pipe.time ? (1 / parseFloat(pipe.time)).toFixed(2) : 0,
                      action: pipe.action
                    })),
                    outcome: calc.result.netWork > 0 ? 'fill' : 
                            calc.result.netWork < 0 ? 'empty' : 'never',
                    time: calc.result.time
                  });
                }}>
                  {calc.pipes.map(p => `${p.name}: ${p.time || '?'}h`).join(', ')} → 
                  {calc.result?.status || 'Not calculated'}
                </button>
                <span>{calc.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PipesAndCisterns;