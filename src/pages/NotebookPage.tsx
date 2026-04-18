import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, doc, getDoc } from "../lib/firebase";
import { Repo, RepoFile } from "../types";
import { 
  ChevronLeft, 
  Layout, 
  MessageSquare, 
  Share2, 
  History, 
  Headphones, 
  FileText, 
  Loader2,
  Play,
  Pause,
  Volume2,
  Download,
  Maximize2,
  Minimize2,
  MapPin,
  Layers,
  Calendar,
  X,
  Code2,
  FileCode,
  Network
} from "lucide-react";
import FileExplorer from "../components/FileExplorer";
import ChatInterface from "../components/ChatInterface";
import KnowledgeGraph from "../components/KnowledgeGraph";
import EvolutionTimeline from "../components/EvolutionTimeline";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import { generateRepoReport, generateAudioOverview, generateCodeEvolution, generateAudio, generateGuidedTour, generateArchitecturalBlueprint, generateOnboardingPath } from "../services/gemini";
import ReactMarkdown from "react-markdown";
import GuidedTour from "../components/GuidedTour";
import ArchitecturalBlueprint from "../components/ArchitecturalBlueprint";
import OnboardingPath from "../components/OnboardingPath";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function NotebookPage() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<"chat" | "graph" | "report" | "evolution" | "audio" | "tour" | "blueprint" | "onboarding" | "explorer" | "architecture">("chat");
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const [report, setReport] = useState<string>("");
  const [audioScript, setAudioScript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tourSteps, setTourSteps] = useState<any[]>([]);
  const [blueprintData, setBlueprintData] = useState<any>(null);
  const [onboardingPath, setOnboardingPath] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to clean transcript
  const cleanTranscript = (text: string) => {
    return text
      .replace(/[#*`~_-]/g, '') // Remove common markdown symbols
      .replace(/^>\s*/gm, '') // Remove blockquote markers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  useEffect(() => {
    async function fetchRepo() {
      if (!repoId) return;
      const docRef = doc(db, "repos", repoId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRepo({ id: docSnap.id, ...docSnap.data() } as Repo);
      }
      setLoading(false);
    }
    fetchRepo();
  }, [repoId]);

  const handleGenerateReport = async () => {
    if (!repo) return;
    setActiveTool("report");
    if (report) return;
    setIsGenerating(true);
    const res = await generateRepoReport(repo.name, (repo as any).files);
    setReport(res || "Failed to generate report.");
    setIsGenerating(false);
  };

  const handleGenerateAudio = async () => {
    if (!repo) return;
    setActiveTool("audio");
    if (audioUrl) return;
    setIsGenerating(true);
    try {
      const script = await generateAudioOverview(repo.name, (repo as any).files);
      setAudioScript(script || "");
      if (script) {
        const base64Audio = await generateAudio(script);
        if (base64Audio) {
          // Gemini TTS returns raw PCM 16-bit, 24kHz
          const binary = atob(base64Audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          
          // Convert PCM to WAV for <audio> tag compatibility
          const wavHeader = createWavHeader(bytes.length, 24000);
          const wavBlob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
          const url = URL.createObjectURL(wavBlob);
          setAudioUrl(url);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Helper to create WAV header for raw PCM
  function createWavHeader(dataLength: number, sampleRate: number) {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
    
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + dataLength, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, dataLength, true);
    
    return buffer;
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const handleGenerateEvolution = async () => {
    if (!repo) return;
    setActiveTool("evolution");
    if (milestones.length > 0) return;
    setIsGenerating(true);
    const res = await generateCodeEvolution(repo.name, (repo as any).files);
    setMilestones(res || []);
    setIsGenerating(false);
  };

  const handleGenerateOnboarding = async () => {
    if (!repo) return;
    setActiveTool("onboarding");
    if (onboardingPath.length > 0) return;
    setIsGenerating(true);
    const res = await generateOnboardingPath(repo.name, (repo as any).files);
    setOnboardingPath(res || []);
    setIsGenerating(false);
  };

  const handleGenerateBlueprint = async () => {
    if (!repo) return;
    setActiveTool("blueprint");
    if (blueprintData) return;
    setIsGenerating(true);
    const res = await generateArchitecturalBlueprint(repo.name, (repo as any).files);
    setBlueprintData(res);
    setIsGenerating(false);
  };

  const handleGenerateTour = async () => {
    if (!repo) return;
    setActiveTool("tour");
    if (tourSteps.length > 0) return;
    setIsGenerating(true);
    const res = await generateGuidedTour(repo.name, (repo as any).files);
    setTourSteps(res || []);
    setIsGenerating(false);
  };

  const handleExportReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repo?.name || "repo"}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isImage = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-serif font-bold mb-4">Notebook not found</h2>
        <button onClick={() => navigate("/dashboard")} className="notebook-btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-background relative">
      {/* Mobile Header */}
      <div className="md:hidden h-14 border-b border-black/5 flex items-center justify-between px-4 bg-white z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-black/5 rounded-lg">
          <Layout className="w-5 h-5" />
        </button>
        <h3 className="font-serif font-bold truncate">{repo.name}</h3>
        <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 hover:bg-black/5 rounded-lg">
          <Layers className="w-5 h-5" />
        </button>
      </div>

      {/* Left Sidebar: File Explorer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-black/5 flex flex-col bg-white transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-black/5 flex items-center gap-3">
          <button 
            onClick={() => navigate("/dashboard")} 
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold truncate text-lg">{repo.name}</h3>
            <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold">Workspace</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 hover:bg-black/5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 px-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Filesystem</h4>
            <FileExplorer 
              files={(repo as any).files} 
              onSelectFile={(f) => {
                setSelectedFile(f);
                setIsSidebarOpen(false);
              }} 
              selectedFile={selectedFile}
            />
          </div>
        </div>
      </aside>

      {/* Sidebar Overlays */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsRightSidebarOpen(false)} />}

      {/* Main Content: Chat or Tool View */}
      <main className="flex-1 flex flex-col relative bg-white overflow-hidden">
        {selectedFile && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col">
            <div className="h-16 border-b border-black/5 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <FileCode className="w-4 h-4 text-accent" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-primary truncate">{selectedFile.path.split('/').pop()}</h3>
                  <p className="text-[10px] text-primary/40 font-mono uppercase tracking-widest truncate">{selectedFile.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-4 mr-4 text-[10px] font-mono text-primary/40 border-r border-black/5 pr-4">
                  <span>SIZE: {formatSize(selectedFile.size)}</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.content || "");
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary/60 transition-colors"
                >
                  <Download className="w-3 h-3" /> Copy
                </button>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-primary/40" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#1e1e1e] flex flex-col">
              {isImage(selectedFile.path) ? (
                <div className="flex-1 flex items-center justify-center p-8 bg-white/5">
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.path} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <SyntaxHighlighter 
                  language={selectedFile.path.split('.').pop() || 'javascript'} 
                  style={vscDarkPlus}
                  customStyle={{ 
                    margin: 0, 
                    padding: '1.5rem', 
                    minHeight: '100%', 
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}
                  showLineNumbers
                >
                  {selectedFile.content || ""}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-accent mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-2">Analyzing Repository</h2>
            <p className="text-primary/60 max-w-sm">
              Indexing repository structure for architectural analysis. This may take a moment.
            </p>
          </div>
        ) : activeTool === "chat" ? (
          <ChatInterface repo={repo} selectedFile={selectedFile} />
        ) : activeTool === "graph" ? (
          <KnowledgeGraph files={(repo as any).files} />
        ) : activeTool === "evolution" ? (
          <EvolutionTimeline milestones={milestones} />
        ) : activeTool === "tour" ? (
          <GuidedTour steps={tourSteps} />
        ) : activeTool === "blueprint" ? (
          <ArchitecturalBlueprint blueprint={blueprintData} />
        ) : activeTool === "onboarding" ? (
          <OnboardingPath path={onboardingPath} />
        ) : activeTool === "architecture" ? (
          <ArchitectureDiagram />
        ) : activeTool === "report" ? (
          <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full custom-scrollbar">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-serif font-bold mb-4">Repository Report</h1>
                <p className="text-primary/60">A comprehensive architectural overview of {repo.name}.</p>
              </div>
              <button 
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <Download className="w-4 h-4" /> Export MD
              </button>
            </div>
            <div className="prose-report">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </div>
        ) : activeTool === "explorer" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
            <div className="w-20 h-20 bg-accent/5 rounded-3xl flex items-center justify-center mb-8">
              <Code2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4">Code Explorer</h2>
            <p className="text-primary/60 max-w-md mb-8">
              Select any file from the sidebar to explore its source code in detail with syntax highlighting.
            </p>
            <div className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl border border-black/5">
              <FileCode className="w-4 h-4 text-primary/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary/40">Ready for inspection</span>
            </div>
          </div>
        ) : activeTool === "audio" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 max-w-4xl mx-auto w-full">
            <div className="w-full glass-card p-12 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-accent/5 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
                <Headphones className="w-10 h-10 text-accent" />
              </div>
              
              <h2 className="text-4xl font-serif font-bold mb-4">Audio Overview</h2>
              <p className="text-primary/60 mb-12 max-w-md">
                Listen to a professional explanation of your codebase. Perfect for onboarding or quick reviews.
              </p>

              {/* Audio Player UI */}
              <div className="w-full max-w-md bg-black/5 rounded-2xl p-6 mb-12">
                <audio 
                  ref={audioRef} 
                  src={audioUrl || ""} 
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Now Playing</span>
                  <Volume2 className="w-4 h-4 text-primary/40" />
                </div>
                <div className="h-1 w-full bg-black/10 rounded-full mb-6 overflow-hidden">
                  <div className={`h-full bg-accent rounded-full ${isPlaying ? 'w-full transition-all duration-[60s] ease-linear' : 'w-0'}`} />
                </div>
                <div className="flex items-center justify-center gap-8">
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <History className="w-5 h-5 text-primary/60" />
                  </button>
                  <button 
                    onClick={togglePlayback}
                    className="w-14 h-14 bg-ink text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <Download className="w-5 h-5 text-primary/60" />
                  </button>
                </div>
              </div>

              <div className="w-full text-left">
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-4">Transcript</h3>
                <div className="p-6 bg-black/5 rounded-xl text-sm text-primary/70 leading-relaxed italic">
                  {cleanTranscript(audioScript)}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Right Sidebar: Tools */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 border-l border-black/5 flex flex-col bg-white transition-transform duration-300 md:relative md:translate-x-0
        ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Knowledge Tools</h3>
          <button onClick={() => setIsRightSidebarOpen(false)} className="md:hidden p-2 hover:bg-black/5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <ToolButton 
            icon={<MessageSquare className="w-4 h-4" />} 
            label="Chat with Code" 
            active={activeTool === "chat"} 
            onClick={() => { setActiveTool("chat"); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Share2 className="w-4 h-4" />} 
            label="Knowledge Graph" 
            active={activeTool === "graph"} 
            onClick={() => { setActiveTool("graph"); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<FileText className="w-4 h-4" />} 
            label="Repository Report" 
            active={activeTool === "report"} 
            onClick={() => { handleGenerateReport(); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<MapPin className="w-4 h-4" />} 
            label="Guided Tour" 
            active={activeTool === "tour"} 
            onClick={() => { handleGenerateTour(); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Layers className="w-4 h-4" />} 
            label="Blueprint" 
            active={activeTool === "blueprint"} 
            onClick={() => { handleGenerateBlueprint(); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Calendar className="w-4 h-4" />} 
            label="Onboarding" 
            active={activeTool === "onboarding"} 
            onClick={() => { handleGenerateOnboarding(); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Network className="w-4 h-4" />} 
            label="Architecture" 
            active={activeTool === "architecture"} 
            onClick={() => { setActiveTool("architecture"); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<History className="w-4 h-4" />} 
            label="Code Evolution" 
            active={activeTool === "evolution"} 
            onClick={() => { handleGenerateEvolution(); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Code2 className="w-4 h-4" />} 
            label="Code Explorer" 
            active={activeTool === "explorer"} 
            onClick={() => { setActiveTool("explorer"); setIsRightSidebarOpen(false); }} 
          />
          <ToolButton 
            icon={<Headphones className="w-4 h-4" />} 
            label="Audio Overview" 
            active={activeTool === "audio"} 
            onClick={() => { handleGenerateAudio(); setIsRightSidebarOpen(false); }} 
          />
        </div>

        <div className="p-6 border-t border-black/5">
          <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">System Status</h4>
            </div>
            <p className="text-[10px] text-primary/60 leading-tight">
              System is processing workspace data for architectural mapping.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ToolButton({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
        active 
          ? "bg-ink text-white shadow-lg shadow-black/10" 
          : "hover:bg-black/5 text-primary/60"
      }`}
    >
      <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-white/10" : "bg-black/5 group-hover:bg-black/10"}`}>
        {icon}
      </div>
      <span className="hidden md:block text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
