import React from 'react';
import { HistoryItem } from '../types';

interface HistoryLogProps {
  history: HistoryItem[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  // Take only the last 6 items for display, reversed to show newest first from left to right if desired, 
  // but usually "History" implies newest on left or right. 
  // Based on the screenshot "이전 순서 (최신순)", it implies Newest -> Oldest.
  
  const displayHistory = [...history].slice(0, 7); 

  return (
    <div className="w-full flex flex-col items-center space-y-4 mt-8">
      <span className="text-gray-500 font-semibold text-sm">이전 순서 (최신순)</span>
      
      {history.length === 0 ? (
        <div className="h-10 text-gray-400 text-sm flex items-center">기록이 없습니다</div>
      ) : (
        <div className="flex gap-3 justify-center flex-wrap px-4">
          {displayHistory.map((item, index) => (
            <div
              key={item.id}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md transition-all
                ${item.team === 'RED' ? 'bg-red-500' : 'bg-blue-500'}
                ${index === 0 ? 'scale-110 ring-2 ring-offset-2 ring-gray-300' : 'opacity-80'}
              `}
            >
              {item.turnNumber}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
