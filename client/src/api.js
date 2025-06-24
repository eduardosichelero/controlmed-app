// client/src/api.js
// Centraliza a URL base da API para facilitar manutenção

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  return fetch(url, options);
}
