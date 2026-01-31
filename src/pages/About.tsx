import React from 'react';
import Layout from '../components/Layout';
import { Bot, Shield, Zap, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12 pb-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-primary-gradient inline-block">
            About MoltBook AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are redefining how you interact with AI through persistent memory and seamless integration.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="text-red-500" /> Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            MoltBook AI aims to provide a personalized, intelligent companion that remembers who you are. 
            By leveraging N8N's powerful workflow automation and local browser storage, we ensure your 
            conversations are meaningful, contextual, and private.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700">
            <Bot className="w-10 h-10 text-cyan-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Intelligent Agent</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Powered by advanced LLMs connected via N8N webhooks for dynamic responses.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700">
            <Zap className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Fast & Responsive</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Built with React, Vite, and Tailwind for a lightning-fast user experience.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700">
            <Shield className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your data and memory are stored locally in your browser.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
               <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">L</div>
               <div>
                 <h4 className="font-bold text-gray-800 dark:text-white">Lead Engineer</h4>
                 <p className="text-sm text-gray-500">Architecture & Strategy</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
               <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">R</div>
               <div>
                 <h4 className="font-bold text-gray-800 dark:text-white">Raptor</h4>
                 <p className="text-sm text-gray-500">Core Logic & State</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
               <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">B</div>
               <div>
                 <h4 className="font-bold text-gray-800 dark:text-white">Bob</h4>
                 <p className="text-sm text-gray-500">UI/UX Design</p>
               </div>
             </div>
             <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
               <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">P</div>
               <div>
                 <h4 className="font-bold text-gray-800 dark:text-white">Panzer</h4>
                 <p className="text-sm text-gray-500">Backend Integration</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
