import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const VolumeAndSurfaceArea = () => {
  const [shape, setShape] = useState('cube');
  const [dimensions, setDimensions] = useState({
    // Cube
    side: '',
    // Cuboid
    length: '',
    width: '',
    height: '',
    // Sphere/Cylinder/Cone
    radius: '',
    // Cylinder/Cone
    height: '',
    // Cone
    slantHeight: '',
    // Pyramid
    baseLength: '',
    baseWidth: '',
    pyramidHeight: '',
    // Triangular Prism
    prismBase: '',
    prismHeight: '',
    prismLength: '',
    // Torus
    majorRadius: '',
    minorRadius: '',
    // Hemisphere
    hemisphereRadius: '',
    // Ellipsoid
    aAxis: '',
    bAxis: '',
    cAxis: ''
  });
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');

  const examples = [
    {
      title: "Cube",
      problem: "Side = 5",
      formula: "Volume = side³, Surface Area = 6 × side²",
      solution: "Volume = 125, Surface Area = 150",
      onTry: () => {
        setShape('cube');
        setDimensions({
          side: '5',
          radius: '',
          height: ''
        });
      }
    },
    {
      title: "Sphere",
      problem: "Radius = 4",
      formula: "Volume = (4/3)πr³, Surface Area = 4πr²",
      solution: "Volume ≈ 268.08, Surface Area ≈ 201.06",
      onTry: () => {
        setShape('sphere');
        setDimensions({
          radius: '4',
          side: '',
          height: ''
        });
      }
    },
    {
      title: "Cylinder",
      problem: "Radius = 3, Height = 7",
      formula: "Volume = πr²h, Surface Area = 2πr(r + h)",
      solution: "Volume ≈ 197.92, Surface Area ≈ 188.50",
      onTry: () => {
        setShape('cylinder');
        setDimensions({
          radius: '3',
          height: '7',
          side: ''
        });
      }
    },
    {
      title: "Cone",
      problem: "Radius = 5, Height = 12",
      formula: "Volume = (1/3)πr²h, Surface Area = πr(r + √(r² + h²))",
      solution: "Volume ≈ 314.16, Surface Area ≈ 282.74",
      onTry: () => {
        setShape('cone');
        setDimensions({
          radius: '5',
          height: '12',
          side: ''
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    switch(shape) {
      case 'cube':
        const s = dimensions.side || 's';
        setFormulaPreview(`Volume = ${s}³, Surface Area = 6 × ${s}²`);
        break;
      case 'cuboid':
        const l = dimensions.length || 'L';
        const w = dimensions.width || 'W';
        const h = dimensions.height || 'H';
        setFormulaPreview(`Volume = ${l} × ${w} × ${h}, Surface Area = 2(${l}${w} + ${w}${h} + ${h}${l})`);
        break;
      case 'sphere':
        const r = dimensions.radius || 'r';
        setFormulaPreview(`Volume = (4/3)π${r}³, Surface Area = 4π${r}²`);
        break;
      case 'cylinder':
        const cr = dimensions.radius || 'r';
        const ch = dimensions.height || 'h';
        setFormulaPreview(`Volume = π${cr}²${ch}, Surface Area = 2π${cr}(${cr} + ${ch})`);
        break;
      case 'cone':
        const cor = dimensions.radius || 'r';
        const coh = dimensions.height || 'h';
        setFormulaPreview(`Volume = (1/3)π${cor}²${coh}, Surface Area = π${cor}(${cor} + √(${cor}² + ${coh}²))`);
        break;
      case 'pyramid':
        const bl = dimensions.baseLength || 'l';
        const bw = dimensions.baseWidth || 'w';
        const ph = dimensions.pyramidHeight || 'h';
        setFormulaPreview(`Volume = (1/3) × ${bl} × ${bw} × ${ph}, Surface Area = ${bl} × ${bw} + ${bl} × √((${bw}/2)² + ${ph}²) + ${bw} × √((${bl}/2)² + ${ph}²)`);
        break;
      case 'prism':
        const pb = dimensions.prismBase || 'b';
        const prismH = dimensions.prismHeight || 'h';
        const pl = dimensions.prismLength || 'l';
        setFormulaPreview(`Volume = (1/2) × ${pb} × ${prismH} × ${pl}, Surface Area = ${pb} × ${prismH} + 2 × ${pl} × (${pb} + ${prismH} + √(${pb}² + ${prismH}²))`);
        break;
      case 'torus':
        const R = dimensions.majorRadius || 'R';
        const mr = dimensions.minorRadius || 'r';
        setFormulaPreview(`Volume = 2π²${R}${mr}², Surface Area = 4π²${R}${mr}`);
        break;
      case 'hemisphere':
        const hr = dimensions.hemisphereRadius || 'r';
        setFormulaPreview(`Volume = (2/3)π${hr}³, Surface Area = 3π${hr}²`);
        break;
      case 'ellipsoid':
        const a = dimensions.aAxis || 'a';
        const b = dimensions.bAxis || 'b';
        const c = dimensions.cAxis || 'c';
        setFormulaPreview(`Volume = (4/3)π${a}${b}${c}, Surface Area ≈ 4π[(${a}ᵇ${b}ᵖ + ${a}ᵖ${c}ᵇ + ${b}ᵖ${c}ᵇ)/3]¹/ᵖ where p ≈ 1.6075`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    let volume = 0;
    let surfaceArea = 0;
    let steps = [];
    let shapeName = '';
    
    switch(shape) {
      case 'cube':
        const side = parseFloat(dimensions.side);
        if (isNaN(side) || side <= 0) {
          alert('Please enter a valid side length');
          return;
        }
        volume = Math.pow(side, 3);
        surfaceArea = 6 * Math.pow(side, 2);
        shapeName = 'Cube';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = side³ = ${side}³ = ${volume}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 6 × side² = 6 × ${side}² = ${surfaceArea}`
        ];
        break;
        
      case 'cuboid':
        const l = parseFloat(dimensions.length);
        const w = parseFloat(dimensions.width);
        const h = parseFloat(dimensions.height);
        if (isNaN(l) || l <= 0 || isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
          alert('Please enter valid dimensions for the cuboid');
          return;
        }
        volume = l * w * h;
        surfaceArea = 2 * (l*w + w*h + h*l);
        shapeName = 'Cuboid';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = length × width × height = ${l} × ${w} × ${h} = ${volume}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 2(length×width + width×height + height×length) = 2(${l}×${w} + ${w}×${h} + ${h}×${l}) = ${surfaceArea}`
        ];
        break;
        
      case 'sphere':
        const r = parseFloat(dimensions.radius);
        if (isNaN(r) || r <= 0) {
          alert('Please enter a valid radius');
          return;
        }
        volume = (4/3) * Math.PI * Math.pow(r, 3);
        surfaceArea = 4 * Math.PI * Math.pow(r, 2);
        shapeName = 'Sphere';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = (4/3)πr³ = (4/3)π${r}³ ≈ ${volume.toFixed(2)}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 4πr² = 4π${r}² ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'cylinder':
        const cr = parseFloat(dimensions.radius);
        const ch = parseFloat(dimensions.height);
        if (isNaN(cr) || cr <= 0 || isNaN(ch) || ch <= 0) {
          alert('Please enter valid radius and height');
          return;
        }
        volume = Math.PI * Math.pow(cr, 2) * ch;
        surfaceArea = 2 * Math.PI * cr * (cr + ch);
        shapeName = 'Cylinder';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = πr²h = π × ${cr}² × ${ch} ≈ ${volume.toFixed(2)}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 2πr(r + h) = 2π × ${cr} × (${cr} + ${ch}) ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'cone':
        const cor = parseFloat(dimensions.radius);
        const coh = parseFloat(dimensions.height);
        if (isNaN(cor) || cor <= 0 || isNaN(coh) || coh <= 0) {
          alert('Please enter valid radius and height');
          return;
        }
        const slantHeight = Math.sqrt(Math.pow(cor, 2) + Math.pow(coh, 2));
        volume = (1/3) * Math.PI * Math.pow(cor, 2) * coh;
        surfaceArea = Math.PI * cor * (cor + slantHeight);
        shapeName = 'Cone';
        steps = [
          `Step 1: Calculate slant height`,
          `Slant Height = √(r² + h²) = √(${cor}² + ${coh}²) ≈ ${slantHeight.toFixed(2)}`,
          `Step 2: Calculate volume`,
          `Volume = (1/3)πr²h = (1/3)π × ${cor}² × ${coh} ≈ ${volume.toFixed(2)}`,
          `Step 3: Calculate surface area`,
          `Surface Area = πr(r + l) = π × ${cor} × (${cor} + ${slantHeight.toFixed(2)}) ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'pyramid':
        const bl = parseFloat(dimensions.baseLength);
        const bw = parseFloat(dimensions.baseWidth);
        const ph = parseFloat(dimensions.pyramidHeight);
        if (isNaN(bl) || bl <= 0 || isNaN(bw) || bw <= 0 || isNaN(ph) || ph <= 0) {
          alert('Please enter valid base dimensions and height');
          return;
        }
        const lSlant = Math.sqrt(Math.pow(bw/2, 2) + Math.pow(ph, 2));
        const wSlant = Math.sqrt(Math.pow(bl/2, 2) + Math.pow(ph, 2));
        volume = (1/3) * bl * bw * ph;
        surfaceArea = bl * bw + bl * lSlant + bw * wSlant;
        shapeName = 'Rectangular Pyramid';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = (1/3) × base length × base width × height = (1/3) × ${bl} × ${bw} × ${ph} = ${volume}`,
          `Step 2: Calculate slant heights`,
          `Length-wise slant = √((${bw}/2)² + ${ph}²) ≈ ${lSlant.toFixed(2)}`,
          `Width-wise slant = √((${bl}/2)² + ${ph}²) ≈ ${wSlant.toFixed(2)}`,
          `Step 3: Calculate surface area`,
          `Surface Area = base area + lateral area = ${bl}×${bw} + ${bl}×${lSlant.toFixed(2)} + ${bw}×${wSlant.toFixed(2)} ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'prism':
        const pb = parseFloat(dimensions.prismBase);
        const prismH = parseFloat(dimensions.prismHeight);
        const pl = parseFloat(dimensions.prismLength);
        if (isNaN(pb) || pb <= 0 || isNaN(prismH) || prismH <= 0 || isNaN(pl) || pl <= 0) {
          alert('Please enter valid base, height and length');
          return;
        }
        const hypotenuse = Math.sqrt(Math.pow(pb, 2) + Math.pow(prismH, 2));
        volume = 0.5 * pb * prismH * pl;
        surfaceArea = pb * prismH + pl * (pb + prismH + hypotenuse);
        shapeName = 'Triangular Prism';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = (1/2) × base × height × length = 0.5 × ${pb} × ${prismH} × ${pl} = ${volume}`,
          `Step 2: Calculate hypotenuse`,
          `Hypotenuse = √(base² + height²) = √(${pb}² + ${prismH}²) ≈ ${hypotenuse.toFixed(2)}`,
          `Step 3: Calculate surface area`,
          `Surface Area = base area + lateral area = ${pb}×${prismH} + ${pl}×(${pb} + ${prismH} + ${hypotenuse.toFixed(2)}) ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'torus':
        const R = parseFloat(dimensions.majorRadius);
        const mr = parseFloat(dimensions.minorRadius);
        if (isNaN(R) || R <= 0 || isNaN(mr) || mr <= 0) {
          alert('Please enter valid major and minor radii');
          return;
        }
        volume = 2 * Math.pow(Math.PI, 2) * R * Math.pow(mr, 2);
        surfaceArea = 4 * Math.pow(Math.PI, 2) * R * mr;
        shapeName = 'Torus (Doughnut)';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = 2π²Rr² = 2π² × ${R} × ${mr}² ≈ ${volume.toFixed(2)}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 4π²Rr = 4π² × ${R} × ${mr} ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'hemisphere':
        const hr = parseFloat(dimensions.hemisphereRadius);
        if (isNaN(hr) || hr <= 0) {
          alert('Please enter a valid radius');
          return;
        }
        volume = (2/3) * Math.PI * Math.pow(hr, 3);
        surfaceArea = 3 * Math.PI * Math.pow(hr, 2);
        shapeName = 'Hemisphere';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = (2/3)πr³ = (2/3)π × ${hr}³ ≈ ${volume.toFixed(2)}`,
          `Step 2: Calculate surface area`,
          `Surface Area = 3πr² = 3π × ${hr}² ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      case 'ellipsoid':
        const a = parseFloat(dimensions.aAxis);
        const b = parseFloat(dimensions.bAxis);
        const c = parseFloat(dimensions.cAxis);
        if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0 || isNaN(c) || c <= 0) {
          alert('Please enter valid axis lengths');
          return;
        }
        volume = (4/3) * Math.PI * a * b * c;
        // Approximation for surface area
        const p = 1.6075;
        surfaceArea = 4 * Math.PI * Math.pow((Math.pow(a*b, p) + Math.pow(a*c, p) + Math.pow(b*c, p))/3, 1/p);
        shapeName = 'Ellipsoid';
        steps = [
          `Step 1: Calculate volume`,
          `Volume = (4/3)πabc = (4/3)π × ${a} × ${b} × ${c} ≈ ${volume.toFixed(2)}`,
          `Step 2: Approximate surface area (using Knud Thomsen's formula)`,
          `Surface Area ≈ 4π[((${a}×${b})^1.6075 + (${a}×${c})^1.6075 + (${b}×${c})^1.6075)/3]^(1/1.6075) ≈ ${surfaceArea.toFixed(2)}`
        ];
        break;
        
      default:
        break;
    }

    setResult({
      shape: shapeName,
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
      steps
    });

    addToHistory({
      description: `${shapeName} calculation`,
      result: `Volume: ${volume.toFixed(2)}, Surface Area: ${surfaceArea.toFixed(2)}`
    });
  };

  React.useEffect(() => {
    updateFormulaPreview();
  }, [dimensions, shape]);

  const renderInputs = () => {
    switch(shape) {
      case 'cube':
        return (
          <div className="input-group">
            <label>Side Length:</label>
            <input
              type="number"
              value={dimensions.side}
              onChange={(e) => setDimensions({...dimensions, side: e.target.value})}
              placeholder="e.g., 5"
              min="0"
            />
          </div>
        );
      case 'cuboid':
        return (
          <>
            <div className="input-group">
              <label>Length:</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Width:</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 2"
                min="0"
              />
            </div>
          </>
        );
      case 'sphere':
        return (
          <div className="input-group">
            <label>Radius:</label>
            <input
              type="number"
              value={dimensions.radius}
              onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
              placeholder="e.g., 7"
              min="0"
            />
          </div>
        );
      case 'cylinder':
        return (
          <>
            <div className="input-group">
              <label>Radius:</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 8"
                min="0"
              />
            </div>
          </>
        );
      case 'cone':
        return (
          <>
            <div className="input-group">
              <label>Radius:</label>
              <input
                type="number"
                value={dimensions.radius}
                onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                placeholder="e.g., 12"
                min="0"
              />
            </div>
          </>
        );
      case 'pyramid':
        return (
          <>
            <div className="input-group">
              <label>Base Length:</label>
              <input
                type="number"
                value={dimensions.baseLength}
                onChange={(e) => setDimensions({...dimensions, baseLength: e.target.value})}
                placeholder="e.g., 6"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Base Width:</label>
              <input
                type="number"
                value={dimensions.baseWidth}
                onChange={(e) => setDimensions({...dimensions, baseWidth: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.pyramidHeight}
                onChange={(e) => setDimensions({...dimensions, pyramidHeight: e.target.value})}
                placeholder="e.g., 9"
                min="0"
              />
            </div>
          </>
        );
      case 'prism':
        return (
          <>
            <div className="input-group">
              <label>Base:</label>
              <input
                type="number"
                value={dimensions.prismBase}
                onChange={(e) => setDimensions({...dimensions, prismBase: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.prismHeight}
                onChange={(e) => setDimensions({...dimensions, prismHeight: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Length:</label>
              <input
                type="number"
                value={dimensions.prismLength}
                onChange={(e) => setDimensions({...dimensions, prismLength: e.target.value})}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
          </>
        );
      case 'torus':
        return (
          <>
            <div className="input-group">
              <label>Major Radius (R):</label>
              <input
                type="number"
                value={dimensions.majorRadius}
                onChange={(e) => setDimensions({...dimensions, majorRadius: e.target.value})}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Minor Radius (r):</label>
              <input
                type="number"
                value={dimensions.minorRadius}
                onChange={(e) => setDimensions({...dimensions, minorRadius: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
          </>
        );
      case 'hemisphere':
        return (
          <div className="input-group">
            <label>Radius:</label>
            <input
              type="number"
              value={dimensions.hemisphereRadius}
              onChange={(e) => setDimensions({...dimensions, hemisphereRadius: e.target.value})}
              placeholder="e.g., 5"
              min="0"
            />
          </div>
        );
      case 'ellipsoid':
        return (
          <>
            <div className="input-group">
              <label>A-axis:</label>
              <input
                type="number"
                value={dimensions.aAxis}
                onChange={(e) => setDimensions({...dimensions, aAxis: e.target.value})}
                placeholder="e.g., 8"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>B-axis:</label>
              <input
                type="number"
                value={dimensions.bAxis}
                onChange={(e) => setDimensions({...dimensions, bAxis: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>C-axis:</label>
              <input
                type="number"
                value={dimensions.cAxis}
                onChange={(e) => setDimensions({...dimensions, cAxis: e.target.value})}
                placeholder="e.g., 3"
                min="0"
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
      title="Volume and Surface Area Calculator" 
      description="Calculate volume and surface area for various 3D shapes including cubes, spheres, cylinders, and more complex forms."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Select Shape:</label>
            <select 
              value={shape} 
              onChange={(e) => setShape(e.target.value)}
              className="shape-selector"
            >
              <option value="cube">Cube</option>
              <option value="cuboid">Cuboid</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="cone">Cone</option>
              <option value="pyramid">Rectangular Pyramid</option>
              <option value="prism">Triangular Prism</option>
              <option value="torus">Torus (Doughnut)</option>
              <option value="hemisphere">Hemisphere</option>
              <option value="ellipsoid">Ellipsoid</option>
            </select>
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <h4>Formula Preview</h4>
              <p>{formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate {shape.charAt(0).toUpperCase() + shape.slice(1)} Properties
          </button>

          {result && (
            <div className="result">
              <h3>Results:</h3>
              <p>Shape: <strong>{result.shape}</strong></p>
              <p>Volume: <strong>{result.volume} cubic units</strong></p>
              <p>Surface Area: <strong>{result.surfaceArea} square units</strong></p>
              
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

export default VolumeAndSurfaceArea;