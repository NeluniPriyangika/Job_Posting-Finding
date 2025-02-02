import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import './comanyPrifile.css';
import Navbar2 from '../navbar2/Navbar2';
import Footer from '../footer/Footer';
import CompanySideBar from '../comanySideBar/ComanySideBar';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';
import Company1 from '../../assets/Company1.jpg';


const JobSeekerReviews = (props) => (
  <div className="companyprofile-jobSeekerReviews">
    <div className='companyprofile-jobSeekerReviews-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    </div>
    <div className="companyprofile-jobSeekerReviews-content2">
      <h2>{ props.title }</h2>
      <div className='companyprofile-jobSeekerReviews-rating'> {props.homeRating}</div>
      <p className='companyprofile-jobSeekerReviews-desc'>"{props.subtitle}</p>
    </div>  
  </div>
);

const JobSeekerReviewsContainer = (props) => (
  <div className="companyprofile-jobSeekerReviews-container">
    {
      props.reviews.map((review) => (
        <JobSeekerReviews title={ review.title }
          personalDes={ review.personalDes }
          imgUrl={ review.imgUrl }
          timeText = {review.timeText} 
          homeRating = {review.homeRating}
          subtitle = {review.subtitle}/>
      ))
    }
  </div>
);

function CompanyProfile() {
  const navigate = useNavigate ();
  const { userId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(null);
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token'); 

    const fetchCompanyData = async () => {
      try {
        console.log('Current user:', currentUser); // Debug log

        if (!userId) {
          setError('No user ID found');
          return;
        }

        console.log('Fetching company data for userId:', userId); // Debug log

        const response = await fetch(`http://localhost:5000/api/company-profile/${userId}`,
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
          throw new Error(errorData.error || 'Failed to fetch company data');
        }

        const data = await response.json();
        console.log('Received company data:', data); // Debug log
        setCompany(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [userId]);

    // Function to determine if the messaging button should be shown
    const shouldShowMessageButton = () => {
      // Don't show if it's the company's own profile
      if (isOwnProfile) return false;
      
      // Only show if the viewer is a jobSeeker
      return currentUserType === 'jobSeeker';
    };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!company) return <div>No company data found</div>;

  const jobSeekerReviews = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, homeRating:<ReadOnlyRating/>, title: 'Leo Doe',subtitle:`“I’ve always struggled with budgeting, but the financial Company I connected with made everything so simple. I feel confident in managing my money now`, imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, homeRating:<ReadOnlyRating/>, title: 'Jony Dep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, homeRating:<ReadOnlyRating/>, title: 'Karoline Jude',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, homeRating:<ReadOnlyRating/>, title: 'charle Jhosep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/201'},  
  ]

  return (
    <div className='companyProfile-main'>
      <Navbar2 />
      <div className='companyprofile-container'>
        <div className='companyprofile-sidebar'>
          <CompanySideBar />
        </div>
        <div className='companyprofile-rightcontainer'>
          <div className='companyprofile-rightcontainer-top'>
            <div className='companyprofile-userdetails1'>
              <div className='companyprofile-header'>
                <h1>{company.name}</h1>
                <div className='companyprofile-onlinestatus'></div>
              </div>
              <hr />
              <div className='companyprofile-rating'>
                <h4>Rating</h4>
                <ReadOnlyRating /*value={company.rating}*/ />
              </div>
              <div className='companyprofile-profexperiance-cont'>
                <h4 className='companyprofile-profexperiance'>{company.experience}</h4>
                <h1>|</h1>
                <h4 className='companyprofile-profexperiance-years'>{company.experience}</h4>
              </div>
              <p className='companyprofile-bio'>{company.bio}</p>
              <h4>Certifications or Qualifications</h4>
              <p>{company.certifications}</p>
              <h4>Available Days</h4>
              <div className='companyprofile-vailabledays'>
                <h6>{company.availableDays?.join(', ')}</h6>
              </div>
              <h4>Available Time</h4>
              <div className='companyprofile-vailabledays'>
                <h6>{company.availableTimeStart} to {company.availableTimeEnd}</h6>
              </div>
            </div>

            <div className='companyprofile-userdetails2'>
              <div>
                <img 
                  className='companyprofile-image' 
                  src={company.profilePhotoUrl || Company1} 
                  alt={company.name} 
                />
              </div>
              {/* Conditional rendering of the message button */}
              {shouldShowMessageButton() && (
                <button 
                  className='companyprofile-messagingbutton' 
                  onClick={() => navigate('/jobSeeker-middle-chat')}
                >
                  Start Messaging
                </button>
              )}
              <h2 className='companyprofile-perminuterate'>
                {company.ratePerMinute} USD / 1 min
              </h2>
              <h2 className='companyprofile-language'>
                  Language: {company.languages || 'English'}
              </h2>
            </div>
          </div>
          
          <div className='companyprofile-rightcontainer-bottom'>
            <div className='companyprofile-jobSeeker-rewiews-content'>
              <JobSeekerReviewsContainer reviews={jobSeekerReviews} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CompanyProfile