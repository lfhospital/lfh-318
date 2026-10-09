import React from 'react';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import AboutHero from '../Components/About-page-Components/AboutHero/AboutHero';
import AboutStats from '../Components/About-page-Components/AboutStats/AboutStats';
import CareApproach from '../Components/About-page-Components/CareApproach/CareApproach';
import WhyChooseUs from '../Components/About-page-Components/WhyChooseUs/WhyChooseUs';
import Leadership from '../Components/About-page-Components/Leadership/Leadership';
import { useAboutContent } from '../Components/About-page-Components/aboutContent';
import '../Components/Common/SectionHeading.css';
import '../Components/About-page-Components/AboutPage.css';

export default function AboutPage() {
    const { content, loading } = useAboutContent();

    return (
        <>
            <Navbar />
            <main className="about-page">
                <AboutHero hero={content.hero} loading={loading} />
                <div className="about-page-sections">
                    <AboutStats stats={content.stats} loading={loading} />
                    <CareApproach pillars={content.pillars} loading={loading} />
                    <WhyChooseUs features={content.features} loading={loading} />
                    <Leadership />
                </div>
            </main>
            <Footer />
        </>
    );
}
