import { motion } from "motion/react";
import { 
  Sparkles, 
  Headphones, 
  FileText, 
  Terminal, 
  Code2, 
  BookOpen, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Quote
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-8 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-[56px] md:text-[84px] font-display font-medium mb-8 tracking-tight text-primary leading-[1.1]">
            Understand your <span className="bg-gradient-to-r from-[#4ADE80] to-[#3B82F6] bg-clip-text text-transparent">Codebase</span>
          </h1>
          <p className="text-[17px] md:text-[19px] text-secondary mb-12 font-sans max-w-2xl mx-auto leading-relaxed">
            Your technical research and thinking partner, grounded in your repository's code, built with the latest Gemini models.
          </p>
          
          <Link 
            to="/dashboard"
            className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-black/80 transition-all text-[15px] inline-block"
          >
            Try RepoMind
          </Link>
        </motion.div>
      </section>

      {/* Use Case Section */}
      <section className="w-full max-w-7xl px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[42px] font-display font-medium text-primary mb-4">How people are using RepoMind</h2>
          <p className="text-secondary text-[17px] max-w-2xl mx-auto">Transforming the way developers interact with complex codebases.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <UseCaseCard 
            icon={<Terminal className="w-6 h-6" />}
            title="Rapid Onboarding"
            description="New to a project? Upload the repository and get a detailed explanation of the architecture, key modules, and setup process in minutes instead of days."
            color="bg-blue-50 text-blue-600"
          />
          <UseCaseCard 
            icon={<Code2 className="w-6 h-6" />}
            title="Deep Code Analysis"
            description="Understand complex logic flows and identify potential side effects of changes across the entire codebase with deep architectural insights."
            color="bg-green-50 text-green-600"
          />
          <UseCaseCard 
            icon={<BookOpen className="w-6 h-6" />}
            title="Auto-Documentation"
            description="Generate comprehensive, implementation-accurate documentation, READMEs, and API guides directly from your source code."
            color="bg-purple-50 text-purple-600"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-display font-medium text-primary mb-4">Trusted by developers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="RepoMind has completely changed how I approach code reviews. I can now see the 'big picture' impact of every PR instantly."
              author="Sarah Chen"
              role="Senior Engineer @ TechFlow"
            />
            <TestimonialCard 
              quote="The Audio Overview feature is a game-changer for my morning commute. I listen to codebase deep-dives and arrive ready to code."
              author="Marcus Thorne"
              role="Fullstack Developer"
            />
            <TestimonialCard 
              quote="Onboarding new hires used to take weeks. With RepoMind, they're contributing meaningful code in their first 48 hours."
              author="Elena Rodriguez"
              role="Engineering Manager"
            />
          </div>
        </div>
      </section>

      {/* Standard SaaS Footer */}
      <footer className="w-full bg-white border-t border-black/[0.05] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-display text-lg font-medium tracking-tight text-primary">RepoMind</span>
              </Link>
              <p className="text-secondary text-[15px] max-w-xs mb-6">
                The intelligent technical partner that understands your codebase as well as you do.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-secondary hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
                <Link to="#" className="text-secondary hover:text-primary transition-colors"><Github className="w-5 h-5" /></Link>
                <Link to="#" className="text-secondary hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-semibold text-primary mb-6">Product</h4>
              <ul className="space-y-4 text-[15px] text-secondary">
                <li><Link to="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-primary mb-6">Company</h4>
              <ul className="space-y-4 text-[15px] text-secondary">
                <li><Link to="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-semibold text-primary mb-6">Legal</h4>
              <ul className="space-y-4 text-[15px] text-secondary">
                <li><Link to="#" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-black/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary text-sm">© 2026 RepoMind. All rights reserved.</p>
            <div className="flex items-center gap-2 text-secondary text-sm">
              <Mail className="w-4 h-4" />
              <span>support@repomind.ai</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function UseCaseCard({ icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <div className="bg-white p-8 rounded-[24px] border border-black/[0.03] shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-[20px] font-display font-semibold text-primary mb-3">{title}</h3>
      <p className="text-secondary leading-relaxed text-[15px]">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="bg-white p-8 rounded-[24px] border border-black/[0.03] relative">
      <Quote className="w-8 h-8 text-black/[0.05] absolute top-6 right-8" />
      <p className="text-primary text-[16px] leading-relaxed mb-8 italic">"{quote}"</p>
      <div>
        <h5 className="font-display font-semibold text-primary">{author}</h5>
        <p className="text-secondary text-sm">{role}</p>
      </div>
    </div>
  );
}
