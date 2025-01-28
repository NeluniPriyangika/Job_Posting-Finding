import React from 'react';
import './privacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>
      
      <section>
        <h2>Introduction</h2>
        <p>This privacy policy describes how Advising App ("we", "us", or "our") collects, uses, and shares your personal information when you use our service.</p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <ul>
          <li>Basic profile information from Facebook (name, email)</li>
          <li>User type (company or seeker)</li>
          <li>Profile information you provide</li>
          <li>Communication data between companys and seekers</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To match seekers with companys</li>
          <li>To facilitate communication between users</li>
          <li>To improve our services</li>
          <li>To communicate with you about our services</li>
        </ul>
      </section>

      <section>
        <h2>Data Storage and Security</h2>
        <p>We implement appropriate security measures to protect your personal information. Data is stored securely and accessed only by authorized personnel.</p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Update or correct your information</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>If you have questions about this privacy policy, please contact us at [your-email].</p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;