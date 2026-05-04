# 🎯 RankCheck AI: The AEO Diagnostic Engine

**🌐 Live Demo:** [Insert Deployed Link Here](https://your-deployed-link-here.com)

> **The Assignment:** Build an AEO diagnostic tool that queries multiple AI models (like GPT, Claude, Gemini) and generates a report card showing how a product ranks vs competitors.

## 🚀 The Problem: From SEO → AEO
Brands have spent years optimizing for search engines (SEO). But today, buying decisions are increasingly influenced by AI assistants like ChatGPT, Gemini, and Meta AI.
* **Brands don’t know if they are being recommended.**
* **They don’t know which competitors dominate AI responses.**
* **They have no visibility into why they are not ranking.**

## 💡 The Solution: RankCheck AI
RankCheck AI simulates how AI models recommend products in real-time and converts that raw data into actionable business intelligence. It provides:
⭐ **Visibility Score** (how often your brand appears)
🤖 **Model-wise ranking breakdown**
🥇 **Top AI-native competitor**
🧠 **Diagnostic root-cause analysis**
🚀 **Actionable growth plan**

## 🧠 Architecture & Strategic Decisions

### 1. ⚡ API Strategy (Speed + Cost Optimization)
Instead of relying on expensive paid APIs, the system uses a highly optimized hybrid AI stack:
* **LLaMA 3.1 (8B)** → via Groq (ultra-fast inference)
* **LLaMA 3.3 (70B)** → via Groq
* **Gemini 2.5 Flash** → via Google GenAI
* **Gemini 1.5 Pro** → Insight generation (reasoning + strategy)
*Result: Zero-cost execution, low latency, and enterprise-grade outputs.*

### 2. ⚙️ Parallel Orchestration & Fault Tolerance
* All model calls run concurrently using `Promise.allSettled`.
* Each request has strict timeout protection.
* **Graceful Degradation:** If one model fails, the system isolates the failure and safely renders partial UI results without crashing.

### 3. 🧠 Insight Engine (Key Differentiator)
A second-stage AI layer acts as a "Brand Strategist." It identifies the top competitor, explains the ranking gaps, and generates clear action steps. *This transforms raw AI output into business decisions.*

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS v4, Lucide Icons
* **Backend:** Node.js, Express.js
* **AI Integration:** Groq SDK, Google Generative AI SDK

## 🔮 Future Improvements (If Scaled)
* **Ranking Comparison Matrix:** Show exact rank (1st, 2nd, 3rd) across models in a visual table.
* **Historical Tracking:** Store scores in PostgreSQL to track AEO performance over time.
* **Retry + Backoff Logic:** Handle rate limits intelligently before defaulting to error states.

## 💻 How to Run Locally

1. Clone the repository.
2. Open two terminal instances (one for the backend, one for the frontend).
3. **Backend Setup:**
   ```bash
   cd core-server
   npm install
   ```
   *Create a `.env` file in the `core-server` directory and add your keys:*
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```
   *Start the server:*
   ```bash
   npm run dev
   ```
4. **Frontend Setup:**
   ```bash
   cd web-interface
   npm install
   npm run dev
   ```
5. Navigate to `http://localhost:5173` in your browser.