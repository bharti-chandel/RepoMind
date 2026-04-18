import { motion } from "motion/react";
import { Calendar, CheckCircle, BookOpen, Clock } from "lucide-react";

interface OnboardingDay {
  day: number;
  focus: string;
  tasks: string[];
  filesToStudy: string[];
}

export default function OnboardingPath({ path }: { path: OnboardingDay[] }) {
  if (!path.length) return null;

  return (
    <div className="flex-1 flex flex-col p-12 max-w-5xl mx-auto w-full">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-4xl font-serif font-bold">Smart Onboarding Path</h2>
        </div>
        <p className="text-primary/60">A personalized 7-day journey to master this codebase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-12">
        {path.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex flex-col items-center text-center border-accent/10 bg-accent/5"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Day</div>
            <div className="text-3xl font-serif font-black text-accent">{day.day}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-12">
        {path.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12 border-l border-black/5"
          >
            <div className="absolute top-0 left-[-12px] w-6 h-6 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-accent/20">
              {day.day}
            </div>

            <div className="glass-card p-12">
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-bold mb-4">{day.focus}</h3>
                  <div className="space-y-4">
                    {day.tasks.map((task, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                        <p className="text-primary/80 leading-relaxed">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-72 pt-8 md:pt-0 md:pl-12 border-t md:border-t-0 md:border-l border-black/5">
                  <div className="flex items-center gap-2 mb-6 text-primary/40">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Files to Study</span>
                  </div>
                  <div className="space-y-3">
                    {day.filesToStudy.map((file, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                        <code className="text-[10px] font-mono text-accent truncate">{file.split("/").pop()}</code>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-primary/40">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Est. 2-3 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-black text-white rounded-2xl flex flex-col items-center text-center">
        <h4 className="text-2xl font-serif font-bold mb-4">Ready to start?</h4>
        <p className="text-white/60 mb-8 max-w-md">This path is designed to give you a deep understanding of the core architecture and business logic.</p>
        <button className="px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-accent/20">
          Begin Day 1
        </button>
      </div>
    </div>
  );
}
