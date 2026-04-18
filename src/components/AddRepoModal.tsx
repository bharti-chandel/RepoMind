import { useState } from "react";
import { X, Github, Loader2, CheckCircle2 } from "lucide-react";
import { db, collection, addDoc, serverTimestamp } from "../lib/firebase";
import axios from "axios";

export default function AddRepoModal({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "indexing" | "completed">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setStatus("processing");

    try {
      // 1. Fetch repo structure from backend
      const response = await axios.post("/api/github/repo", { repoUrl: url });
      const { owner, repo, files } = response.data;

      setStatus("indexing");
      
      // 2. Save to Firestore
      await addDoc(collection(db, "repos"), {
        name: repo,
        owner,
        url,
        description: `Repository for ${repo} by ${owner}`,
        fileCount: files.length,
        files: files, // Store file structure
        createdAt: serverTimestamp(),
      });

      setStatus("completed");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add repository. Make sure it's public.");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-background w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Add Repository</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {status === "idle" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-primary/40 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20" />
                  <input 
                    type="url" 
                    required
                    placeholder="https://github.com/facebook/react"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 text-lg"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full notebook-btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusIcon />}
                <span>Index Repository</span>
              </button>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-8">
                {status === "completed" ? (
                  <CheckCircle2 className="w-full h-full text-green-500" />
                ) : (
                  <div className="w-full h-full border-4 border-black/5 border-t-accent rounded-full animate-spin" />
                )}
              </div>
              
              <h3 className="text-2xl font-serif font-bold mb-2">
                {status === "processing" && "Processing Repository..."}
                {status === "indexing" && "Indexing Files..."}
                {status === "completed" && "Repository Indexed!"}
              </h3>
              <p className="text-primary/60">
                {status === "processing" && "We're fetching the file structure from GitHub."}
                {status === "indexing" && "Building the knowledge base for your code."}
                {status === "completed" && "Redirecting you to your notebook..."}
              </p>

              <div className="w-full max-w-xs mt-8 h-2 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ 
                    width: status === "processing" ? "33%" : status === "indexing" ? "66%" : "100%" 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
