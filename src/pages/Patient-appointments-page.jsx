import React from 'react';
import DashboardLayout from '../Components/Patient-dashboard-Components/DashboardLayout';
import AppointmentsList from '../Components/Patient-dashboard-Components/AppointmentsList/AppointmentsList';

export default function PatientAppointments() {
    return (
        <DashboardLayout active="Appointments">
            {(session) => (
                <main className="dash-main">
                    <AppointmentsList patientId={session.patientId} />
                </main>
            )}
        </DashboardLayout>
    );
}
