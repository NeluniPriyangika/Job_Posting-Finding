import React from 'react'
import './comanyPending.css'
import Navbar2 from '../navbar2/Navbar2'
import Footer from '../footer/Footer'

function CompanyPending() {
  return (
    <div className='companyPending-main'>
        <Navbar2 />
        <div className='companyPending-container'>
          <div className='companyPending-container-header'>
            <h1>Your Account will be approved by the admin...</h1>
          </div>
        </div>
        <Footer />

    </div>
  )
}

export default CompanyPending
