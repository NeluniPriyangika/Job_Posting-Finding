import React, { useState, useEffect } from 'react';
import "./comanyUpdateProfile.css";
import TimezoneSelect from 'react-timezone-select';
import { useNavigate } from 'react-router-dom';
import Footer from '../footer/Footer'; 
import Navbar2 from '../navbar2/Navbar2';

const CompanyUpdateProfile = () => {
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: '',
    displayName: '',
    qualifications: '',
    certifications: '',
    description: '',
    address: '',
    perMinuteRate: {
      amount: 0,
      currency: 'USD'
    },
    timeZone: {},
    availableDays: [],
    availableHoursstart: '',
    availableHoursend: '',
    languages: '',
    phoneNumber: '',
    socialLinks: {
      facebook: '',
      linkedin: '',
      twitter: ''
    },
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState({});
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
    if (userIdFromUrl && userIdFromUrl !== 'undefined') {
      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith('socialLinks.')) {
      // Handle nested socialLinks field update
      const field = name.split('.')[1]; // Extract the key (facebook, linkedin, twitter)
      setProfileData((prevData) => ({
        ...prevData,
        socialLinks: {
          ...prevData.socialLinks,
          [field]: value,
        }
      }));
    } else if (name === 'phoneNumber') {
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
  

  const handleRateChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      perMinuteRate: {
        ...prevData.perMinuteRate,
        [name]: name === 'amount' || name === 'minutes' ? parseFloat(value) : value
      }
    }));
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(profileData).forEach(key => {
      if (key === 'perMinuteRate' || key === 'socialLinks') {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });

    formData.append('timeZone', selectedTimezone.value);

    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/update-company-profile/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/company-profile/${userId}`);
      } else {
        // Handle error
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className='company-profile-update-main'>
      <Navbar2 />
      <div className='company-profile-update-container'>
        <div className='company-profile-update-tipstobuildprofile'>
          <h2 className='company-profile-update-tipstobuildprofile-tittle'>Tips to build a good profile</h2>
          <ul className='company-profile-update-tipstobuildprofile-list'>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Professional Profile Picture: Use a clear, high-quality headshot that reflects your professionalism.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Compelling Bio: Write a brief, engaging bio that highlights your expertise and how you can help JobSeeker.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Relevant Expertise: Select categories that best represent your skills—focus on what you excel at.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Competitive Rate: Research other Companys' rates and set a price that reflects your experience.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Show Experience: Highlight certifications, qualifications, and years of experience.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Update Availability: Keep your schedule current to attract more consultations</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Use Keywords: Add relevant keywords naturally to increase profile visibilit</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Transparency: Clearly explain what JobSeekers can expect from your advic</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Unique Selling Point: Highlight what makes you stand out—your experience, method, or results.</li>
            <li className='company-profile-update-tipstobuildprofile-list-item'>Stay Updated: Regularly refresh your profile with new achievements and experiences.</li>
          </ul>
        </div>
        <form className="company-profile-update-form-container" onSubmit={handleSubmit}>
          <h1 className='company-profile-update-form-tittle'>Update Your Profile</h1>
          <div className='company-profile-update-firstinput-div'>
            <input
              className='company-updateform-input1'
              type="text"
              name="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />

            <input
              className='company-updateform-input1'
              type="text"
              name="displayName"
              value={profileData.displayName}
              onChange={handleInputChange}
              placeholder="Display Name"
              required
            />

            <h4>Add Your Registered Email Address</h4>

            {/*<input
              className='company-updateform-input1'
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />*/}

            <input
              className='company-updateform-input1'
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />

            <input
              className='company-updateform-input1'
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />

            <textarea
              className='company-updateform-textarea'
              type="text"
              name="qualifications"
              value={profileData.qualifications}
              onChange={handleInputChange}
              placeholder="Professional Qualifications"
            />

            <textarea
              className='company-updateform-textarea'
              type="text"
              name="certifications"
              value={profileData.certifications}
              onChange={handleInputChange}
              placeholder="Certifications and other qualifications"
            />

            <textarea 
              className='company-updateform-textarea'
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              placeholder="Short Bio or Description"
              required
            />

            <input
              className='company-updateform-input1'
              type="text"
              name="languages"
              value={profileData.languages}
              onChange={handleInputChange}
              placeholder="Languages"
              required
            />

            <h4>1 min/USD</h4>
            <div>
              <input
                className='company-updateform-ratefor-amount'
                type="number"
                name="amount"
                value={profileData.perMinuteRate.amount}
                onChange={handleRateChange}
                placeholder="Rate per Minute"
                step="1"
                min="1"
                required
              />
              <select
                className='company-updateform-currency'
                name="currency"
                value={profileData.perMinuteRate.currency}
                onChange={handleRateChange}
              >
                <option value="USD">USD</option>
              </select>
            </div>

            <label htmlFor=""> 
              <h4 style={{marginTop:"60px"}}>Add your Profile Photo</h4>
              <input
                className='company-updateform-uploadpic'
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                aria-labelledby="firstname"
              />
            </label> 

            
            <label htmlFor="timeZone" style={{marginTop:"40px"}}><h4>Select Time Zone</h4></label>
            <TimezoneSelect
              className='company-updateform-timezone'
              value={selectedTimezone}
              onChange={setSelectedTimezone}
            />

            <div className='company-available-days'>
              <h4 >Available Days</h4>
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div className='company-available-days-item' key={day}>
                  <input
                    className='company-updateform-days'
                    type="checkbox"
                    name="availableDays"
                    value={day}
                    onChange={handleInputChange}
                  />
                  {day}
                </div>
              ))}
            </div>

            <h4 style={{marginTop:'60px'}}>Add your Available Hours</h4>

            <div className='company-updateform-hours'>
              <input
                className='company-updateform-hours-start'
                type="time"
                name="availableHoursstart"
                value={profileData.availableHoursstart}
                onChange={handleInputChange}
                placeholder="Available Hours Start"
                
              />
              <h6>to</h6> 
              <input
                className='company-updateform-hours-end'
                type="time"
                name="availableHoursend"
                value={profileData.availableHoursend}
                onChange={handleInputChange}
                placeholder="Available Hours End"
              
              />
            </div>

            <h4>Add your PayPal payment link</h4>

            {/*<input
                className='company-updateform-input1'
                type="url"
                name="availableHoursend"
                value={profileData.paypalpaymentlink}
                onChange={handleInputChange}
                placeholder="Payment Link"
                
              />*/}

            <h4>Social Links</h4>
            <input
              className='company-updateform-input1'
              type="text"
              name="socialLinks.facebook"
              value={profileData.socialLinks.facebook}
              onChange={handleInputChange}
              placeholder="Facebook URL"
            />
            <input
              className='company-updateform-input1'
              type="text"
              name="socialLinks.linkedin"
              value={profileData.socialLinks.linkedin}
              onChange={handleInputChange}
              placeholder="LinkedIn URL"
            />
            <input
              className='company-updateform-input1'
              type="text"
              name="socialLinks.twitter"
              value={profileData.socialLinks.twitter}
              onChange={handleInputChange}
              placeholder="Twitter URL"
            />

            <button  className='Company-profileUpdatebutton' type="submit" onClick={handleSubmit}>Update Profile</button>
          </div> 
        </form>
        <div className='company-profile-update-advantagesasCompany'>
          <h2 className='company-profile-update-advantagesasCompany-tittle'>What advantages you get by becomming an company on spiritual insights</h2>
          <ul className='company-profile-update-advantagesasCompany-tittle-list'>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Earn on Your Own Terms</h5>
              <p>Set your own rates and get paid per minute for the advice you offer. The more consultations you have, the more you earn. </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Flexible Schedule</h5>
              <p>Work when it suits you. You can set your own availability and manage your hours based on your lifestyle. </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Build Your Reputation</h5>
              <p>Showcase your expertise, gain reviews from satisfied JobSeekers, and grow your credibility in your field. </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Expand Your Network</h5>
              <p>Connect with people from diverse backgrounds who value your knowledge. Each session is an opportunity to build new professional relationships. </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Help Others</h5>
              <p>Use your knowledge and experience to guide JobSeekers through challenges and help them achieve their goals.  </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Grow Professionally</h5>
              <p>Advising others often enhances your own skills and understanding, making you better at your profession while helping. </p>
            </li>
            <li className='company-profile-update-advantagesasCompany-tittle-list-item'>
              <h5>Global Reach</h5>
              <p>Work with clients from around the world. There are no geographical limitations, allowing you to expand your influence glob.</p>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyUpdateProfile;