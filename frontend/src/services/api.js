export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) {
  // get token from cookie
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

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
