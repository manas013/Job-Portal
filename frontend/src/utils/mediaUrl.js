export const mediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Use relative path so Vite dev proxy serves /uploads from backend
  return path.startsWith('/') ? path : `/${path}`;
};
