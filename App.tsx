import React, { useState, useCallback } from 'react';
import { Trophy, RefreshCw, Volume2, VolumeX, Swords, Shuffle, Repeat } from 'lucide-react';
import { GameCard } from './components/GameCard';
import { HistoryLog } from './components/HistoryLog';
import { Team, GameMode, HistoryItem } from './types';

// Helper for UI click sounds (simple beep)
const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors
  }
};

// Helper for TTS
const speakResult = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel any ongoing speech to prevent queueing
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 1.0; // Normal pitch
  
  window.speechSynthesis.speak(utterance);
};

export default function App() {
  const [currentTeam, setCurrentTeam] = useState<Team>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<GameMode>(GameMode.SEQUENTIAL);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate turn number based on history
  const turnCount = history.length;

  const handleReset = () => {
    // Immediate reset without confirmation
    setHistory([]);
    setCurrentTeam(null);
    if (isSoundOn) playClickSound();
  };

  const getNextRandomTeam = (historyData: HistoryItem[]): Team => {
    // 1. Constraint: No more than 3 consecutive same colors (so max streak is 3)
    // If the last 3 were the same, we MUST pick the opposite to prevent a 4th.
    if (historyData.length >= 3) {
      const lastThree = historyData.slice(0, 3); // index 0 is newest
      const allRed = lastThree.every(h => h.team === 'RED');
      const allBlue = lastThree.every(h => h.team === 'BLUE');
      
      if (allRed) return 'BLUE';
      if (allBlue) return 'RED';
    }

    // 2. Constraint: Balanced distribution
    // We look at the last 20 turns.
    const recentHistory = historyData.slice(0, 20);
    const redCount = recentHistory.filter(h => h.team === 'RED').length;
    const blueCount = recentHistory.filter(h => h.team === 'BLUE').length;
    
    // Base probability for Red
    let redChance = 0.5;

    // Adjust probability to restore balance
    const imbalance = redCount - blueCount;
    // Adjustment factor: 5% per unit of imbalance
    redChance -= (imbalance * 0.05);

    // Clamp between 20% and 80% to maintain some randomness
    redChance = Math.max(0.2, Math.min(0.8, redChance));

    return Math.random() < redChance ? 'RED' : 'BLUE';
  };

  const handleAttack = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Play a click sound for immediate feedback
    if (isSoundOn) playClickSound();

    // Small delay to simulate processing/tension
    setTimeout(() => {
      let nextTeam: Team = 'RED';

      if (mode === GameMode.SEQUENTIAL) {
        // Look at the very last result. If null, start Red.
        const lastTeam = history.length > 0 ? history[0].team : null;
        nextTeam = lastTeam === 'RED' ? 'BLUE' : 'RED';
      } else {
        nextTeam = getNextRandomTeam(history);
      }

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        team: nextTeam,
        turnNumber: turnCount + 1
      };

      setCurrentTeam(nextTeam);
      setHistory(prev => [newItem, ...prev]);
      
      // Speak the result
      if (isSoundOn) {
        speakResult(nextTeam === 'RED' ? '빨강 한걸음' : '파랑 한걸음');
      }

      setIsAnimating(false);
    }, 250); // 250ms visual delay for impact
  }, [history, mode, turnCount, isSoundOn, isAnimating]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-sans text-gray-800">
      {/* Header */}
      <header className="flex flex-col items-center mb-8 text-center">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-500 w-8 h-8 fill-current" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 font-jua">한걸음 술래잡기</h1>
        </div>
        {/* Removed subtitle */}
      </header>

      {/* Main Game Area - Increased max-w to 6xl for larger cards */}
      <div className="flex flex-row justify-center items-center gap-4 md:gap-8 w-full max-w-6xl mb-10">
        <GameCard 
          team="RED" 
          isActive={currentTeam === 'RED'} 
          isAnimating={isAnimating && currentTeam === 'RED'}
        />
        <GameCard 
          team="BLUE" 
          isActive={currentTeam === 'BLUE'} 
          isAnimating={isAnimating && currentTeam === 'BLUE'}
        />
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4 border border-gray-100">
        
        {/* Mode Toggles */}
        <div className="flex p-1 bg-gray-100 rounded-xl relative">
          <div 
            className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${mode === GameMode.SEQUENTIAL ? 'left-1' : 'left-[calc(50%-4px)] translate-x-[calc(0%+4px)]'}`}
          />
          <button 
            onClick={() => { if(isSoundOn) playClickSound(); setMode(GameMode.SEQUENTIAL); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold z-10 transition-colors ${mode === GameMode.SEQUENTIAL ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Repeat className="w-4 h-4" />
            순서대로 (교차)
          </button>
          <button 
            onClick={() => { if(isSoundOn) playClickSound(); setMode(GameMode.RANDOM); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold z-10 transition-colors ${mode === GameMode.RANDOM ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Shuffle className="w-4 h-4" />
            랜덤
          </button>
        </div>

        {/* Attack Button */}
        <button
          onClick={handleAttack}
          disabled={isAnimating}
          className={`
            group relative overflow-hidden w-full py-5 rounded-2xl
            bg-gradient-to-r from-red-500 to-blue-600
            hover:from-red-600 hover:to-blue-700
            text-white shadow-lg shadow-blue-200
            transform transition-all duration-150 active:scale-95
            disabled:opacity-80 disabled:cursor-not-allowed
          `}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Swords className={`w-8 h-8 ${isAnimating ? 'animate-spin' : ''}`} />
            <span className="text-3xl font-black font-jua tracking-wide">공격!</span>
          </div>
          {/* Shine effect */}
          <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1s_infinite]" />
        </button>

        {/* Bottom Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => { playClickSound(); setIsSoundOn(!isSoundOn); }}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors ${isSoundOn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
          >
            {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            {isSoundOn ? '음성 켜짐' : '음성 꺼짐'}
          </button>
          <button
            onClick={handleReset}
            className="w-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Reset History"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History */}
      <HistoryLog history={history} />
      
      {/* Inline styles for custom animations that Tailwind standard config might miss */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}