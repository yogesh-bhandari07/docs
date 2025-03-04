import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ApiTester() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [authType, setAuthType] = useState("none");
  const [basicAuth, setBasicAuth] = useState({ username: "", password: "" });
  const [oauthToken, setOauthToken] = useState("");
  const [queryParams, setQueryParams] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [bodyParams, setBodyParams] = useState([{ key: "", value: "" }]);
  const [response, setResponse] = useState(null);

  const handleAddField = (setter) =>
    setter((prev) => [...prev, { key: "", value: "" }]);
  const handleRemoveField = (index, setter) =>
    setter((prev) => prev.filter((_, i) => i !== index));
  const handleChangeField = (index, field, value, setter) =>
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

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
    } catch (error) {
      setResponse(error.response ? error.response.data : error.message);
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
        </div>
        <div className="mb-4">
          <label className="font-semibold">Authentication</label>
          <select
            className="p-2 border w-full rounded-md bg-white text-textLight"
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
          >
            <option value="none">None</option>
            <option value="basic">Basic Auth</option>
            <option value="oauth">OAuth</option>
          </select>
          {authType === "basic" && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className="p-2 border rounded-md bg-white text-textLight"
                placeholder="Username"
                value={basicAuth.username}
                onChange={(e) =>
                  setBasicAuth({ ...basicAuth, username: e.target.value })
                }
              />
              <input
                type="password"
                className="p-2 border rounded-md bg-white text-textLight"
                placeholder="Password"
                value={basicAuth.password}
                onChange={(e) =>
                  setBasicAuth({ ...basicAuth, password: e.target.value })
                }
              />
            </div>
          )}
          {authType === "oauth" && (
            <input
              type="text"
              className="p-2 border rounded-md w-full mt-2 bg-white text-textLight"
              placeholder="OAuth Token"
              value={oauthToken}
              onChange={(e) => setOauthToken(e.target.value)}
            />
          )}
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
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md"
                  onClick={() => handleRemoveField(index, setter)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              className="bg-primary text-white px-4 py-2 rounded-md"
              onClick={() => handleAddField(setter)}
            >
              + Add
            </button>
          </div>
        ))}
        <button
          className="w-full bg-secondary text-backgroundDark font-bold px-6 py-3 rounded-md mt-4 hover:bg-amber-500 transition"
          onClick={handleSendRequest}
        >
          Send Request
        </button>
      </div>
      {response && (
        <pre className="mt-6 p-6 bg-gray-900 text-white rounded-lg w-full max-w-2xl overflow-auto max-h-64">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
