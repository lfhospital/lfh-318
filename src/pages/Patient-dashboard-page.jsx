import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';
import DashboardSidebar from '../Components/Patient-dashboard-Components/DashboardSidebar/DashboardSidebar';
import DashboardOverview from '../Components/Patient-dashboard-Components/DashboardOverview/DashboardOverview';
import { getPatientSession, getPatientFirstName } from '../utils/patientSession';

export default function PatientDashboard() {
    const session = getPatientSession();
    if (!session?.patientId) return <Navigate to="/login" replace />;

    return (
        <>
            <Navbar />
            <div className="dash-layout">
                <DashboardSidebar active="Overview" />
                <DashboardOverview
                    firstName={getPatientFirstName(session)}
                    patientId={session.patientId}
                />
            </div>
            <Footer />
        </>
    );
}
