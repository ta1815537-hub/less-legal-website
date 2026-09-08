import React, { useState, useMemo } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  Copy, Check, Trash2, ArrowUpDown, Sparkles, 
  GitCompare, Search, RefreshCw, FileText, Clock, Mic, AlignLeft 
} from 'lucide-react';
import { usageLimitService } from '../../../services/usageLimitService';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  analyzeText, 
  convertTextCase, 
  compareTextLines, 
  TextMetrics 
} from '../../../services/toolEngine/textEngine';

interface TextToolsViewProps {
  tool: ToolDefinition;
}

export const TextToolsView: React.FC<TextToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [textInput, setTextInput] = useState('');
  const [textInput2, setTextInput2] = useState(''); // For text diff comparison
  const [findWord, setFindWord] = useState('');
  const [replaceWord, setReplaceWord] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text Metrics using Unicode Intl.Segmenter textEngine
  const metrics: TextMetrics = useMemo(() => {
    return analyzeText(textInput);
  }, [textInput]);

  // Diff lines computation
  const diffLines = useMemo(() => {
    if (tool.slug !== 'text-diff') return [];
    return compareTextLines(textInput, textInput2);
  }, [tool.slug, textInput, textInput2]);

  // Case Conversion handlers
  const handleCaseConvert = (mode: 'upper' | 'lower' | 'title' | 'sentence') => {
    const converted = convertTextCase(textInput, mode);
    setTextInput(converted);
    setStatusMessage(`Converted to ${mode.toUpperCase()} case.`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  // Clean Text Operations
  const removeExtraSpaces = () => {
    const cleaned = textInput
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(line => line.length > 0)
      .join('\n');
    setTextInput(cleaned);
    setStatusMessage(isHindi ? 'अतिरिक्त स्पेस हटा दिए गए!' : 'Extra spaces cleaned up!');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const removeDuplicateLines = () => {
    const lines = textInput.split(/\r?\n/);
    const unique = Array.from(new Set(lines));
    const removedCount = lines.length - unique.length;
    setTextInput(unique.join('\n'));
    setStatusMessage(isHindi ? `${removedCount} डुप्लीकेट लाइनें हटाई गईं!` : `Removed ${removedCount} duplicate line(s)!`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const sortLines = (ascending: boolean = true) => {
    const lines = textInput.split(/\r?\n/).filter(l => l.trim().length > 0);
    lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a));
    setTextInput(lines.join('\n'));
    setStatusMessage(`Sorted ${lines.length} lines ${ascending ? 'A to Z' : 'Z to A'}.`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleFindReplace = () => {
    if (!findWord) return;
    const escaped = findWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    const matchCount = (textInput.match(regex) || []).length;
    const replaced = textInput.replace(regex, replaceWord);
    setTextInput(replaced);
    setStatusMessage(`Replaced ${matchCount} occurrence(s) of "${findWord}".`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. WORD COUNTER & STATS */}
      {tool.slug === 'word-counter' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Words</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">{metrics.words}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Characters</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">{metrics.characters}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">No Spaces</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">{metrics.charactersNoSpaces}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Lines</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">{metrics.lines}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Read Time
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">~{metrics.readingTimeMinutes}m</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Mic className="w-3 h-3" /> Speak Time
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200">~{metrics.speakingTimeMinutes}m</span>
          </div>
        </div>
      )}

      {/* 2. CASE CONVERTER QUICK BUTTONS */}
      {tool.slug === 'case-converter' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCaseConvert('upper')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => handleCaseConvert('lower')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            lowercase
          </button>
          <button
            onClick={() => handleCaseConvert('title')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            Title Case
          </button>
          <button
            onClick={() => handleCaseConvert('sentence')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            Sentence case
          </button>
          <button
            onClick={() => setTextInput(toCamelCase(textInput))}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            camelCase
          </button>
          <button
            onClick={() => setTextInput(toSnakeCase(textInput))}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            snake_case
          </button>
          <button
            onClick={() => setTextInput(toKebabCase(textInput))}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors"
          >
            kebab-case
          </button>
        </div>
      )}

      {/* 3. CLEAN & SORT BUTTONS */}
      {(tool.slug === 'clean-text' || tool.slug === 'sort-lines' || tool.slug === 'remove-duplicate-lines') && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={removeExtraSpaces}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {isHindi ? 'अतिरिक्त स्पेस हटाएं' : 'Trim & Normalize Spaces'}
          </button>
          <button
            onClick={removeDuplicateLines}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {isHindi ? 'डुप्लीकेट लाइनें हटाएं' : 'Remove Duplicate Lines'}
          </button>
          <button
            onClick={() => sortLines(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            Sort Lines (A-Z)
          </button>
          <button
            onClick={() => sortLines(false)}
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            Sort Lines (Z-A)
          </button>
        </div>
      )}

      {/* 4. FIND & REPLACE CONTROLS */}
      {tool.slug === 'find-replace' && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Find text
              </label>
              <input
                type="text"
                value={findWord}
                onChange={(e) => setFindWord(e.target.value)}
                placeholder="Enter word to find..."
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Replace with
              </label>
              <input
                type="text"
                value={replaceWord}
                onChange={(e) => setReplaceWord(e.target.value)}
                placeholder="Replace with..."
                className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={handleFindReplace}
            disabled={!findWord}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            Replace All
          </button>
        </div>
      )}

      {/* 5. TEXT INPUT / OUTPUT AREA */}
      {tool.slug === 'text-diff' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Text (Before)
              </label>
              <textarea
                rows={8}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Modified Text (After)
              </label>
              <textarea
                rows={8}
                value={textInput2}
                onChange={(e) => setTextInput2(e.target.value)}
                placeholder="Paste updated text here..."
                className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Real Line-by-Line Diff Result */}
          {diffLines.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto space-y-1 border border-slate-800">
              <div className="text-[11px] font-sans font-bold text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>Line-by-Line Difference</span>
                <span className="text-emerald-400">+ Added</span>
                <span className="text-red-400">- Removed</span>
              </div>
              {diffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`py-0.5 px-2 rounded flex gap-3 ${
                    line.type === 'added'
                      ? 'bg-emerald-950/60 text-emerald-300 border-l-2 border-emerald-500'
                      : line.type === 'removed'
                      ? 'bg-red-950/60 text-red-300 border-l-2 border-red-500'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="w-6 shrink-0 text-slate-600 select-none text-right">
                    {line.lineNumberNew || line.lineNumberOriginal || idx + 1}
                  </span>
                  <span className="w-4 shrink-0 font-bold select-none">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span className="whitespace-pre-wrap">{line.text || ' '}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isHindi ? 'टेक्स्ट दर्ज करें:' : 'Enter or paste your text:'}
            </label>
            <div className="flex items-center gap-2">
              {textInput && (
                <button
                  onClick={() => copyToClipboard(textInput)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy Text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
              {textInput && (
                <button
                  onClick={() => setTextInput('')}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs flex items-center gap-1 cursor-pointer"
                  title="Clear Text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={10}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type or paste your content here in English, Hindi, or any language..."
            className="w-full p-4 text-sm font-sans rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed"
          />
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
