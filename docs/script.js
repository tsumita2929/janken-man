// シンプルスペースじゃんけんゲーム - 1回限りバトル
class SimpleSpaceJanken {
    constructor() {
        this.gameState = 'title'; // title, playing, finished
        this.battleInProgress = false;
        
        this.hands = {
            rock: { emoji: '✊', name: 'ロック' },
            paper: { emoji: '✋', name: 'ペーパー' },
            scissors: { emoji: '✌️', name: 'シザー' }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('title');
        
        // Particles.jsの初期化を少し遅らせる
        setTimeout(() => {
            this.initParticles();
        }, 100);
    }
    
    initParticles() {
        // Particles.js設定（星空効果）
        if (typeof particlesJS !== 'undefined') {
            try {
                particlesJS('particles-js', {
                    particles: {
                        number: { 
                            value: 80,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: { 
                            value: ['#00d4ff', '#ffffff', '#ff6b6b'] 
                        },
                        shape: { 
                            type: 'circle'
                        },
                        opacity: { 
                            value: 0.5, 
                            random: true,
                            anim: {
                                enable: true,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false
                            }
                        },
                        size: { 
                            value: 3, 
                            random: true,
                            anim: {
                                enable: true,
                                speed: 2,
                                size_min: 0.1,
                                sync: false
                            }
                        },
                        line_linked: {
                            enable: false
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            direction: 'none',
                            random: true,
                            straight: false,
                            out_mode: 'out',
                            bounce: false
                        }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: {
                                enable: true,
                                mode: 'repulse'
                            },
                            onclick: {
                                enable: true,
                                mode: 'push'
                            },
                            resize: true
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                                duration: 0.4
                            },
                            push: {
                                particles_nb: 4
                            }
                        }
                    },
                    retina_detect: true
                });
            } catch (error) {
                console.warn('Particles.js初期化エラー:', error);
            }
        }
    }
    
    bindEvents() {
        // DOM要素の存在確認
        const startButton = document.getElementById('start-button');
        const retryButton = document.getElementById('retry-button');
        const titleButton = document.getElementById('title-button');
        
        if (!startButton) {
            console.error('start-button要素が見つかりません');
            return;
        }
        
        // タイトル画面
        startButton.addEventListener('click', () => {
            console.log('バトル開始ボタンがクリックされました');
            this.startBattle();
        });
        
        // じゃんけんボタン
        document.querySelectorAll('.hand-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.battleInProgress && this.gameState === 'playing') {
                    const hand = e.currentTarget.dataset.hand;
                    console.log('手が選択されました:', hand);
                    this.playBattle(hand);
                }
            });
        });
        
        // 結果画面のボタン
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                console.log('もう一度バトルボタンがクリックされました');
                this.resetGame();
            });
        }
        
        if (titleButton) {
            titleButton.addEventListener('click', () => {
                console.log('ホームボタンがクリックされました');
                this.showScreen('title');
            });
        }
    }
    
    showScreen(screenName) {
        console.log('画面切り替え:', screenName);
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`${screenName}-screen`).classList.add('active');
        
        this.gameState = screenName === 'game' ? 'playing' : screenName;
        console.log('ゲーム状態:', this.gameState);
    }
    
    startBattle() {
        console.log('バトル開始');
        this.battleInProgress = false;
        this.showScreen('game');
        this.resetBattleDisplay();
    }
    
    resetBattleDisplay() {
        // 手の表示をリセット
        const playerHand = document.getElementById('player-hand');
        const opponentHand = document.getElementById('opponent-hand');
        
        playerHand.textContent = '';
        const playerIcon = document.createElement('i');
        playerIcon.className = 'fas fa-question';
        playerHand.appendChild(playerIcon);
        
        opponentHand.textContent = '';
        const opponentIcon = document.createElement('i');
        opponentIcon.className = 'fas fa-question';
        opponentHand.appendChild(opponentIcon);
        
        document.getElementById('result-text').textContent = '';
        document.getElementById('result-text').className = 'result-text';
        
        // バトル結果画面を非表示
        document.getElementById('battle-result').classList.add('hidden');
        
        // ボタンを有効化
        this.enableHandButtons();
    }
    
    resetGame() {
        this.battleInProgress = false;
        this.gameState = 'title';
        this.startBattle();
    }
    
    playBattle(playerHand) {
        if (this.battleInProgress || this.gameState !== 'playing') return;
        
        this.battleInProgress = true;
        this.disableHandButtons();
        
        const opponentHand = this.getRandomHand();
        const result = this.judgeRound(playerHand, opponentHand);
        
        // アニメーション付きで手を表示
        this.displayHandsWithAnimation(playerHand, opponentHand, () => {
            // 結果を表示
            this.showBattleResult(result);
        });
    }
    
    getRandomHand() {
        const hands = Object.keys(this.hands);
        return hands[Math.floor(Math.random() * hands.length)];
    }
    
    judgeRound(player, opponent) {
        if (player === opponent) return 'draw';
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[player] === opponent ? 'win' : 'lose';
    }
    
    displayHandsWithAnimation(playerHand, opponentHand, callback) {
        // カウントダウン演出
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                document.getElementById('result-text').textContent = countdown;
                document.getElementById('result-text').className = 'result-text';
                countdown--;
            } else {
                clearInterval(countdownInterval);
                
                // 手を表示
                document.getElementById('player-hand').textContent = this.hands[playerHand].emoji;
                document.getElementById('opponent-hand').textContent = this.hands[opponentHand].emoji;
                
                // アニメーション効果
                this.animateHands();
                
                // 少し待ってからコールバック実行
                setTimeout(callback, 800);
            }
        }, 500);
    }
    
    showBattleResult(result) {
        const resultText = document.getElementById('result-text');
        const battleResult = document.getElementById('battle-result');
        const battleOutcome = document.getElementById('battle-outcome');
        
        // 結果に応じたメッセージと色
        switch (result) {
            case 'win':
                resultText.textContent = 'VICTORY!';
                resultText.className = 'result-text win';
                battleOutcome.textContent = '🚀 勝利！ 🚀';
                battleOutcome.style.color = '#00b894';
                break;
            case 'draw':
                resultText.textContent = 'DRAW';
                resultText.className = 'result-text draw';
                battleOutcome.textContent = '⚡ 引き分け ⚡';
                battleOutcome.style.color = '#ffd700';
                break;
            case 'lose':
                resultText.textContent = 'DEFEAT...';
                resultText.className = 'result-text lose';
                battleOutcome.textContent = '💥 敗北 💥';
                battleOutcome.style.color = '#ff6b6b';
                break;
        }
        
        // バトル結果画面を表示
        setTimeout(() => {
            battleResult.classList.remove('hidden');
            battleResult.style.animation = 'fadeIn 0.5s ease';
        }, 1000);
    }
    
    animateHands() {
        document.querySelectorAll('.hand-display').forEach(hand => {
            hand.classList.add('animate');
            setTimeout(() => {
                hand.classList.remove('animate');
            }, 800);
        });
    }
    
    enableHandButtons() {
        document.querySelectorAll('.hand-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    disableHandButtons() {
        document.querySelectorAll('.hand-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// ゲーム初期化
document.addEventListener('DOMContentLoaded', () => {
    window.simpleSpaceJanken = new SimpleSpaceJanken();
});

// キーボード操作対応
document.addEventListener('keydown', (e) => {
    if (document.querySelector('#game-screen').classList.contains('active')) {
        if (!window.simpleSpaceJanken.battleInProgress) {
            switch (e.key.toLowerCase()) {
                case '1':
                case 'r':
                    document.getElementById('rock-btn').click();
                    break;
                case '2':
                case 'p':
                    document.getElementById('paper-btn').click();
                    break;
                case '3':
                case 's':
                    document.getElementById('scissors-btn').click();
                    break;
            }
        }
    }
});

// 追加のCSS動的スタイル
const additionalStyles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .hand-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }
    
    .hand-btn:disabled:hover {
        background: linear-gradient(45deg, #1a1a2e, #16213e) !important;
    }
`;

// 動的スタイルを追加
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('スペースゲームエラー:', e.error);
    
    // Particles.jsのエラーは無視してゲームを続行
    if (e.error && e.error.message && e.error.message.includes('particles')) {
        console.warn('Particles.jsエラーを無視してゲームを続行します');
        return;
    }
});

// デバッグ用（開発時のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugSimpleGame = {
        forceWin: () => {
            if (window.simpleSpaceJanken) {
                window.simpleSpaceJanken.playBattle('rock');
            }
        },
        resetGame: () => {
            if (window.simpleSpaceJanken) {
                window.simpleSpaceJanken.resetGame();
            }
        }
    };
}
