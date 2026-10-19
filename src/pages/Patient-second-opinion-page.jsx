import React from 'react';
import RequirePatient from '../Components/Patient-Dashboard-page-Components/RequirePatient';
import SecondOpinion, { sampleSecondOpinions } from '../Components/Patient-Dashboard-page-Components/SecondOpinion/SecondOpinion';

// TODO: replace the sample requests with data from the API
export default function PatientSecondOpinionPage() {
    return (
        <RequirePatient>
            {(isNew) => <SecondOpinion initialRequests={isNew ? [] : sampleSecondOpinions} />}
        </RequirePatient>
    );
}
