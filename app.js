
const mainScreen = document.querySelector('.main');
const gameName = document.querySelector('.game-name')
const startButton = document.querySelector('.start-button');
const gameOption = document.querySelector('.game-option');
const userLogin = document.querySelector('.login');
const userLoginValue = userLogin.querySelector('input');
const submitUser = document.querySelector('.submit');
const gameBoard = document.querySelector('.game-board');
const userHand = document.querySelector('.user');
const gameFloor =  document.querySelector('.game-floor');
const gameFloorDesgin = document.querySelector('.game-floor-svgs');
let cpuPlayers = 0;
let cpuHand = 0;

//function accepts 2 arguments. First argument enter the array of elements you would like to add or remove the class from. For argument 2 type 'remove' to remove overlay or 'add' to add overlay
function addRemoveOverlay(arrEle, str) {
  let arg = str;
  if (arg === 'add') {
    for (let l = 0; l < arrEle.length; l++) {
      arrEle[l].firstElementChild.classList.add('overlay')
    }
  } else {
    for (let l = 0; l < arrEle.length; l++) {
      arrEle[l].firstElementChild.classList.remove('overlay')
    }
  }
}

//updateCPUHand function accepts 2 args. 1st arg is the target where the hand will be udpated. 2nd arg is for the new hand length
function updateCPUHand(target) {
  if (game.players.length > 2) {
    target.nextElementSibling.firstElementChild.innerText = game.players[1].hand.length - 1;
    for (let child of target.children) {
      console.log(target.children.length)
      for (let i = 0; i < target.children.length; i++) {
        child.firstElementChild.innerText = game.players[i].hand.length - 1;
      }
    }
  } else {
    target.firstElementChild.innerText = game.players[1].hand.length - 1;
  }

}

function removeCardUserHand(classPlayer, index, cardIndex) {
  classPlayer[index].hand.splice(cardIndex, 1);
  for (let i = 1; i < classPlayer.length; i++) {
    classPlayer[i].hand.splice(0, 1);
  }
}

function createMidCPUDiv(section, className, content) {
  let midDiv = document.createElement('div');
  document.querySelector(section).insertAdjacentElement('afterend', midDiv);
  midDiv.innerHTML = content;
  midDiv.className = className;
}

function playerHandCreate() {
  let createNewHand = document.createElement('ul');
  createNewHand.classList.add('user');
  createNewHand.setAttribute('index', 0);
  console.log(createNewHand);
  gameBoard.insertAdjacentElement('afterbegin', createNewHand);
  let newHandLI = '';
  for (let i = 0; i < game.players[0].hand.length; i++) {
    newHandLI += `
        <li class="card ${game.players[0].hand[i].suit}-card" index='${i}'>
        <div></div>
        ${game.players[0].hand[i].cardType}
        </li>
        `
  }
  createNewHand.innerHTML = newHandLI;
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
    this.tiedGame = false;
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
      this.tiedPlayers.push(player[index]);
      this.userTied = true;
    }


    if (this.tiedPlayers.length >= 2) {
      this.tiedGame = true;
    } else {
      for (let j = 0; j < this.gameFloorCards.length; j++) {
        player[playerIndex].addCardsWon(this.gameFloorCards[j]);
      }
      this.tiedPlayers = [];
      this.gameFloorCards = [];
    }
    console.log(player)
  }

  tieBreaker(cardIndex) {
    let heightestValue = 0;

    if (this.userTied) {
      for (let i = 0; i < this.tiedPlayers.length; i++) {
        if (this.tiedPlayers[i].name.includes('CPU')) {
          this.gameFloorCards.push(this.tiedPlayers[i].hand[0]);
          this.tiedPlayers[i].hand.splice(0, 1);

          for (let j = 0; j < 3; j++) {
            this.gameFloorCards.push(this.tiedPlayers[i].hand[0]);
            this.tiedPlayers[i].hand.splice(0, 1);
          }

          if (this.tiedPlayers[i].hand[0].value > heightestValue) {
            heightestValue = this.tiedPlayers[i].hand[0].value;
          }

        } else {
          this.gameFloorCards.push(this.tiedPlayers[i].hand[cardIndex]);
          this.tiedPlayers[i].hand.splice(cardIndex, 1);

          for (let j = 0; j < 3; j++) {
            this.gameFloorCards.push(this.tiedPlayers[i].hand[0]);
            this.tiedPlayers[i].hand.splice(0, 1);
          }

          if (this.tiedPlayers[i].hand[cardIndex] > heightestValue) {
            heightestValue = this.tiedPlayers[i].hand[cardIndex];
          }
        }
      }
    } else {
      for (let i = 0; i < this.tiedPlayers.length; i++) {
        this.gameFloorCards.push(this.tiedPlayers[i].hand[0]);
        this.tiedPlayers[i].hand.splice(0, 1);

        for (let j = 0; j < 3; j++) {
          this.gameFloorCards.push(this.tiedPlayers[i].hand[0]);
          this.tiedPlayers[i].hand.splice(0, 1);
        }

        if (this.tiedPlayers[i].hand[0].value > heightestValue) {
          heightestValue = this.tiedPlayers[i].hand[0].value;
        }
      }
    }

    for (let l = 0; l < this.gameFloorCards.length; l++) {
      this.tiedPlayers[0].addCardsWon(this.gameFloorCards[l]);
    }

    if (this.tiedPlayers.length < 2) {
      this.tiedPlayers = [];
      this.gameFloorCards = [];
      this.tiedGame = false;
    }

    console.log(this.players);
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
    gameFloor.style.display = 'flex'; 
    gameFloorDesgin.style.display = 'block';  
    let xtraCPU = '';
    for (let i = 0; i < game.players.length; i++) {
      if (game.players[i].name === userName) {
        playerHandCreate()
      }
    }

    gameBoard.innerHTML +=
      `
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
      createMidCPUDiv('.user', 'cpu-mid', xtraCPU)
    }

    // let gameFloor = document.createElement('div')
    // gameBoard.insertAdjacentElement('afterend', gameFloor);
    // gameFloor.className = 'game-floor';

  }
})


gameBoard.addEventListener('click', (e) => {

  if (e.target.parentElement.className === 'user' && e.target.tagName === 'LI') {
    let userIndex = e.target.parentElement.getAttribute('index');
    let userCardIndex = e.target.getAttribute('index');
    let gameFloor = document.querySelector('.game-floor');
    let indexLI = document.querySelector('.user').getElementsByTagName(`li`);
    let xtraCPU = '';
    let user = document.querySelector('.user');
    gameFloor.innerHTML = `
      <div class='${e.target.className} game-floor-user'>${e.target.innerText}</div>
      <div class='card ${game.players[1].hand[0].suit}-card'>${game.players[1].hand[0].cardType}</div>
    `;

    if (game.players.length > 2) {
      for (let i = 2; i < game.players.length; i++) {
        xtraCPU += `
    <div class='card ${game.players[i].hand[0].suit}-card'>${game.players[i].hand[0].cardType}</div>
    `;
      }
      createMidCPUDiv('.game-floor-user', 'cpu-mid game-floor-mid', xtraCPU)
    }


    for (let j = parseFloat(e.target.getAttribute('index')) + 1; j < indexLI.length; j++) {
      indexLI[j].setAttribute('index', j - 1);
    }

    addRemoveOverlay(indexLI, 'add');

    if (game.tiedGame === true) {
      console.log('this is a tied game');

      game.tieBreaker(userCardIndex);
      updateCPUHand(user.nextElementSibling);
      gameBoard.firstElementChild.remove()
      playerHandCreate();

      setTimeout(() => {
        gameFloor.innerHTML = '';
        removeCardUserHand(game.players, userIndex, userCardIndex);
        e.target.remove();
        addRemoveOverlay(indexLI, 'remove');
      }, 1500);
    } else {
      game.gameBoard(userIndex, userCardIndex);
      updateCPUHand(user.nextElementSibling);
      setTimeout(() => {
        gameFloor.innerHTML = '';
        removeCardUserHand(game.players, userIndex, userCardIndex);
        for (let player of game.players) {
          if (player.hand.length === 0) {
            for (let j = 0; j < player.hand.length; j++) {
              player.addCardsWon();
            }
          }
        }
        e.target.remove();
        addRemoveOverlay(indexLI, 'remove')

      }, 2000);
    }
  }

});