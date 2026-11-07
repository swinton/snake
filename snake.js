// Snake Game
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.gridSize = 20; // 20x20 grid
        this.squareSize = 25; // Each square is 25x25 pixels
        this.canvasSize = this.gridSize * this.squareSize; // 500x500 pixels
        
        // Snake properties
        this.snake = [
            { x: 10, y: 10 }, // Head
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
            { x: 6, y: 10 }  // Tail
        ];
        
        // Food properties
        this.food = { x: 15, y: 15 };
        
        // Movement direction
        this.direction = { x: 1, y: 0 }; // Moving right initially
        this.nextDirection = { x: 1, y: 0 };
        
        // Game state
        this.gameRunning = false; // Start in waiting state
        this.gamePaused = false;
        this.gameWaiting = true; // New state for waiting to start
        
        // Score tracking
        this.score = 0;
        this.highScore = 0;
        
        // Touch control properties
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 30; // Minimum distance for a swipe to register
        
        // Background colors for score milestones
        this.backgroundColors = [
            '#1a1a1a', // Default dark
            '#2c3e50', // Dark blue-gray
            '#8e44ad', // Purple
            '#e74c3c', // Red
            '#f39c12', // Orange
            '#f1c40f', // Yellow
            '#27ae60', // Green
            '#3498db', // Blue
            '#9b59b6', // Light purple
            '#e67e22', // Dark orange
            '#1abc9c', // Teal
            '#34495e', // Dark gray
            '#c0392b', // Dark red
            '#d35400', // Burnt orange
            '#16a085'  // Dark teal
        ];
        
        // Initialize the game
        this.init();
    }
    
    init() {
        // Load high score from cookie
        this.loadHighScore();
        
        // Set initial background color
        document.documentElement.style.setProperty('--cabinet-glow', '#77ff87');
        
        // Set up keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Set up touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // The cabinet controls share the keyboard's gameplay behavior.
        this.startButton = document.getElementById('startButton');
        this.startButton.addEventListener('click', () => {
            this.handleKeyPress({ key: ' ', preventDefault() {} });
            this.draw();
        });
        document.querySelectorAll('[data-direction]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleKeyPress({ key: button.dataset.direction, preventDefault() {} });
            });
        });
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.highScoreDisplay = document.getElementById('highScoreDisplay');
        this.statusDisplay = document.getElementById('arcadeStatus');
        this.actionLabel = document.getElementById('actionLabel');
        if (this.isMobileDevice()) {
            document.getElementById('instructions').innerHTML =
                'SWIPE TO MOVE &nbsp; / &nbsp; TAP SCREEN TO PAUSE<br>OR USE THE CABINET CONTROLS';
        }
        
        // Start the render loop (but game won't start until user input)
        this.renderLoop();
    }
    
    // Cookie utility functions
    setCookie(name, value, days = 365) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        const isSecure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${isSecure}; SameSite=Lax`;
    }
    
    getCookie(name) {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }
    
    loadHighScore() {
        const savedHighScore = this.getCookie('snakeHighScore');
        this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
    }
    
    saveHighScore() {
        this.setCookie('snakeHighScore', this.highScore);
    }
    
    changeBackgroundColor() {
        // Calculate which color to use based on score milestones
        const colorIndex = Math.floor(this.score / 10) % this.backgroundColors.length;
        const newColor = this.backgroundColors[colorIndex];
        document.documentElement.style.setProperty('--cabinet-glow', newColor);
    }
    
    isMobileDevice() {
        // Detect if user is on a mobile device
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               ('ontouchstart' in window);
    }
    
    endGame() {
        this.gameRunning = false;
        
        // Update high score if current score is higher
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }
    
    handleKeyPress(e) {
        // Handle space bar for starting game, new game, or pause/unpause
        if (e.key === ' ') {
            e.preventDefault();
            if (this.gameWaiting) {
                // Start the game for the first time
                this.startGame();
            } else if (!this.gameRunning) {
                this.startNewGame();
            } else {
                // Toggle pause when game is running
                this.gamePaused = !this.gamePaused;
            }
            return;
        }
        
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (this.direction.y === 0) { // Can't reverse into itself
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
        
        this.handleSwipe();
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Check if this is a tap (very small movement) for pause functionality
        if (absDeltaX < 10 && absDeltaY < 10) {
            if (this.gameWaiting) {
                // Start the game for the first time
                this.startGame();
            } else if (!this.gameRunning) {
                this.startNewGame();
            } else {
                // Toggle pause when game is running
                this.gamePaused = !this.gamePaused;
            }
            return;
        }
        
        // Only process swipes if game is running and not paused
        if (!this.gameRunning || this.gamePaused) return;
        
        // Check if swipe is long enough
        if (absDeltaX < this.minSwipeDistance && absDeltaY < this.minSwipeDistance) return;
        
        // Determine swipe direction - prioritize the larger movement
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe right
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
            } else {
                // Swipe left
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                // Swipe down
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
            } else {
                // Swipe up
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
            }
        }
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake head
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.endGame();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.endGame();
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            
            // Check if score reached a multiple of 10 for background color change
            if (this.score > 0 && this.score % 10 === 0) {
                this.changeBackgroundColor();
            }
            
            this.generateFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }
    
    startGame() {
        // Start the game from waiting state
        this.gameWaiting = false;
        this.gameRunning = true;
        this.gamePaused = false;
    }
    
    startNewGame() {
        // Reset snake to initial position
        this.snake = [
            { x: 10, y: 10 }, // Head
            { x: 9, y: 10 },
            { x: 8, y: 10 },
            { x: 7, y: 10 },
            { x: 6, y: 10 }  // Tail
        ];
        
        // Reset direction
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Generate new food
        this.generateFood();
        
        // Start the game
        this.gameWaiting = false;
        this.gameRunning = true;
        this.gamePaused = false;
        
        // Reset score
        this.score = 0;
        
        // Reset background color to default
        document.documentElement.style.setProperty('--cabinet-glow', '#77ff87');
    }
    
    draw() {
        const ctx = this.ctx;
        ctx.fillStyle = '#08110e';
        ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

        // Subtle phosphor grid and inset pixels leave the playfield readable.
        ctx.strokeStyle = '#173125';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < this.gridSize; i++) {
            const position = i * this.squareSize;
            ctx.beginPath();
            ctx.moveTo(position, 0);
            ctx.lineTo(position, this.canvasSize);
            ctx.moveTo(0, position);
            ctx.lineTo(this.canvasSize, position);
            ctx.stroke();
        }

        ctx.shadowColor = '#77ff87';
        ctx.shadowBlur = 9;
        this.snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#d3ff9b' : '#77ee83';
            ctx.fillRect(segment.x * this.squareSize + 2,
                segment.y * this.squareSize + 2,
                this.squareSize - 4, this.squareSize - 4);
        });
        ctx.shadowColor = '#ff4d99';
        ctx.fillStyle = '#ff699b';
        ctx.fillRect(this.food.x * this.squareSize + 4,
            this.food.y * this.squareSize + 4,
            this.squareSize - 8, this.squareSize - 8);
        ctx.shadowBlur = 0;

        const status = this.gameWaiting ? 'READY PLAYER ONE' :
            !this.gameRunning ? 'GAME OVER' : this.gamePaused ? 'PAUSED' : 'GO FOR THE HIGH SCORE';
        const action = this.gameWaiting ? 'START' :
            !this.gameRunning ? 'RETRY' : this.gamePaused ? 'RESUME' : 'PAUSE';
        const score = String(this.score).padStart(4, '0');
        const highScore = String(Math.max(this.highScore, this.score)).padStart(4, '0');
        if (this.scoreDisplay.textContent !== score) this.scoreDisplay.textContent = score;
        if (this.highScoreDisplay.textContent !== highScore) this.highScoreDisplay.textContent = highScore;
        if (this.statusDisplay.textContent !== status) this.statusDisplay.textContent = status;
        this.actionLabel.textContent = action;
        this.startButton.setAttribute('aria-label', `${action.toLowerCase()} game`);

        if (this.gameWaiting || !this.gameRunning || this.gamePaused) {
            ctx.fillStyle = 'rgba(4, 12, 9, 0.88)';
            ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffd07c';
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.fillText('S N A K E  /  S N A K E  /  S N A K E', 250, 168);
            ctx.shadowColor = '#77ff87';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#a5ff9c';
            ctx.font = 'bold 38px "Courier New", monospace';
            ctx.fillText(this.gameWaiting ? 'PRESS START' :
                !this.gameRunning ? 'GAME OVER' : 'PAUSED', 250, 234);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#78b58c';
            ctx.font = 'bold 14px "Courier New", monospace';
            ctx.fillText(this.gameWaiting ? 'A CLASSIC. ONE MORE TIME.' :
                !this.gameRunning ? `YOUR SCORE  ${score}` : 'TAKE A BREATHER, PLAYER ONE.', 250, 270);
            ctx.fillStyle = '#f394b6';
            ctx.font = 'bold 12px "Courier New", monospace';
            ctx.fillText(this.isMobileDevice() ? 'TAP SCREEN OR PRESS THE BUTTON' :
                'PRESS SPACE OR THE CABINET BUTTON', 250, 324);
            ctx.fillStyle = '#567360';
            ctx.fillText('CREDIT  ∞               FREE PLAY', 250, 450);
        }
    }

    renderLoop() {
        // Only update game state if game is running and not paused
        if (this.gameRunning && !this.gamePaused) {
            this.update();
        }
        
        this.draw();
        
        // Run at 10 FPS for classic Snake feel
        setTimeout(() => {
            requestAnimationFrame(() => this.renderLoop());
        }, 100);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
});
