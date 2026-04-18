import React, { useRef } from "react";
import { Download, Share2, Server, Database, Cpu, Layout } from "lucide-react";

export default function ArchitectureDiagram() {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1200;
      canvas.height = 800;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "repomind-architecture.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl w-full">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-serif font-bold mb-4">System Architecture</h1>
            <p className="text-primary/60">A technical mapping of RepoMind's full-stack infrastructure.</p>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
          >
            <Download className="w-4 h-4" /> Download PNG
          </button>
        </div>

        <div className="glass-card p-12 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Share2 className="w-64 h-64" />
          </div>

          <svg 
            ref={svgRef}
            viewBox="0 0 1000 700" 
            className="w-full h-auto drop-shadow-2xl"
            style={{ background: '#ffffff' }}
          >
            {/* Definitions for gradients and markers */}
            <defs>
              <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Background Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
            <rect width="1000" height="700" fill="url(#grid)" />

            {/* Client Layer */}
            <g transform="translate(50, 50)">
              <rect width="280" height="600" rx="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect width="280" height="60" rx="24" fill="#f8fafc" />
              <text x="140" y="38" textAnchor="middle" className="font-bold text-sm fill-slate-400 uppercase tracking-widest">Client Layer (React)</text>
              
              <g transform="translate(20, 80)">
                <rect width="240" height="100" rx="16" fill="url(#grad-blue)" />
                <text x="120" y="45" textAnchor="middle" fill="white" className="font-bold text-lg">Dashboard UI</text>
                <text x="120" y="70" textAnchor="middle" fill="white" fillOpacity="0.7" className="text-xs italic">Workspace & Repo List</text>
              </g>

              <g transform="translate(20, 200)">
                <rect width="240" height="180" rx="16" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="120" y="35" textAnchor="middle" className="font-bold text-sm fill-slate-600">Knowledge Tools</text>
                <text x="40" y="70" className="text-xs fill-slate-500">• Chat Interface</text>
                <text x="40" y="95" className="text-xs fill-slate-500">• Knowledge Graph</text>
                <text x="40" y="120" className="text-xs fill-slate-500">• Code Explorer</text>
                <text x="40" y="145" className="text-xs fill-slate-500">• Audio Overview</text>
              </g>

              <g transform="translate(20, 400)">
                <rect width="240" height="100" rx="16" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="120" y="45" textAnchor="middle" className="font-bold text-sm fill-slate-600">State Management</text>
                <text x="120" y="70" textAnchor="middle" className="text-xs fill-slate-500 italic">React Hooks & Refs</text>
              </g>
            </g>

            {/* Server Layer */}
            <g transform="translate(380, 50)">
              <rect width="280" height="300" rx="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect width="280" height="60" rx="24" fill="#f8fafc" />
              <text x="140" y="38" textAnchor="middle" className="font-bold text-sm fill-slate-400 uppercase tracking-widest">Server Layer (Node)</text>
              
              <g transform="translate(20, 80)">
                <rect width="240" height="80" rx="16" fill="url(#grad-green)" />
                <text x="120" y="45" textAnchor="middle" fill="white" className="font-bold text-lg">Express API</text>
                <text x="120" y="65" textAnchor="middle" fill="white" fillOpacity="0.7" className="text-xs italic">REST Endpoints</text>
              </g>

              <g transform="translate(20, 180)">
                <rect width="240" height="80" rx="16" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="120" y="45" textAnchor="middle" className="font-bold text-sm fill-slate-600">Vite Middleware</text>
                <text x="120" y="65" textAnchor="middle" className="text-xs fill-slate-500 italic">Asset Serving</text>
              </g>
            </g>

            {/* AI Layer */}
            <g transform="translate(710, 50)">
              <rect width="240" height="300" rx="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect width="240" height="60" rx="24" fill="#f8fafc" />
              <text x="120" y="38" textAnchor="middle" className="font-bold text-sm fill-slate-400 uppercase tracking-widest">AI Layer (Gemini)</text>
              
              <g transform="translate(20, 80)">
                <rect width="200" height="60" rx="12" fill="url(#grad-purple)" />
                <text x="100" y="35" textAnchor="middle" fill="white" className="font-bold text-sm">Gemini 3.1 Pro</text>
              </g>

              <g transform="translate(20, 150)">
                <rect width="200" height="60" rx="12" fill="url(#grad-purple)" />
                <text x="100" y="35" textAnchor="middle" fill="white" className="font-bold text-sm">Gemini 3 Flash</text>
              </g>

              <g transform="translate(20, 220)">
                <rect width="200" height="60" rx="12" fill="url(#grad-purple)" />
                <text x="100" y="35" textAnchor="middle" fill="white" className="font-bold text-sm">Gemini TTS</text>
              </g>
            </g>

            {/* Data Layer */}
            <g transform="translate(380, 400)">
              <rect width="570" height="250" rx="24" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect width="570" height="60" rx="24" fill="#f8fafc" />
              <text x="285" y="38" textAnchor="middle" className="font-bold text-sm fill-slate-400 uppercase tracking-widest">Data Layer (Firebase)</text>
              
              <g transform="translate(30, 80)">
                <rect width="240" height="140" rx="16" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="120" y="40" textAnchor="middle" className="font-bold text-sm fill-slate-600">Firestore DB</text>
                <text x="40" y="75" className="text-xs fill-slate-500">• Repository Metadata</text>
                <text x="40" y="100" className="text-xs fill-slate-500">• Analysis Cache</text>
                <text x="40" y="125" className="text-xs fill-slate-500">• User Workspaces</text>
              </g>

              <g transform="translate(300, 80)">
                <rect width="240" height="140" rx="16" fill="#f1f5f9" stroke="#e2e8f0" />
                <text x="120" y="40" textAnchor="middle" className="font-bold text-sm fill-slate-600">Security Rules</text>
                <text x="120" y="70" textAnchor="middle" className="text-xs fill-slate-500 italic">Role-based Access</text>
                <text x="120" y="95" textAnchor="middle" className="text-xs fill-slate-500 italic">Data Validation</text>
              </g>
            </g>

            {/* Connections */}
            <g>
              {/* Client to Server */}
              <path d="M 330 200 L 380 200" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="355" y="190" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold">HTTP/WS</text>

              {/* Client to Data */}
              <path d="M 330 500 L 380 500" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="355" y="490" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold">SDK</text>

              {/* Server to AI */}
              <path d="M 660 150 L 710 150" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <text x="685" y="140" textAnchor="middle" className="text-[10px] fill-slate-400 font-bold">API</text>
            </g>
          </svg>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <ArchitectureCard 
            icon={<Layout className="w-5 h-5" />}
            title="Presentation"
            desc="React-based SPA with real-time state synchronization."
          />
          <ArchitectureCard 
            icon={<Server className="w-5 h-5" />}
            title="Orchestration"
            desc="Express server managing API proxying and static delivery."
          />
          <ArchitectureCard 
            icon={<Cpu className="w-5 h-5" />}
            title="Intelligence"
            desc="Multi-modal Gemini models for deep codebase reasoning."
          />
          <ArchitectureCard 
            icon={<Database className="w-5 h-5" />}
            title="Persistence"
            desc="Firestore NoSQL database for scalable metadata storage."
          />
        </div>
      </div>
    </div>
  );
}

function ArchitectureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-6 bg-black/[0.02] rounded-2xl border border-black/5">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-bold mb-2 uppercase tracking-widest text-primary/40">{title}</h3>
      <p className="text-xs text-primary/60 leading-relaxed">{desc}</p>
    </div>
  );
}
