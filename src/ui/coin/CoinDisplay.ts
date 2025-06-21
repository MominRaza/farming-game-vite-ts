import { gameState } from '../../GameState';
import * as CoinSystem from '../../systems/CoinSystem';

// Create and setup the coin display UI
export function setupCoinDisplay(): void {
    const uiContainer = document.getElementById('ui-container');
    if (!uiContainer) return;

    const coinDisplay = document.createElement('div');
    coinDisplay.id = 'coin-display';
    coinDisplay.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #ffd700;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 215, 0, 0.3);
        backdrop-filter: blur(5px);
    `;

    coinDisplay.innerHTML = `
        <span style="font-size: 20px;">💰</span>
        <span id="coin-count">${CoinSystem.formatCoins(gameState.coins)}</span>
    `;

    uiContainer.appendChild(coinDisplay);

    console.log('Coin display UI initialized');
}

// Update the coin display with current count
export function updateCoinDisplay(): void {
    const coinCountElement = document.getElementById('coin-count');
    if (coinCountElement) {
        coinCountElement.textContent = CoinSystem.formatCoins(gameState.coins);

        // Add a brief animation effect
        const coinDisplay = document.getElementById('coin-display');
        if (coinDisplay) {
            coinDisplay.style.transform = 'scale(1.1)';
            coinDisplay.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.6)';

            setTimeout(() => {
                coinDisplay.style.transform = 'scale(1)';
                coinDisplay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }, 200);
        }
    }
}

// Show coin earning animation
export function showCoinEarnedAnimation(amount: number): void {
    const coinDisplay = document.getElementById('coin-display');
    if (!coinDisplay) return;

    const animation = document.createElement('div');
    animation.style.cssText = `
        position: fixed;
        top: 60px;
        left: 20px;
        color: #ffd700;
        font-size: 16px;
        font-weight: bold;
        z-index: 101;
        pointer-events: none;
        animation: coinEarned 1.5s ease-out forwards;
    `;
    animation.textContent = `+${amount}💰`;

    // Add animation CSS if not already present
    if (!document.querySelector('#coin-animation-style')) {
        const style = document.createElement('style');
        style.id = 'coin-animation-style';
        style.textContent = `
            @keyframes coinEarned {
                0% { opacity: 1; transform: translateY(0px) scale(1); }
                100% { opacity: 0; transform: translateY(-30px) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(animation);

    // Remove animation after it completes
    setTimeout(() => {
        if (animation.parentNode) {
            animation.parentNode.removeChild(animation);
        }
    }, 1500);
}
