import React, { useEffect } from 'react';
import '../styles/about.css';

const About = () => {
  useEffect(() => {
    // Header scroll effect
    const handleScroll = () => {
      const header = document.querySelector('.jellyfish-header');
      if (window.scrollY > 10) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = 'mailto:2200039092cser@gmail.com?subject=Question%20About%20Smart%20Aptitude%20Calculator';
  };

  return (
    <div className="about-glass-container">
      <div className="glass-filter"></div>
      <div className="glass-overlay"></div>
      <div className="glass-specular"></div>
      <div className="glass-content">
        <h1>About JellyFish</h1>
        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              JellyFish was created to provide students, professionals, 
              and math enthusiasts with a comprehensive set of tools to solve complex 
              mathematical problems with ease. Our goal is to make learning and applying 
              mathematical concepts more accessible and enjoyable.
            </p>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <ul className="features-list">
              <li> 30 specialized calculators covering all aptitude topics</li>
              <li>Basic , Step-by-step solutions for better understanding</li>
              <li>Interactive visualizations for complex concepts</li>
              <li>Mobile-friendly design for learning on the go</li>
              <li>Completely free to learn basics, with no ads or subscriptions</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>For Students</h2>
            <p>
              Whether you're preparing for competitive exams, working on homework, 
              or just brushing up on your math skills, our calculators provide 
              instant solutions with detailed explanations to help you learn the 
              concepts behind the calculations.
            </p>
            <div className="designer-credit">
              <h1 className="title">Designer, Pradeep Davuluri from 
                KL University
                <div className="aurora">
                  <div className="aurora__item"></div>
                  <div className="aurora__item"></div>
                  <div className="aurora__item"></div>
                  <div className="aurora__item"></div>
                </div>
              </h1>
            </div>
          </section>

          <section className="about-section">
            <h2>Contact Us</h2>
            <p>
              Have questions or suggestions? We'd love to hear from you!
              <br />
              <a 
                href="mailto:2200039092cser@gmail.com" 
                onClick={handleEmailClick}
                className="email-link"
              >
                2200039092cser@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;