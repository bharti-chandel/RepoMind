import { motion } from "motion/react";

interface Milestone {
  milestone: string;
  description: string;
  impact: string;
}

export default function EvolutionTimeline({ milestones }: { milestones: Milestone[] }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-primary/40">
        <p>No evolution data available yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-12 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-bold mb-4">Code Evolution</h2>
        <p className="text-primary/60">A logical timeline of how this codebase matured.</p>
      </div>

      <div className="relative space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-black/10" />

        {milestones.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12"
          >
            {/* Dot */}
            <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-background border border-black/10 flex items-center justify-center z-10">
              <div className="w-2 h-2 rounded-full bg-accent" />
            </div>

            <div className="glass-card p-6 hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{m.milestone}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 rounded">
                  Milestone {i + 1}
                </span>
              </div>
              <p className="text-primary/70 mb-4 leading-relaxed">{m.description}</p>
              <div className="pt-4 border-t border-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40 block mb-1">Architectural Impact</span>
                <p className="text-sm italic text-primary/60">{m.impact}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
