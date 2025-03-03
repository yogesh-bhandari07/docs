export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) {
  const token = localStorage.getItem("token");
  console.log(token);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // JSON body ke liye headers set karo
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Ensure `body` is `null` instead of `undefined`
  const requestBody =
    body && !isFormData
      ? JSON.stringify(
          Object.fromEntries(
            Object.entries(body).map(([key, value]) => [
              key,
              value === "" ? null : value, // Convert empty strings to null
            ])
          )
        )
      : body;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${endpoint}`,
    {
      method,
      headers,
      body: requestBody,
    }
  );

  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.message);
  return responseData;
}
