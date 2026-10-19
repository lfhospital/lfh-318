// Hospital details shared by the contact page and the booking flow
export const HOSPITAL_NAME = "Lakshmee Foundation Hospital";

export const HOSPITAL_ADDRESS =
  "First Floor, GM57+PR, Ring Rd, opposite Novotel Hotel, Venkateswara Nagar, Veterinary Colony, Vijayawada, Andhra Pradesh 520008";

export const HOSPITAL_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${HOSPITAL_NAME}, ${HOSPITAL_ADDRESS}`
)}`;

export const HOSPITAL_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${HOSPITAL_NAME}, ${HOSPITAL_ADDRESS}`
)}`;
