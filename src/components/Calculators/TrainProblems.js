import React, { useState, useEffect } from 'react';
import '../../styles/calculator.css';

const TrainProblems = () => {
  const [inputs, setInputs] = useState({
    trainLength: '',
    speed: '',
    objectLength: '',
    time: '',
    direction: 'same',
    objectSpeed: ''
  });
  const [result, setResult] = useState(null);
  const [problemType, setProblemType] = useState('crossing');
  const [animation, setAnimation] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [history, setHistory] = useState([]);

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const problemTypes = {
    crossing: {
      name: "Train Crossing Object",
      description: "Calculate time for train to cross a stationary object"
    },
    movingObject: {
      name: "Train Crossing Moving Object",
      description: "Calculate time for train to cross a moving object"
    },
    distance: {
      name: "Distance Covered",
      description: "Calculate distance covered in given time"
    },
    speed: {
      name: "Speed Calculation",
      description: "Calculate speed from time and distance"
    }
  };

  const calculate = () => {
    const trainLength = parseFloat(inputs.trainLength);
    const speed = parseFloat(inputs.speed);
    const objectLength = parseFloat(inputs.objectLength) || 0;
    const objectSpeed = parseFloat(inputs.objectSpeed) || 0;
    const time = parseFloat(inputs.time);

    let calculationResult = {};
    let vizData = {};

    try {
      switch (problemType) {
        case 'crossing':
          const relativeLength = trainLength + objectLength;
          const crossingTime = (relativeLength / 1000) / speed * 3600;
          calculationResult = {
            type: 'time',
            value: crossingTime.toFixed(2),
            unit: 'seconds',
            calculation: [
              `Total length to cover = Train length + Object length`,
              `= ${trainLength}m + ${objectLength}m = ${relativeLength}m`,
              `Convert speed to m/s: ${speed} km/h = ${(speed * 1000/3600).toFixed(2)} m/s`,
              `Time = Distance/Speed = ${relativeLength}m / ${(speed * 1000/3600).toFixed(2)} m/s`,
              `= ${crossingTime.toFixed(2)} seconds`
            ]
          };
          vizData = {
            trainLength,
            objectLength,
            speed,
            objectSpeed: 0,
            time: crossingTime,
            direction: 'same',
            type: 'crossing'
          };
          break;

        case 'movingObject':
          const relativeSpeed = inputs.direction === 'same' 
            ? Math.abs(speed - objectSpeed)
            : speed + objectSpeed;
          const movingTime = ((trainLength + objectLength) / 1000) / relativeSpeed * 3600;
          calculationResult = {
            type: 'time',
            value: movingTime.toFixed(2),
            unit: 'seconds',
            calculation: [
              `Relative speed = ${inputs.direction === 'same' ? 'Difference' : 'Sum'} of speeds`,
              `= ${inputs.direction === 'same' ? `${speed} - ${objectSpeed}` : `${speed} + ${objectSpeed}`} = ${relativeSpeed} km/h`,
              `Total length = ${trainLength}m + ${objectLength}m = ${trainLength + objectLength}m`,
              `Convert speed to m/s: ${relativeSpeed} km/h = ${(relativeSpeed * 1000/3600).toFixed(2)} m/s`,
              `Time = ${trainLength + objectLength}m / ${(relativeSpeed * 1000/3600).toFixed(2)} m/s`,
              `= ${movingTime.toFixed(2)} seconds`
            ]
          };
          vizData = {
            trainLength,
            objectLength,
            speed,
            objectSpeed,
            time: movingTime,
            direction: inputs.direction,
            type: 'movingObject'
          };
          break;

        case 'distance':
          const distance = speed * (time / 3600);
          calculationResult = {
            type: 'distance',
            value: distance.toFixed(2),
            unit: 'km',
            calculation: [
              `Convert time to hours: ${time} seconds = ${(time/3600).toFixed(4)} hours`,
              `Distance = Speed × Time`,
              `= ${speed} km/h × ${(time/3600).toFixed(4)} h`,
              `= ${distance.toFixed(2)} km`
            ]
          };
          vizData = {
            trainLength,
            distance,
            speed,
            time,
            type: 'distance'
          };
          break;

        case 'speed':
          const calculatedSpeed = ((trainLength + objectLength) / 1000) / (time / 3600);
          calculationResult = {
            type: 'speed',
            value: calculatedSpeed.toFixed(2),
            unit: 'km/h',
            calculation: [
              `Total distance = Train length + Object length`,
              `= ${trainLength}m + ${objectLength}m = ${trainLength + objectLength}m = ${(trainLength + objectLength)/1000} km`,
              `Convert time to hours: ${time} seconds = ${(time/3600).toFixed(4)} hours`,
              `Speed = Distance/Time`,
              `= ${(trainLength + objectLength)/1000} km / ${(time/3600).toFixed(4)} h`,
              `= ${calculatedSpeed.toFixed(2)} km/h`
            ]
          };
          vizData = {
            trainLength,
            objectLength,
            speed: calculatedSpeed,
            time,
            type: 'speed'
          };
          break;

        default:
          throw new Error('Invalid problem type');
      }

      setResult(calculationResult);
      setVisualization(vizData);
      setAnimation(true);

      // Add to history
      setHistory(prev => [{
        inputs: {...inputs},
        problemType,
        result: calculationResult,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]);

    } catch (error) {
      alert('Please enter valid numbers for all required fields!');
      console.error(error);
    }
  };

  const resetCalculator = () => {
    setInputs({
      trainLength: '',
      speed: '',
      objectLength: '',
      time: '',
      direction: 'same',
      objectSpeed: ''
    });
    setResult(null);
    setVisualization(null);
  };

  const loadExample = (type) => {
    const examples = {
      crossing: {
        trainLength: '200',
        speed: '60',
        objectLength: '100',
        time: '',
        objectSpeed: ''
      },
      movingObject: {
        trainLength: '200',
        speed: '60',
        objectLength: '100',
        objectSpeed: '40',
        time: '',
        direction: 'same'
      },
      distance: {
        trainLength: '200',
        speed: '60',
        time: '30',
        objectLength: '',
        objectSpeed: ''
      },
      speed: {
        trainLength: '200',
        objectLength: '100',
        time: '18',
        speed: '',
        objectSpeed: ''
      }
    };
    setInputs(examples[type]);
    setProblemType(type);
  };

  return (
    <div className={`calculator-container ${animation ? 'animate' : ''}`}>
      <h2>Train Problems Calculator</h2>
      
      <div className="problem-types">
        {Object.keys(problemTypes).map(type => (
          <button
            key={type}
            className={`tab ${problemType === type ? 'active' : ''}`}
            onClick={() => {
              setProblemType(type);
              loadExample(type);
            }}
          >
            {problemTypes[type].name}
          </button>
        ))}
      </div>

      <div className="problem-description">
        <p>{problemTypes[problemType].description}</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label>Train Length (meters):</label>
          <input
            type="number"
            value={inputs.trainLength}
            onChange={(e) => setInputs({...inputs, trainLength: e.target.value})}
            placeholder="e.g., 200"
            min="1"
          />
        </div>

        {(problemType !== 'speed') && (
          <div className="input-group">
            <label>Train Speed (km/h):</label>
            <input
              type="number"
              value={inputs.speed}
              onChange={(e) => setInputs({...inputs, speed: e.target.value})}
              placeholder="e.g., 60"
              min="1"
            />
          </div>
        )}

        {(problemType === 'crossing' || problemType === 'movingObject' || problemType === 'speed') && (
          <div className="input-group">
            <label>Object Length (meters):</label>
            <input
              type="number"
              value={inputs.objectLength}
              onChange={(e) => setInputs({...inputs, objectLength: e.target.value})}
              placeholder="e.g., 100 for platform"
              min="0"
            />
          </div>
        )}

        {(problemType === 'movingObject') && (
          <>
            <div className="input-group">
              <label>Object Speed (km/h):</label>
              <input
                type="number"
                value={inputs.objectSpeed}
                onChange={(e) => setInputs({...inputs, objectSpeed: e.target.value})}
                placeholder="e.g., 40"
                min="0"
              />
            </div>
            <div className="input-group">
              <label>Direction:</label>
              <select
                value={inputs.direction}
                onChange={(e) => setInputs({...inputs, direction: e.target.value})}
              >
                <option value="same">Same Direction</option>
                <option value="opposite">Opposite Direction</option>
              </select>
            </div>
          </>
        )}

        {(problemType === 'distance' || problemType === 'speed') && (
          <div className="input-group">
            <label>Time (seconds):</label>
            <input
              type="number"
              value={inputs.time}
              onChange={(e) => setInputs({...inputs, time: e.target.value})}
              placeholder="e.g., 30"
              min="0.1"
              step="0.1"
            />
          </div>
        )}
      </div>

      <div className="button-group">
        <button onClick={calculate} className="calculate-btn">
          Calculate
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      {visualization && (
        <div className="visualization">
          <h3>Visualization:</h3>
          <div className="train-animation">
            <div className="track">
              {problemType === 'distance' ? (
                <>
                  <div className="train" style={{ width: `${inputs.trainLength/5}px` }}></div>
                  <div className="distance-marker">
                    {visualization.distance} km in {inputs.time} seconds
                  </div>
                </>
              ) : (
                <>
                  <div className="train" style={{ 
                    width: `${inputs.trainLength/5}px`,
                    animation: `moveTrain ${visualization.time}s linear infinite`
                  }}></div>
                  <div className="object" style={{ 
                    width: `${inputs.objectLength/5}px`,
                    animation: problemType === 'movingObject' ? 
                      `moveObject ${visualization.time}s ${visualization.direction === 'same' ? 'linear' : 'reverse'} infinite` : 'none'
                  }}></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          <p className="result-value">
            {result.type === 'time' ? 'Time to cross:' : 
             result.type === 'distance' ? 'Distance covered:' : 
             'Speed required:'} 
            <strong> {result.value} {result.unit}</strong>
          </p>
          
          <div className="calculation-steps">
            <h4>Calculation Steps:</h4>
            <ol>
              {result.calculation.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>Recent Calculations:</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <button onClick={() => {
                  setInputs(item.inputs);
                  setProblemType(item.problemType);
                }}>
                  {problemTypes[item.problemType].name} - {item.result.value} {item.result.unit}
                </button>
                <span>{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrainProblems;