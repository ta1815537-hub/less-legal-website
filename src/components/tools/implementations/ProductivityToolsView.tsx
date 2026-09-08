import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  CheckSquare, Edit3, Clock, Shuffle, Plus, 
  Trash2, Copy, Check, Download, Play, Pause, RotateCcw 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ProductivityToolsViewProps {
  tool: ToolDefinition;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY_CHECKLIST = 'less_creation_checklist_data';
const STORAGE_KEY_SCRATCHPAD = 'less_creation_scratchpad_data';

export const ProductivityToolsView: React.FC<ProductivityToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // 1. Checklist State
  const [tasks, setTasks] = useState<ChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      { id: '1', text: 'Draft agreement review', completed: false },
      { id: '2', text: 'Check court cause list for hearing dates', completed: true },
      { id: '3', text: 'Export client invoice statement', completed: false },
    ];
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  // 2. Scratchpad State
  const [notesContent, setNotesContent] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SCRATCHPAD) || '';
    } catch {
      return '';
    }
  });

  // 3. Timer State
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'stopwatch'>('pomodoro');
  const [timeLeftSec, setTimeLeftSec] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchSec, setStopwatchSec] = useState(0);

  // 4. Random Picker State
  const [pickerItems, setPickerItems] = useState('Option 1\nOption 2\nOption 3\nOption 4');
  const [pickedResult, setPickedResult] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // Save Checklist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Save Scratchpad
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCRATCHPAD, notesContent);
    } catch {}
  }, [notesContent]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (timerMode === 'stopwatch') {
          setStopwatchSec(prev => prev + 1);
        } else {
          setTimeLeftSec(prev => {
            if (prev <= 1) {
              setIsRunning(false);
              playChime();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerMode]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    } catch {}
  };

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTaskInput.trim(), completed: false }]);
    setNewTaskInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Pick Random Item
  const handlePickRandom = () => {
    const list = pickerItems.split('\n').map(i => i.trim()).filter(Boolean);
    if (list.length === 0) return;
    const chosen = list[Math.floor(Math.random() * list.length)];
    setPickedResult(chosen);
  };

  // Format Timer String
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const exportNotes = () => {
    const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">


      {/* 4. Random Picker */}
      {tool.slug === 'random-picker' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enter options (one per line):
            </label>
            <textarea
              rows={5}
              value={pickerItems}
              onChange={(e) => setPickerItems(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-sm font-sans"
            />
          </div>

          <button
            onClick={handlePickRandom}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Shuffle className="w-4 h-4" />
            <span>Pick a Random Winner / Option</span>
          </button>

          {pickedResult && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-in zoom-in-95 duration-200">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Random Choice:</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {pickedResult}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
