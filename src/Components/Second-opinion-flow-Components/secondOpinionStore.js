// Shared state for the second-opinion request flow.
// - The draft survives leaving the flow (e.g. to add a family member) and
//   coming back, so "saved automatically as a draft" holds within a session.
// - Submitted requests are picked up by the dashboard's Second opinion page.
//   The backend has no second-opinion endpoint yet, so they are kept in
//   localStorage until one exists; swap submitSecondOpinion for the API call.

const SUBMITTED_KEY = "lfh-second-opinions";

const loadSubmitted = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SUBMITTED_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

let draft = null;
let submitted = loadSubmitted();

export const getDraft = () => draft;

export const saveDraft = (value) => {
  draft = value;
};

export const clearDraft = () => {
  draft = null;
};

export const getSubmittedSecondOpinions = () => submitted;

export const submitSecondOpinion = (request) => {
  submitted = [request, ...submitted];
  try {
    localStorage.setItem(SUBMITTED_KEY, JSON.stringify(submitted));
  } catch {
    // Storage unavailable: the request is still listed for this visit
  }
};
