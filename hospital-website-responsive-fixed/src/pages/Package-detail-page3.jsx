import React from 'react';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import PackageDetailsTabs from '../Components/Package-detail-page-Components/PackageDetailsTabs/PackageDetailsTabs';
import TestDetails3 from '../Components/Package-detail-page-Components/TestDetails/TestDetails3';

export default function PackageDetail3() {
    return (
        <>
            <Navbar />
            <TestDetails3 />
            <PackageDetailsTabs />
            <Footer />
        </>
    );
}
