import React from 'react'
import { useNavigate } from 'react-router-dom';
import './payment.css'
import Navbar2 from '../navbar2/Navbar2';
import SeekerSideBar from '../seekerSideBar/SeekerSideBar';
import Footer from '../footer/Footer'
import Company2 from '../../assets/Company2.jpg'

function Payment() {
  const navigate = useNavigate ();


  return (
    <div className='payment-main'>
      <Navbar2 />
      <div className="pyment-container">
        <div className="pyment-container-right">
          <SeekerSideBar /> 
        </div>
        <div className="pyment-container-left">
            <div className="pyment-container-left-longtext">
                <h4>Please do the payment of 20 USD by using following link to </h4>
                <h3>Kaun Gayantha</h3>
                <h4>and take the transaction ID from paypal and enter below, then click on send message now</h4>
            </div>
            <div className="pyment-container-left-content">
                <img className='Payment-companyprofile-image' src={Company2} alt="" />
                <div className='paypal-link-container'>
                    <h4>This is the Adviosr Paypal Link</h4>
                    <a href="https://www.paypal.com/lk/home">https://www.paypal.com/lk/home</a>
                    <h2> Enter the transaction id from paypal payment </h2>
                    <input className='Paymenttransection-id' type="text" />
                    
                </div>
                
            </div>
            <button className='paymet-sendmessage-button' onClick={()=>navigate("/seeker-chat")}>Send Message</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Payment
