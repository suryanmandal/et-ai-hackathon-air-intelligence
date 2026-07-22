"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMunicipal } from "@/context/MunicipalContext";

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

const TRANSLATIONS: Record<string, TranslationData> = {
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
  },
  bn: {
    title: "জরুরী সতর্কবার্তা: সেক্টর MUM_042",
    description: "ইস্টার্ন ফ্রিওয়ের কাছে গ্যাসীয় নাইট্রোজেন ডাই অক্সাইড (NO2) এর উচ্চ ঘনত্ব সনাক্ত করা হয়েছে। স্থল পরিমাপক যন্ত্র নির্দেশ করে যে মাত্রা ১৮৪ μg/m³ এর সংবিধিবদ্ধ বিপদসীমা অতিক্রম করেছে।",
    actions: "হাইপারলোকাল পেরিমিটার অডিটের জন্য সোর্স অ্যাট্রিবিউশন এজেন্ট পাঠানো হচ্ছে। হাইওয়ে ঘনত্ব কমাতে স্বয়ংক্রিয় ট্রাফিক ডাইভারশন অনুরোধ এবং কর্পোরেশন স্ক্রিনে জনসচেতনতামূলক সতর্কবার্তা প্রচার।",
    compliance: "GovChain ব্লকচেন সমন্বয় সম্পূর্ণ। সংবিধিবদ্ধ বায়ুর গুণমান নিয়মাবলী মূল স্তরে প্রয়োগ করা হয়েছে।",
    logTitle: "এজেন্ট কার্যকলাপ প্রবাহ — লাইভ"
  },
  gu: {
    title: "કટોકટીની ચેતવણી: સેક્ટર MUM_042",
    description: "ઇસ્ટર્ન ફ્રીવે પાસે નાઇટ્રોજન ડાયોક્સાઇડ (NO2) નું ઊંચું પ્રમાણ મળ્યું છે. ગ્રાઉન્ડ ટેલિમેટ્રી દર્શાવે છે કે આ સ્તર ૧૮૪ μg/m³ ની કાનૂની જોખમ મર્યાદા ઓળંગી ગયું છે.",
    actions: "સ્થાનિક સીમા ઓડિટ માટે સોર્સ એટ્રિબ્યુশন એજન્ટ મોકલવામાં આવી રહ્યો છે. હાઇવે ટ્રાફિક ઘટાડવા ઓટોમેટિક ડાયવર્ઝનની વિનંતી અને જાહેર ચેતવણી પ્રસારણ.",
    compliance: "GovChain બ્લોકચેન સિંક પૂર્ણ. કાનૂની હવા ગુણવત્તાના નિયમો મૂળ સ્તરે લાગુ કરવામાં આવ્યા છે.",
    logTitle: "એજન્ટ પ્રવૃત્તિ પ્રવાહ — લાઇવ"
  },
  ta: {
    title: "அவசர எச்சரிக்கை: பகுதி MUM_042",
    description: "கிழக்கு விரைவுச்சாலையின் அருகே நைட்ரஜன் டை ஆக்சைடு (NO2) வாயுவின் அதிக செறிவு கண்டறியப்பட்டுள்ளது. நிலத்தடி அளவீடுகள் சட்டப்பூர்வ வரம்பான 184 μg/m³ ஐ தாண்டியுள்ளது எனக் காட்டுகின்றன.",
    actions: "அதிதீவிர ஆய்வுக்காக மூலக் கண்டறிதல் முகவர் அனுப்பப்படுகிறார். போக்குவரத்து நெரிசலைக் குறைக்க தானியங்கி மாற்றுப்பாதைகளைக் கோருதல் மற்றும் பொது எச்சரிக்கைகளைப் பரப்புதல்.",
    compliance: "GovChain பிளாக்செயின் ஒത്തിசைவு முடிந்தது. சட்டப்பூர்வ காற்றுத் தரம் விதிகள் செயல்படுத்தப்பட்டுள்ளன.",
    logTitle: "முகவர் செயல்பாடு — நேரலை"
  },
  te: {
    title: "అత్యవసర హెచ్చరిక: సెక్టార్ MUM_042",
    description: "ఈస్టర్న్ ఫ్రీవే సమీపంలో నైట్రోజన్ డయాక్సైడ్ (NO2) వాయువు అధిక సాంద్రత కనుగొనబడింది. గ్రౌండ్ టెలిమెట్రీ స్థాయిలు 184 μg/m³ ప్రమాద పరిమితిని దాటినట్లు చూపుతున్నాయి.",
    actions: "స్థానిక ఆడిట్ కొరకు సోర్స్ అట్రిబ్యూషన్ ఏజెంట్ ని పంపడం జరుగుతోంది. ట్రాఫిక్ తగ్గించేందుకు ఆటోమేటిక్ డైవర్టర్లు మరియు మున్సిపల్ స్క్రీన్లలో హెచ్చరికలు జారీ చేయడం.",
    compliance: "GovChain బ్లాక్‌చైన్ సింక్రొనైజేషన్ పూర్తయింది. చట్టబద్ధమైన గాలి నాణ్యత నిబంధనలు అమలు చేయబడ్డాయి.",
    logTitle: "ఏజెంట్ కార్యాచరణ — లైవ్"
  },
  kn: {
    title: "ತುರ್ತು ಎಚ್ಚರಿಕೆ: ವಲಯ MUM_042",
    description: "ಈಸ್ಟರ್ನ್ ಫ್ರೀವೇ ಹತ್ತಿರ ನೈಟ್ರೋಜൻ ಡೈಆಕ್ಸೈಡ್ (NO2) ಅನಿಲದ ಹೆಚ್ಚಿನ ಸಾಂದ್ರತೆ ಪತ್ತೆಯಾಗಿದೆ. ನೆಲದ ಟೆಲಿಮೆಟ್ರಿ 184 μg/m³ ಕಡ್ಡಾಯ ಅಪಾಯದ ಮಿತಿಯನ್ನು ಮೀರಿದೆ ಎಂದು ತೋರಿಸುತ್ತದೆ.",
    actions: "ಮೂಲ ಅಟ್ರಿಬ್ಯೂಷನ್ ಏಜೆಂಟರನ್ನು ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ. ಹೆದ್ದಾರಿ ದಟ್ಟಣೆ ಕಡಿಮೆ ಮಾಡಲು ಸ್ವಯಂಚಾಲಿತ ಸಂಚಾರ ಡೈವರ್ಟರ್‌ಗಳ ವಿನಂತಿ ಮತ್ತು ಸಾರ್ವജനಿಕ ಎಚ್ಚರಿಕೆ ಪ್ರಸಾರ.",
    compliance: "GovChain ಬ್ಲಾಕ್‌ಚೈನ್ ಸಿಂಕ್ರೊನೈಸೇಶನ್ ಪೂರ್ಣಗೊಂಡಿದೆ. ಕಡ್ಡಾಯ ವಾಯು ಗುಣಮಟ್ಟ ನಿಯಮಗಳನ್ನು ಜಾರಿಗೊಳಿಸಲಾಗಿದೆ.",
    logTitle: "ಏಜೆಂಟ್ ಚಟುವಟಿಕೆ — ಲೈವ್"
  },
  pa: {
    title: "ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ: ਸੈਕਟਰ MUM_042",
    description: "ਈਸਟਰਨ ਫ੍ਰੀਵੇਅ ਦੇ ਨੇੜੇ ਨਾਈਟ੍ਰੋਜਨ ਡਾਈਆਕਸਾਈਡ (NO2) ਗੈਸ ਦੀ ਉੱਚ ਮਾਤਰਾ ਪਾਈ ਗਈ ਹੈ। ਗਰਾਊਂਡ ਟੈਲੀਮੈਟਰੀ ਦਰਸਾਉਂਦੀ ਹੈ ਕਿ ਪੱਧਰ 184 μg/m³ ਦੀ ਕਾਨੂੰਨੀ ਸੀਮਾ ਪਾਰ ਕਰ ਗਿਆ ਹੈ।",
    actions: "ਸਰੋਤ ਨਿਰਧਾਰਨ ਏਜੰਟ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ। ਹਾਈਵੇ ਦੀ ਭੀੜ ਘਟਾਉਣ ਲਈ ਆਟੋਮੈਟਿਕ ਟ੍ਰੈਫਿਕ ਡਾਇਵਰਸ਼ਨ ਅਤੇ ਨਗਰ ਨਿਗਮ ਸਕ੍ਰੀਨਾਂ 'ਤੇ ਚੇਤਾਵਨੀਆਂ ਪ੍ਰਸਾਰਿਤ ਕਰਨਾ।",
    compliance: "GovChain ਬਲਾਕਚੈਨ ਸਿੰਕ ਪੂਰਾ ਹੋ ਗਿਆ ਹੈ। ਕਾਨੂੰਨੀ ਹਵਾ ਗੁਣਵੱਤਾ ਨਿਯਮ ਲਾਗੂ ਕੀਤੇ ਗਏ ਹਨ।",
    logTitle: "ਏਜੰਟ ਗਤੀਵਿਧੀ — ਲਾਈਵ"
  },
  ml: {
    title: "അടിയന്തിര മുന്നറിയിപ്പ്: സെക്ടർ MUM_042",
    description: "ഈസ്റ്റേൺ ഫ്രീവേയ്ക്ക് സമീപം നൈട്രജൻ ഡയോക്സൈഡ് (NO2) വാതകത്തിന്റെ ഉയർന്ന സാന്ദ്രത കണ്ടെത്തി. അളവുകൾ 184 μg/m³ എന്ന നിയമപരമായ പരിധി കവിഞ്ഞതായി വ്യക്തമാക്കുന്നു.",
    actions: "സ്രോതസ്സ് കണ്ടെത്തൽ ഏജന്റിനെ നിയോഗിക്കുന്നു. ഗതാഗതക്കുരുക്ക് കുറയ്ക്കാൻ ഓട്ടോമാറ്റിക് ഡൈവർട്ടറുകൾ അഭ്യർത്ഥിക്കുകയും മുന്നറിയിപ്പുകൾ നൽകുകയും ചെയ്യുന്നു.",
    compliance: "GovChain ബ്ലോക്ക്‌ചെയിൻ സമന്വയം പൂർത്തിയായി. നിയമപരമായ വായു ഗുണനിലവാര ചട്ടങ്ങൾ പ്രാബല്യത്തിൽ വരുത്തി.",
    logTitle: "ഏജൻ്റ് പ്രവർത്തനം — തത്സമയം"
  }
};

const LANGUAGES = [
  { code: "mr", name: "Marathi (मराठी)", state: "Maharashtra" },
  { code: "bn", name: "Bengali (বাংলা)", state: "West Bengal" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", state: "Gujarat" },
  { code: "ta", name: "Tamil (தமிழ்)", state: "Tamil Nadu" },
  { code: "te", name: "Telugu (తెలుగు)", state: "Andhra Pradesh" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)", state: "Karnataka" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)", state: "Punjab" },
  { code: "ml", name: "Malayalam (മലയാളം)", state: "Kerala" }
];

export default function LanguageTranslationHub() {
  const { activeCorp } = useMunicipal();

  // Translation target language selector hi or customLang
  const [selectedLang, setSelectedLang] = useState<string>("hi");
  const [customLang, setCustomLang] = useState<string>("mr");
  
  // Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-select second language based on current activeCorp state focus
  useEffect(() => {
    if (activeCorp?.state) {
      const stateName = activeCorp.state.toLowerCase();
      let matchedLang = "mr"; // Fallback to Marathi
      
      if (stateName.includes("bengal")) matchedLang = "bn";
      else if (stateName.includes("maharashtra")) matchedLang = "mr";
      else if (stateName.includes("gujarat")) matchedLang = "gu";
      else if (stateName.includes("tamil")) matchedLang = "ta";
      else if (stateName.includes("andhra") || stateName.includes("telangana")) matchedLang = "te";
      else if (stateName.includes("karnataka")) matchedLang = "kn";
      else if (stateName.includes("punjab")) matchedLang = "pa";
      else if (stateName.includes("kerala")) matchedLang = "ml";
      
      setCustomLang(matchedLang);
      setSelectedLang(matchedLang); // Focus on the newly selected regional language
      
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      
      const langObj = LANGUAGES.find(l => l.code === matchedLang);
      setLogs((prev) => [
        ...prev,
        { 
          timestamp: timeStr, 
          agentName: "TranslationEngine", 
          color: "text-primary", 
          message: `State focus changed: Auto-selected [${langObj?.name || matchedLang}] matching region: ${activeCorp.state}` 
        }
      ]);
    }
  }, [activeCorp]);

  // Telemetry log simulator
  useEffect(() => {
    const messages = [
      "Translating alert packet for Station MH-442.",
      "Updating translation cache layers in memory.",
      "Validating regional typography bounds.",
      "Pushing localized advisory to terminal display feed.",
      "Synchronization of language assets completed.",
      "Generating cryptographic verification stamp."
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
    }, 4000);

    return () => clearInterval(logInterval);
  }, []);

  // Filter languages based on search query
  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLanguageName = (code: string) => {
    if (code === "hi") return "Hindi (हिन्दी)";
    const found = LANGUAGES.find(l => l.code === code);
    return found ? found.name : code.toUpperCase();
  };

  return (
    <div className="flex-1 bg-slate-950 p-lg flex flex-col gap-lg overflow-y-auto custom-scrollbar text-left h-full">
      
      {/* Top Header & Interactive Language Buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Regional Language Translation Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Instant telemetry and statutory advisory localizations for ground operators</p>
        </div>

        {/* Dynamic Tab Controls with Search Dropdown */}
        <div className="flex items-center gap-2 relative shrink-0">
          
          {/* Permanent Hindi Button */}
          <button 
            onClick={() => setSelectedLang("hi")}
            className={`px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-colors border ${
              selectedLang === "hi" 
                ? "bg-primary text-slate-950 border-primary shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                : "text-slate-400 border-slate-800 bg-slate-900 hover:text-white"
            }`}
          >
            Hindi (हिन्दी)
          </button>

          {/* Dynamic Regional Second Tab */}
          <button 
            onClick={() => setSelectedLang(customLang)}
            className={`px-3 py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-colors border ${
              selectedLang === customLang 
                ? "bg-primary text-slate-950 border-primary shadow-[0_0_10px_rgba(16,185,129,0.15)]" 
                : "text-slate-400 border-slate-800 bg-slate-900 hover:text-white"
            }`}
          >
            {getLanguageName(customLang)}
          </button>

          {/* Dropdown Toggle Button */}
          <div ref={dropdownRef} className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded flex items-center justify-center transition-colors"
              title="Search Regional Language"
            >
              <span className="material-symbols-outlined text-sm">search</span>
            </button>

            {/* Dropdown Menu Container */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 p-3 flex flex-col gap-2">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2 text-slate-500 text-xs">search</span>
                  <input 
                    type="text" 
                    placeholder="Search regional language..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 pl-7 pr-2 py-1 text-[11px] rounded border border-slate-850 focus:outline-none focus:border-primary font-sans"
                  />
                </div>
                
                <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCustomLang(lang.code);
                          setSelectedLang(lang.code);
                          setIsDropdownOpen(false);
                          setSearchQuery("");
                          
                          const now = new Date();
                          const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
                          setLogs((prev) => [
                            ...prev,
                            { timestamp: timeStr, agentName: "TranslationEngine", color: "text-primary", message: `User manually changed target language to [${lang.name}]` }
                          ]);
                        }}
                        className={`w-full text-left px-2 py-1.5 text-[10px] rounded transition-all flex items-center justify-between ${
                          customLang === lang.code 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "text-slate-400 hover:bg-slate-850 hover:text-white"
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-[8px] opacity-65 uppercase font-mono">{lang.state}</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-slate-600 text-[10px] text-center py-2 font-mono">No matching languages.</span>
                  )}
                </div>
              </div>
            )}
          </div>

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
              TARGET: {selectedLang === "hi" ? "HINDI (hi)" : `${getLanguageName(selectedLang).toUpperCase()} (${selectedLang})`}
            </span>
            <span className="material-symbols-outlined text-primary text-sm">done_all</span>
          </div>

          <div className="flex flex-col gap-5 py-2">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">शीर्षक / Title</label>
              <h3 className="text-white font-bold text-sm transition-all duration-300">
                {TRANSLATIONS[selectedLang]?.title || TRANSLATIONS.en.title}
              </h3>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">विवरण / Description</label>
              <p className="text-slate-400 text-xs leading-relaxed transition-all duration-300">
                {TRANSLATIONS[selectedLang]?.description || TRANSLATIONS.en.description}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">अनुशंसित कार्रवाई / Recommended Actions</label>
              <p className="text-slate-400 text-xs leading-relaxed transition-all duration-300">
                {TRANSLATIONS[selectedLang]?.actions || TRANSLATIONS.en.actions}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-primary uppercase font-bold tracking-widest font-mono">वैधानिक अनुपालन / Statutory Compliance</label>
              <p className="text-slate-400 text-xs leading-relaxed border-l-2 border-primary pl-3 italic bg-primary/5 py-2 rounded-r transition-all duration-300">
                {TRANSLATIONS[selectedLang]?.compliance || TRANSLATIONS.en.compliance}
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
