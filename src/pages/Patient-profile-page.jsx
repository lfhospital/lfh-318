import React from 'react';
import RequirePatient from '../Components/Patient-Dashboard-page-Components/RequirePatient';
import PatientProfileSettings from '../Components/Patient-Dashboard-page-Components/PatientProfileSettings/PatientProfileSettings';

export default function PatientProfilePage() {
    return <RequirePatient>{() => <PatientProfileSettings />}</RequirePatient>;
}
