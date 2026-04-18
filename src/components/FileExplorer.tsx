import { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown, FileCode } from "lucide-react";
import { RepoFile } from "../types";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  file?: RepoFile;
}

export default function FileExplorer({ files, onSelectFile, selectedFile }: { 
  files: RepoFile[], 
  onSelectFile: (f: RepoFile) => void,
  selectedFile: RepoFile | null
}) {
  // Build tree from flat file list
  const buildTree = (files: RepoFile[] = []): FileNode[] => {
    const root: FileNode[] = [];
    if (!files) return root;
    files.forEach(file => {
      const parts = file.path.split("/");
      let currentLevel = root;
      parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;
        let existing = currentLevel.find(n => n.name === part);
        if (!existing) {
          existing = {
            name: part,
            path: parts.slice(0, i + 1).join("/"),
            type: isLast ? "file" : "folder",
            children: isLast ? undefined : [],
            file: isLast ? file : undefined
          };
          currentLevel.push(existing);
        }
        if (!isLast) currentLevel = existing.children!;
      });
    });
    return root;
  };

  const tree = buildTree(files);

  return (
    <div className="space-y-1">
      {tree.map(node => (
        <TreeNode 
          key={node.path} 
          node={node} 
          onSelectFile={onSelectFile} 
          selectedFile={selectedFile} 
        />
      ))}
    </div>
  );
}

function TreeNode({ node, onSelectFile, selectedFile, level = 0 }: { 
  node: FileNode, 
  onSelectFile: (f: RepoFile) => void,
  selectedFile: RepoFile | null,
  level?: number
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isSelected = selectedFile?.path === node.path;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (node.type === "file") {
    return (
      <button 
        onClick={() => onSelectFile(node.file!)}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors group ${
          isSelected ? "bg-accent/10 text-accent font-medium" : "hover:bg-black/5 text-ink/60"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <div className="flex items-center gap-2 truncate">
          <FileCode className="w-4 h-4 opacity-50" />
          <span className="truncate">{node.name}</span>
        </div>
        {node.file?.size && (
          <span className="text-[10px] opacity-0 group-hover:opacity-40 transition-opacity font-mono">
            {formatSize(node.file.size)}
          </span>
        )}
      </button>
    );
  }

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-black/5 text-ink/80 transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Folder className="w-4 h-4 text-accent/60" />
        <span className="font-medium truncate">{node.name}</span>
      </button>
      {isOpen && node.children && (
        <div className="mt-1">
          {node.children.map(child => (
            <TreeNode 
              key={child.path} 
              node={child} 
              onSelectFile={onSelectFile} 
              selectedFile={selectedFile} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
