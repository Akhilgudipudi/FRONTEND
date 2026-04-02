const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }

  return payload;
}

export const certificationsApi = {
  list: () => request("/api/certifications"),
  summary: () => request("/api/certifications/summary"),
  getById: (id) => request(`/api/certifications/${id}`),
  create: (body) =>
    request("/api/certifications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    request(`/api/certifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) =>
    request(`/api/certifications/${id}`, {
      method: "DELETE",
    }),
};
