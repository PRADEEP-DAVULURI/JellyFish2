// src/components/Calculators/TimeandWork.js
import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';

const TimeAndWork = () => {
  const [workers, setWorkers] = useState([
    { efficiency: '', days: '' }
  ]);
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');

  const examples = [
    {
      title: "Single Worker",
      problem: "A worker can complete a job in 10 days (efficiency = 1)",
      formula: "Work = Efficiency × Time",
      solution: "Work rate = 1/10 per day",
      onTry: () => {
        setWorkers([{ efficiency: '1', days: '10' }]);
      }
    },
    {
      title: "Two Workers",
      problem: "Worker A (efficiency=1) in 10 days, Worker B (efficiency=1.5) in 6 days",
      formula: "Combined work rate = Sum of individual rates",
      solution: "1/10 + 1.5/6 = 0.1 + 0.25 = 0.35 → ~2.86 days",
      onTry: () => {
        setWorkers([
          { efficiency: '1', days: '10' },
          { efficiency: '1.5', days: '6' }
        ]);
      }
    },
    {
      title: "Efficient Worker",
      problem: "Worker A (efficiency=2) in 5 days",
      formula: "Work = Efficiency × Time",
      solution: "Work rate = 2/5 = 0.4 per day → 2.5 days alone",
      onTry: () => {
        setWorkers([{ efficiency: '2', days: '5' }]);
      }
    }
  ];

  const updateFormulaPreview = () => {
    const rates = workers.map(worker => {
      const eff = worker.efficiency || 'E';
      const days = worker.days || 'D';
      return `${eff}/${days}`;
    }).join(' + ');
    
    setFormulaPreview(`Combined work rate = ${rates || 'Sum of individual rates'}`);
  };

  const addWorker = () => {
    setWorkers([...workers, { efficiency: '', days: '' }]);
  };

  const removeWorker = (index) => {
    if (workers.length <= 1) return;
    const updated = [...workers];
    updated.splice(index, 1);
    setWorkers(updated);
  };

  const updateWorker = (index, field, value) => {
    const updated = [...workers];
    updated[index][field] = value;
    setWorkers(updated);
  };

  const calculate = (addToHistory) => {
    let totalWork = 0;
    let steps = [];
    
    workers.forEach((worker, idx) => {
      const efficiency = parseFloat(worker.efficiency) || 1;
      const days = parseFloat(worker.days) || 1;
      
      if (days <= 0) {
        alert(`Worker ${idx + 1}: Days must be greater than 0`);
        return;
      }
      
      const work = efficiency * days;
      totalWork += work;
      
      steps.push(
        `Worker ${idx + 1}: Efficiency = ${efficiency}, Days = ${days}`,
        `Work contribution = ${efficiency} × ${days} = ${work}`
      );
    });
    
    const totalEfficiency = workers.reduce((sum, worker) => {
      return sum + (parseFloat(worker.efficiency) || 1);
    }, 0);
    
    steps.push(
      `Total work units = ${totalWork}`,
      `Total efficiency = ${totalEfficiency}`
    );
    
    if (totalEfficiency <= 0) {
      alert('Total efficiency must be greater than 0');
      return;
    }
    
    const combinedDays = (totalWork / totalEfficiency).toFixed(2);
    
    steps.push(
      `Combined time needed = Total work / Total efficiency`,
      `${totalWork} / ${totalEfficiency} = ${combinedDays} days`
    );
    
    setResult({
      totalWork,
      totalEfficiency,
      combinedDays,
      steps
    });

    addToHistory({
      description: `${workers.length} worker(s) calculation`,
      result: `Combined time: ${combinedDays} days`
    });
  };

  React.useEffect(() => {
    updateFormulaPreview();
  }, [workers]);

  return (
    <CalculatorBase 
      title="Time and Work Calculator" 
      description="Calculate combined work time for multiple workers with different efficiencies."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          {workers.map((worker, index) => (
            <div key={index} className="worker-group">
              <h3>Worker {index + 1}</h3>
              <div className="input-group">
                <label>Efficiency (1 = standard):</label>
                <input
                  type="number"
                  value={worker.efficiency}
                  onChange={(e) => updateWorker(index, 'efficiency', e.target.value)}
                  placeholder="e.g., 1.5 for 50% faster"
                />
              </div>
              <div className="input-group">
                <label>Days to complete alone:</label>
                <input
                  type="number"
                  value={worker.days}
                  onChange={(e) => updateWorker(index, 'days', e.target.value)}
                  placeholder="e.g., 10"
                />
              </div>
              {workers.length > 1 && (
                <button 
                  onClick={() => removeWorker(index)}
                  className="remove-btn"
                >
                  Remove Worker
                </button>
              )}
            </div>
          ))}

          <button onClick={addWorker} className="add-btn">
            Add Worker
          </button>

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate Combined Time
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p>Total Work Units: <strong>{result.totalWork}</strong></p>
              <p>Total Efficiency: <strong>{result.totalEfficiency}</strong></p>
              <p>Combined Time Needed: <strong>{result.combinedDays} days</strong></p>
              
              {result.steps && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {result.steps.map((step, index) => (
                    <p key={index} className="step">{step}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default TimeAndWork;