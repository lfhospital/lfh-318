import React from 'react';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import ContactHero from '../Components/Contact-page-Components/ContactHero/ContactHero';
import ContactChannels from '../Components/Contact-page-Components/ContactChannels/ContactChannels';
import VisitUs from '../Components/Contact-page-Components/VisitUs/VisitUs';
import EnquiryForm from '../Components/Contact-page-Components/EnquiryForm/EnquiryForm';
import '../Components/Common/SectionHeading.css';
import '../Components/Contact-page-Components/ContactPage.css';

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="contact-page">
                <ContactHero />
                <div className="contact-page-sections">
                    <ContactChannels />
                    <VisitUs />
                    <EnquiryForm />
                </div>
            </main>
            <Footer />
        </>
    );
}
