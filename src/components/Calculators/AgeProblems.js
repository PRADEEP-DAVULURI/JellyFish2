import React, { useState, useEffect } from 'react';
import CalculatorBase from './CalculatorBase';

const AgeProblems = () => {
  const [currentAges, setCurrentAges] = useState({ person1: '', person2: '' });
  const [years, setYears] = useState({ ago: '', hence: '' });
  const [result, setResult] = useState(null);
  const [formulaPreview, setFormulaPreview] = useState('');
  const [relationshipMode, setRelationshipMode] = useState(false);
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [relationship, setRelationship] = useState('');
  const [relationshipResult, setRelationshipResult] = useState(null);
  const [gender, setGender] = useState('male'); // To handle gender-specific relationships

  // Enhanced relationship mapping with more comprehensive connections
  const relationships = {
    // Immediate family
    mother: { 
      reverse: 'child',
      male: 'son',
      female: 'daughter',
      relationships: {
        spouse: 'father',
        child: ['son', 'daughter'],
        sibling: ['aunt', 'uncle']
      }
    },
    father: { 
      reverse: 'child',
      male: 'son',
      female: 'daughter',
      relationships: {
        spouse: 'mother',
        child: ['son', 'daughter'],
        sibling: ['aunt', 'uncle']
      }
    },
    son: { 
      reverse: 'parent',
      male: 'father',
      female: 'mother',
      relationships: {
        spouse: 'daughter-in-law',
        child: 'grandson',
        parent: ['father', 'mother'],
        sibling: ['son', 'daughter']
      }
    },
    daughter: { 
      reverse: 'parent',
      male: 'father',
      female: 'mother',
      relationships: {
        spouse: 'son-in-law',
        child: 'granddaughter',
        parent: ['father', 'mother'],
        sibling: ['son', 'daughter']
      }
    },
    brother: { 
      reverse: 'sibling',
      male: 'brother',
      female: 'sister',
      relationships: {
        spouse: 'sister-in-law',
        child: ['nephew', 'niece'],
        parent: ['father', 'mother'],
        sibling: ['brother', 'sister']
      }
    },
    sister: { 
      reverse: 'sibling',
      male: 'brother',
      female: 'sister',
      relationships: {
        spouse: 'brother-in-law',
        child: ['nephew', 'niece'],
        parent: ['father', 'mother'],
        sibling: ['brother', 'sister']
      }
    },
    husband: { 
      reverse: 'wife',
      relationships: {
        child: ['son', 'daughter'],
        parent: ['father-in-law', 'mother-in-law'],
        sibling: ['brother-in-law', 'sister-in-law']
      }
    },
    wife: { 
      reverse: 'husband',
      relationships: {
        child: ['son', 'daughter'],
        parent: ['father-in-law', 'mother-in-law'],
        sibling: ['brother-in-law', 'sister-in-law']
      }
    },
    
    // Extended family
    grandfather: { 
      reverse: 'grandchild',
      relationships: {
        spouse: 'grandmother',
        child: ['father', 'mother', 'uncle', 'aunt'],
        sibling: ['great-uncle', 'great-aunt']
      }
    },
    grandmother: { 
      reverse: 'grandchild',
      relationships: {
        spouse: 'grandfather',
        child: ['father', 'mother', 'uncle', 'aunt'],
        sibling: ['great-uncle', 'great-aunt']
      }
    },
    grandson: { 
      reverse: 'grandparent',
      relationships: {
        spouse: 'granddaughter-in-law',
        child: 'great-grandson',
        parent: ['son', 'daughter']
      }
    },
    granddaughter: { 
      reverse: 'grandparent',
      relationships: {
        spouse: 'grandson-in-law',
        child: 'great-granddaughter',
        parent: ['son', 'daughter']
      }
    },
    uncle: { 
      reverse: 'nephew/niece',
      relationships: {
        spouse: 'aunt',
        child: ['cousin'],
        sibling: ['uncle', 'aunt', 'father', 'mother']
      }
    },
    aunt: { 
      reverse: 'nephew/niece',
      relationships: {
        spouse: 'uncle',
        child: ['cousin'],
        sibling: ['uncle', 'aunt', 'father', 'mother']
      }
    },
    nephew: { 
      reverse: 'uncle/aunt',
      relationships: {
        spouse: 'niece-in-law',
        child: 'grandnephew',
        parent: ['brother', 'sister']
      }
    },
    niece: { 
      reverse: 'uncle/aunt',
      relationships: {
        spouse: 'nephew-in-law',
        child: 'grandniece',
        parent: ['brother', 'sister']
      }
    },
    cousin: { 
      reverse: 'cousin',
      relationships: {
        spouse: 'cousin-in-law',
        child: 'second cousin',
        parent: ['uncle', 'aunt']
      }
    },
    
    // In-laws
    fatherInLaw: { 
      reverse: 'son/daughter-in-law',
      relationships: {
        spouse: 'mother-in-law',
        child: ['brother-in-law', 'sister-in-law', 'spouse']
      }
    },
    motherInLaw: { 
      reverse: 'son/daughter-in-law',
      relationships: {
        spouse: 'father-in-law',
        child: ['brother-in-law', 'sister-in-law', 'spouse']
      }
    },
    sonInLaw: { 
      reverse: 'father/mother-in-law',
      relationships: {
        spouse: 'daughter',
        child: 'grandson',
        parent: ['father-in-law', 'mother-in-law']
      }
    },
    daughterInLaw: { 
      reverse: 'father/mother-in-law',
      relationships: {
        spouse: 'son',
        child: 'granddaughter',
        parent: ['father-in-law', 'mother-in-law']
      }
    },
    brotherInLaw: { 
      reverse: 'brother/sister-in-law',
      relationships: {
        spouse: 'sister-in-law',
        child: ['nephew', 'niece'],
        sibling: ['brother-in-law', 'sister-in-law']
      }
    },
    sisterInLaw: { 
      reverse: 'brother/sister-in-law',
      relationships: {
        spouse: 'brother-in-law',
        child: ['nephew', 'niece'],
        sibling: ['brother-in-law', 'sister-in-law']
      }
    },
    
    // Step family
    stepMother: { 
      reverse: 'step-child',
      relationships: {
        spouse: 'step-father',
        child: ['step-son', 'step-daughter'],
        sibling: ['step-aunt', 'step-uncle']
      }
    },
    stepFather: { 
      reverse: 'step-child',
      relationships: {
        spouse: 'step-mother',
        child: ['step-son', 'step-daughter'],
        sibling: ['step-aunt', 'step-uncle']
      }
    },
    stepSon: { 
      reverse: 'step-parent',
      relationships: {
        spouse: 'step-daughter-in-law',
        child: 'step-grandson',
        parent: ['step-father', 'step-mother']
      }
    },
    stepDaughter: { 
      reverse: 'step-parent',
      relationships: {
        spouse: 'step-son-in-law',
        child: 'step-granddaughter',
        parent: ['step-father', 'step-mother']
      }
    }
  };

  const examples = [
    {
      title: "Current Age Difference",
      problem: "A is 30 years old, B is 20 years old. What's the age difference?",
      formula: "Difference = Age1 - Age2",
      solution: "30 - 20 = 10 years",
      onTry: () => {
        setCurrentAges({ person1: '30', person2: '20' });
        setYears({ ago: '', hence: '' });
        setRelationshipMode(false);
      }
    },
    {
      title: "Mother-Daughter Relationship",
      problem: "How is a mother related to her daughter?",
      solution: "Direct parent-child relationship",
      onTry: () => {
        setPerson1('mother');
        setPerson2('daughter');
        setRelationshipMode(true);
      }
    },
    {
      title: "Age Ratio in Past",
      problem: "5 years ago, A was twice as old as B. Current ages are 25 and 15.",
      formula: "(Age1 - YearsAgo) / (Age2 - YearsAgo)",
      solution: "(25 - 5) / (15 - 5) = 20 / 10 = 2",
      onTry: () => {
        setCurrentAges({ person1: '25', person2: '15' });
        setYears({ ago: '5', hence: '' });
        setRelationshipMode(false);
      }
    },
    {
      title: "Uncle-Nephew Relationship",
      problem: "How is an uncle related to his nephew?",
      solution: "Uncle is the brother of one's parent",
      onTry: () => {
        setPerson1('uncle');
        setPerson2('nephew');
        setRelationshipMode(true);
      }
    }
  ];

  const updateFormulaPreview = () => {
    if (relationshipMode) {
      if (person1 && person2) {
        setFormulaPreview(`Relationship between ${person1} and ${person2}`);
      } else if (person1 && relationship) {
        setFormulaPreview(`Who is ${relationship} of ${person1}?`);
      }
    } else {
      const age1 = currentAges.person1 || 'Age1';
      const age2 = currentAges.person2 || 'Age2';
      const ago = years.ago || 'YearsAgo';
      const hence = years.hence || 'YearsHence';
      
      if (years.ago) {
        setFormulaPreview(`(${age1} - ${ago}) / (${age2} - ${ago})`);
      } else if (years.hence) {
        setFormulaPreview(`(${age1} + ${hence}) / (${age2} + ${hence})`);
      } else {
        setFormulaPreview(`|${age1} - ${age2}|`);
      }
    }
  };

  const calculateAge = (addToHistory) => {
    const age1 = parseInt(currentAges.person1);
    const age2 = parseInt(currentAges.person2);
    const yearsAgo = parseInt(years.ago) || 0;
    const yearsHence = parseInt(years.hence) || 0;

    if (isNaN(age1)) {
      alert('Please enter a valid age for Person 1');
      return;
    }

    if (isNaN(age2)) {
      alert('Please enter a valid age for Person 2');
      return;
    }

    let calculationSteps = [];
    let resultObj = { current: `Current ages: ${age1} and ${age2}` };

    if (yearsAgo > 0) {
      const ratio = (age1 - yearsAgo) / (age2 - yearsAgo);
      calculationSteps.push(
        `Step 1: Calculate ages ${yearsAgo} years ago`,
        `Person 1: ${age1} - ${yearsAgo} = ${age1 - yearsAgo}`,
        `Person 2: ${age2} - ${yearsAgo} = ${age2 - yearsAgo}`,
        `Step 2: Calculate ratio`,
        `(${age1 - yearsAgo}) / (${age2 - yearsAgo}) = ${ratio.toFixed(2)}`
      );
      resultObj.past = `${yearsAgo} years ago, the ratio was ${ratio.toFixed(2)}`;
      
      if (yearsHence > 0) {
        const futureRatio = ((age1 + yearsHence)/(age2 + yearsHence)).toFixed(2);
        calculationSteps.push(
          `Step 3: Calculate ratio in ${yearsHence} years`,
          `(${age1 + yearsHence}) / (${age2 + yearsHence}) = ${futureRatio}`
        );
        resultObj.future = `${yearsHence} years hence, the ratio will be ${futureRatio}`;
      }
    } else if (yearsHence > 0) {
      const ratio = (age1 + yearsHence) / (age2 + yearsHence);
      calculationSteps.push(
        `Step 1: Calculate ages in ${yearsHence} years`,
        `Person 1: ${age1} + ${yearsHence} = ${age1 + yearsHence}`,
        `Person 2: ${age2} + ${yearsHence} = ${age2 + yearsHence}`,
        `Step 2: Calculate ratio`,
        `(${age1 + yearsHence}) / (${age2 + yearsHence}) = ${ratio.toFixed(2)}`
      );
      resultObj.future = `${yearsHence} years hence, the ratio will be ${ratio.toFixed(2)}`;
    } else {
      calculationSteps.push(
        `Step 1: Calculate age difference`,
        `|${age1} - ${age2}| = ${Math.abs(age1 - age2)}`
      );
      resultObj.difference = `Difference: ${Math.abs(age1 - age2)} years`;
    }

    setResult({
      ...resultObj,
      steps: calculationSteps
    });

    addToHistory({
      description: `Age calculation: ${age1} & ${age2}${yearsAgo ? `, ${yearsAgo} years ago` : ''}${yearsHence ? `, ${yearsHence} years hence` : ''}`,
      result: resultObj.past || resultObj.future || resultObj.difference
    });
  };

  const calculateRelationship = (addToHistory) => {
    if (!person1 && !person2 && !relationship) {
      alert('Please enter at least two relationship terms');
      return;
    }

    let resultObj = {};
    let calculationSteps = [];
    let relationshipDescription = '';

    if (person1 && person2) {
      // Find relationship between two people
      const rel1 = relationships[person1];
      const rel2 = relationships[person2];
      
      if (rel1 && rel2) {
        // Direct reverse relationship
        if (rel1.reverse === person2 || (Array.isArray(rel1.reverse) && rel1.reverse.includes(person2))) {
          relationshipDescription = `${person1} is the ${person2}'s ${person1}`;
          calculationSteps.push(
            `The reverse of ${person2} is ${rel2.reverse}`,
            `Therefore, ${person1} is the ${person2}'s ${person1}`
          );
        } 
        // Check if person2 is in person1's relationships
        else if (rel1.relationships && Object.values(rel1.relationships).flat().includes(person2)) {
          const relationType = Object.entries(rel1.relationships).find(([_, values]) => 
            Array.isArray(values) ? values.includes(person2) : values === person2
          )[0];
          
          relationshipDescription = `${person1}'s ${relationType} is ${person2}`;
          calculationSteps.push(
            `In ${person1}'s relationships, ${person2} is listed as ${relationType}`,
            `Therefore, ${person1}'s ${relationType} is ${person2}`
          );
        }
        // Check if person1 is in person2's relationships
        else if (rel2.relationships && Object.values(rel2.relationships).flat().includes(person1)) {
          const relationType = Object.entries(rel2.relationships).find(([_, values]) => 
            Array.isArray(values) ? values.includes(person1) : values === person1
          )[0];
          
          relationshipDescription = `${person2}'s ${relationType} is ${person1}`;
          calculationSteps.push(
            `In ${person2}'s relationships, ${person1} is listed as ${relationType}`,
            `Therefore, ${person2}'s ${relationType} is ${person1}`
          );
        }
        // More complex relationship analysis
        else {
          relationshipDescription = `${person1} and ${person2} may be connected through extended family relationships`;
          calculationSteps.push(
            `Checking extended family connections...`,
            `This requires more complex family tree analysis`
          );
        }
      } else {
        relationshipDescription = `One or both relationship terms are not recognized`;
      }
    } else if (person1 && relationship) {
      // Find who has this relationship to person1
      const rel = relationships[relationship];
      if (rel) {
        const reverseRel = rel.reverse;
        relationshipDescription = `The ${relationship} of ${person1} is ${reverseRel}`;
        calculationSteps.push(
          `The reverse relationship of ${relationship} is ${reverseRel}`,
          `Therefore, the ${relationship} of ${person1} is ${reverseRel}`
        );
        
        // If the relationship has gender-specific versions
        if (rel[gender]) {
          relationshipDescription += ` (${rel[gender]} if ${gender})`;
          calculationSteps.push(
            `Gender-specific: ${rel[gender]} if ${gender}`
          );
        }
      } else {
        relationshipDescription = `Relationship term '${relationship}' not recognized`;
      }
    }

    resultObj.relationship = relationshipDescription;
    resultObj.steps = calculationSteps;

    setRelationshipResult(resultObj);

    if (relationshipDescription && !relationshipDescription.includes('not recognized')) {
      addToHistory({
        description: `Relationship: ${person1} ${person2 ? `and ${person2}` : `'s ${relationship}`}`,
        result: relationshipDescription
      });
    }
  };

  const resetCalculator = () => {
    setCurrentAges({ person1: '', person2: '' });
    setYears({ ago: '', hence: '' });
    setResult(null);
    setPerson1('');
    setPerson2('');
    setRelationship('');
    setRelationshipResult(null);
  };

  useEffect(() => {
    updateFormulaPreview();
  }, [currentAges, years, person1, person2, relationship, relationshipMode, gender]);

  return (
    <CalculatorBase 
      title="Age & Relationship Problems Calculator" 
      description="Solve age-related problems and analyze family relationships."
      examples={examples}
    >
      {(addToHistory) => (
        <>
          <div className="mode-toggle">
            <button
              className={`tab ${!relationshipMode ? 'active' : ''}`}
              onClick={() => setRelationshipMode(false)}
            >
              Age Calculator
            </button>
            <button
              className={`tab ${relationshipMode ? 'active' : ''}`}
              onClick={() => setRelationshipMode(true)}
            >
              Relationship Analyzer
            </button>
          </div>

          {!relationshipMode ? (
            <>
              <div className="input-group">
                <label>Current Age of Person 1:</label>
                <input
                  type="number"
                  value={currentAges.person1}
                  onChange={(e) => setCurrentAges({...currentAges, person1: e.target.value})}
                  placeholder="e.g., 30"
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Current Age of Person 2:</label>
                <input
                  type="number"
                  value={currentAges.person2}
                  onChange={(e) => setCurrentAges({...currentAges, person2: e.target.value})}
                  placeholder="e.g., 20"
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Years Ago (optional):</label>
                <input
                  type="number"
                  value={years.ago}
                  onChange={(e) => setYears({...years, ago: e.target.value, hence: ''})}
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>

              <div className="input-group">
                <label>Years Hence (optional):</label>
                <input
                  type="number"
                  value={years.hence}
                  onChange={(e) => setYears({...years, hence: e.target.value, ago: ''})}
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <label>Gender (for gender-specific relationships):</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="input-group">
                <label>Person 1's Relationship:</label>
                <select
                  value={person1}
                  onChange={(e) => setPerson1(e.target.value)}
                >
                  <option value="">Select relationship...</option>
                  {Object.keys(relationships).map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Person 2's Relationship (or leave blank):</label>
                <select
                  value={person2}
                  onChange={(e) => setPerson2(e.target.value)}
                >
                  <option value="">Select relationship...</option>
                  {Object.keys(relationships).map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>OR Find who is this to Person 1:</label>
                <select
                  value={relationship}
                  onChange={(e) => {
                    setRelationship(e.target.value);
                    setPerson2('');
                  }}
                >
                  <option value="">Select relationship to find...</option>
                  {Object.keys(relationships).map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              <div className="relationship-info">
                <h4>Common Relationships:</h4>
                <ul>
                  <li><strong>Immediate:</strong> mother, father, son, daughter, brother, sister</li>
                  <li><strong>Extended:</strong> grandfather, grandmother, uncle, aunt, cousin</li>
                  <li><strong>In-laws:</strong> father-in-law, mother-in-law, son-in-law</li>
                  <li><strong>Step:</strong> step-mother, step-father, step-sister</li>
                </ul>
              </div>
            </>
          )}

          {formulaPreview && (
            <div className="formula-preview">
              <p>{formulaPreview}</p>
            </div>
          )}

          <button 
            onClick={() => relationshipMode ? calculateRelationship(addToHistory) : calculateAge(addToHistory)} 
            className="calculate-btn"
          >
            {relationshipMode ? 'Analyze Relationship' : 'Calculate Age Relationships'}
          </button>

          <button onClick={resetCalculator} className="reset-btn">
            Reset Calculator
          </button>

          {(result || relationshipResult) && (
            <div className="result">
              <h3>Result:</h3>
              {!relationshipMode ? (
                <>
                  {result.current && <p>{result.current}</p>}
                  {result.past && <p>{result.past}</p>}
                  {result.future && <p>{result.future}</p>}
                  {result.difference && <p>{result.difference}</p>}
                  
                  {result.steps && (
                    <div className="step-by-step">
                      <h4>Calculation Steps:</h4>
                      {result.steps.map((step, index) => (
                        <p key={index} className="step">{step}</p>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {relationshipResult.error && (
                    <p className="error">{relationshipResult.error}</p>
                  )}
                  {relationshipResult.relationship && (
                    <p className="relationship">{relationshipResult.relationship}</p>
                  )}
                  
                  {relationshipResult.steps && (
                    <div className="step-by-step">
                      <h4>Analysis Steps:</h4>
                      {relationshipResult.steps.map((step, index) => (
                        <p key={index} className="step">{step}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </CalculatorBase>
  );
};

export default AgeProblems;