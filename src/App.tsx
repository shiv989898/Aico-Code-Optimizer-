import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Zap, CheckCircle2, Activity, ChevronRight, Copy, Check, Sparkles, TerminalSquare, BookOpen, TestTube, Trash2, ArrowRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Language = 'C++' | 'Python' | 'Java';
type Action = 'optimize' | 'explain' | 'tests';

interface OptimizationResult {
  optimizedCode: string;
  improvements: string[];
  complexityAnalysis: string;
}

const Editor = ({ code, setCode, language, actionLabel }: { code: string, setCode: (c: string) => void, language: string, actionLabel: string }) => {
  const lineCount = code.split('\n').length;
  const displayLines = Math.max(10, lineCount);
  const lines = Array.from({ length: displayLines }, (_, i) => i + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#050505]/80 relative group min-h-0">
      <div 
        ref={lineNumbersRef}
        className="w-10 sm:w-12 flex-shrink-0 bg-[#020202] border-r border-white/5 text-right pr-2 sm:pr-3 py-3 sm:py-5 font-mono text-[11px] sm:text-[13px] leading-relaxed text-neutral-700 select-none overflow-hidden"
      >
        {lines.map(line => (
          <div key={line} className={line > lineCount && code !== '' ? 'opacity-0' : ''}>{line}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onScroll={handleScroll}
        placeholder={`// Paste your ${language} code here...\n\nfunction example() {\n  // Needs ${actionLabel.toLowerCase()}\n}`}
        className="flex-1 bg-transparent resize-none p-3 sm:p-5 text-[12px] sm:text-[13px] leading-relaxed font-mono text-neutral-300 placeholder:text-neutral-700 focus:outline-none custom-scrollbar"
        spellCheck={false}
      />
    </div>
  );
};

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('C++');
  const [action, setAction] = useState<Action>('optimize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!code.trim()) {
      setError('Please enter some code first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, action }),
      });

      const text = await response.text();
      
      if (!response.ok) {
        let errorMessage = 'Failed to process code';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}): ${text.slice(0, 50)}...`;
        }
        throw new Error(errorMessage);
      }

      try {
        const data: OptimizationResult = JSON.parse(text);
        setResult(data);
      } catch (e) {
        throw new Error(`Invalid response format: ${text.slice(0, 50)}...`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.optimizedCode) {
      navigator.clipboard.writeText(result.optimizedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSyntaxLanguage = (lang: Language) => {
    switch (lang) {
      case 'C++': return 'cpp';
      case 'Python': return 'python';
      case 'Java': return 'java';
      default: return 'javascript';
    }
  };

  const actionConfig = {
    optimize: { icon: Zap, label: 'Optimize', color: 'text-emerald-400', bg: 'from-emerald-400/20', border: 'border-emerald-400/20' },
    explain: { icon: BookOpen, label: 'Explain', color: 'text-blue-400', bg: 'from-blue-400/20', border: 'border-blue-400/20' },
    tests: { icon: TestTube, label: 'Tests', color: 'text-purple-400', bg: 'from-purple-400/20', border: 'border-purple-400/20' }
  };

  const CurrentIcon = actionConfig[action].icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-dvh w-screen bg-[#000000] text-white font-sans overflow-hidden flex flex-col relative selection:bg-white/20 selection:text-white">
      {/* Beautiful Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500 opacity-[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500 opacity-[0.015] blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="h-14 sm:h-16 border-b border-white/10 bg-[#000000]/60 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 lg:px-6 z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-sm shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-bold font-display tracking-tight text-white leading-none">AICO</h1>
            <p className="text-[8px] sm:text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] mt-1">Studio</p>
          </div>
        </div>
        
        {/* Action Selector - Centered */}
        <div className="flex justify-center flex-none">
          <div className="flex ios-glass-panel rounded-full p-1 border border-white/10 shadow-inner">
            {(Object.keys(actionConfig) as Action[]).map((a) => {
              const Icon = actionConfig[a].icon;
              const isActive = action === a;
              return (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-full transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAction"
                      className="absolute inset-0 ios-glass-btn rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10 shrink-0" />
                  <span className="relative z-10">{actionConfig[a].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status - Right aligned */}
        <div className="flex items-center justify-end gap-4 text-sm text-neutral-400 font-mono flex-1 hidden md:flex">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md text-[10px] uppercase tracking-wider shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            System Online
          </span>
        </div>
      </header>

      {/* Main Content - Stretched Layout */}
      <main className="flex-1 flex flex-col lg:flex-row w-full p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 lg:gap-6 relative z-10 overflow-hidden">
        
        {/* Left Pane: Editor */}
        <section className="flex-1 lg:w-1/2 flex flex-col rounded-xl sm:rounded-2xl border border-white/10 bg-[#050505]/60 backdrop-blur-md overflow-hidden shadow-2xl relative group min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#0a0a0a]/80 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <TerminalSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 shrink-0" />
              <h2 className="text-[10px] sm:text-xs font-mono text-neutral-300 uppercase tracking-wider truncate">Input Source</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex ios-glass-panel rounded-lg p-0.5">
                {(['C++', 'Python', 'Java'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-mono rounded transition-all ${
                      language === lang
                        ? 'ios-glass-btn text-white'
                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-white/10 mx-0.5 sm:mx-1"></div>
              <button
                onClick={() => setCode('')}
                className="ios-glass-btn text-neutral-500 hover:text-red-400 p-1.5 sm:p-2 rounded-lg group"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Editor Component */}
          <Editor code={code} setCode={setCode} language={language} actionLabel={actionConfig[action].label} />

          {/* Footer / Action Button */}
          <div className="p-2 sm:p-4 border-t border-white/10 bg-[#0a0a0a]/80 shrink-0">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-2 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-mono flex items-start gap-2 overflow-hidden"
                >
                  <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleProcess}
              disabled={isProcessing || !code.trim()}
              className={`w-full py-2.5 sm:py-3.5 px-4 font-display font-semibold rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base ${
                isProcessing || !code.trim()
                  ? 'ios-glass-btn opacity-50 cursor-not-allowed text-neutral-400'
                  : 'ios-glass-btn-primary'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CurrentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {actionConfig[action].label} Code
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 opacity-50" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right Pane: Results */}
        <section className="flex-1 lg:w-1/2 flex flex-col rounded-xl sm:rounded-2xl border border-white/10 bg-[#050505]/60 backdrop-blur-md overflow-hidden shadow-2xl relative min-h-0">
          <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-white/10 bg-[#0a0a0a]/80 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Activity className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${actionConfig[action].color} shrink-0`} />
              <h2 className="text-[10px] sm:text-xs font-mono text-neutral-300 uppercase tracking-wider truncate">Output & Analysis</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6 bg-[#050505]/40 min-h-0">
            <AnimatePresence mode="wait">
              {!result && !isProcessing ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col items-center justify-center text-neutral-600"
                >
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border border-white/5 bg-[#0a0a0a] flex items-center justify-center mb-3 sm:mb-5 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                    <Code2 className="w-5 h-5 sm:w-8 sm:h-8 text-neutral-700 relative z-10" />
                  </div>
                  <p className="font-mono text-[11px] sm:text-sm text-neutral-500">Awaiting source code...</p>
                  <p className="font-sans text-[10px] sm:text-xs text-neutral-600 mt-2 max-w-[250px] text-center px-4 hidden sm:block">
                    Enter your code in the left pane and click process to see the magic happen.
                  </p>
                </motion.div>
              ) : isProcessing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="relative mb-4 sm:mb-8">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 border border-white/10 rounded-2xl sm:rounded-3xl bg-[#0a0a0a] flex items-center justify-center shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                       <div className={`w-5 h-5 sm:w-8 sm:h-8 border-2 ${actionConfig[action].color} rounded-full border-t-transparent animate-spin relative z-10`}></div>
                    </div>
                    {/* Glow effect behind spinner */}
                    <div className={`absolute inset-0 blur-2xl opacity-20 bg-gradient-to-br ${actionConfig[action].bg} rounded-full`}></div>
                  </div>
                  <p className={`font-mono text-[10px] sm:text-sm ${actionConfig[action].color} animate-pulse tracking-wide text-center px-4`}>Analyzing AST & processing logic...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-3 sm:gap-6 pb-2 sm:pb-4"
                >
                  {/* Output Code Block */}
                  {result.optimizedCode && (
                    <motion.div variants={itemVariants} className="flex flex-col rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-xl shrink-0">
                      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/5 bg-[#050505]">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                          <span className="ml-2 sm:ml-3 text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-widest truncate">output.{getSyntaxLanguage(language)}</span>
                        </div>
                        <button
                          onClick={copyToClipboard}
                          className="ios-glass-btn flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-mono text-neutral-400 hover:text-white rounded-md transition-colors shrink-0 group"
                        >
                          {copied ? (
                            <><Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> <span className="hidden sm:inline">Copied</span></>
                          ) : (
                            <><Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Copy</span></>
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] sm:text-[13px] leading-relaxed font-mono bg-[#050505] overflow-x-auto max-h-[40vh] sm:max-h-none">
                        <SyntaxHighlighter
                          language={getSyntaxLanguage(language)}
                          style={vscDarkPlus}
                          wrapLongLines={true}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                            fontSize: 'inherit',
                          }}
                        >
                          {result.optimizedCode}
                        </SyntaxHighlighter>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 shrink-0">
                    {/* Analysis */}
                    <motion.div variants={itemVariants} className="rounded-xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-3 sm:p-6 shadow-xl relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${actionConfig[action].bg} to-transparent opacity-20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2`}></div>
                      <h3 className="text-[9px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2 sm:mb-4 flex items-center gap-2 relative z-10">
                        <Activity className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color}`} />
                        Analysis
                      </h3>
                      <p className="text-[11px] sm:text-[13px] text-neutral-300 leading-relaxed font-sans relative z-10">
                        {result.complexityAnalysis}
                      </p>
                    </motion.div>

                    {/* Key Points List */}
                    <motion.div variants={itemVariants} className="rounded-xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-3 sm:p-6 shadow-xl relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${actionConfig[action].bg} to-transparent opacity-20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2`}></div>
                      <h3 className="text-[9px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-2 sm:mb-4 flex items-center gap-2 relative z-10">
                        <CheckCircle2 className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color}`} />
                        Key Points
                      </h3>
                      <ul className="space-y-2 sm:space-y-3 relative z-10">
                        {result.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 sm:gap-3 text-[11px] sm:text-[13px] text-neutral-300 font-sans">
                            <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color} opacity-70 shrink-0 mt-0.5`} />
                            <span className="leading-relaxed">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
