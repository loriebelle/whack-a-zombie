const cursor = document.querySelector('.cursor');
const cursorHeight = cursor.clientHeight;
const cursorWidth = cursor.clientWidth;
const holes =  [...document.querySelectorAll('.hole')];
const bgMusic = document.getElementById('bg-music');
const scoreEl = document.querySelector('.score span');
const timeLeftEl = document.querySelector('.timer span');
const smack = new Audio('assets/smash.mp3');
const gameButton = document.querySelector('.leave');
const soundButton = document.querySelector('.sound-effects'); // New button for sound effects
let score = 0;
let timeLeft = 30;
let gameTimer = null;
let gameRunning = false; // Track whether the game is running
let soundEnabled = false; // Track whether sound effects are enabled

function startTimer() {
    gameTimer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeLeftEl.textContent = timeLeft;
        } else {
            clearInterval(gameTimer);
            alert('Game over! Your score is ' + score + '. Good game!! 🎉');
            // Optionally, stop the game and hide moles
            holes.forEach(hole => hole.innerHTML = '');
            bgMusic.pause(); // Stop background music
            gameButton.textContent = 'Start Game'; // Reset button text
            gameRunning = false; // Update game status
            resetGame(); // Reset the game state
        }
    }, 1000);
}

function run() {
    const i = Math.floor(Math.random() * holes.length);
    const hole = holes[i];
    let timer = null;

    const img = document.createElement('img');
    img.classList.add('mole');
    img.src = 'assets/zombie.svg';
    img.setAttribute('data-clicked', 'false'); // Add a data attribute to track clicks

    img.addEventListener('click', () => {
        if (img.getAttribute('data-clicked') === 'false') { // Check if the mole has been clicked
            score += 10;
            if (soundEnabled) {
                smack.play();
            }
            scoreEl.textContent = score;
            img.src = 'assets/zombie-whacked.svg';
            img.setAttribute('data-clicked', 'true'); // Update the data attribute to indicate it has been clicked
            clearTimeout(timer);
            setTimeout(() => {
                hole.removeChild(img);
                run();
            }, 500);
        }
    });

    hole.appendChild(img);

    timer = setTimeout(() => {
        hole.removeChild(img);
        run();
    }, 1000);
}

// Play background music and start the game
function startGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeLeftEl.textContent = timeLeft;
    startTimer();
    run();
    if (soundEnabled) {
        bgMusic.play();
    }
    gameButton.textContent = 'End Game';
    gameRunning = true;
}

// Stop the game
function endGame() {
    clearInterval(gameTimer);
    holes.forEach(hole => hole.innerHTML = '');
    bgMusic.pause();
    gameButton.textContent = 'Start Game';
    gameRunning = false;
    resetGame(); // Reset the game state
}

// Reset the game state
function resetGame() {
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeLeftEl.textContent = timeLeft;
}

// Handle game button click
gameButton.addEventListener('click', () => {
    if (gameRunning) {
        endGame();
    } else {
        startGame();
    }
});

// Handle sound effects button click
soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects';
    if (soundEnabled && gameRunning) {
        bgMusic.play(); // Play background music if the game is running and sound is enabled
    } else {
        bgMusic.pause(); // Pause background music if sound is disabled
    }
});

// Handle cursor movement and animation
window.addEventListener('mousemove', e => {
    const offsetX = cursorWidth / 2.2;
    const offsetY = cursorHeight / 4;
    const maxX = window.innerWidth - cursorWidth;
    const maxY = window.innerHeight - cursorHeight;
    cursor.style.top = `${Math.min(Math.max(e.pageY - offsetY, 0), maxY)}px`;
    cursor.style.left = `${Math.min(Math.max(e.pageX - offsetX, 0), maxX)}px`;
});

window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});
