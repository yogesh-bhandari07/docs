import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { apiRequest } from "@/services/api";
import Toast from "@/components/Toast";

export default function ApiTester({ page, api }) {
  const [toast, setToast] = useState(null);
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [authType, setAuthType] = useState("none");
  const [basicAuth, setBasicAuth] = useState({ username: "", password: "" });
  const [oauthToken, setOauthToken] = useState("");
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [bodyParams, setBodyParams] = useState([{ key: "", value: "" }]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    console.log("API data:", api);
    if (api) {
      setMethod(api.method || "GET");
      setUrl(api.url || "");

      setQueryParams(
        api.params?.length > 0 ? api.params : [{ key: "", value: "" }]
      );

      setHeaders(
        api.headers?.length > 0 ? api.headers : [{ key: "", value: "" }]
      );

      setBodyParams(api.body?.length > 0 ? api.body : [{ key: "", value: "" }]);

      if (api.headers) {
        const authHeader = api.headers.find((h) => h.key === "Authorization");
        if (authHeader) {
          if (authHeader.value.startsWith("Basic")) {
            const decoded = atob(authHeader.value.replace("Basic ", ""));
            const [username, password] = decoded.split(":");
            setAuthType("basic");
            setBasicAuth({ username, password });
          } else if (authHeader.value.startsWith("Bearer")) {
            setAuthType("oauth");
            setOauthToken(authHeader.value.replace("Bearer ", ""));
          }
        }
      }
    } else {
      setQueryParams([{ key: "", value: "" }]);
      setHeaders([{ key: "", value: "" }]);
      setBodyParams([{ key: "", value: "" }]);
      setMethod("GET");
      setUrl("");
    }
  }, [api]);

  const buildUrlWithParams = () => {
    const params = queryParams
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");
    return params ? `${url}?${params}` : url;
  };

  const handleSendRequest = async () => {
    const fullUrl = buildUrlWithParams();
    const headersObj = Object.fromEntries(
      headers.filter((h) => h.key && h.value).map((h) => [h.key, h.value])
    );
    const bodyObj = Object.fromEntries(
      bodyParams.filter((b) => b.key && b.value).map((b) => [b.key, b.value])
    );

    if (authType === "basic" && basicAuth.username && basicAuth.password) {
      headersObj["Authorization"] = `Basic ${btoa(
        `${basicAuth.username}:${basicAuth.password}`
      )}`;
    }
    if (authType === "oauth" && oauthToken) {
      headersObj["Authorization"] = `Bearer ${oauthToken}`;
    }

    try {
      const res = await axios({
        method,
        url: fullUrl,
        headers: headersObj,
        data: bodyObj,
      });
      setResponse(res.data);
      setToast({ message: "Response Received", type: "success" });
    } catch (error) {
      setResponse(error.response ? error.response.data : error.message);
      setToast({ message: error.message, type: "error" });
    }
  };

  return (
    <div className="p-6 bg-backgroundDark text-textDark min-h-screen flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-6 text-primary"
      >
        API Tester
      </motion.h1>
      <div className="w-full max-w-2xl bg-backgroundLight p-6 rounded-lg shadow-lg">
        <div className="flex gap-3 mb-4">
          <select
            className="p-2 border rounded-md bg-white text-textLight"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {["GET", "POST", "PUT", "DELETE"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="p-2 flex-1 border rounded-md bg-white text-textLight"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleSendRequest}
            className="bg-amber-500 px-4 py-2 rounded-md "
          >
            Send
          </button>
        </div>
        {[
          { label: "Query Params", state: queryParams, setter: setQueryParams },
          { label: "Headers", state: headers, setter: setHeaders },
          { label: "Body Params", state: bodyParams, setter: setBodyParams },
        ].map(({ label, state, setter }) => (
          <div key={label} className="mb-4">
            <label className="block font-bold mb-2 text-secondary">
              {label}
            </label>
            {state.map((param, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="p-2 border rounded-md bg-white text-textLight"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) =>
                    handleChangeField(index, "key", e.target.value, setter)
                  }
                />
                <input
                  type="text"
                  className="p-2 border rounded-md bg-white text-textLight"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) =>
                    handleChangeField(index, "value", e.target.value, setter)
                  }
                />
              </div>
            ))}
          </div>
        ))}

        <div className="mt-6 overflow-x-scroll">
          <h2 className="text-lg font-bold mb-2 text-secondary">Response</h2>
          <div className="p-4 bg-white rounded-md shadow-md text-textDark">
            {response ? (
              <pre>{JSON.stringify(response, null, 2)}</pre>
            ) : (
              <p>No response yet.</p>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
