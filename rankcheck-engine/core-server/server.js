const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const appGateway = express();
const activePort = process.env.PORT || 5000;

appGateway.use(cors());
appGateway.use(express.json());

const groqProvider = new Groq({ apiKey: process.env.GROQ_API_KEY });
const geminiProvider = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const enforceTimeLimit = (targetTask, maxWaitMs) => {
    return Promise.race([
        targetTask,
        new Promise((_, triggerFail) =>
            setTimeout(() => triggerFail(new Error("TimeoutExceeded")), maxWaitMs)
        )
    ]);
};

const fetchLlamaRanks = async (userSearch) => {
    const rawLlamaResponse = await groqProvider.chat.completions.create({
        messages: [
            { role: "system", content: "You are an e-commerce assistant. Provide the top 3 recommended product brands for the user query. Output strictly as a comma-separated list of brand names." },
            { role: "user", content: userSearch }
        ],
        model: "llama-3.1-8b-instant",
    });
    return rawLlamaResponse.choices[0].message.content;
};

const fetchMistralRanks = async (userSearch) => {
    const rawMistralResponse = await groqProvider.chat.completions.create({
        messages: [
            { role: "system", content: "You are an e-commerce assistant. Provide the top 3 recommended product brands for the user query. Output strictly as a comma-separated list of brand names." },
            { role: "user", content: userSearch }
        ],
        model: "llama-3.3-70b-versatile",
    });
    return rawMistralResponse.choices[0].message.content;
};

const fetchGeminiRanks = async (userSearch) => {
    const coreModel = geminiProvider.getGenerativeModel({ model: "gemini-2.5-flash" });
    const systemDirective = "You are an e-commerce assistant. Provide the top 3 recommended product brands for the user query. Output strictly as a comma-separated list of brand names. Query: ";
    const rawGeminiResponse = await coreModel.generateContent(systemDirective + userSearch);
    return rawGeminiResponse.response.text();
};

const evaluateBrandPresence = (aiText, brandTarget) => {
    if (!aiText) return 0;
    const normalizedText = aiText.toLowerCase();
    const normalizedBrand = brandTarget.toLowerCase();
    if (normalizedText.includes(normalizedBrand)) return 1;
    return 0;
};

const generateStrategicInsights = async (searchSubject, targetBrand, rawExtraction) => {
    const coreModel = geminiProvider.getGenerativeModel({ model: "gemini-2.5-flash" });
    const analysisPrompt = `
    You are an analytical brand strategist.
    Query: "${searchSubject}". Target Brand: "${targetBrand}".

    AI Recommendations:
    Llama 3.1: ${rawExtraction.llama || 'None'}
    Llama 3.3: ${rawExtraction.mistral || 'None'}
    Gemini 2.5: ${rawExtraction.gemini || 'None'}

    Identify the most frequently mentioned competing brand across these 3 models.
    
    Return a strict JSON object. Do not use markdown backticks.
    {
      "topCompetitor": "Brand Name",
      "whyNotRanking": ["Direct reason 1", "Direct reason 2"],
      "actionPlan": ["Specific marketing action 1", "Specific marketing action 2"]
    }
    `;
    try {
        const strategyResponse = await coreModel.generateContent(analysisPrompt);
        const cleanedPayload = strategyResponse.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedPayload);
    } catch (fault) {
        return {
            whyNotRanking: ["Insufficient data to determine.", "Competitors have stronger AI associations.", "Brand awareness gap."],
            actionPlan: ["Increase brand mentions in related articles.", "Optimize product descriptions.", "Boost customer reviews mentioning specific keywords."]
        };
    }
};

appGateway.post('/api/analyze', async (inboundReq, outboundRes) => {
    try {
        const searchSubject = inboundReq.body.query;
        const targetBrand = inboundReq.body.brand;

        if (!searchSubject || !targetBrand) {
            return outboundRes.status(400).json({ statusError: "PayloadIncomplete" });
        }

        const thresholdMs = 20000;

        const concurrentThreads = await Promise.allSettled([
            enforceTimeLimit(fetchLlamaRanks(searchSubject), thresholdMs),
            enforceTimeLimit(fetchMistralRanks(searchSubject), thresholdMs),
            enforceTimeLimit(fetchGeminiRanks(searchSubject), thresholdMs)
        ]);

        concurrentThreads.forEach((promise, index) => {
            if (promise.status === 'rejected') {
                const models = ['Llama 3.1', 'Gemma 2', 'Gemini Pro'];
                console.log(`\n❌ ${models[index]} API FAILED:`);
                console.log(promise.reason.message || promise.reason);
            }
        });

        const llamaPayload = concurrentThreads[0].status === 'fulfilled' ? concurrentThreads[0].value : null;
        const mistralPayload = concurrentThreads[1].status === 'fulfilled' ? concurrentThreads[1].value : null;
        const geminiPayload = concurrentThreads[2].status === 'fulfilled' ? concurrentThreads[2].value : null;

        const rawExtraction = {
            llama: llamaPayload,
            mistral: mistralPayload,
            gemini: geminiPayload
        };

        const llamaScore = evaluateBrandPresence(llamaPayload, targetBrand);
        const mistralScore = evaluateBrandPresence(mistralPayload, targetBrand);
        const geminiScore = evaluateBrandPresence(geminiPayload, targetBrand);
        
        const totalScore = llamaScore + mistralScore + geminiScore;
        const visibilityMetric = Math.round((totalScore / 3) * 10);

        const strategicData = await generateStrategicInsights(searchSubject, targetBrand, rawExtraction);

        return outboundRes.status(200).json({
            subject: searchSubject,
            brand: targetBrand,
            visibilityScore: visibilityMetric,
            modelBreakdown: rawExtraction,
            topCompetitor: strategicData.topCompetitor,
            whyNotRanking: strategicData.whyNotRanking,
            actionPlan: strategicData.actionPlan
        });

    } catch (systemCrash) {
        console.log("CRITICAL SYSTEM CRASH:", systemCrash);
        return outboundRes.status(500).json({ systemError: systemCrash.message });
    }
});

appGateway.get('/api/health', (inboundReq, outboundRes) => {
    outboundRes.status(200).json({
        systemState: "online",
        stamp: new Date().toISOString()
    });
});

appGateway.listen(activePort, () => {
    console.log(`Gateway active on port ${activePort}`);
});