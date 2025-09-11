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
        this.gameRunning = true;
        this.gamePaused = false;
        
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
        document.body.style.backgroundColor = this.backgroundColors[0];
        
        // Set up keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Set up touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Start the game loop
        this.gameLoop();
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
        document.body.style.backgroundColor = newColor;
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
        // Handle space bar for new game or pause/unpause
        if (e.key === ' ') {
            e.preventDefault();
            if (!this.gameRunning) {
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
            if (!this.gameRunning) {
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
        this.gameRunning = true;
        this.gamePaused = false;
        
        // Reset score
        this.score = 0;
        
        // Reset background color to default
        document.body.style.backgroundColor = this.backgroundColors[0];
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        
        // Draw grid lines (optional - for debugging)
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.squareSize, 0);
            this.ctx.lineTo(i * this.squareSize, this.canvasSize);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.squareSize);
            this.ctx.lineTo(this.canvasSize, i * this.squareSize);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.ctx.fillStyle = '#27ae60';
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            this.ctx.fillRect(
                segment.x * this.squareSize,
                segment.y * this.squareSize,
                this.squareSize,
                this.squareSize
            );
        }
        
        // Draw snake head differently
        this.ctx.fillStyle = '#2ecc71';
        const head = this.snake[0];
        this.ctx.fillRect(
            head.x * this.squareSize,
            head.y * this.squareSize,
            this.squareSize,
            this.squareSize
        );
        
        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.squareSize,
            this.food.y * this.squareSize,
            this.squareSize,
            this.squareSize
        );
        
        // Draw game over message
        if (!this.gameRunning) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
            
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvasSize / 2, this.canvasSize / 2 - 40);
            
            // Show appropriate restart instructions
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#ffffff';
            if (this.isMobileDevice()) {
                this.ctx.fillText('Tap to play again', this.canvasSize / 2, this.canvasSize / 2 - 10);
            } else {
                this.ctx.fillText('Press SPACE to play again', this.canvasSize / 2, this.canvasSize / 2 - 10);
            }
        }
        
        // Draw pause message
        if (this.gameRunning && this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
            
            this.ctx.fillStyle = '#f39c12';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvasSize / 2, this.canvasSize / 2 - 30);
            
            // Show appropriate resume instructions
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#ffffff';
            if (this.isMobileDevice()) {
                this.ctx.fillText('Tap to resume', this.canvasSize / 2, this.canvasSize / 2);
            } else {
                this.ctx.fillText('Press SPACE to resume', this.canvasSize / 2, this.canvasSize / 2);
            }
        }
        
        // Draw score information
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.fillText(`High Score: ${this.highScore}`, 10, 45);
        
        // Show mobile instructions on first load
        if (this.score === 0 && this.gameRunning && !this.gamePaused && this.isMobileDevice()) {
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillText('Swipe to move • Tap to pause', this.canvasSize / 2, this.canvasSize - 10);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        // Run at 10 FPS for classic Snake feel
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, 100);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SnakeGame();
});
