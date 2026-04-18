import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onSnapshot, collection, db, query } from "./lib/firebase";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import NotebookPage from "./pages/NotebookPage";
import Navbar from "./components/Navbar";
import { Repo } from "./types";

export default function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App: Initializing Firestore listener...");
    const q = query(collection(db, "repos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`App: Received ${snapshot.docs.length} repos`);
      const r = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repo));
      setRepos(r);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setLoading(false); // Stop loading even on error
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary/50 font-display italic text-xl">RepoMind...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-white flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard repos={repos} />} />
            <Route path="/notebook/:repoId" element={<NotebookPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
