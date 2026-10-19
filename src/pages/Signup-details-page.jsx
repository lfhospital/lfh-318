import React from 'react';
import { Navigate } from 'react-router-dom';
import BasicDetailsPage from '../Components/Create-an-Account-Components/BasicDetailsPage/BasicDetailsPage';
import { getPatientSession } from '../utils/patientSession';

// Last sign-up step: shown after the OTP is verified for a new number
export default function SignupDetailsPage() {
    if (!getPatientSession()?.patientId) return <Navigate to="/signup" replace />;
    return <BasicDetailsPage onBack={() => window.history.back()} />;
}
