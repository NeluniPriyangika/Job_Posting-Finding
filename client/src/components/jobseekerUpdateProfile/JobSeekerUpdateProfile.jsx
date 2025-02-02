import React, { useState, useEffect } from 'react';
import './jobseekerUpdateProfile.css';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Navbar2 from '../navbar2/Navbar2';
import Footer from '../footer/Footer';
import ReadOnlyRating from '../readOnlyRating/ReadOnlyRating';


const SeekerReviews = (props) => (
  <div className="seekerReviews">
    <div className='seekerReviews-content1'>
      <img src={ props.imgUrl } 
      alt={ props.alt || 'Image' } />
    </div>
    <div className="seekerReviews-content2">
      <h2>{ props.title }</h2>
      <div className='seekerReviews-rating'> {props.homeRating}</div>
      <p className='seekerReviews-desc'>"{props.subtitle}</p>
    </div>  
  </div>
);

const SeekerReviewsContainer = (props) => (
  <div className="seekerReviews-container">
    {
      props.reviews.map((review) => (
        <SeekerReviews title={ review.title }
          personalDes={ review.personalDes }
          imgUrl={ review.imgUrl }
          timeText = {review.timeText} 
          homeRating = {review.homeRating}
          subtitle = {review.subtitle}/>
      ))
    }
  </div>
);

const SeekerUpdateProfile = () => {

  const seekerReviews = [
    {id: 1, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 2, homeRating:<ReadOnlyRating/>, title: 'Michel Jackson',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/201/200'},
    {id: 3, homeRating:<ReadOnlyRating/>, title: 'Serenity Stone',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/201'},
    {id: 4, homeRating:<ReadOnlyRating/>, title: 'Leo Doe',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/199'},
    {id: 5, homeRating:<ReadOnlyRating/>, title: 'Jony Dep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/198'},
    {id: 6, homeRating:<ReadOnlyRating/>, title: 'Karoline Jude',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/200'},
    {id: 7, homeRating:<ReadOnlyRating/>, title: 'charle Jhosep',subtitle:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`, imgUrl: 'https://unsplash.it/200/201'},  ]

  const [userId, setUserId] = useState(null);  
  const [profileData, setProfileData] = useState({
    fullName: '',
    address: '',
    phoneNumber: '',
    email: '',
    description: '',
    language : '',
    birthday : '',
    interest: '',

  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const userIdFromUrl = pathParts[pathParts.length - 1];
    setUserId(userIdFromUrl);
    // Fetch existing user data if available
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/google-current-user/${userIdFromUrl}`);
        if (response.ok) {
          const userData = await response.json();
          setProfileData(prevData => ({...prevData, ...userData}));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Automatically prepend the "+" sign if it's not there
      let formattedValue = value;
      if (!formattedValue.startsWith("+")) {
        formattedValue = "+" + formattedValue;
      }
      setProfileData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      // Handle other fields
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setProfileData((prevData) => ({
      ...prevData,
      birthday: date
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      formData.append(key, profileData[key]);
    });

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }  

    try {
      const res = await fetch(`http://localhost:5000/api/update-jobseeker-profile/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/jobseeker-profile/${userId}`);
      } else {
        // Handle error
        alert(`Profile update failed: ${data.error || 'An unknown error occurred.'}`);
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again later.');

    }
  };

  return (
    <div className='seeker-updateprofile-main'>
      <Navbar2 />
      <div className='seeker-updateprofile-container'>
        <div className='seeker-updateprofile-leftcontainer'>

            <h3 className='seeker-updateprofile-leftcontainer-header'>Seeker Reviews</h3>

            <div className='seeker-rewiews-container'>
              <div className='seeker-rewiews-content'>
                <SeekerReviewsContainer reviews={ seekerReviews } />
              </div>

            </div>
        </div>
        <div className='seeker-updateprofile-form-container'>
          <form className='seeker-updateprofile-form' onSubmit={handleSubmit}>
            
            <input
              className='seeker-updateprofile-form-input'
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />

            <input
              className='seeker-updateprofile-form-input'
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
    
            <input
                className='seeker-updateprofile-form-input'
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
            />

            <DatePicker
              className='datepicker'
              selected={profileData.birthday}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Birthday"
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              required
            />

            <textarea 
                className='seeker-profile-update-description'
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                placeholder="Short Bio or Description"
            />

            <textarea 
                className='seeker-profile-update-interests'
                name="interest"
                value={profileData.interest}
                onChange={handleInputChange}
                placeholder="What are your interests EX : painting, traveling etc."
            />

            <input
                className='seeker-updateprofile-form-input'
                type="text"
                name="language"
                value={profileData.language}
                onChange={handleInputChange}
                placeholder="Language"
                required
            />

            <h4>Add your Profile Picture</h4>

            <label>
              <input
                  className='seeker-profilepic-upload' 
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
              />
            </label>

            <button className='seeker-profile-update-button' type="submit" onClick={handleSubmit}>Update Profile</button>
          </form>

        </div>
  
        <div className='seeker-updateprofile-rightcontainer'>
          <h3>Advantages of Being a Seeker</h3>
          <div className='seekerAdvantage-container'>
            <div className='seekerAdvantatges'>
              <h4>Access to Expert Advice</h4>
              <p>Connect with top professionals across various fields,
                 and get personalized advice tailored to your specific needs.</p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Flexible Communication</h4>
              <p>Choose how you want to communicate—whether 
                through chat, video, or voice calls—at times that suit your schedule.</p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Find the Right Company</h4>
              <p>Browse a wide range of Companys with diverse expertise, 
                ensuring you get the best match for your unique
              situation.</p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Pay-As-You-Go</h4>
              <p>Only pay for the time you use. You’re charged per minute, 
                giving you control over how much you spend.</p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Set Your Own Goals</h4>
              <p>Get advice that helps you achieve personal and
              professional goals, from career advancement to personal growth.</p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Global Reach</h4>
              <p>Access Companys from around the world, giving you
              insights from different perspectives and industries. </p>
            </div>

            <div className='seekerAdvantatges'>
              <h4>Confidential and Secure</h4>
              <p>All your interactions are private and secure, ensuring
              you can seek advice with confidence.</p>
            </div>
          </div>
        </div>

      </div>
      
      <Footer/>
    </div>
  );
};

export default SeekerUpdateProfile;