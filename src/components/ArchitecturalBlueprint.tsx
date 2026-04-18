import { motion } from "motion/react";
import { Layers, Activity, Box, ArrowRight } from "lucide-react";

interface Blueprint {
  architectureType: string;
  modules: { name: string; purpose: string; keyFiles: string[] }[];
  dataFlow: string;
}

export default function ArchitecturalBlueprint({ blueprint }: { blueprint: Blueprint | null }) {
  if (!blueprint) return null;

  return (
    <div className="flex-1 flex flex-col p-12 max-w-5xl mx-auto w-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-4xl font-serif font-bold">Architectural Blueprint</h2>
        </div>
        <p className="text-primary/60">A high-level overview of the system's design and data flow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-8 bg-accent/5 border-accent/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Architecture Type</h3>
          <p className="text-2xl font-serif font-bold">{blueprint.architectureType}</p>
        </div>
        <div className="md:col-span-2 glass-card p-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary/40 mb-4">Data Flow</h3>
          <p className="text-lg leading-relaxed text-primary/80 italic">"{blueprint.dataFlow}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blueprint.modules.map((module, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black/5 rounded-lg flex items-center justify-center">
                <Box className="w-4 h-4 text-primary/60" />
              </div>
              <h4 className="text-xl font-serif font-bold">{module.name}</h4>
            </div>

            <p className="text-primary/70 mb-8 flex-1 leading-relaxed">{module.purpose}</p>

            <div className="pt-6 border-t border-black/5">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Key Files</h5>
              <div className="flex flex-wrap gap-2">
                {module.keyFiles.map((file, j) => (
                  <code key={j} className="px-2 py-1 bg-black/5 rounded text-[10px] font-mono text-accent">
                    {file.split("/").pop()}
                  </code>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 glass-card bg-black text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Activity className="w-6 h-6 text-accent" />
          <div>
            <h4 className="font-serif font-bold">System Health & Flow</h4>
            <p className="text-sm text-white/60">The core logic is distributed across these modules to ensure scalability.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
          Explore Flow <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
