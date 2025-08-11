export const getFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

export const setToLocalStorage = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};
