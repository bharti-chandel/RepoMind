import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, MapPin, Info } from "lucide-react";

interface TourStep {
  step: number;
  title: string;
  filePath: string;
  explanation: string;
}

export default function GuidedTour({ steps }: { steps: TourStep[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps.length) return null;

  const step = steps[currentStep];

  return (
    <div className="flex-1 flex flex-col p-12 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-serif font-bold mb-2">Interactive Guided Tour</h2>
        <p className="text-primary/60">A curated journey through the most important parts of the codebase.</p>
      </div>

      <div className="glass-card p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl font-serif font-black text-black/[0.03] select-none">
          {step.step}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-2xl font-serif font-bold">{step.title}</h3>
            </div>

            <div className="bg-black/5 rounded-xl p-4 mb-8 flex items-center gap-3 border border-black/5">
              <code className="text-sm font-mono text-accent">{step.filePath}</code>
            </div>

            <div className="prose prose-stone max-w-none mb-12">
              <p className="text-lg leading-relaxed text-primary/80">{step.explanation}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-8 border-t border-black/5">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/40 hover:text-primary disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? "w-8 bg-accent" : "w-2 bg-black/10"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/40 hover:text-primary disabled:opacity-20 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4 p-6 bg-accent/5 rounded-2xl border border-accent/10">
        <Info className="w-5 h-5 text-accent mt-0.5" />
        <p className="text-sm text-accent/80 leading-relaxed">
          <strong>Tip:</strong> You can find these files in the explorer on the left to explore the code in detail while following the tour.
        </p>
      </div>
    </div>
  );
}
