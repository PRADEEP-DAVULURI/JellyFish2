// src/components/Calculators/BoatsAndStreams.js
import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const BoatsAndStreams = () => {
  const [values, setValues] = useState({
    boatSpeed: '',
    streamSpeed: '',
    distanceDownstream: '',
    timeDownstream: '',
    distanceUpstream: '',
    timeUpstream: ''
  });
  const [result, setResult] = useState(null);
  const [calcType, setCalcType] = useState('speed');
  const [formulaPreview, setFormulaPreview] = useState('');
  const [animation, setAnimation] = useState(false);
  const [visualization, setVisualization] = useState(null);

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const examples = [
    {
      title: "Calculate Speeds",
      problem: "Boat speed = 15 km/h, Stream speed = 5 km/h",
      formula: "Downstream = Boat + Stream, Upstream = Boat - Stream",
      solution: "Downstream: 20 km/h, Upstream: 10 km/h",
      onTry: () => {
        setCalcType('speed');
        setValues({
          boatSpeed: '15',
          streamSpeed: '5',
          distanceDownstream: '',
          timeDownstream: '',
          distanceUpstream: '',
          timeUpstream: ''
        });
      }
    },
    {
      title: "Calculate Downstream Speed",
      problem: "Distance = 20 km, Time = 1 hour",
      formula: "Speed = Distance / Time",
      solution: "20 / 1 = 20 km/h",
      onTry: () => {
        setCalcType('downstream');
        setValues({
          distanceDownstream: '20',
          timeDownstream: '1',
          boatSpeed: '',
          streamSpeed: '',
          distanceUpstream: '',
          timeUpstream: ''
        });
      }
    },
    {
      title: "Calculate Upstream Speed",
      problem: "Distance = 10 km, Time = 2 hours",
      formula: "Speed = Distance / Time",
      solution: "10 / 2 = 5 km/h",
      onTry: () => {
        setCalcType('upstream');
        setValues({
          distanceUpstream: '10',
          timeUpstream: '2',
          boatSpeed: '',
          streamSpeed: '',
          distanceDownstream: '',
          timeDownstream: ''
        });
      }
    }
  ];

  const updateFormulaPreview = () => {
    switch(calcType) {
      case 'speed':
        const boat = values.boatSpeed || 'Boat';
        const stream = values.streamSpeed || 'Stream';
        setFormulaPreview(`Downstream = ${boat} + ${stream}, Upstream = ${boat} - ${stream}`);
        break;
      case 'downstream':
        const distDown = values.distanceDownstream || 'Distance';
        const timeDown = values.timeDownstream || 'Time';
        setFormulaPreview(`Downstream Speed = ${distDown} / ${timeDown}`);
        break;
      case 'upstream':
        const distUp = values.distanceUpstream || 'Distance';
        const timeUp = values.timeUpstream || 'Time';
        setFormulaPreview(`Upstream Speed = ${distUp} / ${timeUp}`);
        break;
      default:
        setFormulaPreview('');
    }
  };

  const calculate = (addToHistory) => {
    let resultObj = {};
    let steps = [];
    let vizData = {};

    if (calcType === 'speed') {
      const boatSpeed = parseFloat(values.boatSpeed);
      const streamSpeed = parseFloat(values.streamSpeed);
      
      if (isNaN(boatSpeed)) {
        alert('Please enter valid boat speed');
        return;
      }
      
      if (isNaN(streamSpeed)) {
        alert('Please enter valid stream speed');
        return;
      }
      
      if (streamSpeed >= boatSpeed) {
        alert('Stream speed cannot be greater than or equal to boat speed');
        return;
      }
      
      const downstreamSpeed = boatSpeed + streamSpeed;
      const upstreamSpeed = boatSpeed - streamSpeed;
      const ratio = downstreamSpeed / upstreamSpeed;
      
      steps = [
        `Step 1: Calculate downstream speed`,
        `Downstream = Boat + Stream = ${boatSpeed} + ${streamSpeed} = ${downstreamSpeed} km/h`,
        `Step 2: Calculate upstream speed`,
        `Upstream = Boat - Stream = ${boatSpeed} - ${streamSpeed} = ${upstreamSpeed} km/h`,
        `Step 3: Calculate speed ratio`,
        `Ratio = Downstream / Upstream = ${downstreamSpeed} / ${upstreamSpeed} = ${ratio.toFixed(2)}`
      ];
      
      resultObj = {
        downstreamSpeed: downstreamSpeed.toFixed(2),
        upstreamSpeed: upstreamSpeed.toFixed(2),
        ratio: ratio.toFixed(2),
        steps
      };

      vizData = {
        type: 'speed',
        boatSpeed,
        streamSpeed,
        downstreamSpeed,
        upstreamSpeed
      };
    } else if (calcType === 'downstream') {
      const distance = parseFloat(values.distanceDownstream);
      const time = parseFloat(values.timeDownstream);
      
      if (isNaN(distance) || distance <= 0) {
        alert('Please enter valid distance');
        return;
      }
      
      if (isNaN(time) || time <= 0) {
        alert('Please enter valid time');
        return;
      }
      
      const speed = distance / time;
      
      steps = [
        `Step 1: Calculate downstream speed`,
        `Speed = Distance / Time = ${distance} / ${time} = ${speed.toFixed(2)} km/h`
      ];
      
      resultObj = {
        downstreamSpeed: speed.toFixed(2),
        steps
      };

      vizData = {
        type: 'downstream',
        distance,
        time,
        speed
      };
    } else if (calcType === 'upstream') {
      const distance = parseFloat(values.distanceUpstream);
      const time = parseFloat(values.timeUpstream);
      
      if (isNaN(distance) || distance <= 0) {
        alert('Please enter valid distance');
        return;
      }
      
      if (isNaN(time) || time <= 0) {
        alert('Please enter valid time');
        return;
      }
      
      const speed = distance / time;
      
      steps = [
        `Step 1: Calculate upstream speed`,
        `Speed = Distance / Time = ${distance} / ${time} = ${speed.toFixed(2)} km/h`
      ];
      
      resultObj = {
        upstreamSpeed: speed.toFixed(2),
        steps
      };

      vizData = {
        type: 'upstream',
        distance,
        time,
        speed
      };
    }

    setResult(resultObj);
    setVisualization(vizData);
    setAnimation(true);

    addToHistory({
      description: `${calcType === 'speed' ? 'Boat and stream speeds' : 
                   calcType === 'downstream' ? 'Downstream speed' : 'Upstream speed'} calculation`,
      result: calcType === 'speed' ? 
              `Downstream: ${resultObj.downstreamSpeed} km/h, Upstream: ${resultObj.upstreamSpeed} km/h` :
              calcType === 'downstream' ? `${resultObj.downstreamSpeed} km/h` :
              `${resultObj.upstreamSpeed} km/h`
    });
  };

  React.useEffect(() => {
    updateFormulaPreview();
  }, [values, calcType]);

  const renderInputs = () => {
    switch(calcType) {
      case 'speed':
        return (
          <>
            <div className="input-group">
              <label>Boat Speed in Still Water (km/hr):</label>
              <input
                type="number"
                value={values.boatSpeed}
                onChange={(e) => setValues({...values, boatSpeed: e.target.value})}
                placeholder="e.g., 15"
              />
            </div>
            <div className="input-group">
              <label>Stream Speed (km/hr):</label>
              <input
                type="number"
                value={values.streamSpeed}
                onChange={(e) => setValues({...values, streamSpeed: e.target.value})}
                placeholder="e.g., 5"
              />
            </div>
          </>
        );
      case 'downstream':
        return (
          <>
            <div className="input-group">
              <label>Distance Downstream (km):</label>
              <input
                type="number"
                value={values.distanceDownstream}
                onChange={(e) => setValues({...values, distanceDownstream: e.target.value})}
                placeholder="e.g., 20"
              />
            </div>
            <div className="input-group">
              <label>Time Taken (hrs):</label>
              <input
                type="number"
                value={values.timeDownstream}
                onChange={(e) => setValues({...values, timeDownstream: e.target.value})}
                placeholder="e.g., 1"
              />
            </div>
          </>
        );
      case 'upstream':
        return (
          <>
            <div className="input-group">
              <label>Distance Upstream (km):</label>
              <input
                type="number"
                value={values.distanceUpstream}
                onChange={(e) => setValues({...values, distanceUpstream: e.target.value})}
                placeholder="e.g., 10"
              />
            </div>
            <div className="input-group">
              <label>Time Taken (hrs):</label>
              <input
                type="number"
                value={values.timeUpstream}
                onChange={(e) => setValues({...values, timeUpstream: e.target.value})}
                placeholder="e.g., 2"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderVisualization = () => {
    if (!visualization) return null;

    return (
      <div className="visualization">
        <h3>Visualization:</h3>
        <div className="river-animation">
          <div className="river">
            {calcType === 'speed' && (
              <>
                <div className="boat downstream" 
                  style={{ 
                    animation: `moveBoat ${10/visualization.downstreamSpeed}s linear infinite`
                  }}>
                  Downstream: {visualization.downstreamSpeed} km/h
                </div>
                <div className="boat upstream"
                  style={{ 
                    animation: `moveBoat ${10/visualization.upstreamSpeed}s linear infinite reverse`
                  }}>
                  Upstream: {visualization.upstreamSpeed} km/h
                </div>
                <div className="stream-flow" 
                  style={{ 
                    animation: `flowWater ${10/visualization.streamSpeed}s linear infinite`
                  }}>
                  Stream: {visualization.streamSpeed} km/h
                </div>
              </>
            )}
            {(calcType === 'downstream' || calcType === 'upstream') && (
              <div className="boat"
                style={{ 
                  animation: `moveBoat ${10/visualization.speed}s linear infinite`,
                  animationDirection: calcType === 'upstream' ? 'reverse' : 'normal'
                }}>
                {calcType === 'downstream' ? 'Downstream' : 'Upstream'}: {visualization.speed} km/h
              </div>
            )}
          </div>
          <div className="river-bank"></div>
        </div>
      </div>
    );
  };

  return (
    <CalculatorBase 
      title="Boats and Streams Calculator" 
      description="Calculate boat speeds in downstream and upstream conditions."
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
              <option value="speed">Calculate Speeds from Boat and Stream</option>
              <option value="downstream">Calculate Downstream Speed</option>
              <option value="upstream">Calculate Upstream Speed</option>
            </select>
          </div>

          {renderInputs()}

          {formulaPreview && (
            <div className="formula-preview">
              <p>Formula Preview: {formulaPreview}</p>
            </div>
          )}

          <button onClick={() => calculate(addToHistory)} className="calculate-btn">
            Calculate
          </button>

          {renderVisualization()}

          {result && (
            <div className="result">
              <h3>Result:</h3>
              {result.downstreamSpeed && <p>Downstream Speed: <strong>{result.downstreamSpeed} km/hr</strong></p>}
              {result.upstreamSpeed && <p>Upstream Speed: <strong>{result.upstreamSpeed} km/hr</strong></p>}
              {result.ratio && <p>Downstream:Upstream Speed Ratio: <strong>{result.ratio}</strong></p>}
              
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

export default BoatsAndStreams;