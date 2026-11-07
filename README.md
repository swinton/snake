# 🐍 Snake Game

A classic Snake game built with HTML5 Canvas and vanilla JavaScript, featuring dynamic backgrounds, persistent scoring, and full mobile support.

## 🎮 [Play the Game](https://swinton.github.io/snake/)

**Live Demo:** https://swinton.github.io/snake/

## ✨ Features

### 🎯 Core Gameplay
- **Classic Snake Mechanics**: Navigate the snake to eat food and grow longer
- **Collision Detection**: Game ends when hitting walls or the snake's own body
- **Smooth Movement**: Responsive controls with 10 FPS classic Snake feel

### 📊 Scoring System
- **Real-time Score Tracking**: Points increase with each food consumed
- **Persistent High Score**: Best score saved locally using browser cookies
- **Score Display**: Current and high scores visible during gameplay

### 🌈 Visual Features
- **Dynamic Backgrounds**: Background color changes every 10 points scored
- **15 Color Palette**: Beautiful progression through different background colors
- **Visual Feedback**: Clear game states (playing, paused, game over)
- **Responsive Design**: Optimized for both desktop and mobile devices

### 🎮 Controls

#### Desktop
- **Arrow Keys**: Control snake direction (↑ ↓ ← →)
- **Spacebar**: Pause/resume game or restart after game over

#### Mobile & Touch Devices
- **Swipe Gestures**: Swipe in any direction to move the snake
- **Tap to Pause**: Tap anywhere on the game canvas to pause/resume
- **Tap to Restart**: Tap to start a new game after game over

### 📱 Mobile Optimizations
- **Touch Controls**: Full gesture support for mobile gameplay
- **Responsive Layout**: Canvas automatically resizes for mobile screens
- **Device Detection**: Automatically shows appropriate control instructions
- **Cross-Platform**: Works seamlessly on desktop, tablet, and mobile

## 🚀 How to Play

1. **Start**: The snake begins moving automatically
2. **Control**: Use arrow keys (desktop) or swipe (mobile) to change direction
3. **Eat**: Guide the snake to the red food squares to grow and score points
4. **Avoid**: Don't hit the walls or the snake's own body
5. **Pause**: Press spacebar (desktop) or tap the screen (mobile) to pause
6. **Score**: Try to beat your high score and unlock new background colors!

### 🎨 Background Color Progression
- **Score 0-9**: Dark Gray
- **Score 10-19**: Dark Blue-Gray
- **Score 20-29**: Purple
- **Score 30-39**: Red
- **Score 40-49**: Orange
- **Score 50-59**: Yellow
- **Score 60-69**: Green
- **Score 70-79**: Blue
- **Score 80-89**: Light Purple
- **Score 90-99**: Dark Orange
- **Score 100-109**: Teal
- **Score 110-119**: Dark Gray
- **Score 120-129**: Dark Red
- **Score 130-139**: Burnt Orange
- **Score 140+**: Dark Teal (then cycles repeat)

## 🛠️ Development

### Technologies Used
- **HTML5 Canvas**: For game rendering and graphics
- **Vanilla JavaScript**: No frameworks, pure JS implementation
- **CSS3**: Responsive design and mobile optimizations
- **Browser APIs**: Local storage via cookies, touch events

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/swinton/snake.git
   cd snake
   ```

2. Open `index.html` in a web browser or serve with a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Navigate to `http://localhost:8000` to play locally

### Deploy to Render

This game runs entirely in the browser and deploys as a [Render Static Site](https://render.com/docs/static-sites). No server, database, environment variables, or dependencies are required.

1. Commit and push `render.yaml` along with the application files to your GitHub repository.
2. In the [Render Dashboard](https://dashboard.render.com/), select **New > Blueprint** and connect your repository.
3. Select the branch containing `render.yaml`, review the `snake` static site, and deploy it.
4. Once deployment finishes, open the `onrender.com` URL shown by Render.

The Blueprint copies `index.html` and `snake.js` into `dist/` and publishes that directory. Render automatically deploys subsequent pushes to the linked branch. See [Render's Blueprint setup guide](https://render.com/docs/infrastructure-as-code) for details.

If you prefer **New > Static Site**, use these settings:

| Setting | Value |
| --- | --- |
| Build Command | `mkdir -p dist && cp index.html snake.js dist/` |
| Publish Directory | `dist` |

High scores are saved in browser cookies for the site's domain, so scores from the GitHub Pages site won't transfer to the Render URL.

### Project Structure
```
snake/
├── index.html          # Main HTML file and game container
├── snake.js            # Game logic, controls, and rendering
├── render.yaml         # Render Static Site deployment configuration
├── README.md           # This documentation
└── LICENSE             # MIT license
```

## 🎯 Game Architecture

- **Object-Oriented Design**: Clean `SnakeGame` class structure
- **Canvas Rendering**: Efficient 2D graphics with HTML5 Canvas
- **Event-Driven**: Keyboard and touch event handling
- **State Management**: Game state tracking (running, paused, game over)
- **Responsive**: Automatic device detection and control adaptation

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Acknowledgments

- Inspired by the classic Nokia Snake game
- Built as a modern web implementation with enhanced features
- Designed for cross-platform accessibility

---

**Enjoy playing! 🐍** Try to beat your high score and see all the background colors!
