export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

export const setToLocalStorage = (key: string, value: unknown) => {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);

  window.dispatchEvent(new CustomEvent("localStorageChange", { detail: { key, value: jsonValue } }));
};
