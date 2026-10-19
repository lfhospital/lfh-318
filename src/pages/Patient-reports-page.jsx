import React from 'react';
import RequirePatient from '../Components/Patient-Dashboard-page-Components/RequirePatient';
import PatientReports from '../Components/Patient-Dashboard-page-Components/PatientReports/PatientReports';
import Reports from '../Components/Patient-Dashboard-page-Components/Reports/Reports';

export default function PatientReportsPage() {
    return (
        <RequirePatient>
            {(isNew) => (isNew ? <Reports /> : <PatientReports />)}
        </RequirePatient>
    );
}
