import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const ProbabilityCalculator = () => {
  const [calcType, setCalcType] = useState('basic');
  const [inputs, setInputs] = useState({
    favorable: '',
    total: '',
    probability1: '',
    probability2: '',
    probability3: '',
    andOr: 'or',
    dependent: 'independent',
    given: ''
  });
  const [result, setResult] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [visualization, setVisualization] = useState(null);

  const probabilityTypes = [
    { value: 'basic', label: 'Basic Probability' },
    { value: 'combined', label: 'Combined Probability' },
    { value: 'conditional', label: 'Conditional Probability' },
    { value: 'binomial', label: 'Binomial Probability' },
    { value: 'permutation', label: 'Permutations' },
    { value: 'combination', label: 'Combinations' }
  ];

  const examples = [
    {
      title: "Basic Probability",
      problem: "3 favorable outcomes out of 6",
      formula: "P = favorable / total",
      solution: "0.5 or 50%",
      onTry: () => {
        setCalcType('basic');
        setInputs({...inputs, favorable: '3', total: '6'});
      }
    },
    {
      title: "Independent Events (AND)",
      problem: "P(A)=0.5 and P(B)=0.5",
      formula: "P(A AND B) = P(A) × P(B)",
      solution: "0.25 or 25%",
      onTry: () => {
        setCalcType('combined');
        setInputs({...inputs, probability1: '0.5', probability2: '0.5', andOr: 'and', dependent: 'independent'});
      }
    },
    {
      title: "Conditional Probability",
      problem: "P(A)=0.3, P(B|A)=0.7",
      formula: "P(A AND B) = P(A) × P(B|A)",
      solution: "0.21 or 21%",
      onTry: () => {
        setCalcType('conditional');
        setInputs({...inputs, probability1: '0.3', given: '0.7'});
      }
    }
  ];

  // Generate visualization based on calculation type and inputs
  useEffect(() => {
    if (!result) {
      setVisualization(null);
      return;
    }

    let viz = null;
    switch(calcType) {
      case 'basic':
        const total = parseInt(inputs.total) || 6;
        const favorable = parseInt(inputs.favorable) || 3;
        
        // Dice visualization for basic probability
        if (total <= 6 && total > 0) {
          viz = (
            <div className="dice-visualization">
              <h4>Dice Visualization</h4>
              <div className="dice-container">
                {Array.from({length: total}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`die ${i < favorable ? 'favorable' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p>Favorable outcomes: {favorable} (green)</p>
              <p>Total outcomes: {total}</p>
            </div>
          );
        } 
        // Card visualization for larger numbers
        else if (total <= 52) {
          viz = (
            <div className="card-visualization">
              <h4>Card Deck Visualization</h4>
              <div className="card-container">
                {Array.from({length: Math.min(total, 52)}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`card ${i < favorable ? 'favorable' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p>Favorable outcomes: {favorable} (green)</p>
              <p>Total outcomes: {total}</p>
            </div>
          );
        }
        break;

      case 'combined':
        // Venn diagram for combined probabilities
        const p1 = parseFloat(inputs.probability1) || 0.5;
        const p2 = parseFloat(inputs.probability2) || 0.5;
        const overlap = inputs.dependent === 'independent' ? p1 * p2 : p1 * (parseFloat(inputs.given) || 0.25);
        
        viz = (
          <div className="venn-diagram">
            <h4>Venn Diagram</h4>
            <div className="venn-container">
              <div className="circle a" style={{opacity: p1}}>
                <span>P(A) = {p1.toFixed(2)}</span>
              </div>
              <div className="circle b" style={{opacity: p2}}>
                <span>P(B) = {p2.toFixed(2)}</span>
              </div>
              <div className="intersection" style={{opacity: overlap * 2}}>
                <span>P(A {inputs.andOr === 'and' ? 'AND' : 'OR'} B) = {result.result}</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'binomial':
        // Binomial distribution chart
        const n = parseInt(inputs.total) || 10;
        const k = parseInt(inputs.favorable) || 3;
        const p = parseFloat(inputs.probability1) || 0.5;
        
        viz = (
          <div className="binomial-chart">
            <h4>Binomial Distribution</h4>
            <div className="chart-container">
              {Array.from({length: n + 1}).map((_, x) => {
                const prob = binomialProbability(n, x, p);
                return (
                  <div 
                    key={x} 
                    className={`bar ${x === k ? 'highlight' : ''}`}
                    style={{height: `${prob * 200}px`}}
                    title={`P(${x}) = ${prob.toFixed(4)}`}
                  >
                    <span>{x}</span>
                  </div>
                );
              })}
            </div>
            <p>Highlighted: P({k}) = {result.result}</p>
          </div>
        );
        break;

      default:
        viz = null;
    }

    setVisualization(viz);
  }, [result, calcType, inputs]);

  const binomialProbability = (n, k, p) => {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  };

  const combination = (n, k) => {
    return factorial(n) / (factorial(k) * factorial(n - k));
  };

  const calculateProbability = (addToHistory) => {
    const steps = [];
    let resultObj = { type: '' };

    try {
      switch(calcType) {
        case 'basic':
          const favorable = parseFloat(inputs.favorable);
          const total = parseFloat(inputs.total);
          
          if (isNaN(favorable) || isNaN(total)) {
            throw new Error('Please enter valid numbers');
          }
          if (total === 0) {
            throw new Error('Total outcomes cannot be zero');
          }
          if (favorable > total) {
            throw new Error('Favorable outcomes cannot exceed total outcomes');
          }
          if (favorable < 0) {
            throw new Error('Favorable outcomes cannot be negative');
          }
          
          steps.push(`Basic Probability Formula: P = favorable / total`);
          steps.push(`P = ${favorable} / ${total}`);
          const probability = favorable / total;
          steps.push(`P = ${probability.toFixed(4)}`);
          
          resultObj = {
            type: 'Basic Probability',
            calculation: `${favorable} / ${total}`,
            result: probability.toFixed(4),
            percentage: `${(probability * 100).toFixed(2)}%`,
            explanation: 'Probability of a single event occurring'
          };
          break;

        case 'combined':
          const p1 = parseFloat(inputs.probability1);
          const p2 = parseFloat(inputs.probability2);
          
          if (isNaN(p1) || isNaN(p2)) {
            throw new Error('Please enter valid probabilities');
          }
          if (p1 < 0 || p1 > 1 || p2 < 0 || p2 > 1) {
            throw new Error('Probabilities must be between 0 and 1');
          }
          
          if (inputs.andOr === 'and') {
            steps.push(`Combined Probability (AND) Formula:`);
            if (inputs.dependent === 'independent') {
              steps.push(`For independent events: P(A AND B) = P(A) × P(B)`);
              steps.push(`P = ${p1} × ${p2}`);
              const combined = p1 * p2;
              steps.push(`P = ${combined.toFixed(4)}`);
              
              resultObj = {
                type: 'Combined Probability (AND) - Independent',
                calculation: `${p1} × ${p2}`,
                result: combined.toFixed(4),
                percentage: `${(combined * 100).toFixed(2)}%`,
                explanation: 'Probability of both independent events occurring'
              };
            } else {
              steps.push(`For dependent events: P(A AND B) = P(A) × P(B|A)`);
              const pBgivenA = parseFloat(inputs.given);
              if (isNaN(pBgivenA)) {
                throw new Error('Please enter conditional probability P(B|A)');
              }
              steps.push(`P = ${p1} × ${pBgivenA}`);
              const combined = p1 * pBgivenA;
              steps.push(`P = ${combined.toFixed(4)}`);
              
              resultObj = {
                type: 'Combined Probability (AND) - Dependent',
                calculation: `${p1} × ${pBgivenA}`,
                result: combined.toFixed(4),
                percentage: `${(combined * 100).toFixed(2)}%`,
                explanation: 'Probability of both dependent events occurring'
              };
            }
          } else {
            steps.push(`Combined Probability (OR) Formula:`);
            if (inputs.dependent === 'independent') {
              steps.push(`For independent events: P(A OR B) = P(A) + P(B) - P(A) × P(B)`);
              steps.push(`P = ${p1} + ${p2} - (${p1} × ${p2})`);
              const combined = p1 + p2 - (p1 * p2);
              steps.push(`P = ${combined.toFixed(4)}`);
              
              resultObj = {
                type: 'Combined Probability (OR) - Independent',
                calculation: `${p1} + ${p2} - (${p1} × ${p2})`,
                result: combined.toFixed(4),
                percentage: `${(combined * 100).toFixed(2)}%`,
                explanation: 'Probability of either independent event occurring'
              };
            } else {
              steps.push(`For dependent events: P(A OR B) = P(A) + P(B) - P(A AND B)`);
              const pBgivenA = parseFloat(inputs.given);
              if (isNaN(pBgivenA)) {
                throw new Error('Please enter conditional probability P(B|A)');
              }
              const pAandB = p1 * pBgivenA;
              steps.push(`P = ${p1} + ${p2} - ${pAandB}`);
              const combined = p1 + p2 - pAandB;
              steps.push(`P = ${combined.toFixed(4)}`);
              
              resultObj = {
                type: 'Combined Probability (OR) - Dependent',
                calculation: `${p1} + ${p2} - ${pAandB.toFixed(4)}`,
                result: combined.toFixed(4),
                percentage: `${(combined * 100).toFixed(2)}%`,
                explanation: 'Probability of either dependent event occurring'
              };
            }
          }
          break;

        case 'conditional':
          const pA = parseFloat(inputs.probability1);
          const pBgivenA = parseFloat(inputs.given);
          
          if (isNaN(pA) || isNaN(pBgivenA)) {
            throw new Error('Please enter valid probabilities');
          }
          if (pA < 0 || pA > 1 || pBgivenA < 0 || pBgivenA > 1) {
            throw new Error('Probabilities must be between 0 and 1');
          }
          
          steps.push(`Conditional Probability Formula: P(A AND B) = P(A) × P(B|A)`);
          steps.push(`P = ${pA} × ${pBgivenA}`);
          const conditional = pA * pBgivenA;
          steps.push(`P = ${conditional.toFixed(4)}`);
          
          resultObj = {
            type: 'Conditional Probability',
            calculation: `${pA} × ${pBgivenA}`,
            result: conditional.toFixed(4),
            percentage: `${(conditional * 100).toFixed(2)}%`,
            explanation: 'Probability of both events occurring when B depends on A'
          };
          break;

        case 'binomial':
          const n = parseFloat(inputs.total);
          const k = parseFloat(inputs.favorable);
          const p = parseFloat(inputs.probability1);
          
          if (isNaN(n) || isNaN(k) || isNaN(p)) {
            throw new Error('Please enter valid numbers');
          }
          if (k > n) {
            throw new Error('Successes cannot exceed trials');
          }
          if (p < 0 || p > 1) {
            throw new Error('Probability must be between 0 and 1');
          }
          
          // Combination calculation
          const comb = combination(n, k);
          steps.push(`Combination: C(${n},${k}) = ${n}! / (${k}! × ${n-k}!) = ${comb}`);
          
          // Probability calculation
          const binomial = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
          steps.push(`Binomial Probability: ${comb} × ${p}^${k} × ${(1-p)}^${n-k}`);
          steps.push(`P = ${binomial.toFixed(6)}`);
          
          resultObj = {
            type: 'Binomial Probability',
            calculation: `C(${n},${k}) × ${p}^${k} × ${(1-p)}^${n-k}`,
            result: binomial.toFixed(6),
            percentage: `${(binomial * 100).toFixed(4)}%`,
            explanation: `Probability of exactly ${k} successes in ${n} trials`
          };
          break;

        case 'permutation':
          const nPerm = parseFloat(inputs.favorable);
          const rPerm = parseFloat(inputs.total);
          
          if (isNaN(nPerm) || isNaN(rPerm)) {
            throw new Error('Please enter valid numbers');
          }
          if (rPerm > nPerm) {
            throw new Error('Cannot select more items than available');
          }
          
          const permutation = factorial(nPerm) / factorial(nPerm - rPerm);
          steps.push(`Permutation: P(${nPerm},${rPerm}) = ${nPerm}! / (${nPerm}-${rPerm})!`);
          steps.push(`P = ${permutation}`);
          
          resultObj = {
            type: 'Permutation',
            calculation: `${nPerm}P${rPerm} = ${nPerm}! / (${nPerm}-${rPerm})!`,
            result: permutation,
            explanation: `Number of ways to arrange ${rPerm} items from ${nPerm}`
          };
          break;

        case 'combination':
          const nComb = parseFloat(inputs.favorable);
          const rComb = parseFloat(inputs.total);
          
          if (isNaN(nComb) || isNaN(rComb)) {
            throw new Error('Please enter valid numbers');
          }
          if (rComb > nComb) {
            throw new Error('Cannot select more items than available');
          }
          
          const combinationCalc = combination(nComb, rComb);
          steps.push(`Combination: C(${nComb},${rComb}) = ${nComb}! / (${rComb}! × (${nComb}-${rComb})!)`);
          steps.push(`C = ${combinationCalc}`);
          
          resultObj = {
            type: 'Combination',
            calculation: `${nComb}C${rComb} = ${nComb}! / (${rComb}! × (${nComb}-${rComb})!)`,
            result: combinationCalc,
            explanation: `Number of ways to choose ${rComb} items from ${nComb}`
          };
          break;

        default:
          throw new Error('Invalid calculation type');
      }

      setResult(resultObj);
      setCalculationSteps(steps);

      addToHistory({
        description: resultObj.type,
        result: `Result: ${resultObj.result}${resultObj.percentage ? ` (${resultObj.percentage})` : ''}`
      });

    } catch (error) {
      alert(error.message);
    }
  };

  // Helper function to calculate factorial
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const renderInputs = () => {
    switch(calcType) {
      case 'basic':
        return (
          <>
            <div className="input-group">
              <label>Favorable Outcomes:</label>
              <input
                type="number"
                value={inputs.favorable}
                onChange={(e) => setInputs({...inputs, favorable: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Total Possible Outcomes:</label>
              <input
                type="number"
                value={inputs.total}
                onChange={(e) => setInputs({...inputs, total: e.target.value})}
                placeholder="e.g., 6"
                min="1"
              />
            </div>
          </>
        );
      case 'combined':
        return (
          <>
            <div className="input-group">
              <label>Probability of Event A (0-1):</label>
              <input
                type="number"
                value={inputs.probability1}
                onChange={(e) => setInputs({...inputs, probability1: e.target.value})}
                placeholder="e.g., 0.5"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Probability of Event B (0-1):</label>
              <input
                type="number"
                value={inputs.probability2}
                onChange={(e) => setInputs({...inputs, probability2: e.target.value})}
                placeholder="e.g., 0.5"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Combination:</label>
              <select
                value={inputs.andOr}
                onChange={(e) => setInputs({...inputs, andOr: e.target.value})}
              >
                <option value="and">AND (both events occur)</option>
                <option value="or">OR (either event occurs)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Dependency:</label>
              <select
                value={inputs.dependent}
                onChange={(e) => setInputs({...inputs, dependent: e.target.value})}
              >
                <option value="independent">Independent Events</option>
                <option value="dependent">Dependent Events</option>
              </select>
            </div>
            {inputs.dependent === 'dependent' && (
              <div className="input-group">
                <label>Conditional Probability P(B|A):</label>
                <input
                  type="number"
                  value={inputs.given}
                  onChange={(e) => setInputs({...inputs, given: e.target.value})}
                  placeholder="e.g., 0.7"
                  min="0"
                  max="1"
                  step="0.01"
                />
              </div>
            )}
          </>
        );
      case 'conditional':
        return (
          <>
            <div className="input-group">
              <label>Probability of Event A (0-1):</label>
              <input
                type="number"
                value={inputs.probability1}
                onChange={(e) => setInputs({...inputs, probability1: e.target.value})}
                placeholder="e.g., 0.3"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
            <div className="input-group">
              <label>Conditional Probability P(B|A):</label>
              <input
                type="number"
                value={inputs.given}
                onChange={(e) => setInputs({...inputs, given: e.target.value})}
                placeholder="e.g., 0.7"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </>
        );
      case 'binomial':
        return (
          <>
            <div className="input-group">
              <label>Number of Trials (n):</label>
              <input
                type="number"
                value={inputs.total}
                onChange={(e) => setInputs({...inputs, total: e.target.value})}
                placeholder="e.g., 10"
                min="1"
              />
            </div>
            <div className="input-group">
              <label>Number of Successes (k):</label>
              <input
                type="number"
                value={inputs.favorable}
                onChange={(e) => setInputs({...inputs, favorable: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Probability of Success (p):</label>
              <input
                type="number"
                value={inputs.probability1}
                onChange={(e) => setInputs({...inputs, probability1: e.target.value})}
                placeholder="e.g., 0.5"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </>
        );
      case 'permutation':
      case 'combination':
        return (
          <>
            <div className="input-group">
              <label>Total Items (n):</label>
              <input
                type="number"
                value={inputs.favorable}
                onChange={(e) => setInputs({...inputs, favorable: e.target.value})}
                placeholder="e.g., 5"
                min="1"
              />
            </div>
            <div className="input-group">
              <label>Items Selected (r):</label>
              <input
                type="number"
                value={inputs.total}
                onChange={(e) => setInputs({...inputs, total: e.target.value})}
                placeholder="e.g., 3"
                min="1"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <CalculatorBase 
      title="Probability Calculator" 
      description="Calculate various probability measures including basic, combined, conditional, and combinatorial probabilities."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Calculation Type:</label>
            <select
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
              className="calc-type-selector"
            >
              {probabilityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {renderInputs()}

          <button onClick={() => calculateProbability(addToHistory)} className="calculate-btn">
            Calculate Probability
          </button>

          {result && (
            <div className="result-container">
              <div className="result">
                <h3>Results</h3>
                <div className="result-grid">
                  <div className="result-item">
                    <span className="result-label">Type:</span>
                    <span className="result-value">{result.type}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Calculation:</span>
                    <span className="result-value">{result.calculation}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Result:</span>
                    <span className="result-value">{result.result}</span>
                  </div>
                  {result.percentage && (
                    <div className="result-item">
                      <span className="result-label">Percentage:</span>
                      <span className="result-value">{result.percentage}</span>
                    </div>
                  )}
                  <div className="result-item">
                    <span className="result-label">Explanation:</span>
                    <span className="result-value">{result.explanation}</span>
                  </div>
                </div>

                {calculationSteps.length > 0 && (
                  <div className="step-by-step">
                    <h4>Calculation Steps:</h4>
                    {calculationSteps.map((step, index) => (
                      <div key={index} className="step">{step}</div>
                    ))}
                  </div>
                )}
              </div>

              {visualization && (
                <div className="visualization">
                  {visualization}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default ProbabilityCalculator;