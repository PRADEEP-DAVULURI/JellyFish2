import React, { useState } from 'react';
import '../../styles/calculator.css';

const Geometry = () => {
  const [shape, setShape] = useState('circle');
  const [dimensions, setDimensions] = useState({
    // Circle
    radius: '',
    diameter: '',
    // Square/Rectangle
    side: '',
    length: '',
    width: '',
    // Triangle
    base: '',
    height: '',
    side1: '',
    side2: '',
    side3: '',
    // Trapezoid
    base1: '',
    base2: '',
    heightT: '',
    // Parallelogram/Rhombus
    baseP: '',
    heightP: '',
    sideP: '',
    // Ellipse
    radiusX: '',
    radiusY: '',
    // Sector
    radiusS: '',
    angle: ''
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' or 'formulas'

  const calculateProperties = () => {
    let area = 0;
    let perimeter = 0;
    let circumference = 0;
    let additionalProps = {};
    const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1);

    switch(shape) {
      case 'circle':
        const radius = parseFloat(dimensions.radius) || parseFloat(dimensions.diameter)/2;
        area = Math.PI * radius * radius;
        circumference = 2 * Math.PI * radius;
        additionalProps = {
          Radius: radius.toFixed(2),
          Diameter: (radius * 2).toFixed(2)
        };
        break;

      case 'square':
        const side = parseFloat(dimensions.side);
        area = side * side;
        perimeter = 4 * side;
        additionalProps = { Side: side.toFixed(2) };
        break;

      case 'rectangle':
        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        area = length * width;
        perimeter = 2 * (length + width);
        additionalProps = {
          Length: length.toFixed(2),
          Width: width.toFixed(2),
          Diagonal: Math.sqrt(length*length + width*width).toFixed(2)
        };
        break;

      case 'triangle':
        const base = parseFloat(dimensions.base);
        const height = parseFloat(dimensions.height);
        const side1 = parseFloat(dimensions.side1);
        const side2 = parseFloat(dimensions.side2);
        const side3 = parseFloat(dimensions.side3);
        
        if (base && height) {
          area = 0.5 * base * height;
        } else if (side1 && side2 && side3) {
          // Heron's formula
          const s = (side1 + side2 + side3) / 2;
          area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
        }
        perimeter = side1 + side2 + side3;
        additionalProps = {
          Base: base.toFixed(2),
          Height: height.toFixed(2),
          'Side 1': side1.toFixed(2),
          'Side 2': side2.toFixed(2),
          'Side 3': side3.toFixed(2),
          'Semi-perimeter': (perimeter/2).toFixed(2)
        };
        break;

      case 'trapezoid':
        const base1 = parseFloat(dimensions.base1);
        const base2 = parseFloat(dimensions.base2);
        const heightT = parseFloat(dimensions.heightT);
        area = 0.5 * (base1 + base2) * heightT;
        additionalProps = {
          'Base 1': base1.toFixed(2),
          'Base 2': base2.toFixed(2),
          Height: heightT.toFixed(2)
        };
        break;

      case 'parallelogram':
        const baseP = parseFloat(dimensions.baseP);
        const heightP = parseFloat(dimensions.heightP);
        area = baseP * heightP;
        perimeter = 2 * (baseP + heightP);
        additionalProps = {
          Base: baseP.toFixed(2),
          Height: heightP.toFixed(2),
          'Interior Angle': '≈60° (varies)'
        };
        break;

      case 'ellipse':
        const radiusX = parseFloat(dimensions.radiusX);
        const radiusY = parseFloat(dimensions.radiusY);
        area = Math.PI * radiusX * radiusY;
        circumference = Math.PI * (3*(radiusX + radiusY) - Math.sqrt((3*radiusX + radiusY)*(radiusX + 3*radiusY)));
        additionalProps = {
          'Major Axis': (2 * Math.max(radiusX, radiusY)).toFixed(2),
          'Minor Axis': (2 * Math.min(radiusX, radiusY)).toFixed(2)
        };
        break;

      case 'sector':
        const radiusS = parseFloat(dimensions.radiusS);
        const angle = parseFloat(dimensions.angle);
        area = (angle/360) * Math.PI * radiusS * radiusS;
        perimeter = 2 * radiusS + (angle/360) * 2 * Math.PI * radiusS;
        additionalProps = {
          Radius: radiusS.toFixed(2),
          Angle: `${angle.toFixed(2)}°`,
          'Arc Length': ((angle/360) * 2 * Math.PI * radiusS).toFixed(2)
        };
        break;

      default:
        break;
    }

    setResult({
      shape: shapeName,
      area: area.toFixed(2),
      perimeter: perimeter ? perimeter.toFixed(2) : null,
      circumference: circumference ? circumference.toFixed(2) : null,
      additionalProps
    });
  };

  const resetCalculator = () => {
    setDimensions({
      radius: '',
      diameter: '',
      side: '',
      length: '',
      width: '',
      base: '',
      height: '',
      side1: '',
      side2: '',
      side3: '',
      base1: '',
      base2: '',
      heightT: '',
      baseP: '',
      heightP: '',
      sideP: '',
      radiusX: '',
      radiusY: '',
      radiusS: '',
      angle: ''
    });
    setResult(null);
  };

  const renderInputs = () => {
    switch(shape) {
      case 'circle':
        return (
          <>
            <div className="input-group">
              <label>Radius:</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => setDimensions({...dimensions, radius: e.target.value, diameter: e.target.value ? e.target.value * 2 : ''})}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>Diameter:</label>
              <input
                type="number"
                value={dimensions.diameter}
                onChange={(e) => setDimensions({...dimensions, diameter: e.target.value, radius: e.target.value ? e.target.value / 2 : ''})}
                placeholder="e.g., 10"
              />
            </div>
          </>
        );
      case 'square':
        return (
          <div className="input-group">
            <label>Side Length:</label>
            <input
              type="number"
              value={dimensions.side}
              onChange={(e) => setDimensions({...dimensions, side: e.target.value})}
              placeholder="e.g., 4"
            />
          </div>
        );
      case 'rectangle':
        return (
          <>
            <div className="input-group">
              <label>Length:</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                placeholder="e.g., 6"
              />
            </div>
            <div className="input-group">
              <label>Width:</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                placeholder="e.g., 4"
              />
            </div>
          </>
        );
      case 'triangle':
        return (
          <>
            <div className="input-group">
              <label>Base:</label>
              <input
                type="number"
                value={dimensions.base}
                onChange={(e) => setDimensions({...dimensions, base: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
            <p className="divider">OR</p>
            <div className="input-group">
              <label>Side 1:</label>
              <input
                type="number"
                value={dimensions.side1}
                onChange={(e) => setDimensions({...dimensions, side1: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
            <div className="input-group">
              <label>Side 2:</label>
              <input
                type="number"
                value={dimensions.side2}
                onChange={(e) => setDimensions({...dimensions, side2: e.target.value})}
                placeholder="e.g., 4"
              />
            </div>
            <div className="input-group">
              <label>Side 3:</label>
              <input
                type="number"
                value={dimensions.side3}
                onChange={(e) => setDimensions({...dimensions, side3: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
          </>
        );
      case 'trapezoid':
        return (
          <>
            <div className="input-group">
              <label>Base 1:</label>
              <input
                type="number"
                value={dimensions.base1}
                onChange={(e) => setDimensions({...dimensions, base1: e.target.value})}
                placeholder="e.g., 6"
              />
            </div>
            <div className="input-group">
              <label>Base 2:</label>
              <input
                type="number"
                value={dimensions.base2}
                onChange={(e) => setDimensions({...dimensions, base2: e.target.value})}
                placeholder="e.g., 4"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.heightT}
                onChange={(e) => setDimensions({...dimensions, heightT: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
          </>
        );
      case 'parallelogram':
        return (
          <>
            <div className="input-group">
              <label>Base:</label>
              <input
                type="number"
                value={dimensions.baseP}
                onChange={(e) => setDimensions({...dimensions, baseP: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.heightP}
                onChange={(e) => setDimensions({...dimensions, heightP: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
          </>
        );
      case 'ellipse':
        return (
          <>
            <div className="input-group">
              <label>Horizontal Radius:</label>
              <input
                type="number"
                value={dimensions.radiusX}
                onChange={(e) => setDimensions({...dimensions, radiusX: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>Vertical Radius:</label>
              <input
                type="number"
                value={dimensions.radiusY}
                onChange={(e) => setDimensions({...dimensions, radiusY: e.target.value})}
                placeholder="e.g., 3"
              />
            </div>
          </>
        );
      case 'sector':
        return (
          <>
            <div className="input-group">
              <label>Radius:</label>
              <input
                type="number"
                value={dimensions.radiusS}
                onChange={(e) => setDimensions({...dimensions, radiusS: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
            <div className="input-group">
              <label>Angle (degrees):</label>
              <input
                type="number"
                value={dimensions.angle}
                onChange={(e) => setDimensions({...dimensions, angle: e.target.value})}
                placeholder="e.g., 60"
                min="0"
                max="360"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderFormulas = () => {
    switch(shape) {
      case 'circle':
        return (
          <div className="formula-card">
            <h4>Circle Formulas</h4>
            <p><strong>Area:</strong> A = πr²</p>
            <p><strong>Circumference:</strong> C = 2πr</p>
            <p><strong>Diameter:</strong> D = 2r</p>
          </div>
        );
      case 'triangle':
        return (
          <div className="formula-card">
            <h4>Triangle Formulas</h4>
            <p><strong>Area (base/height):</strong> A = ½ × b × h</p>
            <p><strong>Area (Heron's):</strong> A = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2</p>
            <p><strong>Perimeter:</strong> P = a + b + c</p>
          </div>
        );
      // Add formulas for other shapes similarly
      default:
        return <p>Select a shape to view its formulas</p>;
    }
  };

  return (
    <div className="geometry-calculator">
      <h2>📐 Geometry Calculator</h2>
      
      <div className="shape-selector">
        <label>Select Shape:</label>
        <select value={shape} onChange={(e) => { setShape(e.target.value); resetCalculator(); }}>
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="rectangle">Rectangle</option>
          <option value="triangle">Triangle</option>
          <option value="trapezoid">Trapezoid</option>
          <option value="parallelogram">Parallelogram</option>
          <option value="ellipse">Ellipse</option>
          <option value="sector">Sector</option>
        </select>
      </div>

      <div className="input-section">
        <h3>{shape.charAt(0).toUpperCase() + shape.slice(1)} Dimensions</h3>
        {renderInputs()}
      </div>

      <div className="button-group">
        <button onClick={calculateProperties} className="calculate-btn">
          Calculate
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'properties' ? 'active' : ''}
          onClick={() => setActiveTab('properties')}
        >
          Results
        </button>
        <button 
          className={activeTab === 'formulas' ? 'active' : ''}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
      </div>

      {activeTab === 'properties' && result && (
        <div className="result-section">
          <h3>📊 {result.shape} Properties</h3>
          <div className="result-grid">
            <div className="result-card">
              <h4>Area</h4>
              <p>{result.area} square units</p>
            </div>
            {result.perimeter && (
              <div className="result-card">
                <h4>Perimeter</h4>
                <p>{result.perimeter} units</p>
              </div>
            )}
            {result.circumference && (
              <div className="result-card">
                <h4>Circumference</h4>
                <p>{result.circumference} units</p>
              </div>
            )}
          </div>
          
          <div className="additional-properties">
            <h4>Additional Properties</h4>
            <div className="properties-grid">
              {Object.entries(result.additionalProps).map(([key, value]) => (
                value && (
                  <div key={key} className="property-item">
                    <span>{key}:</span>
                    <strong>{value}</strong>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="formulas-section">
          {renderFormulas()}
        </div>
      )}

      <div className="examples">
        <h4>💡 Quick Examples</h4>
        <ul>
          <li><strong>Circle</strong>: r=5 → Area=78.54, Circumference=31.42</li>
          <li><strong>Rectangle</strong>: 6×4 → Area=24, Perimeter=20</li>
          <li><strong>Triangle</strong>: b=5, h=3 → Area=7.5</li>
        </ul>
      </div>
    </div>
  );
};

export default Geometry;