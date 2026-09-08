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
      {/* 1. Simple Checklist */}
      {tool.slug === 'simple-checklist' && (
        <div className="space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>{completedCount} of {tasks.length} Completed</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder={isHindi ? 'नया काम जोड़ें और Enter दबाएं...' : 'Add a new task and press Enter...'}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-sm focus:outline-blue-500"
            />
            <button
              onClick={addTask}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'जोड़ें' : 'Add'}</span>
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  task.completed
                    ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 opacity-60 line-through'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-white/10 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-white/20'
                  }`}>
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-slate-800 dark:text-slate-200 truncate">{task.text}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setTasks([])}
              className="text-xs text-red-500 hover:underline cursor-pointer"
            >
              Clear All Tasks
            </button>
            <button
              onClick={() => {
                const plain = tasks.map(t => `${t.completed ? '[x]' : '[ ]'} ${t.text}`).join('\n');
                navigator.clipboard.writeText(plain);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied All Tasks' : 'Copy All Tasks'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Quick Notes */}
      {tool.slug === 'quick-notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Auto-saves locally as you type</span>
            <div className="flex items-center gap-3">
              <button onClick={exportNotes} className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                <Download className="w-3 h-3" />
                <span>Export (.txt)</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(notesContent);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={12}
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            placeholder="Jot down quick thoughts, phone numbers, client brief, or code snippets..."
            className="w-full p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-300 dark:border-white/10 text-sm leading-relaxed text-slate-900 dark:text-white placeholder-slate-400 focus:outline-blue-500 font-sans"
          />

          <div className="flex justify-between text-xs text-slate-400">
            <span>Words: {notesContent.trim() ? notesContent.trim().split(/\s+/).length : 0}</span>
            <span>Characters: {notesContent.length}</span>
          </div>
        </div>
      )}

      {/* 3. Focus Timer & Stopwatch */}
      {tool.slug === 'focus-timer' && (
        <div className="space-y-6 text-center">
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-white/5 p-1 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => { setTimerMode('pomodoro'); setTimeLeftSec(25 * 60); setIsRunning(false); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timerMode === 'pomodoro' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => { setTimerMode('shortBreak'); setTimeLeftSec(5 * 60); setIsRunning(false); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timerMode === 'shortBreak' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Break (5m)
            </button>
            <button
              onClick={() => { setTimerMode('stopwatch'); setStopwatchSec(0); setIsRunning(false); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timerMode === 'stopwatch' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Stopwatch
            </button>
          </div>

          <div className="py-6">
            <span className="font-mono text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-wider">
              {timerMode === 'stopwatch' ? formatTimer(stopwatchSec) : formatTimer(timeLeftSec)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3 rounded-full text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                if (timerMode === 'pomodoro') setTimeLeftSec(25 * 60);
                if (timerMode === 'shortBreak') setTimeLeftSec(5 * 60);
                if (timerMode === 'stopwatch') setStopwatchSec(0);
              }}
              className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
