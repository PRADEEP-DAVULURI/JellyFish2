import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [waterLevel, setWaterLevel] = useState(0);
  const [flowAnimation, setFlowAnimation] = useState(false);

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  useEffect(() => {
    if (result && result.time > 0) {
      setFlowAnimation(true);
      const interval = setInterval(() => {
        setWaterLevel(prev => {
          const newLevel = prev + (100 / (result.time * 10));
          return newLevel >= 100 ? 100 : newLevel;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [result]);

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
    setWaterLevel(0);
    let netWork = 0;
    const capacity = parseFloat(cisternCapacity) || 1;
    
    // Create visualization data
    const vizData = pipes.map(pipe => {
      const rate = pipe.time && !isNaN(parseFloat(pipe.time)) 
        ? (capacity / parseFloat(pipe.time)).toFixed(2)
        : 0;
      return {
        name: pipe.name,
        rate,
        action: pipe.action,
        time: pipe.time
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
      setVisualization({ 
        pipes: vizData, 
        outcome: 'never',
        barChartData: createBarChartData(vizData, 0)
      });
    } else {
      const totalTime = (capacity / netWork).toFixed(2);
      newResult = {
        status: `Time to ${netWork > 0 ? 'fill' : 'empty'} the cistern: ${totalTime} hours`,
        netWork: netWork.toFixed(4),
        time: totalTime
      };
      setVisualization({ 
        pipes: vizData, 
        outcome: netWork > 0 ? 'fill' : 'empty', 
        time: totalTime,
        barChartData: createBarChartData(vizData, netWork)
      });
    }

    setResult(newResult);
    
    // Add to history
    setHistory(prev => [{
      pipes: [...pipes],
      result: newResult,
      timestamp: new Date().toLocaleString()
    }, ...prev.slice(0, 4)]);
    
    setAnimation(true);
    setFlowAnimation(true);
  };

  const createBarChartData = (pipesData, netRate) => {
    return {
      labels: [...pipesData.map(p => p.name), 'Net Flow'],
      datasets: [
        {
          label: 'Flow Rate (units/hour)',
          data: [...pipesData.map(p => p.action === 'fill' ? parseFloat(p.rate) : -parseFloat(p.rate)), netRate],
          backgroundColor: [
            ...pipesData.map(p => p.action === 'fill' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)'),
            netRate > 0 ? 'rgba(75, 192, 192, 0.7)' : 
            netRate < 0 ? 'rgba(255, 159, 64, 0.7)' : 'rgba(201, 203, 207, 0.7)'
          ],
          borderColor: [
            ...pipesData.map(p => p.action === 'fill' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)'),
            netRate > 0 ? 'rgba(75, 192, 192, 1)' : 
            netRate < 0 ? 'rgba(255, 159, 64, 1)' : 'rgba(201, 203, 207, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const resetCalculator = () => {
    setPipes([
      { id: 1, time: '', action: 'fill', name: 'Pipe A' },
      { id: 2, time: '', action: 'fill', name: 'Pipe B' }
    ]);
    setResult(null);
    setVisualization(null);
    setCisternCapacity('1');
    setWaterLevel(0);
    setFlowAnimation(false);
  };

  const renderWaterTank = () => {
    const fillPercentage = Math.min(100, Math.max(0, waterLevel));
    const fillColor = result?.netWork > 0 ? "#4CAF50" : "#F44336";
    
    return (
      <div className="water-tank">
        <div className="tank-container">
          <div 
            className="water-fill"
            style={{
              height: `${fillPercentage}%`,
              backgroundColor: fillColor
            }}
          ></div>
          <div className="water-percentage">{fillPercentage.toFixed(1)}%</div>
        </div>
        <div className="tank-status">
          {result?.status || "Configure pipes to see result"}
        </div>
      </div>
    );
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
          {renderWaterTank()}
          
          {visualization && (
            <div className="pipes-visualization">
              {visualization.pipes.map((pipe, index) => (
                <div key={index} className={`pipe ${pipe.action}`}>
                  <div className="pipe-info">
                    <span className="pipe-name">{pipe.name}</span>
                    <span className="pipe-rate">{pipe.rate} units/hr</span>
                    <span className="pipe-time">{pipe.time || '?'} hours</span>
                  </div>
                  <div className={`flow-indicator ${pipe.action} ${flowAnimation ? 'flowing' : ''}`}>
                    <div className="flow-particle"></div>
                    <div className="flow-particle"></div>
                    <div className="flow-particle"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {visualization?.barChartData && (
          <div className="chart-container">
            <Bar 
              data={visualization.barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${Math.abs(context.raw)} units/hour`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Flow Rate (units/hour)'
                    }
                  }
                }
              }}
            />
          </div>
        )}
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
          {result.netWork !== 0 && (
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
                  setWaterLevel(0);
                  setVisualization({
                    pipes: calc.pipes.map(pipe => ({
                      name: pipe.name,
                      rate: pipe.time ? (1 / parseFloat(pipe.time)).toFixed(2) : 0,
                      action: pipe.action,
                      time: pipe.time
                    })),
                    outcome: calc.result.netWork > 0 ? 'fill' : 
                            calc.result.netWork < 0 ? 'empty' : 'never',
                    time: calc.result.time,
                    barChartData: createBarChartData(
                      calc.pipes.map(pipe => ({
                        name: pipe.name,
                        rate: pipe.time ? (1 / parseFloat(pipe.time)).toFixed(2) : 0,
                        action: pipe.action
                      })),
                      parseFloat(calc.result.netWork)
                    )
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