import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import AddDestination from './components/AddDestination';
import AddHotel from './components/AddHotel';
import HotelList from './components/HotelList';
import DestinationList from './components/DestinationList';

function App() {
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [language, setLanguage] = useState('en');

  const tabs = [
    { id: 'destinations', label: 'Destinations', icon: '🌍' },
    { id: 'hotels', label: 'Hotels', icon: '🏨' },
    { id: 'add-destination', label: 'Add Destination', icon: '➕' },
    { id: 'add-hotel', label: 'Add Hotel', icon: '🏨' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'destinations':
        return (
          <DestinationList 
            destinations={destinations}
            setDestinations={setDestinations}
            language={language}
            onSelectDestination={setSelectedDestination}
          />
        );
      case 'hotels':
        return (
          <HotelList 
            hotels={hotels}
            setHotels={setHotels}
            destinations={destinations}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            language={language}
          />
        );
      case 'add-destination':
        return (
          <AddDestination 
            destinations={destinations}
            setDestinations={setDestinations}
            language={language}
          />
        );
      case 'add-hotel':
        return (
          <AddHotel 
            hotels={hotels}
            setHotels={setHotels}
            destinations={destinations}
            language={language}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="main-content">
        <div className="container">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;
