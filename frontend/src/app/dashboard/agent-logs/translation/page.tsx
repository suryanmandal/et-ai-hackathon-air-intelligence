"use client";

import React, { useState, useEffect, useRef } from "react";

interface LogLine {
  timestamp: string;
  agentName: string;
  color: string;
  message: string;
}

interface TranslationData {
  title: string;
  description: string;
  actions: string;
  compliance: string;
  logTitle: string;
}

const TRANSLATIONS: Record<"en" | "hi" | "mr", TranslationData> = {
  en: {
    title: "Emergency Warning: Sector MUM_042",
    description: "High concentration of gaseous Nitrogen Dioxide (NO2) detected near Eastern Freeway. Ground telemetry monitors indicate levels crossed the 184 μg/m³ statutory hazard threshold.",
    actions: "Dispatching Source Attribution Agent for hyperlocal perimeter audit. Requesting automated traffic flow diverters to reduce highway density and broadcasting public warning advisories to municipal screens.",
    compliance: "GovChain Blockchain synchronization complete. Statutory air quality compliance rules enforced at root levels.",
    logTitle: "Agent Activity Stream — Live"
  },
  hi: {
    title: "आपातकालीन प्रेषण चेतावनी: क्षेत्र MUM_042",
    description: "पूर्वी फ्रीवे के पास गैसीय नाइट्रोजन डाइऑक्साइड (NO2) की उच्च सांद्रता पाई गई है। ग्राउंड टेलीमेट्री मॉनिटर बताते हैं कि स्तर 184 μg/m³ वैधानिक खतरा सीमा को पार कर गया है।",
    actions: "हाइपरलोकल परिधि ऑडिट के लिए स्रोत एट्रिब्यूशन एजेंट भेजा जा रहा है। राजमार्ग घनत्व को कम करने के लिए स्वचालित यातायात प्रवाह डायवर्टर का अनुरोध करना और नगर निगम के स्क्रीन पर सार्वजनिक चेतावनी सलाह प्रसारित करना।",
    compliance: "GovChain ब्लॉकचेन सिंक्रनाइज़ेशन पूरा हुआ। वैधानिक वायु गुणवत्ता अनुपालन नियम रूट स्तर पर लागू किए गए।",
    logTitle: "एजेंट गतिविधि स्ट्रीम — लाइव"
  },
  mr: {
    title: "तातडीची चेतावणी: क्षेत्र MUM_042",
    description: "पूर्व मुक्त मार्गाजवळ नायट्रोजन डायऑक्साइड (NO2) वायूची उच्च सांद्रता आढळली आहे. भू-टेलीमेट्री मॉनिटर्स दर्शवतात की पातळीने 184 μg/m³ वैधानिक धोका मर्यादा ओलांडली आहे.",
    actions: "हायपरलोकल परिमिती ऑडिटसाठी स्रोत विशेषता एजंट पाठवला जात आहे. महामार्गाची कोंडी कमी करण्यासाठी स्वयंचलित रहदारी वळवण्याची विनंती केली जात आहे आणि पालिका स्क्रीनवर सार्वजनिक चेतावणी प्रसारित केली जात आहे.",
    compliance: "GovChain ब्लॉकचेन सिंक्रोनाइझेशन पूर्ण झाले. वैधानिक हवेच्या गुणवत्तेचे नियम मूळ पातळीवर लागू केले गेले आहेत.",
    logTitle: "एजंट क्रियाकलाप प्रवाह — थेट"
  }
};

export default function LanguageTranslationHub() {
  // Translation target language selector hi or mr
  const [selectedLang, setSelectedLang] = useState<"hi" | "mr">("hi");

  // Telemetry logs
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: "2026-07-14 11:32:22.918", agentName: "ComplianceAgent", color: "text-purple-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:25.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Buffer sync completed: 42ms latency." },
    { timestamp: "2026-07-14 11:32:27.918", agentName: "System", color: "text-slate-400", message: "Security handshake: Agent credentials verified." },
    { timestamp: "2026-07-14 11:32:30.418", agentName: "ComplianceAgent", color: "text-purple-400", message: "Refining mesh resolution for sub-sector A-9." },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Telemetry simulator
  useEffect(() => {
    const messages = [
      "Translating alert packet for Station MH-442.",
      "Updating translation cache layers in memory.",
      "Validating Hindi text alignment guidelines.",
      "Pushing Marathi advisory to terminal display feed.",
      "Synchronization of language assets completed."
    ];

    const logInterval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

      setLogs((prev) => {
        const updated = [...prev, { timestamp: timeStr, agentName: "TranslationEngine", color: "text-primary", message: msg }];
        if (updated.length > 30) updated.shift();
        return updated;
      });
    }, 3000);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="flex-1 bg-slate-950 p-lg flex flex-col gap-lg overflow-y-auto custom-scrollbar text-left h-full">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Regional Language Translation Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Instant telemetry and statutory advisory localizations for ground operators</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded border border-slate-800 shrink-0">
          <button 
            onClick={() => setSelectedLang("hi")}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${selectedLang === "hi" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Hindi (हिन्दी)
          </button>
          <button 
            onClick={() => setSelectedLang("mr")}
            className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${selectedLang === "mr" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"}`}
          >
            Marathi (मराठी)
          </button>
        </div>
      </div>

      {/* Translation Panels Side-by-Side Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* English Source Panel */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-lg p-5 flex flex-col gap-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">SOURCE: ENGLISH (en)</span>
            <span className="material-symbols-outlined text-slate-500 text-sm">text_fields</span>
          </div>

          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">Title</label>
              <h3 className="text-white font-bold text-sm">{TRANSLATIONS.en.title}</h3>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">Anomaly Description</label>
              <p className="text-slate-400 text-xs leading-relaxed">{TRANSLATIONS.en.description}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">Recommended Actions</label>
              <p className="text-slate-400 text-xs leading-relaxed">{TRANSLATIONS.en.actions}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">Statutory Compliance</label>
              <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-emerald-500 pl-3 italic bg-emerald-500/5 py-2 rounded-r">
                {TRANSLATIONS.en.compliance}
              </p>
            </div>
          </div>
        </div>

        {/* Target Translation Panel */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-lg p-5 flex flex-col gap-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-pulse"></div>
          
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
              TARGET: {selectedLang === "hi" ? "HINDI (hi)" : "MARATHI (mr)"}
            </span>
            <span className="material-symbols-outlined text-primary text-sm">done_all</span>
          </div>

          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">शीर्षक / Title</label>
              <h3 className="text-white font-bold text-sm transition-all duration-300">
                {TRANSLATIONS[selectedLang].title}
              </h3>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">विवरण / Description</label>
              <p className="text-slate-400 text-xs leading-relaxed transition-all duration-300">
                {TRANSLATIONS[selectedLang].description}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">अनुशंसित कार्रवाई / Recommended Actions</label>
              <p className="text-slate-400 text-xs leading-relaxed transition-all duration-300">
                {TRANSLATIONS[selectedLang].actions}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">वैधानिक अनुपालन / Statutory Compliance</label>
              <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-primary pl-3 italic bg-primary/5 py-2 rounded-r transition-all duration-300">
                {TRANSLATIONS[selectedLang].compliance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Translation Logs */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-md flex flex-col gap-sm">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          Translation System Activity Logs
        </span>
        <div className="h-28 overflow-y-auto font-mono text-[11px] bg-slate-950 p-sm rounded border border-slate-850 custom-scrollbar flex flex-col gap-1.5">
          {logs.map((log, idx) => (
            <p key={idx} className="text-slate-400">
              <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
              <span className={`${log.color} font-bold mr-2`}>{log.agentName}</span>
              <span className="text-slate-300">{log.message}</span>
            </p>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
