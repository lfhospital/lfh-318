import React, { useState } from 'react';
import Navbar from '../Components/Doctor-profile-page-Components/Navbar/Navbar';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import HealthPackagesCheckup from '../Components/Health-packages-page-Components/HealthPackages-checkup/HealthPackages-checkup';
import PackageSection from '../Components/Health-packages-page-Components/PackageSection/PackageSection';
import { CompareProvider } from '../Components/Health-packages-page-Components/CompareContext';

export default function Healthpackages() {
    const [searchQuery, setSearchQuery] = useState("");
    // Number of packages matching the search; null until loaded
    const [packageCount, setPackageCount] = useState(null);

    return (
        <>
            <Navbar />
            <CompareProvider>
                <HealthPackagesCheckup
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    packageCount={packageCount}
                />
                <PackageSection
                    searchQuery={searchQuery}
                    onPackagesFiltered={setPackageCount}
                />
            </CompareProvider>
            <Footer />
        </>
    );
}
