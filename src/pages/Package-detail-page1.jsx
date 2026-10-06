import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import PackageDetailsTabs from '../Components/Package-detail-page-Components/PackageDetailsTabs/PackageDetailsTabs';
import TestDetails1 from '../Components/Package-detail-page-Components/TestDetails/TestDetails1';

export default function PackageDetail1() {
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get('package_id');

    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(!!packageId);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!packageId) return;

        const fetchPackageDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `https://ishah.in/api/lfhospital/packages?type=singlePackage&package_id=${packageId}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.packages && data.packages.length > 0) {
                    setPackageData(data.packages[0]);
                } else {
                    setError('Package not found');
                }
            } catch (err) {
                console.error('Error fetching package detail:', err);
                setError('Failed to load package details');
            } finally {
                setLoading(false);
            }
        };

        fetchPackageDetail();
    }, [packageId]);

    return (
        <>
            <Navbar />
            <TestDetails1 packageData={packageData} loading={loading} error={error} />
            <PackageDetailsTabs packageData={packageData} />
            <Footer />
        </>
    );
}
