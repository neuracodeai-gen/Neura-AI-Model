import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateProfile } from '../store/userSlice';
import { setMemory } from '../store/chatSlice';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const user = useSelector((state: RootState) => state.user);
  const memory = useSelector((state: RootState) => state.chat.memory);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    about: '',
    customInstructions: '',
    memory: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: user.username,
        email: user.email,
        about: user.about,
        customInstructions: user.customInstructions,
        memory: memory
      });
    }
  }, [isOpen, user, memory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({
      username: formData.username,
      email: formData.email,
      about: formData.about,
      customInstructions: formData.customInstructions
    }));
    dispatch(setMemory(formData.memory));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-primary-gradient">
            Settings
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Me</label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all min-h-[80px]"
              placeholder="Tell the AI about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Instructions</label>
            <textarea
              value={formData.customInstructions}
              onChange={(e) => setFormData({...formData, customInstructions: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all min-h-[80px]"
              placeholder="How would you like the AI to respond?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Core Memory</label>
            <textarea
              value={formData.memory}
              onChange={(e) => setFormData({...formData, memory: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all min-h-[100px] font-mono text-sm"
              placeholder="Long-term memory context..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
