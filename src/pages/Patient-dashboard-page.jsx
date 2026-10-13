import React from 'react';
import DashboardLayout from '../Components/Patient-dashboard-Components/DashboardLayout';
import DashboardOverview from '../Components/Patient-dashboard-Components/DashboardOverview/DashboardOverview';
import { getPatientFirstName } from '../utils/patientSession';

export default function PatientDashboard() {
    return (
        <DashboardLayout active="Overview">
            {(session) => (
                <DashboardOverview
                    firstName={getPatientFirstName(session)}
                    patientId={session.patientId}
                />
            )}
        </DashboardLayout>
    );
}
