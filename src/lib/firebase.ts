/**
 * Mocking Firebase functionality using Local Storage to ensure the app stays 
 * functional without a Firebase backend.
 */

const STORAGE_KEY = 'repomind_repos';

// Helper to get repos from local storage
const getStoredRepos = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save repos to local storage
const saveRepos = (repos: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(repos));
  // Notify listeners
  window.dispatchEvent(new CustomEvent('repos_changed'));
};

export const db = {};
export const auth = { currentUser: { uid: 'local-user' } };
export const googleProvider = {};

export const loginWithGoogle = async () => ({ user: auth.currentUser });
export const logout = async () => {};

export const collection = (db: any, name: string) => name;
export const query = (col: string) => col;
export const where = () => ({});

export const addDoc = async (col: string, data: any) => {
  const repos = getStoredRepos();
  const newRepo = { 
    ...data, 
    id: Math.random().toString(36).substr(2, 9), 
    createdAt: { seconds: Math.floor(Date.now() / 1000) } 
  };
  repos.push(newRepo);
  saveRepos(repos);
  return { id: newRepo.id };
};

export const getDocs = async (col: string) => ({
  docs: getStoredRepos().map((r: any) => ({ id: r.id, data: () => r }))
});

export const getDoc = async (docRef: any) => {
  const repo = getStoredRepos().find((r: any) => r.id === docRef.id);
  return { exists: () => !!repo, id: repo?.id, data: () => repo };
};

export const doc = (db: any, col: string, id: string) => ({ id, col });

export const deleteDoc = async (docRef: any) => {
  const filtered = getStoredRepos().filter((r: any) => r.id !== docRef.id);
  saveRepos(filtered);
};

export const onSnapshot = (q: any, callback: any) => {
  const handler = () => callback({ docs: getStoredRepos().map((r: any) => ({ id: r.id, data: () => r })) });
  handler();
  window.addEventListener('repos_changed', handler);
  return () => window.removeEventListener('repos_changed', handler);
};

export const serverTimestamp = () => ({ seconds: Math.floor(Date.now() / 1000) });

