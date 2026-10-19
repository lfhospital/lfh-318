import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import PackageDetailsTabs from '../Components/Package-detail-page-Components/PackageDetailsTabs/PackageDetailsTabs';
import TestDetails1 from '../Components/Package-detail-page-Components/TestDetails/TestDetails1';
import { updatePlanItem, usePlan } from '../planStore';

export default function PackageDetail1() {
    const [searchParams] = useSearchParams();
    const packageId = searchParams.get('package_id');

    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(!!packageId);
    const [error, setError] = useState(null);
    const [collectionMode, setCollectionMode] = useState('home');
    const { items: planItems } = usePlan();

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

    // Home collection can't be chosen for packages that don't offer it
    const homeAvailable = packageData ? Boolean(packageData.home_collection_available) : true;
    const effectiveMode = homeAvailable ? collectionMode : 'hospital';
    const planItem = packageData && planItems.find((item) => item.id === packageData._id);

    // Each package starts from the default choice...
    useEffect(() => {
        setCollectionMode('home');
    }, [packageId]);

    // ...unless it's already in the plan with a saved choice
    useEffect(() => {
        if (planItem?.collection) setCollectionMode(planItem.collection);
    }, [planItem?.collection]);

    const chooseCollection = (mode) => {
        if (mode === 'home' && !homeAvailable) return;
        setCollectionMode(mode);
        if (planItem) updatePlanItem(planItem.id, { collection: mode });
    };

    const collection = {
        mode: effectiveMode,
        homeAvailable,
        onChange: chooseCollection,
    };

    return (
        <>
            <Navbar />
            <TestDetails1 packageData={packageData} loading={loading} error={error} collection={collection} />
            <PackageDetailsTabs packageData={packageData} collection={collection} />
            <Footer />
        </>
    );
}
