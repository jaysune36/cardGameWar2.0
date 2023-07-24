
const mainScreen = document.querySelector('.main');
const gameName = document.querySelector('.game-name')
const startButton = document.querySelector('.start-button');
const gameOption = document.querySelector('.game-option');
const userLogin = document.querySelector('.login');
const userLoginValue = userLogin.querySelector('input');
const submitUser = document.querySelector('.submit');
const gameBoard = document.querySelector('.game-board');
const userHand = document.querySelector('.user');
let cpuPlayers = 0;
let cpuHand = 0;
// this createList function accepts 1 argument to be looped through and create the list for the cards to be stored in an array
// function createList(item) {
//   let suits = ['H', 'C', 'D', 'S'];
//   for (let j = 0; j < 10; j++) {
//     if (item.length < 9) {
//       item.push(`${suits[j]}${j + 2}`)
//     } else {
//       item.push('J', 'Q', 'K', 'A');
//       break;
//     }
//   }
// }

// the faceCardPointConver will change a players.hand array item to a point to compare within gameBoard method of the game() class
function faceCardPointConvert(item) {
  let value = 0;
  switch (item) {
    case 'J':
      value = 11;
      break;
    case 'Q':
      value = 12;
      break;
    case 'K':
      value = 13;
      break;
    case 'A':
      value = 14;
      break;
    default:
      console.log(`Err. An incorrect value has been entered.`)
      break;
  }
  return value;
}

class Cards {
  constructor() {
    this.cardTypes = {
      hearts: [],
      clubs: [],
      diamonds: [],
      spades: []
    }
  }
  // this createCards method when called will push to each card type array and add the associated cards and there suits to each array through a loop
  createCards() {
    let cardType = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    for (let key of Object.keys(this.cardTypes)) {
      for (let i = 0; i < cardType.length; i++) {
        this.cardTypes[key].push({
          value: i + 2,
          cardType: cardType[i],
          suit: `${key}`
        })
      }
    }
    return this.cardTypes
  }
}

// The player class will add players to the game and keep track of thhere hand through an array and points to be started at zero.
class Players {
  constructor(name) {
    this.name = name;
    this.hand = [];
    this.cardsWon = [];
  }

  describe() {
    return `${this.name} has ${this.hand.length} in their hand. Here are there cards
    ${this.hand}
    `
  }

  addCardsWon(item) {
    this.cardsWon.push(item);
  }

  cardsWonToHand() {
    for (let i = 0; i < this.cardsWon.length; i++) {
      this.hand.push(this.cardsWon[i])
    }
  }
}

class Deck {
  constructor() {
    this.cardsInDeck = [];
  }

  // the addCards methods will create a new cards varialbe using the new Cards class. Then will call the createCards method to the cards variable and push the newly created cards to the this.deck property and return the property
  addCards() {
    let cards = new Cards();
    cards.createCards();
    this.cardsInDeck = [...cards.cardTypes.hearts, ...cards.cardTypes.clubs, ...cards.cardTypes.diamonds, ...cards.cardTypes.spades];
    return this.cardsInDeck;
  }
}

class Game {
  constructor() {
    this.players = [];
    this.tiedPlayers = [];
    this.gameFloorCards = [];
    this.userTied = false;
  }

  // the start method will initalize the mainMenu mehtod at the time the browser starts. It will then display the mainMenu prompt and allow the user to start the game or exit. If the user decides to exit an alert will display.
  start() {
    let select = this.mainMenu();
    if (parseFloat(select) === 1) {
      return this.startGame()
    } else {
      alert('Thank you for playing!')
    }
  }

  // the mainMenu method will return a prompt to be display if the user would like to see the outcome of the game or exit.
  mainMenu() {
    return prompt(`
    It's time to play WAR!
    Please select an option
    0) Exit
    1) Let's Play
    `)
  }

  startGame() {
    this.addPlayers();
    console.log(this.shuffleDeckAndDeal());
    // this.shuffleDeckAndDeal();
    // this.gameBoard();
    // this.replayGame();
    // this.addPlayers();
    // console.log(this.players);
  }

  addPlayers(name, num) {
    this.players.push(new Players(name));
    for (let i = 0; i < num; i++) {
      this.players.push(new Players(`CPU ${i + 1}`));
    }
    return this.players;

  }

  // the shuffleDeck method will create a new Deck using the new Deck() class and then using a for loop randomly push a card to player[0](or Player One)'s hand. The remaining cards will then be pushed to player 2's hand array. 
  shuffleDeckAndDeal() {
    let deck = new Deck();
    deck.addCards();
    for (let j = 0; j < this.players.length; j++) {
      let handLength = deck.cardsInDeck.length / (this.players.length - j);
      for (let i = 0; i < handLength; i++) {
        let randomNumber = Math.floor(Math.random() * deck.cardsInDeck.length);
        let randomCard = deck.cardsInDeck[randomNumber];
        this.players[j].hand.push(randomCard);
      }
      deck.cardsInDeck.splice(1, handLength);
    }

    return this.players;
  }

  //the gameBoard method will call both players in the this.players array and then compare each item within their arrays. The array will first compare if each item is a string or a number. If a string compares to a number that player adds a point. If both players have string or 'face card' than the faceCardPointConvert will change that player string item to a point and then compare and the winner with the higher number will have a point added to their points.
  gameBoard(index, cardIndex) {
    let player = this.players
    let heightestValue = 0;
    let playerIndex = 0;
    this.gameFloorCards.push(player[index].hand[cardIndex]);


    for (let i = 1; i < player.length; i++) {
      this.gameFloorCards.push(player[i].hand[0]);
      if (player[i].hand[0].value > heightestValue) {
        heightestValue = player[i].hand[0].value;
        playerIndex = i;
        if (this.tiedPlayers.length === 0) {
          this.tiedPlayers.push(player[i]);
        } else {
          this.tiedPlayers.splice(i - 1, 1);
        }
      } else if (player[i].hand[0].value === heightestValue) {
        this.tiedPlayers.push(player[i]);
      }

    }

    if (player[index].hand[cardIndex].value > heightestValue) {
      heightestValue = player[index].hand[cardIndex].value;
      playerIndex = index;
      this.tiedPlayers = [];
    } else if (player[index].hand[cardIndex].value === heightestValue) {
      this.tiedPlayers.push(player[index])
    }


    if (this.tiedPlayers.length >= 2) {
      this.tieBreaker(index, cardIndex);
      console.log(`There are players that tied`);
    } else {
      for (let j = 0; j < this.gameFloorCards.length; j++) {
        player[playerIndex].addCardsWon(this.gameFloorCards[j]);
      }
      this.tiedPlayers = [];
      this.gameFloorCards = [];
    }

  }

  tieBreaker(index, cardIndex) {
    let heightestValue = 0;
    if (this.userTied === true) {
      let userTieCard = this.players[index].hand[cardIndex];
      gameFloorPool.push(userTieCard);
      gameFloorPool.push(tiedPlayers[1].hand[0])
      if (userTieCard.value < tiedPlayers[1].hand[0].value) {
        playerIndex = 1;
      }
    } else {
      for (let i = 0; i < tiedPlayers.length; i++) {
        if (tiedPlayers[i].hand[0].value > heightestValue) {
          playerIndex = i;
        }
      }
    }

    for (let i = 0; i < tiedPlayers.length; i++) {
      for (let j = 0; j < 3; j++) {
        gameFloorPool.push(tiedPlayers[playerIndex].hand[j]);
        tiedPlayers[i].hand.splice(1, 1);
      }
    }
    for (let l = 0; l < gameFloorPool.length; l++) {
      this.players[playerIndex].addCardsWon(gameFloorPool[l]);
    }
    console.log(this.players)
  }

  // the replayGame method will prompt who the winner of the game was and then return the user back to the main menu.
  replayGame() {
    if (this.players[0].points > this.players[1].points) {
      alert(
        `${this.players[0].name} wins with ${this.players[0].points} points!`);
      this.players = [];
      this.start();
    } else if (this.players[0].points < this.players[1].points) {
      alert(
        `${this.players[1].name} wins with ${this.players[1].points} points!`);
      this.players = [];
      this.start();
    } else {
      alert(
        `It is a Tie! Both players had ${this.players[0].points} points!`);
      this.players = [];
      this.start();
    }
  }


}


let game = new Game();

startButton.addEventListener('click', (e) => {
  if (e.target.className === 'game-start' && e.target.parentElement.className === 'start-button') {
    let gameStart = startButton.querySelector('.game-start')
    gameStart.style.display = 'none';
    gameOption.querySelector('.game-select').style.display = 'flex';
  }
})

gameOption.addEventListener('click', (e) => {
  let userName = '';
  if (e.target.tagName === 'LI' && e.target.parentElement.parentElement.className === 'game-option') {
    cpuPlayers = e.target.className;
    gameOption.querySelector('.game-select').style.display = 'none';
    userLogin.style.display = 'flex';
  }

  if (e.target.class = 'sumbit' && userLoginValue.value !== '') {
    userName = userLoginValue.value;
    game.addPlayers(userName, cpuPlayers);
    game.shuffleDeckAndDeal();
    userLogin.style.display = 'none';
    mainScreen.style.display = 'none';
    gameName.style.display = 'none';
    gameBoard.style.display = 'flex';
    let innerUl = '';
    let xtraCPU = '';
    for (let i = 0; i < game.players.length; i++) {
      if (game.players[i].name === userName) {
        for (let j = 0; j < game.players[i].hand.length; j++) {
          innerUl += `
                  <li class="card ${game.players[0].hand[j].suit}-card" index='${j}'>
                    
                      ${game.players[i].hand[j].cardType}
                    
                  </li>
              `
        }
      }
    }

    gameBoard.innerHTML = `
          <ul class="user" index='0'>
            ${innerUl}
          </ul>
          <div class="cpu">
          <p class="cpu-card" index='1'>${game.players[game.players.length - 1].hand.length}</p>
        </div>

          `;

    if (game.players.length > 2) {
      for (let i = 2; i < game.players.length; i++) {
        xtraCPU += `<div>
          <p class="cpu-card" index='${i}'>${game.players[i].hand.length}</p>
          </div>`
      }
      let midDiv = document.createElement('div');
      document.querySelector('.user').insertAdjacentElement('afterend', midDiv);
      midDiv.innerHTML = xtraCPU;
      midDiv.className = 'cpu-mid';
    }

    let gameFloor = document.createElement('div')
    gameBoard.insertAdjacentElement('afterend', gameFloor);
    gameFloor.className = 'game-floor';

  }
})


gameBoard.addEventListener('click', (e) => {
  if (e.target.parentElement.className === 'user') {
    let userIndex = e.target.parentElement.getAttribute('index');
    let userCardIndex = e.target.getAttribute('index');
    let gameFloor = document.querySelector('.game-floor');
    let indexLI = document.querySelector('.user').getElementsByTagName(`li`);
    let xtraCPU = '';
    gameFloor.innerHTML = `
      <div class='${e.target.className} game-floor-user'>${e.target.innerText}</div>
      <div class='card ${game.players[game.players.length - 1].hand[0].suit}-card'>${game.players[game.players.length - 1].hand[0].cardType}</div>
    `;
    
    
    for (let j = parseFloat(e.target.getAttribute('index')) + 1; j < indexLI.length; j++) {
      indexLI[j].setAttribute('index', j - 1)
    }

    if (game.players.length > 2) {
      for (let i = 2; i < game.players.length; i++) {
        xtraCPU += `
    <div class='card ${game.players[i].hand[0].suit}-card'>${game.players[i].hand[0].cardType}</div>
    `;
      }
      let midDiv = document.createElement('div');
      document.querySelector('.game-floor-user').insertAdjacentElement('afterend', midDiv);
      midDiv.innerHTML = xtraCPU;
      midDiv.className = 'cpu-mid game-floor-mid';
    }
    game.gameBoard(userIndex, userCardIndex);
    setTimeout(() => {
      gameFloor.innerHTML = '';
      game.players[userIndex].hand.splice(userCardIndex, 1);
      for (let i = 1; i < game.players.length; i++) {
        game.players[i].hand.splice(0, 1);
      }
      e.target.remove();
    }, 2000);
  }

});








//this variable creates the menu class
// let game = new Game();
// //After calling the start method this will initalize the main menu prompt
// let game = new Game();