import React, { useState } from 'react';
import '../../styles/calculator.css';

const Clock = () => {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [result, setResult] = useState(null);

  const calculateAngle = () => {
    if (!time1) return;
    
    // Parse time input
    const [hours, minutes] = time1.split(':').map(Number);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      alert('Please enter a valid time in HH:MM format');
      return;
    }

    // Calculate angle for time1
    const hourAngle = (hours % 12) * 30 + (minutes * 0.5);
    const minuteAngle = minutes * 6;
    let angle = Math.abs(hourAngle - minuteAngle);
    angle = Math.min(angle, 360 - angle);

    // Calculate time between two times if provided
    let timeDiff = null;
    if (time2) {
      const [hours2, minutes2] = time2.split(':').map(Number);
      if (hours2 < 0 || hours2 > 23 || minutes2 < 0 || minutes2 > 59) {
        alert('Please enter a valid second time in HH:MM format');
        return;
      }
      
      const totalMinutes1 = hours * 60 + minutes;
      const totalMinutes2 = hours2 * 60 + minutes2;
      timeDiff = Math.abs(totalMinutes2 - totalMinutes1);
    }

    setResult({
      angle: angle.toFixed(2),
      timeDiff: timeDiff ? `${Math.floor(timeDiff / 60)} hours and ${timeDiff % 60} minutes` : null
    });
  };

  return (
    <div className="calculator-container">
      <h2>Clock Angle Calculator</h2>
      <div className="example">
        <p><strong>Example:</strong> At 3:00, the angle is 90°</p>
        <p>Between 3:00 and 4:30 is 1 hour and 30 minutes</p>
      </div>

      <div className="input-group">
        <label>Enter Time (HH:MM):</label>
        <input
          type="time"
          value={time1}
          onChange={(e) => setTime1(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Second Time (optional for time difference):</label>
        <input
          type="time"
          value={time2}
          onChange={(e) => setTime2(e.target.value)}
        />
      </div>

      <button onClick={calculateAngle} className="calculate-btn">
        Calculate Clock Angle
      </button>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p>Angle between hands: <strong>{result.angle}°</strong></p>
          {result.timeDiff && (
            <p>Time difference: <strong>{result.timeDiff}</strong></p>
          )}
        </div>
      )}
    </div>
  );
};

export default Clock;