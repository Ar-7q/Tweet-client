export const isCooldownActive = (key: string) => {
  const expiry = localStorage.getItem(key);

  if (!expiry) return false;

  return Date.now() < Number(expiry);
};

export const startCooldown = (key: string, seconds: number) => {
  localStorage.setItem(key, (Date.now() + seconds * 1000).toString());
};

export const getCooldownRemaining = (key: string) => {
  const expiry = localStorage.getItem(key);

  if (!expiry) return 0;

  const remaining = Math.ceil((Number(expiry) - Date.now()) / 1000);

  return remaining > 0 ? remaining : 0;
};
