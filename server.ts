import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch GitHub Repo Structure and Files
  app.post("/api/github/repo", async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: "Repo URL is required" });

    try {
      // Extract owner and repo from URL
      // https://github.com/owner/repo
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return res.status(400).json({ error: "Invalid GitHub URL" });

      const [_, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, "");

      // Fetch file tree recursively
      const treeUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/main?recursive=1`;
      // Note: Some repos use 'master' instead of 'main'. We should handle that.
      let treeResponse;
      try {
        treeResponse = await axios.get(treeUrl);
      } catch (e) {
        const masterUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/master?recursive=1`;
        treeResponse = await axios.get(masterUrl);
      }

      const files = treeResponse.data.tree.filter((item: any) => item.type === "blob");
      
      res.json({
        owner,
        repo: cleanRepo,
        files: files.map((f: any) => ({
          path: f.path,
          sha: f.sha,
          size: f.size,
          url: f.url
        }))
      });
    } catch (error: any) {
      console.error("GitHub Fetch Error:", error.message);
      res.status(500).json({ error: "Failed to fetch repository" });
    }
  });

  // Fetch individual file content
  app.get("/api/github/file", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "File URL is required" });

    try {
      const response = await axios.get(url as string, {
        headers: { Accept: "application/vnd.github.v3.raw" }
      });
      res.send(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch file content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
