const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      'Что-то пошло не так при запросе к API';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return payload;
}

export const api = {
  getFeed: (params = {}, token) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        searchParams.set(key, String(value));
      }
    });

    const suffix = searchParams.toString() ? `?${searchParams}` : '';
    return request(`/bff/feed${suffix}`, { token });
  },
  getRecipe: (id, token) => request(`/bff/recipes/${id}`, { token }),
  getProfile: (userId, token) => request(`/bff/profiles/${userId}`, { token }),
  getDashboard: (token) => request('/bff/me/dashboard', { token }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  getMe: (token) => request('/auth/me', { token }),
  getUsers: (token) => request('/users', { token }),
  getRecipes: (params = {}, token) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    const suffix = searchParams.toString() ? `?${searchParams}` : '';
    return request(`/recipes${suffix}`, { token });
  },
  uploadRecipePhoto: (file, token) => {
    const formData = new FormData();
    formData.append('file', file);

    return request('/uploads/recipes', {
      method: 'POST',
      body: formData,
      token,
    });
  },
  createRecipe: (body, token) => request('/recipes', { method: 'POST', body, token }),
  deleteRecipe: (id, token) => request(`/recipes/${id}`, { method: 'DELETE', token }),
  updateUserRole: (id, role, token) =>
    request(`/users/${id}/role`, {
      method: 'PATCH',
      body: { role },
      token,
    }),
  deleteUser: (id, token) => request(`/users/${id}`, { method: 'DELETE', token }),
  likeRecipe: (id, token) => request(`/recipes/${id}/likes`, { method: 'POST', token }),
  unlikeRecipe: (id, token) => request(`/recipes/${id}/likes`, { method: 'DELETE', token }),
  favoriteRecipe: (id, token) =>
    request(`/recipes/${id}/favorites`, { method: 'POST', token }),
  unfavoriteRecipe: (id, token) =>
    request(`/recipes/${id}/favorites`, { method: 'DELETE', token }),
  subscribe: (userId, token) =>
    request(`/users/${userId}/subscription`, { method: 'POST', token }),
  unsubscribe: (userId, token) =>
    request(`/users/${userId}/subscription`, { method: 'DELETE', token }),
  createComment: (recipeId, body, token) =>
    request(`/recipes/${recipeId}/comments`, { method: 'POST', body, token }),
  deleteComment: (recipeId, commentId, token) =>
    request(`/recipes/${recipeId}/comments/${commentId}`, {
      method: 'DELETE',
      token,
    }),
};
