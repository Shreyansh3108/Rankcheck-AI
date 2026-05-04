# 🎯 RankCheck AI: The AEO Diagnostic Engine

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**🌐 Live Application:** [Insert Deployed Link Here](https://your-deployed-link-here.com)

> **Project Objective:** Architect an Answer Engine Optimization (AEO) diagnostic tool that concurrently queries multiple Large Language Models (LLMs) to generate a competitive benchmarking report for brands.

## 🚀 The Business Problem: The Shift to AEO
For over a decade, brands have optimized for traditional search engines (SEO). Today, consumer discovery is increasingly driven by generative AI assistants (ChatGPT, Gemini, Meta AI). This creates a visibility blind spot:
* Brands lack telemetry on whether AI models recommend their products.
* They cannot easily identify which competitors dominate AI-generated responses.
* They have no actionable data on the root causes of their ranking failures.

## 💡 The Solution
RankCheck AI is a full-stack diagnostic engine that simulates real-time AI product recommendations. It aggregates raw output from parallel endpoints and processes it through a secondary reasoning layer to deliver actionable business intelligence.

**Key Deliverables:**
* ⭐ **Visibility Score:** A quantitative metric of brand appearance across top model outputs.
* 🤖 **Cross-Model Benchmarking:** Exact positioning across diverse LLM endpoints.
* 🥇 **Competitor Extraction:** Automated identification of the primary AI-native threat.
* 🧠 **Root-Cause Diagnostics:** Contextual analysis of why the brand underperformed.
* 🚀 **Strategic Action Plan:** Data-driven marketing directives.

## ⚙️ System Architecture & Engineering Trade-offs

### 1. Hybrid API Strategy (Cost & Latency Optimization)
To deliver an enterprise-grade experience without the prohibitive latency and cost of serial proprietary API calls, the system utilizes a hybrid model architecture:
* **Data Aggregation Tier:** 
  * Meta Llama 3.1 (8B) via Groq (Ultra-low latency inference)
  * Meta Llama 3.3 (70B) via Groq
  * Google Gemini 2.5 Flash via Native SDK
* **Reasoning & Synthesis Tier:** 
  * Google Gemini 1.5 Pro (High-context strategy generation)

*Trade-off Result: Near-instantaneous data gathering combined with deep strategic reasoning, achieving zero-cost execution without sacrificing output quality.*

### 2. Parallel Orchestration & Data Flow
Sequential network requests create unacceptable UI bottlenecks. The backend resolves this by orchestrating concurrent API requests.
* Implemented `Promise.allSettled` to initiate all model queries simultaneously.
* Enforced strict timeout wrappers to prevent hanging connections.
* **Fault Tolerance:** Designed with graceful degradation. If an endpoint experiences a timeout or rate limit, the Node.js controller isolates the failure. The React client seamlessly renders partial data, ensuring the user experience remains intact rather than crashing the application.

## 🛠️ Technology Stack
* **Client:** React.js (Vite), Tailwind CSS v4, Lucide React (Icons).
* **Server:** Node.js, Express.js, CORS configuration.
* **AI Integrations:** Groq Cloud SDK, Google Generative AI SDK.

## 🔮 Scalability Roadmap
If extending this prototype for enterprise SaaS deployment, the following architecture upgrades would be prioritized:
1. **Visual Matrix UI:** Implement a comprehensive data grid mapping exact ordinal ranks (1st, 2nd, 3rd) across all historical queries.
2. **State Persistence:** Integrate PostgreSQL (via Prisma ORM) to track AEO performance deltas week-over-week.
3. **Resilient Networking:** Implement exponential backoff algorithms for rate-limited endpoints prior to triggering fallback UI states.

## 💻 Local Development Setup

### Prerequisites
* Node.js (v18+ recommended)
* API Keys from [Groq](https://console.groq.com/) and [Google AI Studio](https://aistudio.google.com/)

### Installation

**Step 1: Clone the repository**
```bash
git clone [https://github.com/Shreyansh3108/Rankcheck-AI.git](https://github.com/Shreyansh3108/Rankcheck-AI.git)
cd Rankcheck-AI
```

**Step 2: Initialize the Backend**
Open a terminal instance:
```bash
cd core-server
npm install
```
Create a `.env` file in the `/core-server` directory:
```env
PORT=5000
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```
Start the development server:
```bash
npm run dev
```

**Step 3: Initialize the Frontend**
Open a second terminal instance:
```bash
cd web-interface
npm install
npm run dev
```

**Step 4: Access the Application**
Navigate to `http://localhost:5173` in your preferred browser.