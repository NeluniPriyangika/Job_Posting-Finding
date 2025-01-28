import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import './seekerPrifile.css';
import Navbar2 from '../navbar2/Navbar2';
import Footer from '../footer/Footer';
import SeekerSideBar from '../seekerSideBar/SeekerSideBar';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import Company2 from '../../assets/Company2.jpg';


const CompanyReviews = (props) => (
  <div className="seekerprofile-companyReviews">
    <div className='seekerprofile-companyReviews-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    </div>
    <div className="seekerprofile-companyReviews-content2">
      <h2>{ props.title }</h2>
      <div className='seekerprofile-companyReviews-rating'> {props.homeRating}</div>
      <p className='seekerprofile-companyReviews-desc'>"{props.subtitle}</p>
    </div>  
  </div>
);

const CompanyReviewsContainer = (props) => (
  <div className="seekerprofile-companyReviews-container">
    {
      props.reviews.map((review) => (
        <CompanyReviews title={ review.title }
          personalDes={ review.personalDes }
          imgUrl={ review.imgUrl }
          timeText = {review.timeText} 
          homeRating = {review.homeRating}
          subtitle = {review.subtitle}/>
      ))
    }
  </div>
);

function SeekerProfile() {

  const navigate = useNavigate ();
  const { userId } = useParams();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(null);
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); 

    const fetchSeekerData = async () => {
      try {
        console.log('Current user:', currentUser); // Debug log

        if (!userId) {
          setError('No user ID found');
          return;
        }

        console.log('Fetching company data for userId:', userId); // Debug log

        const response = await fetch(`http://localhost:5000/api/seeker-profile/${userId}`,
          { method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add JWT token here
            },
          }
        );
        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch seeker data');
        }

        const data = await response.json();
        console.log('Received seeker data:', data); // Debug log
        setSeeker(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seeker data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSeekerData();
  }, [userId]);

      // Function to determine if the messaging button should be shown
      const shouldShowMessageButton = () => {
        // Don't show if it's the company's own profile
        if (isOwnProfile) return false;
        
        // Only show if the viewer is a seeker
        return currentUserType === 'company';
      };
  


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!seeker) return <div>No company data found</div>;

  const seekerReviews = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, homeRating:<ReadOnlyRating/>, title: 'Leo Doe',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, homeRating:<ReadOnlyRating/>, title: 'Jony Dep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, homeRating:<ReadOnlyRating/>, title: 'Karoline Jude',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, homeRating:<ReadOnlyRating/>, title: 'charle Jhosep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/201'},  
  ]

  return (
    <div className='seekerProfile-main'>
      <Navbar2 />
      <div className='seekerprofile-container'>
        <div className='seekerprofile-sidebar'>
          <SeekerSideBar />
        </div>
        <div className='seekerprofile-rightcontainer'>
            <div className='seekerprofile-rightcontainer-top'>
              <div className='seekerprofile-userdetails1'>
                  <div className='seekerprofile-header' >
                    <h1>{seeker.name}</h1>
                    <div className='seekerprofile-onlinestatus'></div>
                  </div>
                  <hr />
                  <div className='seekerprofile-rating'>
                    <h4>Rating</h4>
                    <ReadOnlyRating/>
                  </div>
                  <p className='seekerprofile-bio'>{seeker.description}</p>
                  <h4>My Interests</h4>
                  <p> {seeker.interest} </p>
              </div>

              <div className='seekerprofile-userdetails2'>
                <div>
                    <img className='seekerprofile-image' src={seeker.profilePhotoUrl || Company2} alt={seeker.name} />
                </div>

                {/* Conditional rendering of the message button */}
                {shouldShowMessageButton() && (
                  <button 
                    className='seekerprofile-messagingbutton' 
                    onClick={() => navigate('/company-chat')}
                  >
                    Start Messaging
                  </button>
                 )}
                <h2 className='seekerprofile-language'>Language : {seeker.language || 'English'}</h2>
                
              </div>


            </div>
            <div className='seekerprofile-rightcontainer-bottom'>
              <div className='seekerprofile-company-rewiews-content'>
                <CompanyReviewsContainer reviews={ seekerReviews } />
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SeekerProfile
