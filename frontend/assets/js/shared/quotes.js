class QuoteWidget {
    constructor() {
        this.currentQuote = null;
        this.isVisible = false;
        this.autoRefreshInterval = null;
        this.init();
    }

    init() {
        this.createQuoteWidget();
        this.attachEventListeners();
        this.fetchRandomQuote();
        this.startAutoRefresh();
    }

    createQuoteWidget() {
        const quoteWidgetHTML = `
            <div id="quote-widget" class="quote-widget">
                <div class="quote-content">
                    <div class="quote-header">
                        <div class="quote-icon">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <div class="quote-actions">
                            <button class="quote-refresh" title="New Quote">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button class="quote-toggle" title="Toggle Auto-refresh">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="quote-close" title="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="quote-body">
                        <div class="quote-text">
                            <div class="quote-loading">
                                <div class="loading-spinner"></div>
                                <span>Loading inspiration...</span>
                            </div>
                        </div>
                        <div class="quote-author"></div>
                        <div class="quote-tags"></div>
                    </div>
                </div>
                <div class="quote-toggle-btn" title="Daily Inspiration">
                    <i class="fas fa-lightbulb"></i>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', quoteWidgetHTML);
    }

    attachEventListeners() {
        const widget = document.getElementById('quote-widget');
        const toggleBtn = widget.querySelector('.quote-toggle-btn');
        const closeBtn = widget.querySelector('.quote-close');
        const refreshBtn = widget.querySelector('.quote-refresh');
        const autoToggleBtn = widget.querySelector('.quote-toggle');

        toggleBtn.addEventListener('click', () => {
            this.toggleWidget();
        });

        closeBtn.addEventListener('click', () => {
            this.hideWidget();
        });

        refreshBtn.addEventListener('click', () => {
            this.fetchRandomQuote();
        });

        autoToggleBtn.addEventListener('click', () => {
            this.toggleAutoRefresh();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideWidget();
            }
        });
    }

    async fetchRandomQuote() {
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        const quoteTags = document.querySelector('.quote-tags');
        const refreshBtn = document.querySelector('.quote-refresh i');

        try {
            quoteText.innerHTML = `
                <div class="quote-loading">
                    <div class="loading-spinner"></div>
                    <span>Loading inspiration...</span>
                </div>
            `;
            quoteAuthor.textContent = '';
            quoteTags.innerHTML = '';

            refreshBtn.classList.add('fa-spin');

            const response = await fetch('/PackTrack/backend/api/random/quotes.json');
            const allQuotes = await response.json();
            const quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

            if (quote.content) {
                this.currentQuote = quote;
                this.displayQuote(quote);
            } else {
                throw new Error('Invalid quote data');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            this.displayError();
        } finally {
            setTimeout(() => {
                refreshBtn.classList.remove('fa-spin');
            }, 500);
        }
    }

    displayQuote(quote) {
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        const quoteTags = document.querySelector('.quote-tags');

        quoteText.style.opacity = '0';

        setTimeout(() => {
            quoteText.innerHTML = `"${quote.content}"`;
            quoteAuthor.textContent = `— ${quote.author}`;

            if (quote.tags && quote.tags.length > 0) {
                quoteTags.innerHTML = quote.tags.map(tag =>
                    `<span class="quote-tag">${tag}</span>`
                ).join('');
            }

            quoteText.style.opacity = '1';
        }, 200);
    }

    displayError() {
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        const quoteTags = document.querySelector('.quote-tags');

        quoteText.innerHTML = '"The greatest glory in living lies not in never falling, but in rising every time we fall."';
        quoteAuthor.textContent = '— Nelson Mandela';
        quoteTags.innerHTML = '<span class="quote-tag">Offline</span>';
    }

    toggleWidget() {
        const widget = document.getElementById('quote-widget');

        if (this.isVisible) {
            this.hideWidget();
        } else {
            this.showWidget();
        }
    }

    showWidget() {
        const widget = document.getElementById('quote-widget');
        widget.classList.add('active');
        this.isVisible = true;
    }

    hideWidget() {
        const widget = document.getElementById('quote-widget');
        widget.classList.remove('active');
        this.isVisible = false;
    }

    startAutoRefresh() {
        this.autoRefreshInterval = setInterval(() => {
            this.fetchRandomQuote();
        }, 20000); // 20 seconds
    }

    toggleAutoRefresh() {
        const autoToggleBtn = document.querySelector('.quote-toggle i');

        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
            autoToggleBtn.classList.remove('fa-play');
            autoToggleBtn.classList.add('fa-pause');
        } else {
            this.startAutoRefresh();
            autoToggleBtn.classList.remove('fa-pause');
            autoToggleBtn.classList.add('fa-play');
        }
    }
}

// CSS Styles - Add this to your style.css file
const quoteWidgetStyles = `
/* Quote Widget Styles */
.quote-widget {
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 5;
    max-width: 400px;
    font-family: var(--font-family);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.quote-widget .quote-content {
    background: var(--bg-black-25);
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--bg-black-50);
    backdrop-filter: blur(20px);
    border: 1px solid var(--bg-black-50);
    transform: translateY(100%) scale(0.8);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
}

.quote-widget.active .quote-content {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.quote-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem 0.5rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    background-size: 200% 200%;
    animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.quote-icon {
    color: white;
    font-size: 1.2rem;
    opacity: 0.9;
}

.quote-actions {
    display: flex;
    gap: 8px;
}

.quote-actions button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.quote-actions button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.quote-body {
    padding: 1.25rem;
}

.quote-text {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-black-900);
    margin-bottom: 1rem;
    font-style: italic;
    font-weight: 500;
    transition: opacity 0.3s ease;
    min-height: 50px;
    display: flex;
    align-items: center;
}

.quote-author {
    color: var(--text-black-700);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.quote-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.quote-tag {
    background: var(--bg-black-50);
    color: var(--text-black-700);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.quote-loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-black-700);
    font-style: normal;
    font-size: 0.9rem;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--bg-black-50);
    border-top: 2px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.quote-toggle-btn {
    position: absolute;
    bottom: -60px;
    right: 0;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6); }
    100% { box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
}

.quote-toggle-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .quote-widget {
        bottom: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .quote-toggle-btn {
        right: 20px;
    }
}

/* Dark mode specific adjustments */
body.dark .quote-content {
    background: var(--bg-black-25);
    border-color: var(--bg-black-50);
}

body.light .quote-content {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
}
`;

document.addEventListener('DOMContentLoaded', () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = quoteWidgetStyles;
    document.head.appendChild(styleSheet);

    new QuoteWidget();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuoteWidget;
}