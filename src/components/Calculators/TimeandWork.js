// src/components/Calculators/TimeandWork.js
import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import { BarChart, PieChart } from './VisualizationComponents';

const TimeAndWork = () => {
  const [workers, setWorkers] = useState([
    { efficiency: '', days: '', name: '' }
  ]);
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');
  const [visualizationData, setVisualizationData] = useState(null);

  const examples = [
    {
      title: "Single Worker",
      problem: "A worker can complete a job in 10 days (efficiency = 1)",
      formula: "Work = Efficiency × Time",
      solution: "Work rate = 1/10 per day",
      onTry: () => {
        setWorkers([{ efficiency: '1', days: '10', name: 'Worker A' }]);
      }
    },
    {
      title: "Two Workers",
      problem: "Worker A (efficiency=1) in 10 days, Worker B (efficiency=1.5) in 6 days",
      formula: "Combined work rate = Sum of individual rates",
      solution: "1/10 + 1.5/6 = 0.1 + 0.25 = 0.35 → ~2.86 days",
      onTry: () => {
        setWorkers([
          { efficiency: '1', days: '10', name: 'Worker A' },
          { efficiency: '1.5', days: '6', name: 'Worker B' }
        ]);
      }
    },
    {
      title: "Efficient Worker",
      problem: "Worker A (efficiency=2) in 5 days",
      formula: "Work = Efficiency × Time",
      solution: "Work rate = 2/5 = 0.4 per day → 2.5 days alone",
      onTry: () => {
        setWorkers([{ efficiency: '2', days: '5', name: 'Skilled Worker' }]);
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
    setWorkers([...workers, { efficiency: '', days: '', name: `Worker ${workers.length + 1}` }]);
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
    let workContributions = [];
    
    workers.forEach((worker, idx) => {
      const efficiency = parseFloat(worker.efficiency) || 1;
      const days = parseFloat(worker.days) || 1;
      const name = worker.name || `Worker ${idx + 1}`;
      
      if (days <= 0) {
        alert(`${name}: Days must be greater than 0`);
        return;
      }
      
      const work = efficiency * days;
      totalWork += work;
      workContributions.push({ name, work });
      
      steps.push(
        `${name}: Efficiency = ${efficiency}, Days = ${days}`,
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

    // Prepare visualization data
    const workerNames = workers.map((worker, idx) => worker.name || `Worker ${idx + 1}`);
    
    // Bar chart data for work contributions
    const barData = {
      labels: workerNames,
      datasets: [
        {
          label: 'Work Contribution',
          data: workContributions.map(w => w.work),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Efficiency',
          data: workers.map(w => parseFloat(w.efficiency) || 1),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    // Pie chart data for time distribution
    const pieData = {
      labels: [...workerNames, 'Combined Time'],
      datasets: [{
        data: [...workers.map(w => parseFloat(w.days) || 1), parseFloat(combinedDays)],
        backgroundColor: [
          ...workers.map((_, i) => `hsl(${(i * 360) / workers.length}, 70%, 60%)`),
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          ...workers.map((_, i) => `hsl(${(i * 360) / workers.length}, 70%, 40%)`),
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    };

    setVisualizationData({
      bar: {
        type: 'bar',
        data: barData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Work Units / Efficiency'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Workers'
              }
            }
          }
        }
      },
      pie: {
        type: 'pie',
        data: pieData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} days (${percentage}%)`;
                }
              }
            }
          }
        }
      }
    });
    
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

  useEffect(() => {
    updateFormulaPreview();
  }, [workers]);

  const renderVisualization = () => {
    if (!visualizationData) return null;

    return (
      <div className="visualization-container">
        <div className="visualization-section">
          <h4>Work Contributions vs Efficiency</h4>
          <div className="chart-container">
            <BarChart data={visualizationData.bar.data} options={visualizationData.bar.options} />
          </div>
          <p className="visualization-caption">
            This chart compares each worker's total work contribution (blue) with their efficiency (red).
          </p>
        </div>

        <div className="visualization-section">
          <h4>Time Distribution</h4>
          <div className="chart-container">
            <PieChart data={visualizationData.pie.data} options={visualizationData.pie.options} />
          </div>
          <p className="visualization-caption">
            This pie chart shows individual completion times and the combined time when working together.
          </p>
        </div>
      </div>
    );
  };

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
                <label>Name (optional):</label>
                <input
                  type="text"
                  value={worker.name}
                  onChange={(e) => updateWorker(index, 'name', e.target.value)}
                  placeholder={`Worker ${index + 1}`}
                />
              </div>
              <div className="input-group">
                <label>Efficiency (1 = standard):</label>
                <input
                  type="number"
                  value={worker.efficiency}
                  onChange={(e) => updateWorker(index, 'efficiency', e.target.value)}
                  placeholder="e.g., 1.5 for 50% faster"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div className="input-group">
                <label>Days to complete alone:</label>
                <input
                  type="number"
                  value={worker.days}
                  onChange={(e) => updateWorker(index, 'days', e.target.value)}
                  placeholder="e.g., 10"
                  min="1"
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

              {renderVisualization()}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default TimeAndWork;