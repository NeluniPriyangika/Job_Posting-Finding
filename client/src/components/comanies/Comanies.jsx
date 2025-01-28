import React, { useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import axios from 'axios';
import Navbar2 from '../navbar2/Navbar2';

const Card = (props) => (
    <div className="card">
      <div className='card-content1'>
        <img src={props.imgUrl} alt={props.alt || 'Image'} />
        <p>{props.timeText}</p>
      </div>
      <div className="card-content2">
        <h2>{props.title}</h2>
        <div><ReadOnlyRating /></div>
        <p className='card-Subtitle'>{props.subtitle}</p>
        <p className='personaldescription'>{props.personalDes}</p>
      </div>
    </div>
  );
  
  const CardContainer = (props) => (
    <div className="cards-container">
      {
        props.cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            personalDes={card.personalDes}
            imgUrl={card.imgUrl}
            timeText={card.timeText}
            homeRating={card.homeRating}
            subtitle={card.subtitle}
          />
        ))
      }
    </div>
  );

function Companys() {
    const [companys, setCompanys] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Fetch companys from the backend
    useEffect(() => {
      const fetchCompanys = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/companys', {
            headers: {
              Authorization: `Bearer yourAccessToken`, // Replace with a valid token
            },
          });
  
          setCompanys(response.data.companys);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching companys:', error);
          setLoading(false);
        }
      };
  
      fetchCompanys();
    }, []);
  
    return (
      <div className='homemain'>
        <Navbar2/>
        <div className='home-find-companys-container'>
          <div className="home-find-companys-container-card-container">
            <h1 style={{ 'text-align': "start" }}>
              Find Companys
            </h1>
  
            {loading ? <p>Loading...</p> : <CardContainer cards={companys} />}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
export default Companys
