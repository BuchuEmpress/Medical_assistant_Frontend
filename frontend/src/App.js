import React, { useState, createContext, useContext } from 'react';
import { Send, Moon, Sun, Menu, X, Brain, FileText, Image, Search, Heart, Upload, Loader2, Globe } from 'lucide-react';

import axios from "axios";

function App() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedConversation = [
      ...conversation,
      { role: "user", content: input }
    ];

    setConversation(updatedConversation);
    setInput("");

    try {
      const response = await axios.post("https://medical-assistant-1-a1cg.onrender.com", {
        messages: updatedConversation
      });

      setConversation([
        ...updatedConversation,
        { role: "assistant", content: response.data.reply }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Medical Care AI Chat</h2>
      <div style={{ marginBottom: "20px" }}>
        {conversation.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "80%", padding: "10px" }}
      />
      <button onClick={handleSend} style={{ padding: "10px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}




const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);
  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};
const useTheme = () => useContext(ThemeContext);

const LanguageContext = createContext();
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const translations = {
    en: {
      home: 'Home', chat: 'Chat', textAnalysis: 'Text Analysis', imageAnalysis: 'Image Analysis', research: 'Research',
      welcomeTo: 'Welcome to', tagline: 'Your AI-powered medical assistant for Cameroon',
      aiChat: 'AI-Powered Chat', aiChatDesc: 'Interactive health conversation',
      textAnalysisTitle: 'Medical Text Analysis', textAnalysisDesc: 'Insights from patient records',
      imageAnalysisTitle: 'Analyze Medical Images', imageAnalysisDesc: 'AI-based image interpretation',
      researchTitle: 'Medical Research Search', researchDesc: 'Search trusted medical sources',
      tryNow: 'Try it now', disclaimer: '⚠️ This is an AI assistant for informational purposes only. Always consult qualified healthcare professionals.',
      hello: 'Hello! How can I assist you today? ✨', askQuestion: 'Ask a medical question...', send: 'Send',
      enterText: 'Enter Medical Text', textPlaceholder: 'Paste or type medical records, symptoms, test results...',
      analyzeText: 'Analyze Text', analyzing: 'Analyzing...', results: 'Analysis Results',
      summary: 'Summary', keyFindings: 'Key Findings', recommendations: 'Recommendations', nextSteps: 'Next Steps',
      uploadImage: 'Upload Medical Image', clickUpload: 'Click to upload medical image',
      fileInfo: 'PNG, JPG, JPEG up to 10MB', analyzeImage: 'Analyze Image', extractedText: 'Extracted Text',
      searchMedical: 'Search Medical Information', searchPlaceholder: 'e.g., diabetes treatment, COVID-19 symptoms...',
      sources: 'Sources', readMore: 'Read more'
    },
    fr: {
      home: 'Accueil', chat: 'Discussion', textAnalysis: 'Analyse de Texte', imageAnalysis: 'Analyse d\'Image', research: 'Recherche',
      welcomeTo: 'Bienvenue sur', tagline: 'Votre assistant médical IA pour le Cameroun',
      aiChat: 'Discussion IA', aiChatDesc: 'Conversation santé interactive',
      textAnalysisTitle: 'Analyse de Texte Médical', textAnalysisDesc: 'Informations des dossiers patients',
      imageAnalysisTitle: 'Analyser Images Médicales', imageAnalysisDesc: 'Interprétation d\'images par IA',
      researchTitle: 'Recherche Médicale', researchDesc: 'Rechercher sources médicales fiables',
      tryNow: 'Essayer maintenant', disclaimer: '⚠️ Ceci est un assistant IA à titre informatif uniquement. Consultez toujours des professionnels de santé qualifiés.',
      hello: 'Bonjour! Comment puis-je vous aider aujourd\'hui? ✨', askQuestion: 'Posez une question médicale...',
      send: 'Envoyer', enterText: 'Entrez le Texte Médical', textPlaceholder: 'Collez ou tapez dossiers médicaux, symptômes, résultats...',
      analyzeText: 'Analyser le Texte', analyzing: 'Analyse en cours...', results: 'Résultats de l\'Analyse',
      summary: 'Résumé', keyFindings: 'Résultats Clés', recommendations: 'Recommandations', nextSteps: 'Prochaines Étapes',
      uploadImage: 'Télécharger Image Médicale', clickUpload: 'Cliquez pour télécharger l\'image médicale',
      fileInfo: 'PNG, JPG, JPEG jusqu\'à 10MB', analyzeImage: 'Analyser l\'Image', extractedText: 'Texte Extrait',
      searchMedical: 'Rechercher Informations Médicales', searchPlaceholder: 'ex: traitement diabète, symptômes COVID-19...',
      sources: 'Sources', readMore: 'Lire la suite'
    }
  };
  const t = translations[language];
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};
const useLanguage = () => useContext(LanguageContext);

function LanguageSelector() {
  const { isDark } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${isDark ? 'bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300' : 'bg-teal-100 hover:bg-teal-200 text-teal-600'}`}>
        <Globe className="w-5 h-5 animate-pulse" />
        <span className="text-xl">{languages.find(l => l.code === language)?.flag}</span>
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-50 ${isDark ? 'bg-teal-800 border border-teal-600' : 'bg-white border border-gray-200'}`}>
          {languages.map(lang => (
            <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsOpen(false); }} className={`w-full px-4 py-3 flex items-center space-x-3 transition-all ${language === lang.code ? (isDark ? 'bg-teal-600' : 'bg-teal-100') : ''} ${isDark ? 'hover:bg-teal-700' : 'hover:bg-gray-100'}`}>
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && <span className="ml-auto text-teal-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navigation({ currentPage, setCurrentPage }) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: 'home', label: t.home },
    { id: 'chat', label: t.chat },
    { id: 'text-analysis', label: t.textAnalysis },
    { id: 'image-analysis', label: t.imageAnalysis },
    { id: 'research', label: t.research }
  ];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md ${isDark ? 'bg-teal-900/80' : 'bg-white/80'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-teal-400 to-cyan-500' : 'bg-gradient-to-br from-teal-500 to-cyan-600'}`}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">MediCare AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`hover:text-teal-500 transition-colors ${currentPage === item.id ? 'text-teal-500 font-semibold' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.label}
              </button>
            ))}
            <LanguageSelector />
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button onClick={toggleTheme} className="p-2">{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-teal-800' : 'bg-white'} border-t ${isDark ? 'border-teal-700' : 'border-gray-200'}`}>
          <div className="px-4 py-3 space-y-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }} className="block w-full text-left py-2 hover:text-teal-500">{item.label}</button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function HomePage({ setCurrentPage }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const features = [
    { id: 'chat', icon: <Brain className="w-12 h-12" />, title: t.aiChat, description: t.aiChatDesc, color: 'from-blue-100 to-blue-200', iconColor: 'text-blue-600' },
    { id: 'text-analysis', icon: <FileText className="w-12 h-12" />, title: t.textAnalysisTitle, description: t.textAnalysisDesc, color: 'from-green-100 to-green-200', iconColor: 'text-green-600' },
    { id: 'image-analysis', icon: <Image className="w-12 h-12" />, title: t.imageAnalysisTitle, description: t.imageAnalysisDesc, color: 'from-red-100 to-red-200', iconColor: 'text-red-600' },
    { id: 'research', icon: <Search className="w-12 h-12" />, title: t.researchTitle, description: t.researchDesc, color: 'from-purple-100 to-purple-200', iconColor: 'text-purple-600' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">{t.welcomeTo} <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">MediCare AI</span></h1>
        <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t.tagline}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
        {features.map((feature) => (
          <div key={feature.id} onClick={() => setCurrentPage(feature.id)} className={`rounded-2xl p-6 shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${isDark ? 'bg-gradient-to-br from-teal-800/50 to-cyan-900/50 backdrop-blur-sm' : `bg-gradient-to-br ${feature.color}`}`}>
            <div className={`${feature.iconColor} mb-4`}>{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feature.description}</p>
            <button className="mt-4 text-teal-500 font-semibold hover:text-teal-600">{t.tryNow} →</button>
          </div>
        ))}
      </div>
      <div className="text-center py-8">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.disclaimer}</p>
      </div>
    </main>
  );
}

function ChatPage() {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ type: 'ai', text: t.hello }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setChatInput('');
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language })
      });
      //for token exhaustion
       if (response.status === 429) {
        setMessages(prev => [...prev, { type: 'ai', text: '⚠️ You’ve reached your daily chat limit. Please try again later.' }]);
        return;
      }
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'ai', text: 'Error: Unable to connect. Please ensure backend is running.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.aiChat}</h1>
      <div className={`rounded-2xl p-6 shadow-2xl min-h-[500px] flex flex-col ${isDark ? 'bg-teal-800/50' : 'bg-teal-50'}`}>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-lg ${msg.type === 'user' ? (isDark ? 'bg-teal-600 text-white' : 'bg-teal-500 text-white') : (isDark ? 'bg-teal-900/50' : 'bg-white')}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-teal-900/50' : 'bg-white'}`}>
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={t.askQuestion} className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${isDark ? 'bg-teal-900/50 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`} />
          <button onClick={handleSendMessage} disabled={isLoading} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

function TextAnalysisPage() {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/analyze-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context: '', language })
      });

       // for token exhaustion
      if (response.status === 429) {
        alert("⚠️ You've reached your daily analysis limit. Please try again later.");
        return;
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      alert('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.textAnalysisTitle}</h1>
      <div className={`rounded-2xl p-6 shadow-2xl mb-6 ${isDark ? 'bg-teal-800/50' : 'bg-green-50'}`}>
        <label className="block text-lg font-semibold mb-3">{t.enterText}</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.textPlaceholder} rows="8" className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? 'bg-teal-900/50 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`} />
        <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50">
          {isLoading ? <span className="flex items-center"><Loader2 className="w-5 h-5 animate-spin mr-2" />{t.analyzing}</span> : t.analyzeText}
        </button>
      </div>
      {analysis && (
        <div className={`rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-teal-800/50' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4">{t.results}</h2>
          <div className="space-y-4">
            <div><h3 className="font-semibold text-lg mb-2">{t.summary}</h3><p>{analysis.summary}</p></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.keyFindings}</h3><ul className="list-disc list-inside space-y-1">{analysis.key_findings?.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.recommendations}</h3><ul className="list-disc list-inside space-y-1">{analysis.recommendations?.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.nextSteps}</h3><ul className="list-disc list-inside space-y-1">{analysis.next_steps?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
            <p className="text-sm text-gray-500 italic mt-4">{analysis.disclaimer}</p>
          </div>
        </div>
      )}
    </main>
  );
}

function ImageAnalysisPage() {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/analyze-image`, {
        method: 'POST',
        body: formData
      });

       //for token exhaustion
      if (response.status === 429) {
       alert("⚠️ You've reached your daily image analysis limit. Please try again later.");
        return;
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      alert('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.imageAnalysisTitle}</h1>
      <div className={`rounded-2xl p-6 shadow-2xl mb-6 ${isDark ? 'bg-teal-800/50' : 'bg-red-50'}`}>
        <label className="block text-lg font-semibold mb-3">{t.uploadImage}</label>
        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDark ? 'border-teal-600' : 'border-red-300'}`}>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">{t.clickUpload}</p>
            <p className="text-sm text-gray-500">{t.fileInfo}</p>
          </label>
        </div>
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50">
              {isLoading ? <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin mr-2" />{t.analyzing}</span> : t.analyzeImage}
            </button>
          </div>
        )}
      </div>
      {analysis && (
        <div className={`rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-teal-800/50' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4">{t.results}</h2>
          <div className="space-y-4">
            <div><h3 className="font-semibold text-lg mb-2">{t.extractedText}</h3><p className={`p-3 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{analysis.extracted_text}</p></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.summary}</h3><p>{analysis.analysis?.summary}</p></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.keyFindings}</h3><ul className="list-disc list-inside space-y-1">{analysis.analysis?.key_findings?.map((f, i) => <li key={i}>{f}</li>)}</ul></div>
            <div><h3 className="font-semibold text-lg mb-2">{t.recommendations}</h3><ul className="list-disc list-inside space-y-1">{analysis.analysis?.recommendations?.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
          </div>
        </div>
      )}
    </main>
  );
}

function ResearchPage() {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, max_results: 5, language })
      });

      // for token exhaustion
      if (response.status === 429) {
        alert("⚠️ You've reached your monthly research limit. Please try again later.");
        return;
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.researchTitle}</h1>
      <div className={`rounded-2xl p-6 shadow-2xl mb-6 ${isDark ? 'bg-teal-800/50' : 'bg-purple-50'}`}>
        <label className="block text-lg font-semibold mb-3">{t.searchMedical}</label>
        <div className="flex space-x-2">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} placeholder={t.searchPlaceholder} className={`flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDark ? 'bg-teal-900/50 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`} />
          <button onClick={handleSearch} disabled={isLoading} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {results && (
        <div className="space-y-6">
          <div className={`rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-teal-800/50' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">{t.summary}</h2>
            <p>{results.summary}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">{t.sources}</h2>
            {results.results?.map((result, idx) => (
              <div key={idx} className={`rounded-2xl p-6 shadow-xl mb-4 ${isDark ? 'bg-teal-800/50' : 'bg-white'}`}>
                <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                <p className="text-sm mb-2">{result.content}</p>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600 text-sm">{t.readMore} →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// trigger redeploy

function MediCareApp() {
  const { isDark } = useTheme();
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'}`}>
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'chat' && <ChatPage />}
      {currentPage === 'text-analysis' && <TextAnalysisPage />}
      {currentPage === 'image-analysis' && <ImageAnalysisPage />}
      {currentPage === 'research' && <ResearchPage />}
    </div>
  );
}

// export default function App() {
//   return (
//     <ThemeProvider>
//       <LanguageProvider>
//         <MediCareApp />
//       </LanguageProvider>
//     </ThemeProvider>
//   );
// }

