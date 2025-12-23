export async function getOtp(body: any) {
  const res = await fetch(`/api/core/auth/otp`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`(${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}

export async function login(body: { email: string; otp: string }) {
  const res = await fetch(`/api/core/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`(${res.status}): ${text || res.statusText}`);
  }

  return res.json(); // { ok: true }
}