import { Navigate } from "react-router-dom";
import { getPatientSession } from "../../utils/patientSession";

// Dashboard section pages need a logged-in patient. `children` receives
// whether they have just signed up, so the page can show its empty state.
export default function RequirePatient({ children }) {
  const session = getPatientSession();
  if (!session?.patientId) return <Navigate to="/login" replace />;
  return children(Boolean(session.newUser));
}
