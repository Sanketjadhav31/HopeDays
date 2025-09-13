import React from 'react';

const Header = ({ activeTab, setActiveTab, tabs, language, setLanguage }) => {
  return (
    <>
      <header className="header">
        <div className="container">
          <h1>🌍 Travel App</h1>
          <p>Manage your destinations and hotels with ease</p>
        </div>
      </header>
      
      <nav className="tab-nav">
        <div className="container">
          <ul className="tab-list">
            {tabs.map(tab => (
              <li key={tab.id} className="tab-item">
                <button
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="language-selector">
            <span className="language-label">Language:</span>
            <div className="language-buttons">
              <button
                className={`language-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                className={`language-btn ${language === 'ar' ? 'active' : ''}`}
                onClick={() => setLanguage('ar')}
              >
                AR
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
