import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Activity, Target, AlertTriangle, Zap, CheckCircle2, XCircle } from 'lucide-react';

function App() {
  const [searchSubject, setSearchSubject] = useState('');
  const [targetBrand, setTargetBrand] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing search sequence...');
  const [systemError, setSystemError] = useState(null);
  
  const [insightData, setInsightData] = useState(null);

  // Dynamic loading sequence to keep user engaged during the 15-20s wait
  useEffect(() => {
    let intervalId;
    if (isProcessing) {
      const sequence = [
        "Querying Meta Llama 3.1 (8B)...",
        "Cross-referencing with Llama 3.3 (70B)...",
        "Analyzing data via Gemini 2.5 Flash...",
        "Evaluating brand visibility vectors...",
        "Generating strategic action plan..."
      ];
      let step = 0;
      setLoadingText(sequence[0]);
      
      intervalId = setInterval(() => {
        step++;
        if (step < sequence.length) {
          setLoadingText(sequence[step]);
        }
      }, 3500);
    }
    return () => clearInterval(intervalId);
  }, [isProcessing]);

  const executeAnalysis = async (e) => {
    e.preventDefault();
    if (!searchSubject || !targetBrand) return;

    setIsProcessing(true);
    setSystemError(null);
    setInsightData(null);

    try {
      const networkResponse = await axios.post('https://rankcheck-ai.onrender.com/api/analyze', {
        query: searchSubject,
        brand: targetBrand
      });
      
      setInsightData(networkResponse.data);
    } catch (fault) {
      setSystemError("Engine timeout or connection failure. Please try again.");
      console.error(fault);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderModelResult = (modelName, data) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{modelName}</h3>
      {data ? (
        <ol className="text-slate-200 text-sm leading-relaxed space-y-1 list-decimal list-inside marker:text-indigo-400">
          {data.split(',').map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
        </ol>
      ) : (
        <p className="text-red-400 text-sm flex items-center gap-1"><XCircle size={14}/> Query Failed</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-indigo-500" />
            <h1 className="text-xl font-bold tracking-tight">RankCheck<span className="text-indigo-500">AI</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Analyze AI Search Visibility</h2>
          <form onSubmit={executeAnalysis} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Query (e.g., best protein powder)" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                disabled={isProcessing}
                required
              />
            </div>
            <div className="md:col-span-5 relative">
              <Target className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Target Brand (e.g., Optimum Nutrition)" 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500 transition-colors"
                value={targetBrand}
                onChange={(e) => setTargetBrand(e.target.value)}
                disabled={isProcessing}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-medium rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? <Activity className="animate-spin" size={18} /> : "Run Audit"}
            </button>
          </form>
          
          {/* Dynamic Loading State */}
          {isProcessing && (
            <div className="mt-6 flex items-center justify-center gap-3 text-indigo-400 animate-pulse">
              <Activity size={18} />
              <span className="text-sm font-medium">{loadingText}</span>
            </div>
          )}

          {/* Error State */}
          {systemError && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 flex items-center gap-2 text-sm">
              <AlertTriangle size={16} />
              {systemError}
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {insightData && !isProcessing && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Score & Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Score Card */}
              {/* Score & Competitor Card */}
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col justify-center items-center text-center">
                <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-xs">Visibility Score</p>
                <div className={`text-6xl font-bold mb-2 ${insightData.visibilityScore > 5 ? 'text-emerald-400' : insightData.visibilityScore > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {insightData.visibilityScore}<span className="text-2xl text-slate-500">/10</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 px-2">
                  Scored based on frequency of appearance across the top 3 spots in our parallel AI endpoints.
                </p>
                {insightData.modelBreakdown.gemini && (
                   <div className="w-full mt-2 pt-4 border-t border-slate-700">
                     <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Top Competitor</p>
                     <p className="text-sm font-bold text-indigo-400">{insightData.topCompetitor || "Multiple"}</p>
                   </div>
                )}
              </div>

              {/* Models Breakdown */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderModelResult('Llama 3.1 (8B)', insightData.modelBreakdown.llama)}
                {renderModelResult('Llama 3.3 (70B)', insightData.modelBreakdown.mistral)}
                {renderModelResult('Gemini 2.5 Flash', insightData.modelBreakdown.gemini)}
              </div>
            </div>

            {/* Strategic Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why Not Ranking */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                  <AlertTriangle className="text-amber-400" size={20} />
                  <h3 className="text-lg font-bold">Why You Didn't Rank Higher</h3>
                </div>
                <ul className="space-y-4">
                  {insightData.whyNotRanking.map((reason, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                      <XCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Plan */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                  <Zap className="text-emerald-400" size={20} />
                  <h3 className="text-lg font-bold">Growth Action Plan</h3>
                </div>
                <ul className="space-y-4">
                  {insightData.actionPlan.map((action, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}

export default App;