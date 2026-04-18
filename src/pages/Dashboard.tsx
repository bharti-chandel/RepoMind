import { useState } from "react";
import { Repo } from "../types";
import { Plus, BookOpen, Clock, FileCode, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import AddRepoModal from "../components/AddRepoModal";
import { motion } from "motion/react";
import { db, deleteDoc, doc } from "../lib/firebase";

export default function Dashboard({ repos }: { repos: Repo[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 bg-white p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">My Notebooks</h1>
          <p className="text-primary/60">Manage your indexed repositories and insights.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input 
              type="text" 
              placeholder="Search repos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-black/5 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="notebook-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Repository</span>
          </button>
        </div>
      </div>

      {filteredRepos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 glass-card">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-primary/20" />
          </div>
          <h3 className="text-xl font-serif font-bold mb-2">No notebooks yet</h3>
          <p className="text-primary/60 mb-6">Start by adding a GitHub repository to index.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="notebook-btn-secondary"
          >
            Create your first notebook
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo, idx) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <RepoCard repo={repo} />
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && <AddRepoModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete the notebook for "${repo.name}"?`)) {
      try {
        await deleteDoc(doc(db, "repos", repo.id));
      } catch (error) {
        console.error("Error deleting repository:", error);
        alert("Failed to delete the notebook. Please try again.");
      }
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full hover:shadow-md transition-shadow group relative">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
          <FileCode className="w-6 h-6 text-accent" />
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary/40 bg-black/5 px-2 py-1 rounded">
            {repo.owner}
          </div>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-primary/30 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Notebook"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-serif font-bold mb-2 line-clamp-1">{repo.name}</h3>
      <p className="text-sm text-primary/60 mb-6 line-clamp-2 flex-1">
        {repo.description || "No description provided."}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-black/5">
        <div className="flex items-center gap-4 text-xs text-primary/40">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(repo.createdAt?.seconds * 1000).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            <span>{repo.fileCount} files</span>
          </div>
        </div>
        
        <Link 
          to={`/notebook/${repo.id}`}
          className="text-sm font-bold text-accent hover:underline flex items-center gap-1"
        >
          Open Notebook
        </Link>
      </div>
    </div>
  );
}
