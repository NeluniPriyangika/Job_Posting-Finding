import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import LoginPage1 from './pages/loginPage1/LoginPage1';
import LoginFBPage from './pages/LoginFBPage/LoginFBPage';
import JobSeekerHomePage from './pages/jobseekerHomePage/JobSeekerHomePage';

import CompanyUpdateProfilePage from './pages/companyUpdateProfilePage/CompanyUpdateProfilePage';
import JobSeekerUpdateProfilePage from './pages/jobseekerUpdateProfilePage/JobSeekerUpdateProfilePage';
import CompanyProfilePage from './pages/companyProfilePage/CompanyProfilePage';
import JobSeekerProfilePage from './pages/jobseekerProfilePage/JobSeekerProfilePage';
import JobSeekerMiddleChatPage from './pages/jobseekerMiddleChatPage/JobSeekerMiddleChatPage';
import JobSeekerChatPage from './pages/jobSeekerChatPage/JobSeekerChatPage';
import CompanyPendingPage from './pages/companyPendingPage/CompanyPendingPage';
import CompanyChatPage from './pages/companyChatPage/CompanyChatPage';
import CompanyPublicChatPage from './pages/companyPublicChatPage/CompanyPublicChatPage';
import PaymentPage from './pages/paymentPage/PaymentPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage';
import CompanysPage from './pages/companyPage/CompanyPage';
//import JobSeekersPage from './pages/jobSeekersPage/JobSeekersPage';


// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage1 />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/login-FBpage" element={<LoginFBPage />} />
          <Route path="/company-update-profile/:userId" element={<PrivateRoute><CompanyUpdateProfilePage /></PrivateRoute>} />
          <Route path="/jobseeker-update-profile/:userId" element={<PrivateRoute><JobSeekerUpdateProfilePage /></PrivateRoute>} />
          <Route path="/jobSeeker-home" element={<PrivateRoute><JobSeekerHomePage /></PrivateRoute> } />
          <Route path="/company-profile/:userId" element={<PrivateRoute><CompanyProfilePage /></PrivateRoute>} />
          <Route path="/jobSeeker-profile/:userId" element={<PrivateRoute><JobSeekerProfilePage /></PrivateRoute> } />
          <Route path="/jobSeeker-middle-chat" element={<PrivateRoute><JobSeekerMiddleChatPage /></PrivateRoute> } />
          <Route path="/jobSeeker-chat" element={<PrivateRoute><JobSeekerChatPage /></PrivateRoute> } />
          <Route path="/company-pending" element={<PrivateRoute>< CompanyPendingPage/></PrivateRoute> } />
          <Route path="/company-chat" element={<PrivateRoute>< CompanyChatPage/></PrivateRoute> } />
          <Route path="/company-public-chat" element={<PrivateRoute>< CompanyPublicChatPage/></PrivateRoute> } />
          <Route path="/payment" element={<PrivateRoute>< PaymentPage/></PrivateRoute> } />
          <Route path="/privacy-policy" element={<PrivateRoute>< PrivacyPolicyPage/></PrivateRoute> } />
          <Route path="/companys" element={<PrivateRoute>< CompanysPage/></PrivateRoute> } />

          
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;