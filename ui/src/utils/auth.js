/**
 * Gets the token from localstorage
 * @returns Token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Sets the token to localstorage
 * @param {string} token 
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Deletes the token from localstorage
 */
export const removeToken = () => {
  localStorage.removeItem("token");
};
