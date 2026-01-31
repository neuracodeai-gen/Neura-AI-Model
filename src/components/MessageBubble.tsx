import React from 'react';
import Markdown from 'react-markdown';
import { cn } from '../utils/cn';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'w-full',
        isUser ? 'bg-transparent' : 'bg-gray-50 dark:bg-gray-900/20'
      )}
    >
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8 py-6 flex gap-4">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border border-gray-200 dark:border-gray-700',
            isUser ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
          )}
        >
          {isUser ? 'U' : 'N'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {isUser ? 'You' : 'Neura'}
            </div>
            <div className="text-[10px] text-gray-400">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div className={cn('w-full', isUser ? 'flex justify-end' : 'flex justify-start')}>
            <div
              className={cn(
                'inline-block max-w-full rounded-2xl px-4 py-3 border shadow-sm',
                isUser
                  ? 'bg-gray-100 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
              )}
            >
              <div className="prose dark:prose-invert max-w-none leading-relaxed break-words">
                <Markdown>{content}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
