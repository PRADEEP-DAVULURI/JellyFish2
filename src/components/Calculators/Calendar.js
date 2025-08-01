import React, { useState } from 'react';
import CalculatorBase from './CalculatorBase';
import '../../styles/calculator.css';

const CalendarCalculator = () => {
  const [date, setDate] = useState('');
  const [result, setResult] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);

  const examples = [
    {
      title: "Millennium Start",
      problem: "January 1, 2000",
      solution: "Saturday (Leap Year)",
      onTry: () => setDate('2000-01-01')
    },
    {
      title: "Current Date",
      problem: "Today's date",
      solution: `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}`,
      onTry: () => setDate(new Date().toISOString().split('T')[0])
    },
    {
      title: "Historical Event",
      problem: "July 20, 1969",
      solution: "Sunday (Moon Landing)",
      onTry: () => setDate('1969-07-20')
    }
  ];

  const calculateDay = (addToHistory) => {
    if (!date) {
      alert('Please select a date');
      return;
    }
    
    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      alert('Please enter a valid date');
      return;
    }

    const steps = [];
    steps.push(`Input Date: ${inputDate.toISOString().split('T')[0]}`);

    // Get day of week using Date object
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[inputDate.getDay()];
    steps.push(`JavaScript Calculation: ${dayOfWeek}`);

    // Zeller's Congruence algorithm for verification
    let day = inputDate.getDate();
    let month = inputDate.getMonth() + 1;
    let year = inputDate.getFullYear();
    
    steps.push(`Original values - Day: ${day}, Month: ${month}, Year: ${year}`);

    if (month < 3) {
      month += 12;
      year -= 1;
      steps.push(`Adjusted for Zeller's - Month: ${month}, Year: ${year}`);
    }
    
    const K = year % 100;
    const J = Math.floor(year / 100);
    
    steps.push(`K (year % 100): ${K}`);
    steps.push(`J (floor(year / 100)): ${J}`);

    const h = (
      day + 
      Math.floor((13 * (month + 1)) / 5) + 
      K + 
      Math.floor(K / 4) + 
      Math.floor(J / 4) + 
      (5 * J)
    );
    
    steps.push(`h = day + floor(13*(month+1)/5) + K + floor(K/4) + floor(J/4) + 5*J`);
    steps.push(`h = ${day} + ${Math.floor((13 * (month + 1)) / 5)} + ${K} + ${Math.floor(K / 4)} + ${Math.floor(J / 4)} + ${5 * J} = ${h}`);

    const zellerDay = h % 7;
    const zellerDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const zellerResult = zellerDays[zellerDay];
    
    steps.push(`h mod 7 = ${zellerDay} → ${zellerResult}`);

    // Leap year calculation
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    steps.push(`Leap Year Check:`);
    steps.push(`(${year} % 4 === 0 && ${year} % 100 !== 0) || ${year} % 400 === 0`);
    steps.push(`(${year % 4 === 0} && ${year % 100 !== 0}) || ${year % 400 === 0}`);
    steps.push(`(${year % 4 === 0 && year % 100 !== 0}) || ${year % 400 === 0} → ${isLeapYear}`);

    // Day of year calculation
    const startOfYear = new Date(inputDate.getFullYear(), 0, 0);
    const diff = inputDate - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    steps.push(`Day of Year: ${dayOfYear}`);

    // Week number calculation
    const firstDayOfYear = new Date(inputDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (inputDate - firstDayOfYear) / (1000 * 60 * 60 * 24);
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    steps.push(`Week Number: ${weekNumber}`);

    // Age calculation (if date is in past)
    const today = new Date();
    let age = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < inputDate.getDate())) {
      age--;
    }
    if (inputDate <= today) {
      steps.push(`Age: ${age} years`);
    }

    setResult({
      dayOfWeek,
      zellerDay: zellerResult,
      isLeapYear,
      formattedDate: inputDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      dayOfYear,
      weekNumber,
      age: inputDate <= today ? age : null,
      year: inputDate.getFullYear()
    });

    setCalculationSteps(steps);

    addToHistory({
      description: `Date Analysis: ${inputDate.toISOString().split('T')[0]}`,
      result: `${dayOfWeek}, ${isLeapYear ? 'Leap Year' : 'Not Leap Year'}`
    });
  };

  return (
    <CalculatorBase 
      title="Calendar Calculator" 
      description="Calculate day of week, leap years, and other calendar properties for any date."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="input-group">
            <label>Select a Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="date-input"
            />
          </div>

          <button onClick={() => calculateDay(addToHistory)} className="calculate-btn">
            Analyze Date
          </button>

          {result && (
            <div className="result">
              <h3>Date Analysis Results</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Full Date:</span>
                  <span className="result-value">{result.formattedDate}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Day of Week:</span>
                  <span className="result-value">{result.dayOfWeek}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Zeller's Verification:</span>
                  <span className="result-value">{result.zellerDay}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Leap Year:</span>
                  <span className="result-value">{result.isLeapYear ? 'Yes' : 'No'}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Day of Year:</span>
                  <span className="result-value">{result.dayOfYear}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Week Number:</span>
                  <span className="result-value">{result.weekNumber}</span>
                </div>
                {result.age !== null && (
                  <div className="result-item">
                    <span className="result-label">Age:</span>
                    <span className="result-value">{result.age} years</span>
                  </div>
                )}
                <div className="result-item">
                  <span className="result-label">Year Type:</span>
                  <span className="result-value">
                    {result.isLeapYear ? 'Leap Year' : 'Common Year'} ({result.year})
                  </span>
                </div>
              </div>

              {calculationSteps.length > 0 && (
                <div className="step-by-step">
                  <h4>Calculation Details:</h4>
                  {calculationSteps.map((step, index) => (
                    <div key={index} className="step">{step}</div>
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

export default CalendarCalculator;