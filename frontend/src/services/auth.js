// services/auth.ts
export async function registerAdmin(data) {
  const res = await fetch("http://localhost:5000/api/admin/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message);
  return responseData;
}

export async function login(email, password) {
  const res = await fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message);

  localStorage.setItem("token", responseData.token);
  return responseData;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
