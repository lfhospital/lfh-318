import React from 'react';
import RequirePatient from '../Components/Patient-Dashboard-page-Components/RequirePatient';
import Payments, { samplePayments } from '../Components/Patient-Dashboard-page-Components/Payments/Payments';

// TODO: replace the sample payments with data from the API
export default function PatientPaymentsPage() {
    return (
        <RequirePatient>
            {(isNew) => <Payments initialPayments={isNew ? [] : samplePayments} />}
        </RequirePatient>
    );
}
