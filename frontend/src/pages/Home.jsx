import React from 'react'


import Hero from '../components/CommanComponents/Hero';
import HealthcareActions from '../components/CommanComponents/HealthcareServices';

const Home = () => {
  return (
    <div className=" text-black px-4 lg:px-32 py-4 md:px-10 md:py-8 ">
      <Hero/>
      <HealthcareActions/>
    </div>
  );
}

export default Home