import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Zap, CheckCircle2, Activity, ChevronRight, Copy, Check, Sparkles, TerminalSquare, BookOpen, TestTube, Trash2, ArrowRight, Download, Upload, Bug, FileText, ShieldAlert, Wand2, MessageSquare, Rocket, AlignLeft, ZoomIn, ZoomOut, ChevronDown } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';

type Language = 'C++' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript' | 'Rust' | 'Go' | 'C#' | 'Swift' | 'Kotlin' | 'Ruby' | 'PHP' | 'SQL';
type Action = 'optimize' | 'explain' | 'tests' | 'debug' | 'document' | 'security' | 'refactor' | 'review' | 'modernize';

interface OptimizationResult {
  optimizedCode: string;
  improvements: string[];
  complexityAnalysis: string;
}

const getSyntaxLanguage = (lang: Language) => {
  switch (lang) {
    case 'C++': return 'cpp';
    case 'Python': return 'python';
    case 'Java': return 'java';
    case 'JavaScript': return 'javascript';
    case 'TypeScript': return 'typescript';
    case 'Rust': return 'rust';
    case 'Go': return 'go';
    case 'C#': return 'csharp';
    case 'Swift': return 'swift';
    case 'Kotlin': return 'kotlin';
    case 'Ruby': return 'ruby';
    case 'PHP': return 'php';
    case 'SQL': return 'sql';
    default: return 'javascript';
  }
};

const Dropdown = ({ value, options, onChange, icon: Icon, align = 'left', className = '' }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-1.5 sm:gap-2 bg-transparent hover:bg-white/5 text-neutral-300 text-[11px] sm:text-xs font-mono rounded px-2 py-1.5 transition-colors"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-neutral-500" />}
          <span>{options.find((o: any) => o.value === value)?.label || value}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full ${align === 'center' ? 'left-1/2 -translate-x-1/2 w-full' : align === 'right' ? 'right-0 w-40' : 'left-0 w-40'} mt-1 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 py-1`}
          >
            {options.map((option: any) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-[11px] sm:text-xs font-mono flex items-center gap-2 hover:bg-blue-500/20 hover:text-blue-400 transition-colors ${
                  value === option.value ? 'bg-blue-500/10 text-blue-400' : 'text-neutral-300'
                }`}
              >
                {option.icon && <option.icon className="w-3.5 h-3.5" />}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Editor = ({ code, setCode, language, actionLabel, fontSize, onProcess }: { code: string, setCode: (c: string) => void, language: string, actionLabel: string, fontSize: number, onProcess: () => void }) => {
  const [cursor, setCursor] = useState({ line: 1, col: 1 });

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('aico-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
        'editor.lineHighlightBackground': '#ffffff0a',
        'editorLineNumber.foreground': '#525252',
        'editorLineNumber.activeForeground': '#a3a3a3',
        'editor.selectionBackground': '#3b82f640',
        'editor.inactiveSelectionBackground': '#3b82f620',
        'editorCursor.foreground': '#3b82f6',
        'editorWidget.background': '#0a0a0a',
        'editorWidget.border': '#262626',
        'editorSuggestWidget.background': '#0a0a0a',
        'editorSuggestWidget.border': '#262626',
        'editorSuggestWidget.selectedBackground': '#ffffff10',
      }
    });
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.onDidChangeCursorPosition((e: any) => {
      setCursor({ line: e.position.lineNumber, col: e.position.column });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onProcess();
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 relative group bg-transparent">
        <MonacoEditor
          height="100%"
          language={getSyntaxLanguage(language)}
          theme="aico-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            wordWrap: 'on',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            renderLineHighlight: 'all',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
          }}
        />
      </div>
      {/* Editor Status Bar */}
      <div className="h-6 sm:h-7 bg-black/40 border-t border-white/5 flex items-center justify-between px-3 sm:px-4 text-[9px] sm:text-[10px] font-mono text-neutral-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>{code.length} chars</span>
          <span>{code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {cursor.line}, Col {cursor.col}</span>
          <span>UTF-8</span>
          <span className="text-neutral-400">{language}</span>
        </div>
      </div>
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
  const [inputCopied, setInputCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(13);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  const [isKeyPointsOpen, setIsKeyPointsOpen] = useState(true);

  useEffect(() => {
    const savedCode = localStorage.getItem('aico_code');
    const savedLang = localStorage.getItem('aico_lang') as Language;
    if (savedCode) setCode(savedCode);
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('aico_code', code);
    localStorage.setItem('aico_lang', language);
  }, [code, language]);

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

  const downloadCode = () => {
    if (result?.optimizedCode) {
      const blob = new Blob([result.optimizedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      let ext = 'txt';
      switch (language) {
        case 'C++': ext = 'cpp'; break;
        case 'Python': ext = 'py'; break;
        case 'Java': ext = 'java'; break;
        case 'JavaScript': ext = 'js'; break;
        case 'TypeScript': ext = 'ts'; break;
        case 'Rust': ext = 'rs'; break;
        case 'Go': ext = 'go'; break;
        case 'C#': ext = 'cs'; break;
        case 'Swift': ext = 'swift'; break;
        case 'Kotlin': ext = 'kt'; break;
        case 'Ruby': ext = 'rb'; break;
        case 'PHP': ext = 'php'; break;
        case 'SQL': ext = 'sql'; break;
      }
      
      a.download = `output.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      
      const ext = file.name.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'cpp': case 'cc': case 'cxx': case 'h': case 'hpp': setLanguage('C++'); break;
        case 'py': setLanguage('Python'); break;
        case 'java': setLanguage('Java'); break;
        case 'js': case 'jsx': setLanguage('JavaScript'); break;
        case 'ts': case 'tsx': setLanguage('TypeScript'); break;
        case 'rs': setLanguage('Rust'); break;
        case 'go': setLanguage('Go'); break;
        case 'cs': setLanguage('C#'); break;
        case 'swift': setLanguage('Swift'); break;
        case 'kt': case 'kts': setLanguage('Kotlin'); break;
        case 'rb': setLanguage('Ruby'); break;
        case 'php': setLanguage('PHP'); break;
        case 'sql': setLanguage('SQL'); break;
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const actionConfig = {
    optimize: { icon: Zap, label: 'Optimize', color: 'text-emerald-400', bg: 'from-emerald-400/20', border: 'border-emerald-400/20' },
    explain: { icon: BookOpen, label: 'Explain', color: 'text-blue-400', bg: 'from-blue-400/20', border: 'border-blue-400/20' },
    tests: { icon: TestTube, label: 'Tests', color: 'text-purple-400', bg: 'from-purple-400/20', border: 'border-purple-400/20' },
    debug: { icon: Bug, label: 'Debug', color: 'text-red-400', bg: 'from-red-400/20', border: 'border-red-400/20' },
    document: { icon: FileText, label: 'Document', color: 'text-amber-400', bg: 'from-amber-400/20', border: 'border-amber-400/20' },
    security: { icon: ShieldAlert, label: 'Security', color: 'text-rose-500', bg: 'from-rose-500/20', border: 'border-rose-500/20' },
    refactor: { icon: Wand2, label: 'Refactor', color: 'text-indigo-400', bg: 'from-indigo-400/20', border: 'border-indigo-400/20' },
    review: { icon: MessageSquare, label: 'Review', color: 'text-cyan-400', bg: 'from-cyan-400/20', border: 'border-cyan-400/20' },
    modernize: { icon: Rocket, label: 'Modernize', color: 'text-fuchsia-400', bg: 'from-fuchsia-400/20', border: 'border-fuchsia-400/20' }
  };

  const languageOptions = (['C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'C#', 'Swift', 'Kotlin', 'Ruby', 'PHP', 'SQL'] as Language[]).map(lang => ({
    value: lang,
    label: lang
  }));

  const actionOptions = (Object.keys(actionConfig) as Action[]).map(a => ({
    value: a,
    label: actionConfig[a as Action].label,
    icon: actionConfig[a as Action].icon
  }));

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
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500 opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-500 opacity-[0.03] blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="h-14 sm:h-16 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-center z-20 shrink-0">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6">
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
          <div className="flex justify-center flex-none w-full max-w-[200px] sm:max-w-[300px]">
            <Dropdown 
              value={action} 
              options={actionOptions} 
              onChange={(val: Action) => setAction(val)} 
              icon={CurrentIcon} 
              align="center"
              className="w-full bg-black/40 border border-white/10 rounded-lg shadow-inner"
            />
          </div>

          {/* Status - Right aligned */}
          <div className="flex items-center justify-end gap-4 text-sm text-neutral-400 font-mono flex-1 hidden md:flex">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full ios-glass-panel text-[10px] uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              System Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Stretched Layout */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto p-2 sm:p-4 lg:p-6 gap-2 sm:gap-4 lg:gap-6 relative z-10 overflow-hidden">
        
        {/* Left Pane: Editor */}
        <section className="flex-1 lg:w-1/2 flex flex-col rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative group min-h-0 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-black/40 border-b border-white/10 shrink-0">
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-t-2 border-t-blue-500 text-neutral-200">
                <TerminalSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <h2 className="text-[11px] sm:text-xs font-mono">input.{getSyntaxLanguage(language)}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3">
              <Dropdown 
                value={language} 
                options={languageOptions} 
                onChange={(val: Language) => setLanguage(val)} 
                align="right"
              />
              <div className="w-px h-4 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setFontSize(f => Math.max(8, f - 1))}
                  className="ios-glass-btn text-neutral-500 hover:text-white p-1.5 sm:p-2 rounded-lg group"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setFontSize(f => Math.min(24, f + 1))}
                  className="ios-glass-btn text-neutral-500 hover:text-white p-1.5 sm:p-2 rounded-lg group"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-0.5 sm:mx-1 shrink-0"></div>
                <label className="ios-glass-btn text-neutral-500 hover:text-blue-400 p-1.5 sm:p-2 rounded-lg cursor-pointer group" title="Upload file">
                  <Upload className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".cpp,.cc,.cxx,.h,.hpp,.py,.java,.js,.jsx,.ts,.tsx,.rs,.go,.cs,.swift,.kt,.kts,.rb,.php,.sql,.txt" />
                </label>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setInputCopied(true);
                    setTimeout(() => setInputCopied(false), 2000);
                  }}
                  className="ios-glass-btn text-neutral-500 hover:text-emerald-400 p-1.5 sm:p-2 rounded-lg group"
                  title="Copy code"
                >
                  {inputCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button
                  onClick={() => setCode('')}
                  className="ios-glass-btn text-neutral-500 hover:text-red-400 p-1.5 sm:p-2 rounded-lg group"
                  title="Clear code"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Editor Component */}
          <Editor code={code} setCode={setCode} language={language} actionLabel={actionConfig[action].label} fontSize={fontSize} onProcess={handleProcess} />

          {/* Footer / Action Button */}
          <div className="p-2 sm:p-4 border-t border-white/5 bg-black/20 shrink-0">
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
        <section className="flex-1 lg:w-1/2 flex flex-col rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 overflow-hidden relative min-h-0 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-black/40 border-b border-white/10 shrink-0">
            <div className="flex items-center">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/40 border-t-2 border-t-emerald-500 text-neutral-200">
                <Activity className={`w-3.5 h-3.5 ${actionConfig[action].color} shrink-0`} />
                <h2 className="text-[11px] sm:text-xs font-mono">output.md</h2>
              </div>
            </div>
            {result && (
              <div className="flex items-center gap-2 px-3">
                 <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                 </span>
              </div>
            )}
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
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl ios-glass-panel flex items-center justify-center mb-3 sm:mb-5 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                    <Code2 className="w-5 h-5 sm:w-8 sm:h-8 text-neutral-500 relative z-10 animate-pulse" />
                  </div>
                  <p className="font-mono text-[11px] sm:text-sm text-neutral-400">Awaiting source code...</p>
                  <p className="font-sans text-[10px] sm:text-xs text-neutral-500 mt-2 max-w-[250px] text-center px-4 hidden sm:block">
                    Enter your code in the left pane and click process to see the magic happen.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-600 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <Sparkles className="w-3 h-3" />
                    <span>Pro tip: Press <kbd className="bg-black/40 px-1.5 py-0.5 rounded border border-white/10 mx-1 text-neutral-400">Cmd/Ctrl + Enter</kbd> to run</span>
                  </div>
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
                    <div className="w-12 h-12 sm:w-20 sm:h-20 ios-glass-panel rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                       <div className={`w-5 h-5 sm:w-8 sm:h-8 border-2 ${actionConfig[action].color} rounded-full border-t-transparent animate-spin relative z-10`}></div>
                    </div>
                    {/* Glow effect behind spinner */}
                    <div className={`absolute inset-0 blur-2xl opacity-30 bg-gradient-to-br ${actionConfig[action].bg} rounded-full`}></div>
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
                    <motion.div variants={itemVariants} className="flex flex-col rounded-xl ios-glass-panel overflow-hidden shrink-0">
                      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/5 bg-black/40">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                          <span className="ml-2 sm:ml-3 text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-widest truncate">output.{getSyntaxLanguage(language)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setWordWrap(!wordWrap)}
                            className={`ios-glass-btn flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-mono rounded-md transition-colors shrink-0 group ${wordWrap ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}
                            title="Toggle Word Wrap"
                          >
                            <AlignLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Wrap</span>
                          </button>
                          <button
                            onClick={downloadCode}
                            className="ios-glass-btn flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-mono text-neutral-400 hover:text-white rounded-md transition-colors shrink-0 group"
                            title="Download code"
                          >
                            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Download</span>
                          </button>
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
                      </div>
                      <div className="text-[11px] sm:text-[13px] leading-relaxed font-mono bg-black/20 overflow-hidden h-[40vh] sm:h-[50vh]">
                        <MonacoEditor
                          height="100%"
                          language={getSyntaxLanguage(language)}
                          theme="aico-dark"
                          value={result.optimizedCode}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: fontSize,
                            wordWrap: wordWrap ? 'on' : 'off',
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            renderLineHighlight: 'none',
                            smoothScrolling: true,
                            cursorBlinking: 'solid',
                            domReadOnly: true,
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-6 shrink-0">
                    {/* Analysis */}
                    <motion.div variants={itemVariants} className="rounded-xl ios-glass-panel overflow-hidden flex flex-col">
                      <button 
                        onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors relative z-10"
                      >
                        <h3 className="text-[9px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <Activity className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color}`} />
                          Analysis
                        </h3>
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${isAnalysisOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isAnalysisOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative"
                          >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${actionConfig[action].bg} to-transparent opacity-20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none`}></div>
                            <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-1">
                              <p className="text-[11px] sm:text-[13px] text-neutral-300 leading-relaxed font-sans relative z-10">
                                {result.complexityAnalysis}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Key Points List */}
                    <motion.div variants={itemVariants} className="rounded-xl ios-glass-panel overflow-hidden flex flex-col">
                      <button 
                        onClick={() => setIsKeyPointsOpen(!isKeyPointsOpen)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors relative z-10"
                      >
                        <h3 className="text-[9px] sm:text-[11px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color}`} />
                          Key Points
                        </h3>
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${isKeyPointsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isKeyPointsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative"
                          >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${actionConfig[action].bg} to-transparent opacity-20 blur-2xl rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none`}></div>
                            <div className="px-3 sm:px-6 pb-3 sm:pb-6 pt-1">
                              <ul className="space-y-1 sm:space-y-2 relative z-10">
                                {result.improvements.map((improvement, index) => (
                                  <li key={index} className="flex items-start gap-2 sm:gap-3 text-[11px] sm:text-[13px] text-neutral-300 font-sans p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${actionConfig[action].color} opacity-70 shrink-0 mt-0.5`} />
                                    <span className="leading-relaxed">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
