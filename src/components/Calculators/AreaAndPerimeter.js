import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';

const AreaAndPerimeter = () => {
  const [shape, setShape] = useState('rectangle');
  const [dimensions, setDimensions] = useState({
    // Rectangle
    length: '',
    width: '',
    // Circle
    radius: '',
    // Square
    side: '',
    // Triangle
    base: '',
    height: '',
    side1: '',
    side2: '',
    side3: '',
    // Parallelogram
    pBase: '',
    pHeight: '',
    pSide: '',
    // Trapezoid
    tBase1: '',
    tBase2: '',
    tHeight: '',
    tSide1: '',
    tSide2: '',
    // Rhombus
    rDiagonal1: '',
    rDiagonal2: '',
    rSide: '',
    // Regular Pentagon
    pentagonSide: '',
    // Regular Hexagon
    hexagonSide: '',
    // Ellipse
    majorAxis: '',
    minorAxis: '',
    // Sector
    sectorRadius: '',
    sectorAngle: ''
  });
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');

  const examples = [
    {
      title: "Rectangle",
      problem: "Length = 10, Width = 5",
      formula: "Area = length × width, Perimeter = 2 × (length + width)",
      solution: "Area = 50, Perimeter = 30",
      onTry: () => {
        setShape('rectangle');
        setDimensions({
          ...dimensions,
          length: '10',
          width: '5',
          radius: '',
          side: ''
        });
      }
    },
    {
      title: "Circle",
      problem: "Radius = 7",
      formula: "Area = πr², Circumference = 2πr",
      solution: "Area ≈ 153.94, Circumference ≈ 43.98",
      onTry: () => {
        setShape('circle');
        setDimensions({
          ...dimensions,
          radius: '7',
          length: '',
          width: '',
          side: ''
        });
      }
    },
    {
      title: "Triangle (Base & Height)",
      problem: "Base = 6, Height = 8",
      formula: "Area = ½ × base × height",
      solution: "Area = 24",
      onTry: () => {
        setShape('triangle');
        setDimensions({
          ...dimensions,
          base: '6',
          height: '8',
          length: '',
          width: '',
          radius: '',
          side: ''
        });
      }
    },
    {
      title: "Parallelogram",
      problem: "Base = 5, Height = 8, Side = 6",
      formula: "Area = base × height, Perimeter = 2 × (base + side)",
      solution: "Area = 40, Perimeter = 22",
      onTry: () => {
        setShape('parallelogram');
        setDimensions({
          ...dimensions,
          pBase: '5',
          pHeight: '8',
          pSide: '6',
          length: '',
          width: '',
          radius: '',
          side: ''
        });
      }
    },
    {
      title: "Regular Hexagon",
      problem: "Side = 4",
      formula: "Area = (3√3/2) × side², Perimeter = 6 × side",
      solution: "Area ≈ 41.57, Perimeter = 24",
      onTry: () => {
        setShape('hexagon');
        setDimensions({
          ...dimensions,
          hexagonSide: '4',
          length: '',
          width: '',
          radius: '',
          side: ''
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    switch(shape) {
      case 'rectangle':
        const l = dimensions.length || 'L';
        const w = dimensions.width || 'W';
        setFormulaPreview(`Area = ${l} × ${w}, Perimeter = 2 × (${l} + ${w})`);
        break;
      case 'circle':
        const r = dimensions.radius || 'r';
        setFormulaPreview(`Area = π × ${r}², Circumference = 2 × π × ${r}`);
        break;
      case 'square':
        const s = dimensions.side || 's';
        setFormulaPreview(`Area = ${s}², Perimeter = 4 × ${s}`);
        break;
      case 'triangle':
        if (dimensions.base && dimensions.height) {
          const b = dimensions.base || 'b';
          const h = dimensions.height || 'h';
          setFormulaPreview(`Area = ½ × ${b} × ${h}`);
        } else if (dimensions.side1 && dimensions.side2 && dimensions.side3) {
          const a = dimensions.side1 || 'a';
          const b = dimensions.side2 || 'b';
          const c = dimensions.side3 || 'c';
          setFormulaPreview(`Heron's Formula: s = (${a} + ${b} + ${c})/2, Area = √[s(s-${a})(s-${b})(s-${c})]`);
        } else {
          setFormulaPreview('Enter base/height or all three sides');
        }
        break;
      case 'parallelogram':
        const pb = dimensions.pBase || 'b';
        const ph = dimensions.pHeight || 'h';
        const ps = dimensions.pSide || 'a';
        setFormulaPreview(`Area = ${pb} × ${ph}, Perimeter = 2 × (${pb} + ${ps})`);
        break;
      case 'trapezoid':
        const tb1 = dimensions.tBase1 || 'a';
        const tb2 = dimensions.tBase2 || 'b';
        const th = dimensions.tHeight || 'h';
        setFormulaPreview(`Area = ½ × (${tb1} + ${tb2}) × ${th}`);
        break;
      case 'rhombus':
        const rd1 = dimensions.rDiagonal1 || 'd₁';
        const rd2 = dimensions.rDiagonal2 || 'd₂';
        const rs = dimensions.rSide || 'a';
        setFormulaPreview(`Area = ½ × ${rd1} × ${rd2}, Perimeter = 4 × ${rs}`);
        break;
      case 'pentagon':
        const pentSide = dimensions.pentagonSide || 'a';
        setFormulaPreview(`Area ≈ 1.72048 × ${pentSide}², Perimeter = 5 × ${pentSide}`);
        break;
      case 'hexagon':
        const hexSide = dimensions.hexagonSide || 'a';
        setFormulaPreview(`Area = (3√3/2) × ${hexSide}², Perimeter = 6 × ${hexSide}`);
        break;
      case 'ellipse':
        const major = dimensions.majorAxis || 'a';
        const minor = dimensions.minorAxis || 'b';
        setFormulaPreview(`Area = π × ${major} × ${minor}, Circumference ≈ π × [3(${major}+${minor}) - √((3${major}+${minor})(${major}+3${minor}))]`);
        break;
      case 'sector':
        const sr = dimensions.sectorRadius || 'r';
        const sa = dimensions.sectorAngle || 'θ';
        setFormulaPreview(`Area = (${sa}/360) × π × ${sr}², Arc Length = (${sa}/360) × 2π × ${sr}`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    let area = 0, perimeter = 0;
    let steps = [];
    let shapeName = '';
    
    switch(shape) {
      case 'rectangle':
        const length = parseFloat(dimensions.length);
        const width = parseFloat(dimensions.width);
        
        if (isNaN(length) || length <= 0) {
          alert('Please enter a valid length');
          return;
        }
        
        if (isNaN(width) || width <= 0) {
          alert('Please enter a valid width');
          return;
        }
        
        area = length * width;
        perimeter = 2 * (length + width);
        shapeName = 'Rectangle';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = length × width = ${length} × ${width} = ${area}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 2 × (length + width) = 2 × (${length} + ${width}) = ${perimeter}`
        ];
        break;
        
      case 'circle':
        const radius = parseFloat(dimensions.radius);
        
        if (isNaN(radius) || radius <= 0) {
          alert('Please enter a valid radius');
          return;
        }
        
        area = Math.PI * Math.pow(radius, 2);
        perimeter = 2 * Math.PI * radius;
        shapeName = 'Circle';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = π × radius² = π × ${radius}² ≈ ${area.toFixed(2)}`,
          `Step 2: Calculate circumference`,
          `Circumference = 2 × π × radius = 2 × π × ${radius} ≈ ${perimeter.toFixed(2)}`
        ];
        break;
        
      case 'square':
        const side = parseFloat(dimensions.side);
        
        if (isNaN(side) || side <= 0) {
          alert('Please enter a valid side length');
          return;
        }
        
        area = Math.pow(side, 2);
        perimeter = 4 * side;
        shapeName = 'Square';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = side² = ${side}² = ${area}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 4 × side = 4 × ${side} = ${perimeter}`
        ];
        break;
        
      case 'triangle':
        const base = parseFloat(dimensions.base);
        const height = parseFloat(dimensions.height);
        const side1 = parseFloat(dimensions.side1);
        const side2 = parseFloat(dimensions.side2);
        const side3 = parseFloat(dimensions.side3);
        
        if (base && height) {
          area = 0.5 * base * height;
          shapeName = 'Triangle (base-height)';
          
          steps = [
            `Step 1: Calculate area using base and height`,
            `Area = ½ × base × height = ½ × ${base} × ${height} = ${area}`
          ];
          
          if (side1 && side2 && side3) {
            perimeter = side1 + side2 + side3;
            steps.push(
              `Step 2: Calculate perimeter`,
              `Perimeter = side1 + side2 + side3 = ${side1} + ${side2} + ${side3} = ${perimeter}`
            );
          }
        } else if (side1 && side2 && side3) {
          const s = (side1 + side2 + side3) / 2;
          area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
          perimeter = side1 + side2 + side3;
          shapeName = 'Triangle (three sides)';
          
          steps = [
            `Step 1: Calculate semi-perimeter`,
            `s = (a + b + c)/2 = (${side1} + ${side2} + ${side3})/2 = ${s}`,
            `Step 2: Apply Heron's formula`,
            `Area = √[s(s-a)(s-b)(s-c)] = √[${s}(${s-side1})(${s-side2})(${s-side3})] ≈ ${area.toFixed(2)}`,
            `Step 3: Calculate perimeter`,
            `Perimeter = a + b + c = ${side1} + ${side2} + ${side3} = ${perimeter}`
          ];
        } else {
          alert('Please enter either base & height or all three sides');
          return;
        }
        break;
        
      case 'parallelogram':
        const pBase = parseFloat(dimensions.pBase);
        const pHeight = parseFloat(dimensions.pHeight);
        const pSide = parseFloat(dimensions.pSide);
        
        if (isNaN(pBase) || pBase <= 0 || isNaN(pHeight) || pHeight <= 0 || isNaN(pSide) || pSide <= 0) {
          alert('Please enter valid dimensions for the parallelogram');
          return;
        }
        
        area = pBase * pHeight;
        perimeter = 2 * (pBase + pSide);
        shapeName = 'Parallelogram';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = base × height = ${pBase} × ${pHeight} = ${area}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 2 × (base + side) = 2 × (${pBase} + ${pSide}) = ${perimeter}`
        ];
        break;
        
      case 'trapezoid':
        const tBase1 = parseFloat(dimensions.tBase1);
        const tBase2 = parseFloat(dimensions.tBase2);
        const tHeight = parseFloat(dimensions.tHeight);
        
        if (isNaN(tBase1) || tBase1 <= 0 || isNaN(tBase2) || tBase2 <= 0 || isNaN(tHeight) || tHeight <= 0) {
          alert('Please enter valid dimensions for the trapezoid');
          return;
        }
        
        area = 0.5 * (tBase1 + tBase2) * tHeight;
        shapeName = 'Trapezoid';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = ½ × (base1 + base2) × height = ½ × (${tBase1} + ${tBase2}) × ${tHeight} = ${area}`
        ];
        
        if (dimensions.tSide1 && dimensions.tSide2) {
          const tSide1 = parseFloat(dimensions.tSide1);
          const tSide2 = parseFloat(dimensions.tSide2);
          perimeter = tBase1 + tBase2 + tSide1 + tSide2;
          steps.push(
            `Step 2: Calculate perimeter`,
            `Perimeter = base1 + base2 + side1 + side2 = ${tBase1} + ${tBase2} + ${tSide1} + ${tSide2} = ${perimeter}`
          );
        }
        break;
        
      case 'rhombus':
        const rDiagonal1 = parseFloat(dimensions.rDiagonal1);
        const rDiagonal2 = parseFloat(dimensions.rDiagonal2);
        const rSide = parseFloat(dimensions.rSide);
        
        if (isNaN(rDiagonal1) || rDiagonal1 <= 0 || isNaN(rDiagonal2) || rDiagonal2 <= 0 || isNaN(rSide) || rSide <= 0) {
          alert('Please enter valid dimensions for the rhombus');
          return;
        }
        
        area = 0.5 * rDiagonal1 * rDiagonal2;
        perimeter = 4 * rSide;
        shapeName = 'Rhombus';
        
        steps = [
          `Step 1: Calculate area using diagonals`,
          `Area = ½ × diagonal1 × diagonal2 = ½ × ${rDiagonal1} × ${rDiagonal2} = ${area}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 4 × side = 4 × ${rSide} = ${perimeter}`
        ];
        break;
        
      case 'pentagon':
        const pentagonSide = parseFloat(dimensions.pentagonSide);
        
        if (isNaN(pentagonSide) || pentagonSide <= 0) {
          alert('Please enter a valid side length for the pentagon');
          return;
        }
        
        area = 1.72048 * Math.pow(pentagonSide, 2);
        perimeter = 5 * pentagonSide;
        shapeName = 'Regular Pentagon';
        
        steps = [
          `Step 1: Calculate area (approximate)`,
          `Area ≈ 1.72048 × side² = 1.72048 × ${pentagonSide}² ≈ ${area.toFixed(2)}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 5 × side = 5 × ${pentagonSide} = ${perimeter}`
        ];
        break;
        
      case 'hexagon':
        const hexagonSide = parseFloat(dimensions.hexagonSide);
        
        if (isNaN(hexagonSide) || hexagonSide <= 0) {
          alert('Please enter a valid side length for the hexagon');
          return;
        }
        
        area = (3 * Math.sqrt(3) / 2) * Math.pow(hexagonSide, 2);
        perimeter = 6 * hexagonSide;
        shapeName = 'Regular Hexagon';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = (3√3/2) × side² = (3√3/2) × ${hexagonSide}² ≈ ${area.toFixed(2)}`,
          `Step 2: Calculate perimeter`,
          `Perimeter = 6 × side = 6 × ${hexagonSide} = ${perimeter}`
        ];
        break;
        
      case 'ellipse':
        const majorAxis = parseFloat(dimensions.majorAxis);
        const minorAxis = parseFloat(dimensions.minorAxis);
        
        if (isNaN(majorAxis) || majorAxis <= 0 || isNaN(minorAxis) || minorAxis <= 0) {
          alert('Please enter valid axes lengths for the ellipse');
          return;
        }
        
        area = Math.PI * majorAxis * minorAxis;
        perimeter = Math.PI * (3 * (majorAxis + minorAxis)) - 
                   Math.sqrt((3 * majorAxis + minorAxis) * (majorAxis + 3 * minorAxis));
        shapeName = 'Ellipse';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = π × major axis × minor axis = π × ${majorAxis} × ${minorAxis} ≈ ${area.toFixed(2)}`,
          `Step 2: Calculate approximate circumference`,
          `Circumference ≈ π × [3(${majorAxis}+${minorAxis}) - √((3×${majorAxis}+${minorAxis})(${majorAxis}+3×${minorAxis}))] ≈ ${perimeter.toFixed(2)}`
        ];
        break;
        
      case 'sector':
        const sectorRadius = parseFloat(dimensions.sectorRadius);
        const sectorAngle = parseFloat(dimensions.sectorAngle);
        
        if (isNaN(sectorRadius) || sectorRadius <= 0 || isNaN(sectorAngle) || sectorAngle <= 0 || sectorAngle > 360) {
          alert('Please enter valid radius (positive) and angle (0-360 degrees) for the sector');
          return;
        }
        
        area = (sectorAngle / 360) * Math.PI * Math.pow(sectorRadius, 2);
        perimeter = 2 * sectorRadius + (sectorAngle / 360) * 2 * Math.PI * sectorRadius;
        shapeName = 'Sector of a Circle';
        
        steps = [
          `Step 1: Calculate area`,
          `Area = (angle/360) × π × radius² = (${sectorAngle}/360) × π × ${sectorRadius}² ≈ ${area.toFixed(2)}`,
          `Step 2: Calculate perimeter (including arc length)`,
          `Perimeter = 2 × radius + arc length = 2 × ${sectorRadius} + (${sectorAngle}/360) × 2π × ${sectorRadius} ≈ ${perimeter.toFixed(2)}`
        ];
        break;
        
      default:
        break;
    }

    setResult({
      shape: shapeName,
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      steps
    });

    addToHistory({
      description: `${shapeName} calculation`,
      result: `Area: ${area.toFixed(2)}${perimeter ? `, Perimeter: ${perimeter.toFixed(2)}` : ''}`
    });
  };

  React.useEffect(() => {
    updateFormulaPreview();
  }, [dimensions, shape]);

  const renderInputs = () => {
    switch(shape) {
      case 'rectangle':
        return (
          <>
            <div className="input-group">
              <label>Length:</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Width:</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
          </>
        );
      case 'circle':
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
      case 'square':
        return (
          <div className="input-group">
            <label>Side Length:</label>
            <input
              type="number"
              value={dimensions.side}
              onChange={(e) => setDimensions({...dimensions, side: e.target.value})}
              placeholder="e.g., 4"
              min="0"
            />
          </div>
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
                placeholder="e.g., 6"
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
            <p>Or enter all three sides for Heron's formula:</p>
            <div className="input-group">
              <label>Side 1:</label>
              <input
                type="number"
                value={dimensions.side1}
                onChange={(e) => setDimensions({...dimensions, side1: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Side 2:</label>
              <input
                type="number"
                value={dimensions.side2}
                onChange={(e) => setDimensions({...dimensions, side2: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Side 3:</label>
              <input
                type="number"
                value={dimensions.side3}
                onChange={(e) => setDimensions({...dimensions, side3: e.target.value})}
                placeholder="e.g., 5"
                min="0"
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
                value={dimensions.pBase}
                onChange={(e) => setDimensions({...dimensions, pBase: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.pHeight}
                onChange={(e) => setDimensions({...dimensions, pHeight: e.target.value})}
                placeholder="e.g., 8"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Side Length:</label>
              <input
                type="number"
                value={dimensions.pSide}
                onChange={(e) => setDimensions({...dimensions, pSide: e.target.value})}
                placeholder="e.g., 6"
                min="0"
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
                value={dimensions.tBase1}
                onChange={(e) => setDimensions({...dimensions, tBase1: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Base 2:</label>
              <input
                type="number"
                value={dimensions.tBase2}
                onChange={(e) => setDimensions({...dimensions, tBase2: e.target.value})}
                placeholder="e.g., 7"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Height:</label>
              <input
                type="number"
                value={dimensions.tHeight}
                onChange={(e) => setDimensions({...dimensions, tHeight: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
            <p>Optional: For perimeter calculation</p>
            <div className="input-group">
              <label>Side 1:</label>
              <input
                type="number"
                value={dimensions.tSide1}
                onChange={(e) => setDimensions({...dimensions, tSide1: e.target.value})}
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Side 2:</label>
              <input
                type="number"
                value={dimensions.tSide2}
                onChange={(e) => setDimensions({...dimensions, tSide2: e.target.value})}
                placeholder="e.g., 4"
                min="0"
              />
            </div>
          </>
        );
      case 'rhombus':
        return (
          <>
            <div className="input-group">
              <label>Diagonal 1:</label>
              <input
                type="number"
                value={dimensions.rDiagonal1}
                onChange={(e) => setDimensions({...dimensions, rDiagonal1: e.target.value})}
                placeholder="e.g., 8"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Diagonal 2:</label>
              <input
                type="number"
                value={dimensions.rDiagonal2}
                onChange={(e) => setDimensions({...dimensions, rDiagonal2: e.target.value})}
                placeholder="e.g., 6"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Side Length:</label>
              <input
                type="number"
                value={dimensions.rSide}
                onChange={(e) => setDimensions({...dimensions, rSide: e.target.value})}
                placeholder="e.g., 5"
                min="0"
              />
            </div>
          </>
        );
      case 'pentagon':
        return (
          <div className="input-group">
            <label>Side Length:</label>
            <input
              type="number"
              value={dimensions.pentagonSide}
              onChange={(e) => setDimensions({...dimensions, pentagonSide: e.target.value})}
              placeholder="e.g., 4"
              min="0"
            />
          </div>
        );
      case 'hexagon':
        return (
          <div className="input-group">
            <label>Side Length:</label>
            <input
              type="number"
              value={dimensions.hexagonSide}
              onChange={(e) => setDimensions({...dimensions, hexagonSide: e.target.value})}
              placeholder="e.g., 5"
              min="0"
            />
          </div>
        );
      case 'ellipse':
        return (
          <>
            <div className="input-group">
              <label>Major Axis:</label>
              <input
                type="number"
                value={dimensions.majorAxis}
                onChange={(e) => setDimensions({...dimensions, majorAxis: e.target.value})}
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Minor Axis:</label>
              <input
                type="number"
                value={dimensions.minorAxis}
                onChange={(e) => setDimensions({...dimensions, minorAxis: e.target.value})}
                placeholder="e.g., 6"
                min="0"
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
                value={dimensions.sectorRadius}
                onChange={(e) => setDimensions({...dimensions, sectorRadius: e.target.value})}
                placeholder="e.g., 8"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Angle (degrees):</label>
              <input
                type="number"
                value={dimensions.sectorAngle}
                onChange={(e) => setDimensions({...dimensions, sectorAngle: e.target.value})}
                placeholder="e.g., 45"
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

  return (
    <CalculatorBase 
      title="Area and Perimeter Calculator" 
      description="Calculate area and perimeter for various geometric shapes including rectangles, circles, triangles, and more complex shapes."
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
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
              <option value="parallelogram">Parallelogram</option>
              <option value="trapezoid">Trapezoid</option>
              <option value="rhombus">Rhombus</option>
              <option value="pentagon">Regular Pentagon</option>
              <option value="hexagon">Regular Hexagon</option>
              <option value="ellipse">Ellipse</option>
              <option value="sector">Sector of a Circle</option>
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
            Calculate {shape.charAt(0).toUpperCase() + shape.slice(1)} Dimensions
          </button>

          {result && (
            <div className="result">
              <h3>Results:</h3>
              <p>Shape: <strong>{result.shape}</strong></p>
              <p>Area: <strong>{result.area} square units</strong></p>
              {result.perimeter !== '0.00' && (
                <p>Perimeter: <strong>{result.perimeter} linear units</strong></p>
              )}
              
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

export default AreaAndPerimeter;