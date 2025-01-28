import React, { useEffect, useState } from 'react';
import './home.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import axios from 'axios';

const Card = ({ imgUrl, timeText, title, subtitle, personalDes }) => (
  <div className="card">
    <div className='card-content1'>
      <img 
        src={imgUrl} 
        alt={title} 
        onError={(e) => {
          e.target.src = '/default-avatar.png'; // Fallback image
        }}
      />
      <p>{timeText}</p>
    </div>
    <div className="card-content2">
      <h2>{title}</h2>
      <div><ReadOnlyRating /></div>
      <p className='card-Subtitle'>{subtitle}</p>
      <p className='personaldescription'>{personalDes}</p>
    </div>
  </div>
);

const CardContainer = ({ cards }) => (
  <div className="cards-container">
    {cards.map((card) => (
      <Card
        key={card.id}
        {...card}
      />
    ))}
  </div>
);

function Home() {
  const [companys, setCompanys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/companies');
        setCompanys(response.data.companys);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companys:', error);
        setError('Failed to load companys. Please try again later.');
        setLoading(false);
      }
    };

    fetchCompanys();
  }, []);

  return (
    <div className='homemain'>
      <Navbar />
      <div className='homebgimage'>
        <div className='homemaintext'>
          <div className='welcometext'>WELCOME</div>
          <div className='username'>To</div>
        </div>
        <h1 className='sitename'>Spiritual Insights</h1>
      </div>
      
      <div className='home-find-companys-container'>
        <div className="home-find-companys-container-card-container">
          <h1>Find Companys</h1>
          
          {loading ? (
            <div className="loading">Loading companys...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : companys.length === 0 ? (
            <div className="no-companys">No companys available at the moment</div>
          ) : (
            <CardContainer cards={companys} />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Home;