import React from 'react';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import PackageDetailsTabs from '../Components/Package-detail-page-Components/PackageDetailsTabs/PackageDetailsTabs';
import TestDetails1 from '../Components/Package-detail-page-Components/TestDetails/TestDetails1';

export default function PackageDetail1() {
    return (
        <>
            <Navbar />
            <TestDetails1 />
            <PackageDetailsTabs />
            <Footer />
        </>
    );
}
