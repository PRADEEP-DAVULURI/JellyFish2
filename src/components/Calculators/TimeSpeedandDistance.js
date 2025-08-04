import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../styles/calculator.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeSpeedDistance = () => {
  const [inputs, setInputs] = useState({
    distance: '',
    speed: '',
    time: ''
  });
  const [missingValue, setMissingValue] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('distance');
  const [history, setHistory] = useState([]);
  const [animation, setAnimation] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [vehicleType, setVehicleType] = useState('car');
  const [showVisualization, setShowVisualization] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation effect
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const vehicleIcons = {
    car: '🚗',
    bike: '🏍️',
    truck: '🚚',
    plane: '✈️',
    train: '🚆',
    ship: '🚢'
  };

  const formulas = {
    distance: {
      expression: 'Distance = Speed × Time',
      example: 'Car at 60 km/h for 2 hours → 60 × 2 = 120 km'
    },
    speed: {
      expression: 'Speed = Distance ÷ Time',
      example: '120 km in 2 hours → 120 ÷ 2 = 60 km/h'
    },
    time: {
      expression: 'Time = Distance ÷ Speed',
      example: '120 km at 60 km/h → 120 ÷ 60 = 2 hours'
    }
  };

  const generateChartData = (distance, speed, time) => {
    const hours = parseFloat(time) || parseFloat(distance) / parseFloat(speed);
    const interval = hours / 10;
    const labels = [];
    const distanceData = [];
    
    for (let i = 0; i <= 10; i++) {
      const currentHour = (i * interval).toFixed(2);
      labels.push(`${currentHour} hrs`);
      distanceData.push(parseFloat(speed) * parseFloat(currentHour));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Distance Traveled (km)',
          data: distanceData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          fill: true
        }
      ]
    };
  };

  const calculate = () => {
    const { distance, speed, time } = inputs;
    const filledValues = [distance, speed, time].filter(v => v !== '').length;

    if (filledValues !== 2) {
      alert('Please leave exactly one field blank!');
      return;
    }

    try {
      let value, calculation, unit, missing;
      const steps = [];
      
      if (!distance && speed && time) {
        value = parseFloat(speed) * parseFloat(time);
        calculation = `${speed} × ${time} = ${value.toFixed(2)}`;
        unit = 'km';
        missing = 'distance';
        
        steps.push('Using: Distance = Speed × Time');
        steps.push(`${speed} km/h × ${time} hours`);
        steps.push(`= ${value.toFixed(2)} km`);

        setChartData(generateChartData(value, speed, time));
      } 
      else if (distance && !speed && time) {
        value = parseFloat(distance) / parseFloat(time);
        calculation = `${distance} ÷ ${time} = ${value.toFixed(2)}`;
        unit = 'km/h';
        missing = 'speed';
        
        steps.push('Using: Speed = Distance ÷ Time');
        steps.push(`${distance} km ÷ ${time} hours`);
        steps.push(`= ${value.toFixed(2)} km/h`);
      } 
      else if (distance && speed && !time) {
        value = parseFloat(distance) / parseFloat(speed);
        calculation = `${distance} ÷ ${speed} = ${value.toFixed(2)}`;
        unit = 'hours';
        missing = 'time';
        
        steps.push('Using: Time = Distance ÷ Speed');
        steps.push(`${distance} km ÷ ${speed} km/h`);
        steps.push(`= ${value.toFixed(2)} hours`);
      }

      setResult({
        value: value.toFixed(2),
        calculation,
        unit,
        missing,
        steps
      });
      setMissingValue(missing);
      setActiveTab(missing);
      setAnimation(true);
      setShowVisualization(missing === 'distance');
      setProgress(0);

      setHistory(prev => [{
        inputs: {...inputs},
        result: `${missing}: ${value.toFixed(2)} ${unit}`,
        timestamp: new Date().toLocaleTimeString(),
        vehicle: vehicleType
      }, ...prev.slice(0, 3)]);

    } catch (error) {
      alert('Please enter valid numbers!');
      console.error(error);
    }
  };

  useEffect(() => {
    if (showVisualization && result) {
      const animationDuration = parseFloat(result.value) / parseFloat(inputs.speed || (inputs.distance / inputs.time)) * 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / animationDuration) * 100);
        setProgress(newProgress);
        
        if (newProgress < 100) {
          requestAnimationFrame(animate);
        }
      };
      
      const animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [showVisualization, result, inputs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const resetCalculator = () => {
    setInputs({ distance: '', speed: '', time: '' });
    setResult(null);
    setMissingValue(null);
    setChartData(null);
    setShowVisualization(false);
    setProgress(0);
  };

  const loadExample = (type) => {
    const examples = {
      distance: { speed: '60', time: '2', distance: '' },
      speed: { distance: '120', time: '2', speed: '' },
      time: { distance: '120', speed: '60', time: '' }
    };
    setInputs(examples[type]);
    setMissingValue(type);
    setActiveTab(type);
    setShowVisualization(type === 'distance');
  };

  const renderVehicleAnimation = () => {
    if (!showVisualization || !result) return null;

    const distance = parseFloat(result.value);
    const speed = parseFloat(inputs.speed || (inputs.distance / inputs.time));

    return (
      <div className="vehicle-animation-container">
        <div className="road">
          <div className="distance-markers">
            {[0, 0.25, 0.5, 0.75, 1].map((portion, i) => (
              <div key={i} className="marker" style={{ left: `${portion * 100}%` }}>
                <span>{(distance * portion).toFixed(1)} km</span>
              </div>
            ))}
          </div>
          <div 
            className="vehicle"
            style={{ 
              left: `${progress}%`,
            }}
          >
            <span className="vehicle-icon">{vehicleIcons[vehicleType]}</span>
            <span className="speed-badge">{speed} km/h</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`calculator-container ${animation ? 'animate' : ''}`}>
      <h2>Time, Speed and Distance Calculator</h2>
      
      <div className="formula-tabs">
        {Object.keys(formulas).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              loadExample(tab);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="formula-preview">
        <h4>{formulas[activeTab].expression}</h4>
        <p>Example: {formulas[activeTab].example}</p>
      </div>

      <div className="input-section">
        <div className="vehicle-selector">
          <label>Vehicle Type:</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            {Object.keys(vehicleIcons).map(type => (
              <option key={type} value={type}>
                {vehicleIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Distance (km):</label>
          <input
            type="number"
            name="distance"
            value={inputs.distance}
            onChange={handleInputChange}
            placeholder={missingValue === 'distance' ? 'Calculated' : 'Enter distance'}
            min="0"
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label>Speed (km/h):</label>
          <input
            type="number"
            name="speed"
            value={inputs.speed}
            onChange={handleInputChange}
            placeholder={missingValue === 'speed' ? 'Calculated' : 'Enter speed'}
            min="0"
            step="0.1"
          />
        </div>

        <div className="input-group">
          <label>Time (hours):</label>
          <input
            type="number"
            name="time"
            value={inputs.time}
            onChange={handleInputChange}
            placeholder={missingValue === 'time' ? 'Calculated' : 'Enter time'}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="button-group">
        <button onClick={calculate} className="calculate-btn">
          Calculate
        </button>
        <button onClick={resetCalculator} className="reset-btn">
          Reset
        </button>
      </div>

      {result && (
        <div className="result-section">
          <h3>Result:</h3>
          <p className="result-value">
            {result.missing.charAt(0).toUpperCase() + result.missing.slice(1)}: 
            <strong> {result.value} {result.unit}</strong>
          </p>
          <p className="result-calculation">
            Calculation: {result.calculation}
          </p>
          
          <div className="calculation-steps">
            <h4>Steps:</h4>
            <ol>
              {result.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {showVisualization && (
            <div className="visualization-section">
              <h4>Journey Visualization:</h4>
              {renderVehicleAnimation()}
              
              <div className="chart-container">
                <Line 
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Distance Over Time',
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Distance (km)'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Time (hours)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>Recent Calculations:</h3>
          <ul>
            {history.map((item, i) => (
              <li key={i}>
                <span className="vehicle-icon">{vehicleIcons[item.vehicle]}</span>
                <span className="history-result">{item.result}</span>
                <span className="history-time">{item.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimeSpeedDistance;