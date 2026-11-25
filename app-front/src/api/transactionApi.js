
import { apiRequest } from "./apiClient";

export function getTransactions(params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });

  const query = queryParams.toString();

  return apiRequest(`/api/transactions${query ? `?${query}` : ""}`);
}
