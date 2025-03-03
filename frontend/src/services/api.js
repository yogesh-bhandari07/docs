export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) {
  const token = localStorage.getItem("token");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // JSON body ke liye headers set karo
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${endpoint}`,
    {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    }
  );

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message);
  return responseData;
}
