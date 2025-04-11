const startBtn = document.getElementById("start-button");
const rollBtn = document.getElementById("roll-button");
const gameArea = document.getElementById("game-area");
const playerCountSelect = document.getElementById("player-count");
const throwsInput = document.getElementById("throws-count");
const currentPlayerSpan = document.getElementById("current-player");
const throwsRemainingSpan = document.getElementById("throws-remaining");
const diceImg = document.getElementById("dice-image");
const scoreboardsDiv = document.getElementById("scoreboards");

let players = [];
let currentPlayerIndex = 0;
let throwsPerPlayer = 5;
let totalThrowsLeft = 0;

// Dice images
const diceImages = [
  "images/dice1.jpg", // 1
  "images/dice2.jpg", // 2
  "images/dice3.jpg", // 3
  "images/dice4.jpg", // 4
  "images/dice5.jpg", // 5
  "images/dice6.jpg"  // 6
];

// Start Game
startBtn.addEventListener("click", () => {
  const numPlayers = parseInt(playerCountSelect.value);
  throwsPerPlayer = parseInt(throwsInput.value) || 1;
  totalThrowsLeft = throwsPerPlayer * numPlayers;
  currentPlayerIndex = 0;

  players = [];
  for (let i = 1; i <= numPlayers; i++) {
    players.push({ name: `Player ${i}`, rolls: [], total: 0 });
  }

  renderScoreboards();
  updateStatus();
  rollBtn.disabled = false;
  gameArea.classList.remove("hidden");
});

// Roll Dice
rollBtn.addEventListener("click", () => {
  diceImg.style.animation = "none";
  diceImg.offsetHeight; // Force reflow
  diceImg.style.animation = "roll 1s ease";

  setTimeout(() => {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceImg.src = diceImages[roll - 1];

    const player = players[currentPlayerIndex];
    player.rolls.push(roll);
    player.total += roll;

    totalThrowsLeft--;

    renderScoreboards();

    if (totalThrowsLeft > 0) {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      updateStatus();
    } else {
      currentPlayerSpan.textContent = "Game Over!";
      throwsRemainingSpan.textContent = "";
      rollBtn.disabled = true;
      highlightWinner();
    }
  }, 1000);
});

function updateStatus() {
  const player = players[currentPlayerIndex];
  currentPlayerSpan.textContent = player.name;
  throwsRemainingSpan.textContent = `Total Throws Left: ${totalThrowsLeft}`;
}

function renderScoreboards() {
  scoreboardsDiv.innerHTML = "";
  players.forEach((p, idx) => {
    const sb = document.createElement("div");
    sb.classList.add("scoreboard");
    sb.innerHTML = `
      <h3>${p.name} — Total: ${p.total}</h3>
      <ul>
        ${p.rolls.map((r, i) => `<li>Roll ${i + 1}: ${r}</li>`).join("")}
      </ul>
    `;
    scoreboardsDiv.appendChild(sb);
  });
}

function highlightWinner() {
  const maxTotal = Math.max(...players.map(p => p.total));
  players.forEach((p, idx) => {
    const sb = scoreboardsDiv.children[idx];
    if (p.total === maxTotal) {
      const h3 = sb.querySelector("h3");
      h3.style.color = "#c0392b";
      h3.textContent += " 🏆";
    }
  });
}
