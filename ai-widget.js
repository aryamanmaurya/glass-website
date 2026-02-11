// ai-widget.js - Complete Optimized Version
// Uses TinyLlama (0.6GB) + Knowledge Base isolation

(function() {
    'use strict';
    
    const CONFIG = {
        ollamaUrl: 'http://localhost:11434',
        model: 'tinyllama:latest', // 0.6GB - minimal general knowledge exposure
        temperature: 0.1, // Low creativity = less hallucination
        maxTokens: 150,   // Short answers = faster
        useStrictMode: true // Only use provided context
    };

    // ═══════════════════════════════════════════════════════════════
    // BUSINESS KNOWLEDGE BASE - ONLY SOURCE OF TRUTH
    // ═══════════════════════════════════════════════════════════════
    const KNOWLEDGE_BASE = {
        // Services with detailed info
        services: {
            windows: {
                keywords: ["window", "glass window", "window installation", "window fitting", "window price", "window cost"],
                title: "Window Glass Installation",
                price: "Starting from ₹2,500 per window",
                details: "Includes plain, tempered, and frosted glass options. Free site measurement. Warranty included.",
                timeframe: "1-2 days installation"
            },
            shower: {
                keywords: ["shower", "shower door", "bathroom glass", "shower enclosure", "shower price"],
                title: "Shower Door Installation",
                price: "Starting from ₹8,000",
                details: "Frameless and framed options. Premium hardware. Waterproof sealing. 5-year warranty.",
                timeframe: "Same day installation"
            },
            mirror: {
                keywords: ["mirror", "wall mirror", "bathroom mirror", "mirror fitting", "mirror installation"],
                title: "Mirror Installation",
                price: "Starting from ₹1,500",
                details: "All sizes and shapes. Wall-mounted or stand. Beveled edges available. Safety backing.",
                timeframe: "2-3 hours"
            },
            partition: {
                keywords: ["partition", "glass partition", "office partition", "room divider", "glass wall"],
                title: "Glass Partition Walls",
                price: "Starting from ₹15,000",
                details: "Office cabins, room dividers, soundproof options. Custom designs. Professional finish.",
                timeframe: "2-3 days"
            },
            emergency: {
                keywords: ["emergency", "urgent", "broken glass", "crack", "repair", "accident", "shattered"],
                title: "Emergency Glass Repair",
                price: "Call for quote - 24/7 service",
                details: "Rapid response within 1-2 hours. Temporary boarding if needed. Insurance claims assistance.",
                timeframe: "Immediate response"
            },
            sliding: {
                keywords: ["sliding door", "sliding glass", "patio door", "sliding window"],
                title: "Sliding Glass Doors",
                price: "Starting from ₹12,000",
                details: "Smooth track systems. Safety glass. Locking mechanisms. Weatherproof seals.",
                timeframe: "1 day"
            }
        },

        // Business info
        business: {
            name: "Raju Glass Fitting & Services",
            experience: "10+ years",
            established: "2014",
            projects: "500+ completed projects",
            satisfaction: "100% customer satisfaction",
            warranty: "All work guaranteed with warranty"
        },

        // Contact & location
        contact: {
            phone: "+91-81467-15800",
            whatsapp: "918146715800",
            email: "rajuglassfitting@gmail.com",
            address: "Mohali, Punjab"
        },

        // Service areas
        areas: {
            primary: ["Mohali", "Chandigarh", "Panchkula"],
            secondary: ["Zirakpur", "Kharar", "Dera Bassi"],
            coverage: "20km radius free visit"
        },

        // Working hours
        hours: {
            regular: "Monday to Saturday, 9:00 AM to 7:00 PM",
            emergency: "24/7 for urgent repairs",
            sunday: "Closed (except emergencies)"
        },

        // Policies
        policies: {
            quote: "Free site visit and quotation",
            measurement: "Free measurement at your location",
            consultation: "Free design consultation",
            warranty: "1-5 years warranty depending on service"
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SMART SEARCH ENGINE
    // ═══════════════════════════════════════════════════════════════
    function findRelevantKnowledge(question) {
        const lowerQ = question.toLowerCase();
        const matches = [];
        const scores = new Map();

        // Score services
        for (const [key, service] of Object.entries(KNOWLEDGE_BASE.services)) {
            let score = 0;
            for (const keyword of service.keywords) {
                if (lowerQ.includes(keyword.toLowerCase())) {
                    score += keyword.split(' ').length; // Multi-word matches worth more
                }
            }
            if (score > 0) {
                scores.set(`service:${key}`, { type: 'service', data: service, score });
            }
        }

        // Score other categories
        const categoryKeywords = {
            'contact': ['phone', 'call', 'contact', 'whatsapp', 'number', 'reach'],
            'areas': ['area', 'location', 'where', 'serve', 'city', 'place', 'near'],
            'hours': ['time', 'hour', 'open', 'close', 'when', 'available', 'timing'],
            'experience': ['experience', 'year', 'old', 'established', 'how long'],
            'pricing': ['price', 'cost', 'rate', 'charge', 'how much', 'expensive', 'cheap']
        };

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            let score = 0;
            for (const kw of keywords) {
                if (lowerQ.includes(kw)) score++;
            }
            if (score > 0) {
                scores.set(`category:${category}`, { type: 'category', data: category, score });
            }
        }

        // Sort by score
        const sorted = Array.from(scores.entries())
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 2); // Top 2 matches

        return sorted.map(([key, value]) => value);
    }

    // ═══════════════════════════════════════════════════════════════
    // CONTEXT BUILDER - Creates isolated knowledge context
    // ═══════════════════════════════════════════════════════════════
    function buildContext(matches, question) {
        let context = "YOU ARE RAJU GLASS FITTING AI ASSISTANT.\n";
        context += "USE ONLY THIS INFORMATION TO ANSWER:\n\n";
        
        for (const match of matches) {
            if (match.type === 'service') {
                const s = match.data;
                context += `SERVICE: ${s.title}\n`;
                context += `Price: ${s.price}\n`;
                context += `Details: ${s.details}\n`;
                context += `Time: ${s.timeframe}\n\n`;
            }
        }

        // Always include contact info
        context += `CONTACT: ${KNOWLEDGE_BASE.contact.phone}\n`;
        context += `AREAS: ${KNOWLEDGE_BASE.areas.primary.join(', ')}\n`;
        context += `HOURS: ${KNOWLEDGE_BASE.hours.regular}\n`;
        context += `EXPERIENCE: ${KNOWLEDGE_BASE.business.experience}\n\n`;
        
        context += "RULES:\n";
        context += "- Answer ONLY using the above information\n";
        context += "- If unsure, say 'Please call for details'\n";
        context += "- Be concise (2-3 sentences max)\n";
        context += "- Include phone number in every answer\n\n";

        return context;
    }

    // ═══════════════════════════════════════════════════════════════
    // FALLBACK ANSWERS (No AI needed for common questions)
    // ═══════════════════════════════════════════════════════════════
    function getDirectAnswer(question) {
        const lowerQ = question.toLowerCase();

        // Exact match patterns
        const patterns = [
            {
                test: /(hello|hi|hey|namaste)/i,
                answer: `Hello! Welcome to ${KNOWLEDGE_BASE.business.name}. How can I help you with glass fitting services today?`
            },
            {
                test: /(thank|thanks|dhanyavad)/i,
                answer: "You're welcome! Feel free to call us at +91-81467-15800 anytime. Have a great day!"
            },
            {
                test: /(bye|goodbye|see you)/i,
                answer: "Goodbye! Contact us at +91-81467-15800 when you're ready. We're here to help!"
            },
            {
                test: /(services|what do you do|offer)/i,
                answer: `We offer: Window Installation, Shower Doors, Mirrors, Glass Partitions, Sliding Doors, and Emergency Repairs. All with ${KNOWLEDGE_BASE.business.experience} of experience. Call +91-81467-15800 for details.`
            },
            {
                test: /(price|cost|rate).*all|list of price/i,
                answer: `Our pricing: Windows ₹2,500+, Shower Doors ₹8,000+, Mirrors ₹1,500+, Partitions ₹15,000+, Sliding Doors ₹12,000+. Free quotes available. Call +91-81467-15800.`
            }
        ];

        for (const p of patterns) {
            if (p.test.test(lowerQ)) return p.answer;
        }

        return null; // Need AI processing
    }

    // ═══════════════════════════════════════════════════════════════
    // MAIN PROCESSING FUNCTION
    // ═══════════════════════════════════════════════════════════════
    async function processQuestion(question) {
        // Step 1: Check direct patterns (instant, no AI)
        const directAnswer = getDirectAnswer(question);
        if (directAnswer) {
            return { answer: directAnswer, source: 'direct', confidence: 'high' };
        }

        // Step 2: Search knowledge base
        const matches = findRelevantKnowledge(question);
        
        if (matches.length === 0) {
            return { 
                answer: "I don't have specific information about that. Please call Raju Glass Fitting at +91-81467-15800 or WhatsApp us for assistance.",
                source: 'fallback',
                confidence: 'low'
            };
        }

        // Step 3: Build isolated context
        const context = buildContext(matches, question);

        // Step 4: Use TinyLlama ONLY as formatter (constrained)
        try {
            const response = await fetch(`${CONFIG.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: CONFIG.model,
                    prompt: `${context}Question: ${question}\n\nAnswer (2 sentences, include phone):`,
                    stream: false,
                    options: {
                        temperature: CONFIG.temperature,
                        num_predict: CONFIG.maxTokens,
                        stop: ["\n\n", "User:", "Question:"]
                    }
                })
            });

            if (!response.ok) throw new Error('Ollama error');

            const data = await response.json();
            let answer = data.response.trim();

            // Post-process: Ensure phone number is included
            if (!answer.includes('+91-81467-15800')) {
                answer += ` Call +91-81467-15800 for more details.`;
            }

            return {
                answer: answer,
                source: 'ai-constrained',
                confidence: 'medium',
                context: matches.map(m => m.data.title || m.data)
            };

        } catch (error) {
            console.error('AI Error:', error);
            
            // Fallback to template if AI fails
            if (matches[0].type === 'service') {
                const s = matches[0].data;
                return {
                    answer: `${s.title}: ${s.price}. ${s.details}. Time: ${s.timeframe}. Call +91-81467-15800.`,
                    source: 'template-fallback',
                    confidence: 'medium'
                };
            }

            return {
                answer: "I'm having trouble processing that. Please call us directly at +91-81467-15800.",
                source: 'error',
                confidence: 'low'
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // WIDGET UI (Same professional design)
    // ═══════════════════════════════════════════════════════════════
    function initWidget() {
        // Inject CSS
        const styles = `
            <style>
                #ai-widget-container {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 600px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .ai-search-bar {
                    background: white;
                    border-radius: 50px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: text;
                    transition: all 0.3s ease;
                }
                .ai-search-bar:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
                }
                .ai-search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 15px;
                    color: #333;
                    background: transparent;
                }
                .ai-send-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #3b82f6;
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ai-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(5px);
                    z-index: 10000;
                    display: none;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 15vh;
                }
                .ai-modal-overlay.active { display: flex; }
                .ai-modal-content {
                    background: white;
                    width: 90%;
                    max-width: 700px;
                    max-height: 75vh;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .ai-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f9fafb;
                }
                .ai-modal-search-bar {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: white;
                    padding: 10px 16px;
                    border-radius: 25px;
                    border: 1px solid #e5e7eb;
                }
                .ai-modal-search-bar input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 15px;
                }
                .ai-icon-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .ai-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                }
                .ai-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 50px;
                }
                .ai-typing-indicator span {
                    width: 10px;
                    height: 10px;
                    background: #3b82f6;
                    border-radius: 50%;
                    display: inline-block;
                    animation: bounce 1.4s infinite;
                    margin: 0 3px;
                }
                .ai-typing-indicator span:nth-child(2) { animation-delay: 0.16s; }
                .ai-typing-indicator span:nth-child(3) { animation-delay: 0.32s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
                .ai-answer-container { animation: fadeIn 0.4s ease; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .ai-answer-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                }
                .ai-answer-text {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                    margin-bottom: 20px;
                }
                .ai-action-buttons {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .ai-btn-primary {
                    padding: 12px 24px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    text-decoration: none;
                }
                .ai-btn-secondary {
                    padding: 12px 24px;
                    background: white;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    text-decoration: none;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);

        // Create HTML
        const html = `
            <div id="ai-widget-container">
                <div class="ai-search-bar" onclick="document.getElementById('ai-main-search').focus()">
                    <span style="color: #3b82f6;">🔍</span>
                    <input type="text" class="ai-search-input" id="ai-main-search" 
                           placeholder="Ask about glass fitting services..." 
                           onkeypress="if(event.key==='Enter') window.AIWidget.submit()">
                    <button class="ai-send-btn" onclick="window.AIWidget.submit()">➤</button>
                </div>
            </div>
            <div class="ai-modal-overlay" id="ai-modal" onclick="if(event.target.id==='ai-modal') window.AIWidget.close()">
                <div class="ai-modal-content">
                    <div class="ai-modal-header">
                        <div class="ai-modal-search-bar">
                            <span style="color: #3b82f6;">🔍</span>
                            <input type="text" id="ai-modal-search" placeholder="Ask about glass fitting services..."
                                   onkeypress="if(event.key==='Enter') window.AIWidget.submitModal()">
                        </div>
                        <button class="ai-icon-btn" onclick="window.AIWidget.close()">✕</button>
                    </div>
                    <div class="ai-modal-body" id="ai-modal-body"></div>
                </div>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);

        // Widget Controller
        window.AIWidget = {
            async submit() {
                const q = document.getElementById('ai-main-search').value.trim();
                if (q) this.open(q);
            },
            async submitModal() {
                const q = document.getElementById('ai-modal-search').value.trim();
                if (q) this.process(q);
            },
            open(question) {
                document.getElementById('ai-modal-search').value = question;
                document.getElementById('ai-modal').classList.add('active');
                document.body.style.overflow = 'hidden';
                this.process(question);
            },
            close() {
                document.getElementById('ai-modal').classList.remove('active');
                document.body.style.overflow = '';
            },
            showLoading(question) {
                document.getElementById('ai-modal-body').innerHTML = `
                    <div class="ai-loading-container">
                        <div style="font-size: 17px; color: #374151; margin-bottom: 20px;">${question}</div>
                        <div class="ai-typing-indicator"><span></span><span></span><span></span></div>
                    </div>
                `;
            },
            showAnswer(question, result) {
                document.getElementById('ai-modal-body').innerHTML = `
                    <div class="ai-answer-container">
                        <h2 class="ai-answer-title">${question}</h2>
                        <div class="ai-answer-text">${result.answer}</div>
                        <div class="ai-action-buttons">
                            <a href="https://wa.me/${KNOWLEDGE_BASE.contact.whatsapp}" class="ai-btn-primary" target="_blank">📱 WhatsApp Quote</a>
                            <a href="tel:${KNOWLEDGE_BASE.contact.phone}" class="ai-btn-secondary">📞 Call Now</a>
                        </div>
                        <div style="font-size: 12px; color: #9ca3af; margin-top: 16px;">
                            Source: ${result.source} | Confidence: ${result.confidence}
                        </div>
                    </div>
                `;
            },
            async process(question) {
                this.showLoading(question);
                const result = await processQuestion(question);
                this.showAnswer(question, result);
            }
        };

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.AIWidget.close();
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();
