import React from 'react';
import RequirePatient from '../Components/Patient-Dashboard-page-Components/RequirePatient';
import FamilyMembers, { sampleFamilyMembers } from '../Components/Patient-Dashboard-page-Components/FamilyMembers/FamilyMembers';

// TODO: replace the sample members with data from the API
export default function PatientFamilyMembersPage() {
    return (
        <RequirePatient>
            {(isNew) => <FamilyMembers initialMembers={isNew ? [] : sampleFamilyMembers} />}
        </RequirePatient>
    );
}
