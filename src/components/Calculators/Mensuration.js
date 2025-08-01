import React, { useState } from 'react';
import '../../styles/calculator.css';

const Mensuration = () => {
  const [shape, setShape] = useState('cube');
  const [dimensions, setDimensions] = useState({
    // Common dimensions
    length: '',
    width: '',
    height: '',
    radius: '',
    // Special dimensions
    baseRadius: '',
    slantHeight: '',
    baseSide: '',
    topRadius: '',
    // Pyramid dimensions
    baseLength: '',
    baseWidth: '',
    // Prism dimensions
    baseArea: '',
    perimeter: ''
  });
  
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [history, setHistory] = useState([]);
  const [unit, setUnit] = useState('cm');

  const calculate = () => {
    let volume = 0;
    let surfaceArea = 0;
    let lateralArea = 0;
    let baseArea = 0;
    let properties = {};
    const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1);

    switch(shape) {
      case 'cube':
        const side = parseFloat(dimensions.length);
        volume = Math.pow(side, 3);
        surfaceArea = 6 * Math.pow(side, 2);
        properties = { Side: side };
        break;
        
      case 'cuboid':
        const l = parseFloat(dimensions.length);
        const w = parseFloat(dimensions.width);
        const h = parseFloat(dimensions.height);
        volume = l * w * h;
        surfaceArea = 2 * (l*w + w*h + h*l);
        properties = { Length: l, Width: w, Height: h };
        break;
        
      case 'sphere':
        const r = parseFloat(dimensions.radius);
        volume = (4/3) * Math.PI * Math.pow(r, 3);
        surfaceArea = 4 * Math.PI * Math.pow(r, 2);
        properties = { Radius: r, Diameter: r * 2 };
        break;
        
      case 'cylinder':
        const cr = parseFloat(dimensions.radius);
        const ch = parseFloat(dimensions.height);
        volume = Math.PI * Math.pow(cr, 2) * ch;
        lateralArea = 2 * Math.PI * cr * ch;
        baseArea = Math.PI * Math.pow(cr, 2);
        surfaceArea = 2 * Math.PI * cr * (cr + ch);
        properties = { Radius: cr, Height: ch };
        break;
        
      case 'cone':
        const bcr = parseFloat(dimensions.baseRadius);
        const coh = parseFloat(dimensions.height);
        const csh = dimensions.slantHeight ? parseFloat(dimensions.slantHeight) : 
                   Math.sqrt(Math.pow(bcr, 2) + Math.pow(coh, 2));
        volume = (1/3) * Math.PI * Math.pow(bcr, 2) * coh;
        lateralArea = Math.PI * bcr * csh;
        baseArea = Math.PI * Math.pow(bcr, 2);
        surfaceArea = Math.PI * bcr * (bcr + csh);
        properties = { 
          'Base Radius': bcr, 
          Height: coh, 
          'Slant Height': csh 
        };
        break;
        
      case 'pyramid':
        const bl = parseFloat(dimensions.baseLength);
        const bw = parseFloat(dimensions.baseWidth);
        const ph = parseFloat(dimensions.height);
        baseArea = bl * bw;
        volume = (1/3) * baseArea * ph;
        const slantLength = Math.sqrt(Math.pow(bl/2, 2) + Math.pow(ph, 2));
        const slantWidth = Math.sqrt(Math.pow(bw/2, 2) + Math.pow(ph, 2));
        lateralArea = bl * slantWidth + bw * slantLength;
        surfaceArea = baseArea + lateralArea;
        properties = { 
          'Base Length': bl, 
          'Base Width': bw, 
          Height: ph 
        };
        break;
        
      case 'prism':
        const ba = parseFloat(dimensions.baseArea);
        const prh = parseFloat(dimensions.height);
        volume = ba * prh;
        const latArea = parseFloat(dimensions.perimeter) * prh;
        surfaceArea = (2 * ba) + latArea;
        properties = { 
          'Base Area': ba, 
          Height: prh,
          Perimeter: dimensions.perimeter 
        };
        break;
        
      case 'frustum':
        const r1 = parseFloat(dimensions.baseRadius);
        const r2 = parseFloat(dimensions.topRadius);
        const fh = parseFloat(dimensions.height);
        volume = (1/3) * Math.PI * fh * (Math.pow(r1, 2) + Math.pow(r2, 2) + (r1 * r2));
        const fsh = Math.sqrt(Math.pow(fh, 2) + Math.pow(r1 - r2, 2));
        lateralArea = Math.PI * (r1 + r2) * fsh;
        surfaceArea = lateralArea + (Math.PI * (Math.pow(r1, 2) + Math.pow(r2, 2)));
        properties = { 
          'Base Radius': r1, 
          'Top Radius': r2, 
          Height: fh,
          'Slant Height': fsh 
        };
        break;
        
      default:
        break;
    }

    const newResult = {
      shape: shapeName,
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
      lateralArea: lateralArea ? lateralArea.toFixed(2) : null,
      baseArea: baseArea ? baseArea.toFixed(2) : null,
      properties,
      unit,
      timestamp: new Date().toLocaleString()
    };
    
    setResult(newResult);
    setHistory([newResult, ...history].slice(0, 10));
  };

  const resetCalculator = () => {
    setDimensions({
      length: '',
      width: '',
      height: '',
      radius: '',
      baseRadius: '',
      slantHeight: '',
      baseSide: '',
      topRadius: '',
      baseLength: '',
      baseWidth: '',
      baseArea: '',
      perimeter: ''
    });
    setResult(null);
  };

  const renderInputs = () => {
    switch(shape) {
      case 'cube':
        return (
          <div className="input-group">
            <label>Side Length ({unit}):</label>
            <input
              type="number"
              value={dimensions.length}
              onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
              placeholder="e.g., 5"
              min="0"
              step="any"
            />
          </div>
        );
        
      case 'cuboid':
        return (
          <>
            <div className="input-group">
              <label>Length ({unit}):</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                placeholder="e.g., 4"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Width ({unit}):</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                placeholder="e.g., 3"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 2"
                min="0"
                step="any"
              />
            </div>
          </>
        );
        
      case 'sphere':
        return (
          <div className="input-group">
            <label>Radius ({unit}):</label>
            <input
              type="number"
              value={dimensions.radius}
              onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
              placeholder="e.g., 7"
              min="0"
              step="any"
            />
          </div>
        );
        
      case 'cylinder':
        return (
          <>
            <div className="input-group">
              <label>Radius ({unit}):</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                placeholder="e.g., 3"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 8"
                min="0"
                step="any"
              />
            </div>
          </>
        );
        
      case 'cone':
        return (
          <>
            <div className="input-group">
              <label>Base Radius ({unit}):</label>
              <input
                type="number"
                value={dimensions.baseRadius}
                onChange={(e) => setDimensions({...dimensions, baseRadius: e.target.value})}
                placeholder="e.g., 5"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 12"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Slant Height ({unit}, optional):</label>
              <input
                type="number"
                value={dimensions.slantHeight}
                onChange={(e) => setDimensions({...dimensions, slantHeight: e.target.value})}
                placeholder="Will calculate if empty"
                min="0"
                step="any"
              />
            </div>
          </>
        );
        
      case 'pyramid':
        return (
          <>
            <div className="input-group">
              <label>Base Length ({unit}):</label>
              <input
                type="number"
                value={dimensions.baseLength}
                onChange={(e) => setDimensions({...dimensions, baseLength: e.target.value})}
                placeholder="e.g., 6"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Base Width ({unit}):</label>
              <input
                type="number"
                value={dimensions.baseWidth}
                onChange={(e) => setDimensions({...dimensions, baseWidth: e.target.value})}
                placeholder="e.g., 4"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 5"
                min="0"
                step="any"
              />
            </div>
          </>
        );
        
      case 'prism':
        return (
          <>
            <div className="input-group">
              <label>Base Area ({unit}²):</label>
              <input
                type="number"
                value={dimensions.baseArea}
                onChange={(e) => setDimensions({...dimensions, baseArea: e.target.value})}
                placeholder="e.g., 25"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 10"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Base Perimeter ({unit}, optional):</label>
              <input
                type="number"
                value={dimensions.perimeter}
                onChange={(e) => setDimensions({...dimensions, perimeter: e.target.value})}
                placeholder="Needed for surface area"
                min="0"
                step="any"
              />
            </div>
          </>
        );
        
      case 'frustum':
        return (
          <>
            <div className="input-group">
              <label>Base Radius ({unit}):</label>
              <input
                type="number"
                value={dimensions.baseRadius}
                onChange={(e) => setDimensions({...dimensions, baseRadius: e.target.value})}
                placeholder="e.g., 8"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Top Radius ({unit}):</label>
              <input
                type="number"
                value={dimensions.topRadius}
                onChange={(e) => setDimensions({...dimensions, topRadius: e.target.value})}
                placeholder="e.g., 4"
                min="0"
                step="any"
              />
            </div>
            <div className="input-group">
              <label>Height ({unit}):</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 6"
                min="0"
                step="any"
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
      <h2>Mensuration Calculator</h2>
      
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
            <label>Select 3D Shape:</label>
            <select
              value={shape}
              onChange={(e) => {
                setShape(e.target.value);
                resetCalculator();
              }}
            >
              <optgroup label="Regular Solids">
                <option value="cube">Cube</option>
                <option value="cuboid">Cuboid</option>
                <option value="sphere">Sphere</option>
              </optgroup>
              <optgroup label="Circular Solids">
                <option value="cylinder">Cylinder</option>
                <option value="cone">Cone</option>
                <option value="frustum">Frustum (Truncated Cone)</option>
              </optgroup>
              <optgroup label="Pyramids & Prisms">
                <option value="pyramid">Pyramid</option>
                <option value="prism">Prism</option>
              </optgroup>
            </select>
          </div>
          
          <div className="input-group">
            <label>Unit of Measurement:</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="m">Meters (m)</option>
              <option value="in">Inches (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
          
          {renderInputs()}
          
          <div className="button-group">
            <button onClick={calculate} className="btn btn-primary">
              Calculate {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
            <button onClick={resetCalculator} className="btn btn-danger">
              Reset
            </button>
          </div>
          
          {result && (
            <div className="result">
              <h3>{result.shape} Results ({unit})</h3>
              <div className="result-grid">
                <div className="result-card">
                  <div className="result-label">Volume</div>
                  <div className="result-value">{result.volume} {unit}³</div>
                </div>
                <div className="result-card">
                  <div className="result-label">Surface Area</div>
                  <div className="result-value">{result.surfaceArea} {unit}²</div>
                </div>
                {result.lateralArea && (
                  <div className="result-card">
                    <div className="result-label">Lateral Area</div>
                    <div className="result-value">{result.lateralArea} {unit}²</div>
                  </div>
                )}
                {result.baseArea && (
                  <div className="result-card">
                    <div className="result-label">Base Area</div>
                    <div className="result-value">{result.baseArea} {unit}²</div>
                  </div>
                )}
              </div>
              
              <div className="properties">
                <h4>Properties</h4>
                <div className="properties-grid">
                  {Object.entries(result.properties).map(([key, value]) => (
                    <div key={key} className="property-item">
                      <span>{key}:</span>
                      <strong>{value} {unit}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'formulas' && (
        <div className="formulas">
          <h3>Mensuration Formulas</h3>
          
          <div className="formula-card">
            <h4>Cube</h4>
            <p>Volume = side³</p>
            <p>Surface Area = 6 × side²</p>
          </div>
          
          <div className="formula-card">
            <h4>Cuboid</h4>
            <p>Volume = length × width × height</p>
            <p>Surface Area = 2(lw + wh + hl)</p>
          </div>
          
          <div className="formula-card">
            <h4>Sphere</h4>
            <p>Volume = (4/3)πr³</p>
            <p>Surface Area = 4πr²</p>
          </div>
          
          <div className="formula-card">
            <h4>Cylinder</h4>
            <p>Volume = πr²h</p>
            <p>Lateral Area = 2πrh</p>
            <p>Surface Area = 2πr(r + h)</p>
          </div>
          
          <div className="formula-card">
            <h4>Cone</h4>
            <p>Volume = (1/3)πr²h</p>
            <p>Lateral Area = πrl (l = slant height)</p>
            <p>Surface Area = πr(r + l)</p>
          </div>
          
          <div className="formula-card">
            <h4>Pyramid</h4>
            <p>Volume = (1/3) × Base Area × height</p>
            <p>Surface Area = Base Area + Lateral Area</p>
          </div>
          
          <div className="formula-card">
            <h4>Prism</h4>
            <p>Volume = Base Area × height</p>
            <p>Surface Area = (2 × Base Area) + (Perimeter × height)</p>
          </div>
          
          <div className="formula-card">
            <h4>Frustum of Cone</h4>
            <p>Volume = (1/3)πh(R² + r² + Rr)</p>
            <p>Lateral Area = π(R + r)l</p>
            <p>Surface Area = π(R² + r² + (R + r)l)</p>
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
                  <div className="history-shape">{item.shape}</div>
                  <div className="history-values">
                    <span>Vol: {item.volume} {item.unit}³</span>
                    <span>SA: {item.surfaceArea} {item.unit}²</span>
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
    </div>
  );
};

export default Mensuration;