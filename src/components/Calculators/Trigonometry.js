import React, { useState } from 'react';
import '../../styles/calculator.css';

const Trigonometry = () => {
  const [inputs, setInputs] = useState({
    angle: '',
    sideA: '',
    sideB: '',
    sideC: '',
    calculateFor: 'sine',
    angleUnit: 'degrees'
  });
  
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const angle = parseFloat(inputs.angle);
    const sideA = parseFloat(inputs.sideA);
    const sideB = parseFloat(inputs.sideB);
    const sideC = parseFloat(inputs.sideC);
    
    // Convert angle to radians if in degrees
    const angleRad = inputs.angleUnit === 'degrees' 
      ? angle * (Math.PI / 180) 
      : angle;
    
    let value, calculation, details;
    
    switch(inputs.calculateFor) {
      case 'sine':
        value = Math.sin(angleRad);
        calculation = `sin(${angle}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}) = ${value.toFixed(4)}`;
        details = `Sine of an angle is the ratio of the length of the opposite side to the hypotenuse.`;
        break;
        
      case 'cosine':
        value = Math.cos(angleRad);
        calculation = `cos(${angle}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}) = ${value.toFixed(4)}`;
        details = `Cosine of an angle is the ratio of the length of the adjacent side to the hypotenuse.`;
        break;
        
      case 'tangent':
        value = Math.tan(angleRad);
        calculation = `tan(${angle}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}) = ${value.toFixed(4)}`;
        details = `Tangent of an angle is the ratio of the length of the opposite side to the adjacent side.`;
        break;
        
      case 'arcsine':
        if (sideA && sideC) {
          value = Math.asin(sideA / sideC);
          const angleValue = inputs.angleUnit === 'degrees' 
            ? (value * (180 / Math.PI)).toFixed(2) 
            : value.toFixed(4);
          calculation = `arcsin(${sideA}/${sideC}) = ${angleValue}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}`;
          details = `Arcsine (inverse sine) finds the angle given the ratio of opposite side to hypotenuse.`;
        }
        break;
        
      case 'arccosine':
        if (sideB && sideC) {
          value = Math.acos(sideB / sideC);
          const angleValue = inputs.angleUnit === 'degrees' 
            ? (value * (180 / Math.PI)).toFixed(2) 
            : value.toFixed(4);
          calculation = `arccos(${sideB}/${sideC}) = ${angleValue}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}`;
          details = `Arccosine (inverse cosine) finds the angle given the ratio of adjacent side to hypotenuse.`;
        }
        break;
        
      case 'arctangent':
        if (sideA && sideB) {
          value = Math.atan(sideA / sideB);
          const angleValue = inputs.angleUnit === 'degrees' 
            ? (value * (180 / Math.PI)).toFixed(2) 
            : value.toFixed(4);
          calculation = `arctan(${sideA}/${sideB}) = ${angleValue}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}`;
          details = `Arctangent (inverse tangent) finds the angle given the ratio of opposite side to adjacent side.`;
        }
        break;
        
      case 'findSide':
        if (angle && sideA) {
          value = sideA / Math.tan(angleRad);
          calculation = `Adjacent side = ${sideA} / tan(${angle}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}) = ${value.toFixed(2)}`;
          details = `Using tangent function to find adjacent side length.`;
        }
        break;
        
      case 'findHypotenuse':
        if (angle && sideA) {
          value = sideA / Math.sin(angleRad);
          calculation = `Hypotenuse = ${sideA} / sin(${angle}${inputs.angleUnit === 'degrees' ? '°' : ' rad'}) = ${value.toFixed(2)}`;
          details = `Using sine function to find hypotenuse length.`;
        }
        break;
        
      default:
        break;
    }
    
    if (value !== undefined) {
      const newResult = {
        value: value,
        calculation,
        details,
        angleInRadians: inputs.angleUnit === 'radians' ? angle : angleRad.toFixed(4),
        angleInDegrees: inputs.angleUnit === 'degrees' ? angle : (angle * (180 / Math.PI)).toFixed(2),
        timestamp: new Date().toLocaleString()
      };
      
      setResult(newResult);
      setHistory([newResult, ...history].slice(0, 10)); // Keep last 10 calculations
    }
  };

  const resetCalculator = () => {
    setInputs({
      angle: '',
      sideA: '',
      sideB: '',
      sideC: '',
      calculateFor: 'sine',
      angleUnit: 'degrees'
    });
    setResult(null);
  };

  const renderInputs = () => {
    switch(inputs.calculateFor) {
      case 'sine':
      case 'cosine':
      case 'tangent':
        return (
          <div className="input-group">
            <label>Angle:</label>
            <input
              type="number"
              value={inputs.angle}
              onChange={(e) => setInputs({...inputs, angle: e.target.value})}
              placeholder={`Enter angle in ${inputs.angleUnit}`}
            />
          </div>
        );
        
      case 'arcsine':
        return (
          <>
            <div className="input-group">
              <label>Opposite Side:</label>
              <input
                type="number"
                value={inputs.sideA}
                onChange={(e) => setInputs({...inputs, sideA: e.target.value})}
                placeholder="Enter opposite side length"
              />
            </div>
            <div className="input-group">
              <label>Hypotenuse:</label>
              <input
                type="number"
                value={inputs.sideC}
                onChange={(e) => setInputs({...inputs, sideC: e.target.value})}
                placeholder="Enter hypotenuse length"
              />
            </div>
          </>
        );
        
      case 'arccosine':
        return (
          <>
            <div className="input-group">
              <label>Adjacent Side:</label>
              <input
                type="number"
                value={inputs.sideB}
                onChange={(e) => setInputs({...inputs, sideB: e.target.value})}
                placeholder="Enter adjacent side length"
              />
            </div>
            <div className="input-group">
              <label>Hypotenuse:</label>
              <input
                type="number"
                value={inputs.sideC}
                onChange={(e) => setInputs({...inputs, sideC: e.target.value})}
                placeholder="Enter hypotenuse length"
              />
            </div>
          </>
        );
        
      case 'arctangent':
        return (
          <>
            <div className="input-group">
              <label>Opposite Side:</label>
              <input
                type="number"
                value={inputs.sideA}
                onChange={(e) => setInputs({...inputs, sideA: e.target.value})}
                placeholder="Enter opposite side length"
              />
            </div>
            <div className="input-group">
              <label>Adjacent Side:</label>
              <input
                type="number"
                value={inputs.sideB}
                onChange={(e) => setInputs({...inputs, sideB: e.target.value})}
                placeholder="Enter adjacent side length"
              />
            </div>
          </>
        );
        
      case 'findSide':
        return (
          <>
            <div className="input-group">
              <label>Angle:</label>
              <input
                type="number"
                value={inputs.angle}
                onChange={(e) => setInputs({...inputs, angle: e.target.value})}
                placeholder={`Enter angle in ${inputs.angleUnit}`}
              />
            </div>
            <div className="input-group">
              <label>Opposite Side:</label>
              <input
                type="number"
                value={inputs.sideA}
                onChange={(e) => setInputs({...inputs, sideA: e.target.value})}
                placeholder="Enter opposite side length"
              />
            </div>
          </>
        );
        
      case 'findHypotenuse':
        return (
          <>
            <div className="input-group">
              <label>Angle:</label>
              <input
                type="number"
                value={inputs.angle}
                onChange={(e) => setInputs({...inputs, angle: e.target.value})}
                placeholder={`Enter angle in ${inputs.angleUnit}`}
              />
            </div>
            <div className="input-group">
              <label>Opposite Side:</label>
              <input
                type="number"
                value={inputs.sideA}
                onChange={(e) => setInputs({...inputs, sideA: e.target.value})}
                placeholder="Enter opposite side length"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="calculator-container">
      <h2>Trigonometry Calculator</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          Calculator
        </button>
        <button 
          className={`tab ${activeTab === 'formulas' ? 'active' : ''}`}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      
      {activeTab === 'calculator' && (
        <>
          <div className="input-group">
            <label>Calculation Type:</label>
            <select
              value={inputs.calculateFor}
              onChange={(e) => setInputs({...inputs, calculateFor: e.target.value})}
            >
              <optgroup label="Basic Functions">
                <option value="sine">Sine (sinθ)</option>
                <option value="cosine">Cosine (cosθ)</option>
                <option value="tangent">Tangent (tanθ)</option>
              </optgroup>
              <optgroup label="Inverse Functions">
                <option value="arcsine">Arcsine (sin⁻¹)</option>
                <option value="arccosine">Arccosine (cos⁻¹)</option>
                <option value="arctangent">Arctangent (tan⁻¹)</option>
              </optgroup>
              <optgroup label="Side Calculations">
                <option value="findSide">Find Adjacent Side</option>
                <option value="findHypotenuse">Find Hypotenuse</option>
              </optgroup>
            </select>
          </div>
          
          <div className="input-group">
            <label>Angle Unit:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="angleUnit"
                  value="degrees"
                  checked={inputs.angleUnit === 'degrees'}
                  onChange={() => setInputs({...inputs, angleUnit: 'degrees'})}
                />
                Degrees
              </label>
              <label>
                <input
                  type="radio"
                  name="angleUnit"
                  value="radians"
                  checked={inputs.angleUnit === 'radians'}
                  onChange={() => setInputs({...inputs, angleUnit: 'radians'})}
                />
                Radians
              </label>
            </div>
          </div>
          
          {renderInputs()}
          
          <div className="button-group">
            <button onClick={calculate} className="btn btn-primary">
              Calculate {inputs.calculateFor}
            </button>
            <button onClick={resetCalculator} className="btn btn-danger">
              Reset
            </button>
          </div>
          
          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p className="result-calculation">{result.calculation}</p>
              <p className="result-details">{result.details}</p>
              <div className="result-grid">
                <div className="result-card">
                  <div className="result-label">Value</div>
                  <div className="result-value">{result.value}</div>
                </div>
                <div className="result-card">
                  <div className="result-label">Angle in Radians</div>
                  <div className="result-value">{result.angleInRadians}</div>
                </div>
                <div className="result-card">
                  <div className="result-label">Angle in Degrees</div>
                  <div className="result-value">{result.angleInDegrees}°</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'formulas' && (
        <div className="formulas">
          <h3>Trigonometry Formulas</h3>
          
          <div className="formula-card">
            <h4>Right Triangle Definitions</h4>
            <p>sinθ = Opposite / Hypotenuse</p>
            <p>cosθ = Adjacent / Hypotenuse</p>
            <p>tanθ = Opposite / Adjacent</p>
          </div>
          
          <div className="formula-card">
            <h4>Inverse Functions</h4>
            <p>θ = sin⁻¹(Opposite / Hypotenuse)</p>
            <p>θ = cos⁻¹(Adjacent / Hypotenuse)</p>
            <p>θ = tan⁻¹(Opposite / Adjacent)</p>
          </div>
          
          <div className="formula-card">
            <h4>Pythagorean Theorem</h4>
            <p>Hypotenuse² = Opposite² + Adjacent²</p>
          </div>
          
          <div className="formula-card">
            <h4>Unit Circle Values</h4>
            <p>sin(0°) = 0, sin(30°) = 0.5, sin(45°) = √2/2, sin(60°) = √3/2, sin(90°) = 1</p>
            <p>cos(0°) = 1, cos(30°) = √3/2, cos(45°) = √2/2, cos(60°) = 0.5, cos(90°) = 0</p>
          </div>
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="history">
          <h3>Calculation History</h3>
          {history.length > 0 ? (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <div className="history-calculation">{item.calculation}</div>
                  <div className="history-value">Result: {item.value}</div>
                  <div className="history-time">{item.timestamp}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No calculations in history yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Trigonometry;