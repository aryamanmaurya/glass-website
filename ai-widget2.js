// AI Assistant Widget for Raju Glass Fitting
// Add this to any page: <script src="ai-widget.js"></script>

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        ollamaUrl: 'http://localhost:11434',
        model: 'llama3.2:latest', // Change to your preferred model
        position: 'bottom-center', // Options: bottom-center, bottom-right, bottom-left
        primaryColor: '#3b82f6', // Blue to match your website
        secondaryColor: '#10b981', // Green for WhatsApp-style actions
    };

    // Suggested questions for glass fitting business
    const SUGGESTIONS = [
        "What glass fitting services do you offer?",
        "How much does window installation cost?",
        "Do you provide emergency glass repair?",
        "What areas do you serve in Tricity?",
        "How can I get a free quote?",
        "Do you install shower doors and mirrors?"
    ];

    // Inject CSS
    function injectStyles() {
        const styles = `
            <style>
                /* AI Widget Container */
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

                /* Search Bar */
                .ai-search-bar {
                    background: white;
                    border-radius: 50px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: text;
                    transition: all 0.3s ease;
                }

                .ai-search-bar:hover {
                    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
                    transform: translateY(-2px);
                }

                .ai-search-icon {
                    color: ${CONFIG.primaryColor};
                    font-size: 18px;
                }

                .ai-search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 15px;
                    color: #333;
                    background: transparent;
                }

                .ai-search-input::placeholder {
                    color: #888;
                }

                .ai-send-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: ${CONFIG.primaryColor};
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .ai-send-btn:hover {
                    background: #2563eb;
                    transform: scale(1.05);
                }

                /* Suggestions Dropdown */
                .ai-suggestions {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    right: 0;
                    margin-bottom: 10px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .ai-suggestions.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .ai-suggestion-item {
                    padding: 14px 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #333;
                    font-size: 14px;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background 0.2s;
                }

                .ai-suggestion-item:last-child {
                    border-bottom: none;
                }

                .ai-suggestion-item:hover {
                    background: #f8f9fa;
                }

                /* Modal Overlay */
                .ai-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(5px);
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 15vh;
                }

                .ai-modal-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                /* Modal Content */
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
                    transform: scale(0.95);
                    transition: transform 0.3s ease;
                }

                .ai-modal-overlay.active .ai-modal-content {
                    transform: scale(1);
                }

                /* Modal Header */
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
                    background: transparent;
                    font-size: 15px;
                    color: #1f2937;
                }

                .ai-modal-actions {
                    display: flex;
                    gap: 8px;
                }

                .ai-icon-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .ai-icon-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                /* Modal Body */
                .ai-modal-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    background: white;
                }

                /* Loading State */
                .ai-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 50px 20px;
                }

                .ai-loading-text {
                    font-size: 17px;
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-weight: 500;
                    text-align: center;
                }

                .ai-typing-indicator {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }

                .ai-typing-indicator span {
                    width: 10px;
                    height: 10px;
                    background: ${CONFIG.primaryColor};
                    border-radius: 50%;
                    animation: ai-bounce 1.4s infinite ease-in-out both;
                }

                .ai-typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .ai-typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                .ai-typing-indicator span:nth-child(3) { animation-delay: 0s; }

                @keyframes ai-bounce {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }

                /* Answer Content */
                .ai-answer-container {
                    animation: ai-fadeIn 0.4s ease;
                }

                @keyframes ai-fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ai-answer-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                    line-height: 1.4;
                }

                .ai-answer-text {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #4b5563;
                    margin-bottom: 24px;
                }

                .ai-answer-text p {
                    margin-bottom: 12px;
                }

                /* Action Buttons */
                .ai-action-buttons {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                }

                .ai-btn-primary {
                    padding: 12px 24px;
                    background: ${CONFIG.primaryColor};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .ai-btn-primary:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .ai-btn-secondary {
                    padding: 12px 24px;
                    background: white;
                    color: #374151;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .ai-btn-secondary:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }

                /* Related Content */
                .ai-related-section {
                    margin-bottom: 24px;
                }

                .ai-section-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .ai-related-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }

                .ai-related-card {
                    display: flex;
                    gap: 12px;
                    padding: 14px;
                    background: #f9fafb;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    text-decoration: none;
                }

                .ai-related-card:hover {
                    background: white;
                    border-color: #e5e7eb;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transform: translateY(-2px);
                }

                .ai-related-thumb {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, #1d4ed8 100%);
                    border-radius: 10px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .ai-related-info h4 {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }

                .ai-related-info p {
                    font-size: 12px;
                    color: #6b7280;
                }

                /* Related Questions */
                .ai-related-questions {
                    margin-top: 20px;
                }

                .ai-related-question-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 0;
                    color: ${CONFIG.primaryColor};
                    font-size: 14px;
                    cursor: pointer;
                    border-bottom: 1px solid #f3f4f6;
                    transition: all 0.2s;
                }

                .ai-related-question-item:hover {
                    color: #1d4ed8;
                    padding-left: 8px;
                }

                .ai-related-question-item:last-child {
                    border-bottom: none;
                }

                /* Scrollbar */
                .ai-modal-body::-webkit-scrollbar {
                    width: 8px;
                }

                .ai-modal-body::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }

                .ai-modal-body::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }

                .ai-modal-body::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }

                /* Error Message */
                .ai-error-message {
                    padding: 16px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 10px;
                    color: #dc2626;
                    margin: 16px 0;
                    font-size: 14px;
                }

                /* Mobile Responsive */
                @media (max-width: 640px) {
                    #ai-widget-container {
                        width: 95%;
                        bottom: 15px;
                    }

                    .ai-modal-overlay {
                        padding-top: 10vh;
                    }

                    .ai-modal-content {
                        width: 95%;
                        max-height: 85vh;
                        border-radius: 16px;
                    }

                    .ai-answer-title {
                        font-size: 18px;
                    }

                    .ai-action-buttons {
                        flex-direction: column;
                    }

                    .ai-btn-primary, .ai-btn-secondary {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Create widget HTML
    function createWidget() {
        const widgetHTML = `
            <div id="ai-widget-container">
                <div class="ai-suggestions" id="ai-suggestions">
                    ${SUGGESTIONS.map(q => `
                        <div class="ai-suggestion-item" onclick="AIWidget.ask('${q.replace(/'/g, "\\'")}')">
                            <span class="ai-search-icon">🔍</span>
                            <span>${q}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="ai-search-bar" onclick="AIWidget.focusSearch()">
                    <span class="ai-search-icon">🔍</span>
                    <input type="text" class="ai-search-input" id="ai-main-search" 
                           placeholder="Ask about glass fitting services..." 
                           onfocus="AIWidget.showSuggestions()" 
                           onblur="setTimeout(AIWidget.hideSuggestions, 200)" 
                           onkeypress="AIWidget.handleKeyPress(event)">
                    <button class="ai-send-btn" onclick="AIWidget.submit()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="ai-modal-overlay" id="ai-modal" onclick="AIWidget.closeModalOnBackdrop(event)">
                <div class="ai-modal-content" onclick="event.stopPropagation()">
                    <div class="ai-modal-header">
                        <div class="ai-modal-search-bar">
                            <span style="color: ${CONFIG.primaryColor};">🔍</span>
                            <input type="text" id="ai-modal-search" placeholder="Ask about glass fitting services..." 
                                   onkeypress="AIWidget.handleModalKeyPress(event)">
                        </div>
                        <div class="ai-modal-actions">
                            <button class="ai-icon-btn" onclick="AIWidget.clearSearch()" title="Clear">🗑️</button>
                            <button class="ai-icon-btn" onclick="AIWidget.closeModal()" title="Close" style="font-size: 18px;">✕</button>
                        </div>
                    </div>
                    <div class="ai-modal-body" id="ai-modal-body"></div>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div);
    }

    // Widget Controller
    const AIWidget = {
        isLoading: false,
        currentQuestion: '',

        init() {
            injectStyles();
            createWidget();
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeModal();
            });
        },

        focusSearch() {
            document.getElementById('ai-main-search').focus();
        },

        showSuggestions() {
            document.getElementById('ai-suggestions').classList.add('active');
        },

        hideSuggestions() {
            document.getElementById('ai-suggestions').classList.remove('active');
        },

        handleKeyPress(event) {
            if (event.key === 'Enter') this.submit();
        },

        handleModalKeyPress(event) {
            if (event.key === 'Enter') {
                const question = document.getElementById('ai-modal-search').value.trim();
                if (question) this.processQuestion(question);
            }
        },

        submit() {
            const question = document.getElementById('ai-main-search').value.trim();
            if (question) {
                this.openModal(question);
            }
        },

        ask(question) {
            document.getElementById('ai-main-search').value = question;
            this.openModal(question);
        },

        openModal(question) {
            this.currentQuestion = question;
            document.getElementById('ai-modal-search').value = question;
            document.getElementById('ai-modal').classList.add('active');
            document.body.style.overflow = 'hidden';
            this.processQuestion(question);
        },

        closeModal() {
            document.getElementById('ai-modal').classList.remove('active');
            document.body.style.overflow = '';
            document.getElementById('ai-modal-body').innerHTML = '';
        },

        closeModalOnBackdrop(event) {
            if (event.target.id === 'ai-modal') this.closeModal();
        },

        clearSearch() {
            document.getElementById('ai-modal-search').value = '';
            document.getElementById('ai-modal-search').focus();
        },

        async processQuestion(question) {
            if (this.isLoading) return;
            this.isLoading = true;
            this.currentQuestion = question;
            this.showLoading();

            try {
                const response = await fetch(`${CONFIG.ollamaUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: CONFIG.model,
                        prompt: `You are a helpful AI assistant for Raju Glass Fitting & Services, a professional glass fitting company in Mohali, Chandigarh, and Panchkula. Answer the following question concisely and professionally. If you don't know specific details, provide a helpful general response about glass fitting services.\n\nQuestion: ${question}\n\nAnswer:`,
                        stream: false,
                        options: { temperature: 0.7, num_predict: 500 }
                    })
                });

                if (!response.ok) throw new Error('Failed to get response from Ollama');

                const data = await response.json();
                this.showAnswer(question, data.response || 'Sorry, I could not generate a response.');
                
            } catch (error) {
                console.error('Error:', error);
                this.showError(error.message);
            } finally {
                this.isLoading = false;
            }
        },

        showLoading() {
            document.getElementById('ai-modal-body').innerHTML = `
                <div class="ai-loading-container">
                    <div class="ai-loading-text">${this.currentQuestion}</div>
                    <div class="ai-typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
        },

        showAnswer(question, answer) {
            const formattedAnswer = answer
                .split('\n\n')
                .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                .join('');

            const relatedQuestions = this.generateRelatedQuestions(question);

            document.getElementById('ai-modal-body').innerHTML = `
                <div class="ai-answer-container">
                    <h2 class="ai-answer-title">${question}</h2>
                    <div class="ai-answer-text">${formattedAnswer}</div>
                    
                    <div class="ai-action-buttons">
                        <a href="https://wa.me/918146715800" class="ai-btn-primary" target="_blank">
                            📱 WhatsApp for Quote
                        </a>
                        <a href="tel:+918146715800" class="ai-btn-secondary">
                            📞 Call Now
                        </a>
                    </div>

                    <div class="ai-related-section">
                        <div class="ai-section-title">You might also be interested in</div>
                        <div class="ai-related-grid">
                            <a href="services.html" class="ai-related-card">
                                <div class="ai-related-thumb">🪟</div>
                                <div class="ai-related-info">
                                    <h4>Our Services</h4>
                                    <p>Window, door & mirror installation</p>
                                </div>
                            </a>
                            <a href="portfolio.html" class="ai-related-card">
                                <div class="ai-related-thumb" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">📸</div>
                                <div class="ai-related-info">
                                    <h4>View Portfolio</h4>
                                    <p>See our completed projects</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div class="ai-related-questions">
                        <div class="ai-section-title">Related Questions</div>
                        ${relatedQuestions.map(q => `
                            <div class="ai-related-question-item" onclick="AIWidget.askRelated('${q.replace(/'/g, "\\'")}')">
                                <span>↗</span>
                                <span>${q}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        showError(message) {
            document.getElementById('ai-modal-body').innerHTML = `
                <div class="ai-answer-container">
                    <h2 class="ai-answer-title">${this.currentQuestion}</h2>
                    <div class="ai-error-message">
                        <strong>Error:</strong> ${message}<br><br>
                        Please make sure Ollama is running on your local machine with the model "${CONFIG.model}" available.
                    </div>
                    <div class="ai-action-buttons">
                        <button class="ai-btn-primary" onclick="AIWidget.processQuestion('${this.currentQuestion.replace(/'/g, "\\'")}')">Try Again</button>
                        <button class="ai-btn-secondary" onclick="AIWidget.closeModal()">Close</button>
                    </div>
                </div>
            `;
        },

        askRelated(question) {
            document.getElementById('ai-modal-search').value = question;
            this.processQuestion(question);
            document.getElementById('ai-modal-body').scrollTop = 0;
        },

        generateRelatedQuestions(currentQ) {
            const questions = [
                "What types of glass do you install?",
                "Do you offer warranty on installations?",
                "How long does installation take?",
                "Do you provide free measurements?",
                "What are your service charges?",
                "Do you work on weekends?"
            ];
            return questions
                .filter(q => !currentQ.toLowerCase().includes(q.toLowerCase().split(' ')[0]))
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AIWidget.init());
    } else {
        AIWidget.init();
    }

    // Expose to global scope
    window.AIWidget = AIWidget;

})();
