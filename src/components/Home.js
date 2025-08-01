import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';
import JellyfishLogo from './JellyfishLogo';

const topics = [
  { name: "Average", icon: "📊", description: "Calculate averages and weighted averages" },
  { name: "Percentage", icon: "📈", description: "Percentage calculations and conversions" },
  { name: "Profit and Loss", icon: "💰", description: "Calculate profit, loss, and percentages" },
  { name: "Simple Interest", icon: "🏦", description: "Simple interest calculations" },
  { name: "Compound Interest", icon: "📊", description: "Compound interest with different frequencies" },
  { name: "Ratio and Proportion", icon: "↔️", description: "Ratio simplification and proportion problems" },
  { name: "Time and Work", icon: "⏱️", description: "Work rate and combined work problems" },
  { name: "Pipes and Cisterns", icon: "🚰", description: "Inlet and outlet pipe problems" },
  { name: "Time, Speed and Distance", icon: "🚗", description: "Calculate any missing value from the trio" },
  { name: "Boats and Streams", icon: "⛵", description: "Upstream and downstream speed problems" },
  { name: "Train Problems", icon: "🚆", description: "Train crossing and speed problems" },
  { name: "Mixture and Alligation", icon: "🧪", description: "Mix different ingredients with given properties" },
  { name: "Age Problems", icon: "👴👶", description: "Age ratio and difference problems" },
  { name: "Partnership", icon: "🤝", description: "Profit sharing based on investment" },
  { name: "Area and Perimeter", icon: "📏", description: "Calculate for various shapes" },
  { name: "Volume and Surface Area", icon: "🧊", description: "Calculate for 3D shapes" },
  { name: "Number System", icon: "🔢", description: "Convert between different number bases" },
  { name: "Problems on Numbers", icon: "❓", description: "Digit sums, reversals, and special numbers" },
  { name: "Calendar", icon: "📅", description: "Day of week and leap year calculations" },
  { name: "Clock", icon: "⏰", description: "Angle between clock hands and time calculations" },
  { name: "Probability", icon: "🎲", description: "Basic probability calculations" },
  { name: "Permutation & Combination", icon: "🔀", description: "Arrangements and selections" },
  { name: "Algebra (Quadratic Equations)", icon: "𝑥²", description: "Solve quadratic equations" },
  { name: "Geometry", icon: "△□○", description: "Properties of geometric shapes" },
  { name: "Trigonometry", icon: "sin/cos", description: "Trigonometric functions and identities" },
  { name: "Mensuration", icon: "📐", description: "Measurements of geometric figures" },
  { name: "Data Interpretation", icon: "📊", description: "Statistical measures and analysis" },
  { name: "Surds and Indices", icon: "√", description: "Operations with roots and exponents" },
  { name: "Logarithms", icon: "log", description: "Logarithmic calculations" },
  { name: "Simplification", icon: "=", description: "Simplify complex expressions" }
];

const categories = [
  { id: 'all', name: 'All Topics' },
  { id: 'math', name: 'Mathematics', topics: ['Average', 'Percentage', 'Ratio and Proportion', 'Algebra (Quadratic Equations)', 'Geometry', 'Trigonometry', 'Mensuration', 'Surds and Indices', 'Logarithms', 'Simplification'] },
  { id: 'finance', name: 'Finance', topics: ['Profit and Loss', 'Simple Interest', 'Compound Interest', 'Partnership'] },
  { id: 'time', name: 'Time & Work', topics: ['Time and Work', 'Pipes and Cisterns', 'Time, Speed and Distance', 'Boats and Streams', 'Train Problems', 'Calendar', 'Clock'] },
  { id: 'numbers', name: 'Numbers', topics: ['Number System', 'Problems on Numbers'] },
  { id: 'other', name: 'Other', topics: ['Mixture and Alligation', 'Age Problems', 'Area and Perimeter', 'Volume and Surface Area', 'Probability', 'Permutation & Combination', 'Data Interpretation'] }
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      categories.find(cat => cat.id === selectedCategory)?.topics.includes(topic.name);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className="jellyfish-header">
  <div className="header-content">
    <JellyfishLogo />
    <nav className="main-nav">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/about" className="nav-link">About</Link>
    </nav>
  </div>
</header>

      <main className="home-container">
        <div className="glass-container glass-container--rounded glass-container--large">
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>
          <div className="glass-content">
            <p>Your comprehensive solution for aptitude problems by one Click</p>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="glass-container glass-container--rounded glass-container--medium">
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>
          <div className="glass-content">
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="category-tabs">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="topics-grid">
          {filteredTopics.map((topic, index) => (
            <Link
              key={index}
              to={`/${topic.name.toLowerCase().replace(/ & | /g, '-')}`}
              className="glass-container glass-container--rounded glass-container--small topic-button"
            >
              <div className="glass-filter"></div>
              <div className="glass-overlay"></div>
              <div className="glass-specular"></div>
              <div className="glass-content glass-content--alone">
                <div className="topic-icon">{topic.icon}</div>
                <h3>{topic.name}</h3>
                <p className="topic-description">{topic.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;