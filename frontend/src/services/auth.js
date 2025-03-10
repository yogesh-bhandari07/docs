// services/auth.ts
export async function registerAdmin(data) {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message);
  return responseData;
}

export async function login(email, password) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.message || "Login failed");

    document.cookie = `token=${responseData.token}; path=/;expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    ).toUTCString()}`;

    return responseData;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
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
