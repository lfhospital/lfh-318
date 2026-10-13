import React from 'react';
import DashboardLayout from '../Components/Patient-dashboard-Components/DashboardLayout';
import PrescriptionsList from '../Components/Patient-dashboard-Components/PrescriptionsList/PrescriptionsList';

export default function PatientPrescriptions() {
    return (
        <DashboardLayout active="Prescriptions">
            {(session) => (
                <main className="dash-main">
                    <PrescriptionsList patientId={session.patientId} />
                </main>
            )}
        </DashboardLayout>
    );
}
