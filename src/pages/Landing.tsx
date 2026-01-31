import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Shield, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Landing: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-gradient opacity-10 dark:opacity-5 transform -skew-y-6 origin-top-left scale-110" />
        
        <div className="container mx-auto px-6 py-24 relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 p-4 rounded-full bg-white dark:bg-dark-surface shadow-xl inline-block">
            <Bot size={64} className="text-cyan-500" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight">
            MoltBook <span className="text-transparent bg-clip-text bg-primary-gradient">AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Your intelligent companion for seamless conversations. 
            Experience the power of N8N-driven AI with persistent memory.
          </p>
          
          <div className="flex gap-4">
            <Link
              to={isAuthenticated ? "/chat" : "/auth"}
              className="px-8 py-4 bg-primary-gradient text-white text-lg font-bold rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1"
            >
              {isAuthenticated ? "Go to Chat" : "Get Started"}
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={Zap} 
            title="Real-time Interaction" 
            description="Instant responses powered by advanced N8N workflows and high-speed webhooks." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Local Privacy" 
            description="Your data stays in your browser. Local memory management ensures you control your context." 
          />
          <FeatureCard 
            icon={Sparkles} 
            title="Smart Context" 
            description="The AI remembers your last 10 messages and maintains a persistent memory block you can edit." 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
    <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center mb-6 text-white">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default Landing;
