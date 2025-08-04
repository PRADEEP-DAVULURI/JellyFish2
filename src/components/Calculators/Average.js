import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css'; // Updated import path

const Average = () => {
  const [numbers, setNumbers] = useState('');
  const [weights, setWeights] = useState('');
  const [calcType, setCalcType] = useState('simple');
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');
  const [animationPhase, setAnimationPhase] = useState(0);

  const examples = [
    {
      title: "Simple Average",
      problem: "Numbers: 10, 20, 30, 40, 50",
      formula: "(Sum of numbers) / (Count of numbers)",
      solution: "(10+20+30+40+50)/5 = 30",
      onTry: () => {
        setCalcType('simple');
        setNumbers('10,20,30,40,50');
        setWeights('');
      }
    },
    {
      title: "Weighted Average",
      problem: "Numbers: 10,20,30 with weights: 1,2,3",
      formula: "(Sum of (number × weight)) / (Sum of weights)",
      solution: "(10×1 + 20×2 + 30×3)/(1+2+3) = 23.33",
      onTry: () => {
        setCalcType('weighted');
        setNumbers('10,20,30');
        setWeights('1,2,3');
      }
    },
    {
      title: "Classroom Grades",
      problem: "Test scores: 85,90,78 with weights: 0.3,0.4,0.3",
      formula: "Weighted average calculation",
      solution: "(85×0.3 + 90×0.4 + 78×0.3)/(0.3+0.4+0.3) = 84.9",
      onTry: () => {
        setCalcType('weighted');
        setNumbers('85,90,78');
        setWeights('0.3,0.4,0.3');
      }
    }
  ];

  const updateFormulaPreview = () => {
    if (calcType === 'simple') {
      const nums = numbers || 'numbers';
      setFormulaPreview(`(${nums.split(',').join(' + ')}) / count`);
    } else {
      const nums = numbers || 'numbers';
      const wts = weights || 'weights';
      
      const numArray = nums.split(',');
      const wtArray = wts.split(',');
      
      let formulaParts = [];
      for (let i = 0; i < Math.min(numArray.length, wtArray.length); i++) {
        formulaParts.push(`${numArray[i] || 'n'} × ${wtArray[i] || 'w'}`);
      }
      
      setFormulaPreview(`(${formulaParts.join(' + ')}) / (${wts.split(',').join(' + ')})`);
    }
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, result]);

  const calculateAverage = (addToHistory) => {
    const numArray = numbers.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
    
    if (numArray.length === 0) {
      alert('Please enter valid numbers separated by commas');
      return;
    }

    if (calcType === 'simple') {
      const sum = numArray.reduce((acc, num) => acc + num, 0);
      const avg = sum / numArray.length;
      
      const steps = [
        `Step 1: Sum all numbers`,
        `${numArray.join(' + ')} = ${sum}`,
        `Step 2: Divide by count of numbers`,
        `${sum} / ${numArray.length} = ${avg.toFixed(2)}`
      ];
      
      setResult({
        type: 'Simple Average',
        calculation: `(${numArray.join(' + ')}) / ${numArray.length}`,
        result: avg.toFixed(2),
        steps,
        numbers: numArray,
        sum,
        average: avg
      });

      addToHistory({
        description: `Average of ${numArray.length} numbers`,
        result: avg.toFixed(2)
      });
    } else {
      const weightArray = weights.split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w));
      if (weightArray.length !== numArray.length) {
        alert('Number of weights must match number of values');
        return;
      }
      
      const weightedSum = numArray.reduce((acc, num, i) => acc + (num * (weightArray[i] || 0)), 0);
      const totalWeight = weightArray.reduce((acc, w) => acc + w, 0);
      
      if (totalWeight === 0) {
        alert('Total weight cannot be zero');
        return;
      }
      
      const weightedAvg = weightedSum / totalWeight;
      
      const steps = [
        `Step 1: Multiply each number by its weight`,
        ...numArray.map((n, i) => `${n} × ${weightArray[i]} = ${(n * weightArray[i]).toFixed(2)}`),
        `Step 2: Sum the weighted values`,
        `${numArray.map((n, i) => (n * weightArray[i]).toFixed(2)).join(' + ')} = ${weightedSum.toFixed(2)}`,
        `Step 3: Sum the weights`,
        `${weightArray.join(' + ')} = ${totalWeight}`,
        `Step 4: Divide weighted sum by total weight`,
        `${weightedSum.toFixed(2)} / ${totalWeight} = ${weightedAvg.toFixed(2)}`
      ];
      
      setResult({
        type: 'Weighted Average',
        calculation: `(${numArray.map((n, i) => `${n} × ${weightArray[i]}`).join(' + ')}) / ${totalWeight}`,
        result: weightedAvg.toFixed(2),
        steps,
        numbers: numArray,
        weights: weightArray,
        weightedSum,
        totalWeight,
        average: weightedAvg
      });

      addToHistory({
        description: `Weighted average of ${numArray.length} numbers`,
        result: weightedAvg.toFixed(2)
      });
    }
    setAnimationPhase(0);
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [numbers, weights, calcType, updateFormulaPreview]);

  const renderVisualization = () => {
    if (!result) return null;

    if (calcType === 'simple') {
      return (
        <div className="average-visualization">
          <div className="number-train">
            {result.numbers.map((num, i) => (
              <div 
                key={i} 
                className="number-carriage"
                style={{
                  '--value': num,
                  '--delay': i * 0.2,
                  '--phase': animationPhase,
                  '--hue': (i * 30) % 360
                }}
              >
                <div className="number-value">{num}</div>
                <div className="number-plate">{i+1}</div>
                {animationPhase >= 1 && (
                  <div className="number-sparks">
                    {[...Array(5)].map((_, s) => (
                      <div key={s} className="spark" style={{ '--spark-index': s }}>✨</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {animationPhase >= 2 && (
            <div className="summation-line">
              <div className="summation-arrow">↓</div>
              <div className="summation-result">
                Sum: {result.sum}
              </div>
            </div>
          )}
          
          {animationPhase >= 3 && (
            <div className="division-animation">
              <div className="division-symbol">÷</div>
              <div className="division-number">{result.numbers.length}</div>
              <div className="equals-symbol">=</div>
              <div className="average-result" style={{ '--hue': (result.average * 10) % 360 }}>
                {result.average.toFixed(2)}
                <div className="result-confetti">
                  {[...Array(20)].map((_, c) => (
                    <div key={c} className="confetti" style={{ '--confetti-index': c }}>🎉</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="weighted-visualization">
          <div className="weighted-items">
            {result.numbers.map((num, i) => (
              <div key={i} className="weighted-item">
                <div 
                  className="number-bubble"
                  style={{
                    '--size': num / Math.max(...result.numbers) * 100 + 50,
                    '--hue': (i * 60) % 360,
                    '--phase': animationPhase
                  }}
                >
                  {num}
                </div>
                <div 
                  className="weight-bubble"
                  style={{
                    '--size': result.weights[i] / Math.max(...result.weights) * 100 + 30,
                    '--hue': (i * 60 + 180) % 360,
                    '--phase': animationPhase
                  }}
                >
                  ×{result.weights[i]}
                </div>
                
                {animationPhase >= 1 && (
                  <div className="weighted-product">
                    = {(num * result.weights[i]).toFixed(2)}
                    <div className="product-beam" style={{ '--delay': i * 0.3 }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {animationPhase >= 2 && (
            <div className="weighted-sum">
              <div className="sum-line"></div>
              <div className="sum-total">
                Sum: {result.weightedSum.toFixed(2)}
                <div className="sum-flare"></div>
              </div>
              <div className="total-weights">
                Total Weights: {result.totalWeight}
              </div>
            </div>
          )}
          
          {animationPhase >= 3 && (
            <div className="weighted-final">
              <div className="division-symbol">÷</div>
              <div className="final-result">
                {result.average.toFixed(2)}
                <div className="result-fireworks">
                  {[...Array(8)].map((_, f) => (
                    <div key={f} className="firework" style={{ '--firework-index': f }}>💥</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="result">
        <h3>Result:</h3>
        <p>Type: <strong>{result.type}</strong></p>
        <p>Calculation: <strong>{result.calculation}</strong></p>
        <p>Average: <strong>{result.result}</strong></p>
        
        {result.steps && (
          <div className="step-by-step">
            <h4>Calculation Steps:</h4>
            {result.steps.map((step, index) => (
              <p key={index} className="step">{step}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <CalculatorBase 
      title="Average Calculator" 
      description="Calculate simple or weighted averages from a list of numbers."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Calculation Type:</label>
            <select 
              value={calcType} 
              onChange={(e) => setCalcType(e.target.value)}
              className="type-selector"
            >
              <option value="simple">Simple Average</option>
              <option value="weighted">Weighted Average</option>
            </select>
          </div>

          <div className="input-group">
            <label>Enter numbers (comma separated):</label>
            <input
              type="text"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              placeholder="e.g., 10, 20, 30, 40, 50"
            />
          </div>

          {calcType === 'weighted' && (
            <div className="input-group">
              <label>Enter weights (comma separated):</label>
              <input
                type="text"
                value={weights}
                onChange={(e) => setWeights(e.target.value)}
                placeholder="e.g., 1, 2, 3, 4, 5"
              />
            </div>
          )}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button 
            onClick={() => calculateAverage(addToHistory)} 
            className="calculate-btn"
          >
            Calculate {calcType === 'simple' ? 'Simple' : 'Weighted'} Average
          </button>

          {renderVisualization()}
          {renderResult()}
        </>
      )}
    </CalculatorBase>
  );
};

export default Average;