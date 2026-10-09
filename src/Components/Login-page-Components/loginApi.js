const API_BASE = "https://ishah.in/api/lfhospital/patients";

async function post(path, payload) {
  try {
    const response = await fetch(`${API_BASE}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);
    const ok = response.ok && result?.success !== false;
    return { ok, message: result?.message, data: result?.data ?? result };
  } catch (err) {
    console.error(`Error calling ${path} API:`, err);
    return { ok: false, message: "We couldn't reach the server. Please check your connection and try again." };
  }
}

export const sendOtp = (phno) => post("sendotp", { phno });

export const verifyOtp = (phno, otp) =>
  post("verifyotp", { phno, otp, action: "login" });
