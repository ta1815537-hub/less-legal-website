import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../../types';
import { 
  QrCode, Key, Code, Binary, Link, Palette, 
  Copy, Check, Download, RefreshCw, Sparkles, Wifi, CreditCard, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { 
  generateQrDataUrl, 
  generateQrSvgString, 
  formatUpiUri, 
  formatWifiUri, 
  QrCodeOptions 
} from '../../../services/toolEngine/qrEngine';
import { 
  processJson, 
  encodeUnicodeBase64, 
  decodeUnicodeBase64, 
  generateSecurePassword, 
  PasswordResult 
} from '../../../services/toolEngine/devEngine';

interface QrDigitalToolsViewProps {
  tool: ToolDefinition;
}

export const QrDigitalToolsView: React.FC<QrDigitalToolsViewProps> = ({ tool }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // 1. QR Generator State
  const [qrType, setQrType] = useState<'url' | 'wifi' | 'upi' | 'text'>('url');
  const [qrContent, setQrContent] = useState('https://lesscreation.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiAmount, setUpiAmount] = useState('');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrSvgString, setQrSvgString] = useState<string | null>(null);

  // 2. Password Generator State
  const [passLength, setPassLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNumbers, setIncNumbers] = useState(true);
  const [incSymbols, setIncSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [passwordData, setPasswordData] = useState<PasswordResult | null>(null);

  // 3. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{\n  "brand": "Less Creation",\n  "founder": "Anurag Gurauli",\n  "mission": "Technology that makes difficult things simple."\n}');
  const [jsonIndent, setJsonIndent] = useState<number>(2);
  const [jsonResult, setJsonResult] = useState<{ valid: boolean; formatted?: string; error?: string } | null>(null);

  // 4. Base64 & URL State
  const [rawText, setRawText] = useState('Less Creation — Simple Technology for Everyone');
  const [convertedText, setConvertedText] = useState('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [base64Error, setBase64Error] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR Code dynamically
  useEffect(() => {
    if (tool.slug !== 'qr-generator') return;

    let payload = qrContent;
    if (qrType === 'wifi') {
      payload = formatWifiUri({ ssid: wifiSsid, password: wifiPass, encryption: 'WPA' });
    } else if (qrType === 'upi') {
      payload = formatUpiUri({
        vpa: upiId,
        payeeName: upiName || 'Merchant',
        amount: parseFloat(upiAmount) || undefined
      });
    }

    if (!payload.trim()) {
      setQrDataUrl(null);
      setQrSvgString(null);
      return;
    }

    const qrOpts: QrCodeOptions = {
      content: payload,
      errorCorrectionLevel: errorCorrection,
      width: 400,
      margin: 2
    };

    generateQrDataUrl(qrOpts)
      .then(url => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null));

    generateQrSvgString(qrOpts)
      .then(svg => setQrSvgString(svg))
      .catch(() => setQrSvgString(null));
  }, [tool.slug, qrType, qrContent, wifiSsid, wifiPass, upiId, upiName, upiAmount, errorCorrection]);

  // Generate Password with crypto engine
  const handleGeneratePassword = () => {
    const res = generateSecurePassword({
      length: passLength,
      includeUppercase: incUpper,
      includeLowercase: incLower,
      includeNumbers: incNumbers,
      includeSymbols: incSymbols,
      excludeAmbiguous
    });
    setPasswordData(res);
  };

  useEffect(() => {
    if (tool.slug === 'password-generator') {
      handleGeneratePassword();
    }
  }, [tool.slug, passLength, incUpper, incLower, incNumbers, incSymbols, excludeAmbiguous]);

  // JSON processing
  const handleProcessJson = (minify: boolean = false) => {
    const res = processJson(jsonInput, minify ? 0 : jsonIndent);
    if (res.valid) {
      setJsonResult({ valid: true, formatted: minify ? res.minified : res.formatted });
    } else {
      setJsonResult({ valid: false, error: res.error });
    }
  };

  useEffect(() => {
    if (tool.slug === 'json-formatter') {
      handleProcessJson(false);
    }
  }, [tool.slug, jsonIndent]);

  // Base64 processing
  const handleConvertBase64 = (mode: 'encode' | 'decode') => {
    setBase64Mode(mode);
    setBase64Error(null);
    try {
      if (mode === 'encode') {
        const enc = encodeUnicodeBase64(rawText);
        setConvertedText(enc);
      } else {
        const dec = decodeUnicodeBase64(rawText);
        setConvertedText(dec);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid Base64 string.';
      setBase64Error(msg);
      setConvertedText('');
    }
  };

  useEffect(() => {
    if (tool.slug === 'base64-tool') {
      handleConvertBase64('encode');
    }
  }, [tool.slug]);

  // Download QR SVG file
  const downloadSvgFile = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. QR GENERATOR */}
      {tool.slug === 'qr-generator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                QR Content Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'url', label: 'URL / Link' },
                  { id: 'upi', label: 'UPI Pay' },
                  { id: 'wifi', label: 'Wi-Fi' },
                  { id: 'text', label: 'Plain Text' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setQrType(type.id as any)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      qrType === type.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {qrType === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            )}

            {qrType === 'upi' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    UPI ID / VPA (e.g., merchant@okhdfcbank)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@upi"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Payee Name
                    </label>
                    <input
                      type="text"
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      placeholder="Business Name"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Amount (Optional ₹)
                    </label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      placeholder="₹ 500"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="MyHomeWiFi"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Wi-Fi Password
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Text Content
                </label>
                <textarea
                  rows={4}
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  placeholder="Enter any text to encode in QR..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setErrorCorrection(lvl)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      errorCorrection === lvl
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center">
            {qrDataUrl ? (
              <div className="space-y-4 flex flex-col items-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <img src={qrDataUrl} alt="Generated QR Code" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
                </div>
                <div className="flex gap-2">
                  <a
                    href={qrDataUrl}
                    download="qrcode.png"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                  <button
                    onClick={downloadSvgFile}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Fill in details to render your verified QR code</p>
            )}
          </div>
        </div>
      )}

      {/* 2. PASSWORD GENERATOR */}
      {tool.slug === 'password-generator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wider break-all select-all">
                {passwordData?.password || 'Generating...'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => passwordData && copyText(passwordData.password)}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm"
                  title="Copy Password"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleGeneratePassword}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white cursor-pointer shadow-sm"
                  title="Generate New Password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {passwordData && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-blue-200/60 dark:border-blue-500/20">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entropy: {passwordData.entropyBits} bits ({passwordData.strengthLabel})</span>
                </div>
                <span className="text-slate-400 text-[11px]">Never stored or transmitted</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Password Length</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">{passLength} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passLength}
                onChange={(e) => setPassLength(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incUpper}
                  onChange={(e) => setIncUpper(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incLower}
                  onChange={(e) => setIncLower(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incNumbers}
                  onChange={(e) => setIncNumbers(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incSymbols}
                  onChange={(e) => setIncSymbols(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Symbols (!@#$)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 3. JSON FORMATTER */}
      {tool.slug === 'json-formatter' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleProcessJson(false)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Prettify JSON
              </button>
              <button
                onClick={() => handleProcessJson(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Minify JSON
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Indent:</span>
              {[2, 4].map(ind => (
                <button
                  key={ind}
                  onClick={() => setJsonIndent(ind)}
                  className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                    jsonIndent === ind ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {ind} spaces
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw Input</span>
              <textarea
                rows={12}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  const res = processJson(e.target.value, jsonIndent);
                  setJsonResult(res.valid ? { valid: true, formatted: res.formatted } : { valid: false, error: res.error });
                }}
                className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Formatted Output</span>
                {jsonResult?.formatted && (
                  <button
                    onClick={() => copyText(jsonResult.formatted!)}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
              <div className="w-full h-[230px] p-3 font-mono text-xs rounded-xl bg-slate-900 text-slate-100 overflow-auto border border-slate-800">
                {jsonResult?.valid ? (
                  <pre className="whitespace-pre-wrap">{jsonResult.formatted}</pre>
                ) : (
                  <div className="text-red-400 flex items-start gap-2 pt-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{jsonResult?.error || 'Invalid JSON syntax'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BASE64 TOOL */}
      {tool.slug === 'base64-tool' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleConvertBase64('encode')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                base64Mode === 'encode'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => handleConvertBase64('decode')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                base64Mode === 'decode'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Input Text (Unicode & Multilingual Safe)
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                try {
                  if (base64Mode === 'encode') setConvertedText(encodeUnicodeBase64(e.target.value));
                  else setConvertedText(decodeUnicodeBase64(e.target.value));
                  setBase64Error(null);
                } catch (err: unknown) {
                  setBase64Error('Invalid Base64 format');
                  setConvertedText('');
                }
              }}
              className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
            />
          </div>

          {base64Error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{base64Error}</span>
            </div>
          )}

          {convertedText && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Converted Output</span>
                <button
                  onClick={() => copyText(convertedText)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={5}
                readOnly
                value={convertedText}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
