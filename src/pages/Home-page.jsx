import React from 'react';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import Hero from '../Components/Home-page-Components/Hero/Hero';
import Specialties from '../Components/Home-page-Components/Specialties/Specialties';
import MissionSection from '../Components/Home-page-Components/MissionSection/MissionSection';
import CareJourney from '../Components/Home-page-Components/CareJourney/CareJourney';
import HealthPackages from '../Components/Home-page-Components/HealthPackages/HealthPackages';
import PatientStories from '../Components/Home-page-Components/PatientStories/PatientStories';
import FAQSection from '../Components/Home-page-Components/FAQSection/FAQSection';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';

export default function HomePage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Specialties />
            <MissionSection />
            <CareJourney />
            <HealthPackages />
            <PatientStories />
            <FAQSection />
            <Footer />
        </>
    );
}
