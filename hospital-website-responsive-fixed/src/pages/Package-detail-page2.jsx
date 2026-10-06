import React from 'react';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import PackageDetailsTabs from '../Components/Package-detail-page-Components/PackageDetailsTabs/PackageDetailsTabs';
import TestDetails2 from '../Components/Package-detail-page-Components/TestDetails/TestDetails2';

export default function PackageDetail2() {
    return (
        <>
            <Navbar />
            <TestDetails2/>
            <PackageDetailsTabs />
            <Footer />
        </>
    );
}
