import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const NumberSystem = () => {
  const [number, setNumber] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('2');
  const [result, setResult] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);

  const bases = [
    { value: '2', label: 'Binary (2)' },
    { value: '8', label: 'Octal (8)' },
    { value: '10', label: 'Decimal (10)' },
    { value: '16', label: 'Hexadecimal (16)' },
    { value: '32', label: 'Base32 (32)' },
    { value: '64', label: 'Base64 (64)' }
  ];

  const examples = [
    {
      title: "Decimal to Binary",
      problem: "255 in decimal",
      formula: "Divide by 2 and track remainders",
      solution: "11111111 in binary",
      onTry: () => {
        setNumber('255');
        setFromBase('10');
        setToBase('2');
      }
    },
    {
      title: "Binary to Hexadecimal",
      problem: "10101100 in binary",
      formula: "Group into nibbles (4 bits) and convert",
      solution: "AC in hexadecimal",
      onTry: () => {
        setNumber('10101100');
        setFromBase('2');
        setToBase('16');
      }
    },
    {
      title: "Hexadecimal to Decimal",
      problem: "FF in hexadecimal",
      formula: "F×16¹ + F×16⁰ = 15×16 + 15×1",
      solution: "255 in decimal",
      onTry: () => {
        setNumber('FF');
        setFromBase('16');
        setToBase('10');
      }
    }
  ];

  const validateNumber = (numStr, base) => {
    const baseNum = parseInt(base);
    const validDigits = {
      2: /^[01.]+$/,
      8: /^[0-7.]+$/,
      10: /^[0-9.]+$/,
      16: /^[0-9A-Fa-f.]+$/,
      32: /^[A-Z2-7=]+$/,
      64: /^[A-Za-z0-9+/=]+$/
    };

    if (!validDigits[base].test(numStr)) {
      return `Invalid characters for base ${base}`;
    }

    if (numStr.split('.').length > 2) {
      return "Number cannot contain more than one decimal point";
    }

    return null;
  };

  const convertNumber = (addToHistory) => {
    const numStr = number.toString().trim().toUpperCase();
    const steps = [];
    
    // Validation
    const validationError = validateNumber(numStr, fromBase);
    if (validationError) {
      alert(validationError);
      return;
    }

    steps.push(`Starting conversion: ${numStr} (base ${fromBase}) → base ${toBase}`);

    let decimalValue = 0;
    const fromBaseNum = parseInt(fromBase);
    const toBaseNum = parseInt(toBase);

    // Convert from original base to decimal
    if (fromBase === '10') {
      decimalValue = parseFloat(numStr);
      steps.push(`Input is already in decimal: ${decimalValue}`);
    } else {
      const parts = numStr.split('.');
      let intPart = 0;
      let fracPart = 0;
      
      // Integer part conversion
      steps.push(`Converting integer part: ${parts[0]}`);
      for (let i = 0; i < parts[0].length; i++) {
        const digit = parseInt(parts[0][i], fromBaseNum);
        intPart = intPart * fromBaseNum + digit;
        steps.push(`Digit ${parts[0][i]} (${digit}): ${intPart - digit} × ${fromBaseNum} + ${digit} = ${intPart}`);
      }
      
      // Fractional part conversion
      if (parts[1]) {
        steps.push(`Converting fractional part: 0.${parts[1]}`);
        for (let i = 0; i < parts[1].length; i++) {
          const digit = parseInt(parts[1][i], fromBaseNum);
          fracPart = fracPart + digit / Math.pow(fromBaseNum, i + 1);
          steps.push(`Digit ${parts[1][i]} (${digit}): add ${digit}/${fromBaseNum}^${i+1} = ${digit/Math.pow(fromBaseNum, i+1)}`);
        }
      }
      
      decimalValue = intPart + fracPart;
      steps.push(`Combined decimal value: ${intPart} + ${fracPart} = ${decimalValue}`);
    }

    // Convert from decimal to target base
    let convertedValue = '';

    if (toBase === '10') {
      convertedValue = decimalValue.toString();
      steps.push(`Target is decimal: ${convertedValue}`);
    } else {
      // Integer part conversion
      let intPart = Math.floor(decimalValue);
      if (intPart === 0) {
        convertedValue = '0';
        steps.push(`Integer part is 0`);
      } else {
        let intResult = '';
        steps.push(`Converting integer part ${intPart} to base ${toBase}:`);
        while (intPart > 0) {
          const remainder = intPart % toBaseNum;
          const digit = remainder < 10 ? remainder.toString() : String.fromCharCode(55 + remainder);
          intResult = digit + intResult;
          steps.push(`${intPart} ÷ ${toBaseNum} = ${Math.floor(intPart / toBaseNum)} remainder ${remainder} (${digit})`);
          intPart = Math.floor(intPart / toBaseNum);
        }
        convertedValue = intResult;
        steps.push(`Integer result: ${intResult}`);
      }
      
      // Fractional part conversion
      let fracPart = decimalValue - Math.floor(decimalValue);
      if (fracPart > 0) {
        convertedValue += '.';
        let precision = 0;
        const maxPrecision = 10;
        steps.push(`Converting fractional part 0.${fracPart.toString().substring(2)} to base ${toBase}:`);
        
        while (fracPart > 0 && precision < maxPrecision) {
          fracPart *= toBaseNum;
          const digit = Math.floor(fracPart);
          const digitChar = digit < 10 ? digit.toString() : String.fromCharCode(55 + digit);
          convertedValue += digitChar;
          steps.push(`0.${fracPart.toString().substring(2)} × ${toBaseNum} = ${fracPart} → digit ${digit} (${digitChar})`);
          fracPart -= digit;
          precision++;
        }
        steps.push(`Fractional result: ${convertedValue}`);
      }
    }

    setResult({
      original: numStr,
      fromBase,
      decimal: decimalValue.toString(),
      converted: convertedValue,
      toBase
    });

    setCalculationSteps(steps);

    addToHistory({
      description: `Base conversion: ${fromBase} → ${toBase}`,
      result: `${numStr}<sub>${fromBase}</sub> = ${convertedValue}<sub>${toBase}</sub>`
    });
  };

  return (
    <CalculatorBase 
      title="Number System Converter" 
      description="Convert numbers between different bases including binary, octal, decimal, hexadecimal, and more."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Number:</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 255 or 1010.101 or FF.A"
            />
          </div>

          <div className="input-group">
            <label>From Base:</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(e.target.value)}
            >
              {bases.map(base => (
                <option key={`from-${base.value}`} value={base.value}>{base.label}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>To Base:</label>
            <select
              value={toBase}
              onChange={(e) => setToBase(e.target.value)}
            >
              {bases.map(base => (
                <option key={`to-${base.value}`} value={base.value}>{base.label}</option>
              ))}
            </select>
          </div>

          <button onClick={() => convertNumber(addToHistory)} className="calculate-btn">
            Convert Number
          </button>

          {result && (
            <div className="result">
              <h3>Result:</h3>
              <p className="result-equation">
                {result.original}<sub>{result.fromBase}</sub> = {result.converted}<sub>{result.toBase}</sub>
              </p>
              {fromBase !== '10' && toBase !== '10' && (
                <p className="intermediate-value">(Decimal intermediate: {result.decimal})</p>
              )}
              
              {calculationSteps.length > 0 && (
                <div className="step-by-step">
                  <h4>Calculation Steps:</h4>
                  {calculationSteps.map((step, index) => (
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

export default NumberSystem;