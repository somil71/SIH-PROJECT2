import React from 'react'
import groupProfile from '../assets/assets_frontend/group_profiles.png'
import arrowIcon from '../assets/assets_frontend/arrow_icon.svg'



const Header = () => {
  return ( 
    <div> 
        <div>
            <p>
                Book Appointment <br /> With Trusted Doctors
            </p>
            <div>
                <img src={groupProfile} alt="Group Profile" />
                <p>Simply browse through our extensive list of doctors, <br /> schedule your appointment hassle-free.</p>
            </div>
            <a href="">
                Book Appointment <img src={arrowIcon} alt="" />
            </a>
        </div>
    </div>
  )
}

export default Header