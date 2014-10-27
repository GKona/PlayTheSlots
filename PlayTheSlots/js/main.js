/// <reference path="jquery.js" />
// Disables right-clicking
document.oncontextmenu = function () {
    return false;
}
// !!!
// Code segment below was taken here http://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/
// Allows for multiple types images to be displayed within the canvas 
function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

// Image sources
var sources = {
    sevens: 'img/7s.jpg',
    bananas: 'img/bananas.png',
    bars: 'img/bars.jpg',
    bells: 'img/bells.jpg',
    cherries: 'img/cherries.jpg',
    grapes: 'img/grapes.jpg',
    oranges: 'img/oranges.jpg',
    blank: 'img/blank.jpg',
    qReel: 'img/Q.png',
    timer1: 'img/timer1.png',
    timer2: 'img/timer2.png'
};
// Code segment above was taken from http://www.html5canvastutorials.com/tutorials/html5-canvas-image-loader/
// !!!

// Draws initial slot machine on the canvas on load
window.onload = function () {
    var theCanvas = document.getElementById('myCanvas');
    var print = theCanvas.getContext('2d');
    var pr = theCanvas.getContext('2d');

    var sPannel = new Image();
    sPannel.src = "img/sPannel.png";
    sPannel.onload = drawSPannel;
    
    // Draws slot machine pannels and text
    function drawSPannel() {
        startSnd.play();
        print.drawImage(sPannel, 0, 0, 405, 515);
        loadImages(sources, function (images) {
            print.drawImage(images.qReel, 60, 145, 75, 75);
            print.drawImage(images.qReel, 165, 145, 75, 75);
            print.drawImage(images.qReel, 270, 145, 75, 75);
        });
        print.font = "18pt Book Antiqua";
        print.fillStyle = "red";
        print.fillText(playerMoney, 58, 277);
        print.fillText(playerBet, 188, 277)
        print.fillText(winnings, 288, 277);
        print.fillText(jackpot, 58, 332);
        print.fillText(winRatio, 188, 332);
        print.fillText("%", 240, 332)
        print.fillText(turn, 58, 386);
        print.fillText(winNumber, 116, 386);
        print.fillText(lossNumber, 176, 386);
    }

    // Declaration of all number tracking variables 
    var playerMoney = 1000;
    var winnings = 0;
    var jackpot = 5000;
    var turn = 0;
    var playerBet = 0;
    var winNumber = 0;
    var lossNumber = 0;
    var spinResult;
    var fruits = "";
    var winRatio = 0.00;
    var grapes = 0;
    var bananas = 0;
    var oranges = 0;
    var cherries = 0;
    var bars = 0;
    var bells = 0;
    var sevens = 0;
    var blanks = 0;
    var reel1 = 55;
    var reel2 = 160;
    var reel3 = 265;

    // Declaration of all sounds 
    var spinSnd = new Audio("sounds/spin.wav");
    var winSnd = new Audio("sounds/win.wav");
    var loseSnd = new Audio("sounds/lose.wav");
    var coinSnd = new Audio("sounds/coin.wav");
    var jackpotSnd = new Audio("sounds/jackpot.wav");
    var quitSnd = new Audio("sounds/quit.wav");
    var startSnd = new Audio("sounds/start.wav");
    var resetSnd = new Audio("sounds/reset.wav");
    var tickSnd = new Audio("sounds/tick.wav");
    
    // Utility function to show Player Stats 
    function showPlayerStats() {
        winRatio = winNumber / turn;
        /*
        $("#jackpot").text("Jackpot: " + jackpot);
        $("#playerMoney").text("Player Money: " + playerMoney);
        $("#playerTurn").text("Turn: " + turn);
        $("#playerWins").text("Wins: " + winNumber);
        $("#playerLosses").text("Losses: " + lossNumber);
        $("#playerWinRatio").text("Win Ratio: " + (winRatio * 100).toFixed(2) + "%");
        */
        print.drawImage(sPannel, 0, 0, 405, 515);
        print.fillText(playerMoney, 58, 277);
        print.fillText(playerBet, 188, 277)
        print.fillText(winnings, 288, 277);
        print.fillText(jackpot, 58, 332);
        if (winRatio >= 0) {
            print.fillText((winRatio * 100).toFixed(2), 188, 332);
        }
        else {
            print.fillText(0.00, 188, 332);
        }
        print.fillText("%", 240, 332)
        print.fillText(turn, 58, 386);
        print.fillText(winNumber, 116, 386);
        print.fillText(lossNumber, 176, 386);
    }

    // Utility function to reset all fruit tallies 
    function resetFruitTally() {
        grapes = 0;
        bananas = 0;
        oranges = 0;
        cherries = 0;
        bars = 0;
        bells = 0;
        sevens = 0;
        blanks = 0;
    }

    // Utility function to reset the player stats 
    function resetAll() {
        playerMoney = 1000;
        playerBet = 0;
        winnings = 0;
        jackpot = 5000;
        winRatio = 0.00;
        turn = 0;
        playerBet = 0;
        winNumber = 0;
        lossNumber = 0;
    }

    // Check to see if the player won the jackpot 
    function checkJackPot() {
        /* compare two random values */
        var jackPotTry = Math.floor(Math.random() * 51 + 1);
        var jackPotWin = Math.floor(Math.random() * 51 + 1);
        if (jackPotTry == jackPotWin) {
            alert("You Won the $" + jackpot + " Jackpot!!");
            playerMoney += jackpot;
            jackpot = 1000;
        }
    }

    // Utility function to show a win message and increase player money
    function showWinMessage() {
        playerMoney += winnings;
        //$("div#winOrLose>p").text("You Won: $" + winnings);
        resetFruitTally();
        checkJackPot();
    }

    // Utility function to show a loss message and reduce player money 
    function showLossMessage() {
        playerMoney -= playerBet;
        //$("div#winOrLose>p").text("You Lost!");
        resetFruitTally();
    }

    // Utility function to check if a value falls within a range of bounds 
    function checkRange(value, lowerBounds, upperBounds) {
        if (value >= lowerBounds && value <= upperBounds) {
            return value;
        }
        else {
            return !value;
        }
    }

    // Utility function to determines the betLine results (e.g. Bar - Orange - Banana)
    function Reels() {
        var betLine = [" ", " ", " "];
        var outCome = [0, 0, 0];

        for (var spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "Grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "Banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "Orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): // 7.7% probability
                    betLine[spin] = "Cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): // 4.6% probability
                    betLine[spin] = "Bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): // 3.1% probability
                    betLine[spin] = "Bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): // 1.5% probability
                    betLine[spin] = "Seven";
                    sevens++;
                    break;
            }       
        }
        return betLine;
    }

    // Utility function to calculate the player's winnings, if any and plays winning or losing soundeffect
    function determineWinnings() {
        if (blanks == 0) {
            if (grapes == 3) {
                winnings = playerBet * 10;
                winSnd.play();
            }
            else if (bananas == 3) {
                winnings = playerBet * 20;
                winSnd.play();
            }
            else if (oranges == 3) {
                winnings = playerBet * 30;
                winSnd.play();
            }
            else if (cherries == 3) {
                winnings = playerBet * 40;
                winSnd.play();
            }
            else if (bars == 3) {
                winnings = playerBet * 50;
                winSnd.play();
            }
            else if (bells == 3) {
                winnings = playerBet * 75;
                winSnd.play();
            }
            else if (sevens == 3) {
                winnings = playerBet * 100;
                jackpotSnd.play();
            }
            else if (grapes == 2) {
                winnings = playerBet * 2;
                winSnd.play();
            }
            else if (bananas == 2) {
                winnings = playerBet * 2;
                winSnd.play();
            }
            else if (oranges == 2) {
                winnings = playerBet * 3;
                winSnd.play();
            }
            else if (cherries == 2) {
                winnings = playerBet * 4;
                winSnd.play();
            }
            else if (bars == 2) {
                winnings = playerBet * 5;
                winSnd.play();
            }
            else if (bells == 2) {
                winnings = playerBet * 10;
                winSnd.play();
            }
            else if (sevens == 2) {
                winnings = playerBet * 20;
                winSnd.play();
            }
            else if (sevens == 1) {
                winnings = playerBet * 5;
                winSnd.play();
            }
            else {
                winnings = playerBet * 1;
                winSnd.play();
            }
            winNumber++;
            showWinMessage();
        }
        else {
            lossNumber++;
            showLossMessage();
            winnings = 0;
            loseSnd.play();
        }
    }
    
    // Utility function to assign images to randomly selected real items
    function reelImgs(spin, reel) {
        switch (spin) {
            case "Seven":
                loadImages(sources, function (images) {
                    print.drawImage(images.sevens, reel, 145, 85, 75);
                });
                break;
            case "Grapes":
                loadImages(sources, function (images) {
                    print.drawImage(images.grapes, reel, 145, 85, 75);
                });
                break;
            case "Banana":
                loadImages(sources, function (images) {
                    print.drawImage(images.bananas, reel, 145, 85, 75);
                });
                break;
            case "Orange":
                loadImages(sources, function (images) {
                    print.drawImage(images.oranges, reel, 145, 85, 75);
                });
                break;
            case "Cherry":
                loadImages(sources, function (images) {
                    print.drawImage(images.cherries, reel, 145, 85, 75);
                });
                break;
            case "Bar":
                loadImages(sources, function (images) {
                    print.drawImage(images.bars, reel, 145, 85, 75);
                });
                break;
            case "Bell":
                loadImages(sources, function (images) {
                    print.drawImage(images.bells, reel, 145, 85, 75);
                });
                break;
            default:
                loadImages(sources, function (images) {
                    print.drawImage(images.blank, reel, 145, 85, 75);
                });
                break;
        }
    }

    // Utility function to retain the reel images after every spin and during bet change
    function retainReel() {
        if (fruits == "") {
            loadImages(sources, function (images) {
                print.drawImage(images.qReel, 60, 145, 75, 75);
                print.drawImage(images.qReel, 165, 145, 75, 75);
                print.drawImage(images.qReel, 270, 145, 75, 75);
            });
        }
        else {
            reelImgs(spinResult[0], reel1);
            reelImgs(spinResult[1], reel2);
            reelImgs(spinResult[2], reel3);
        }
    }

    // Utility function for reel spin animation
    function reelSpin() {
        spinSnd.currentTime = 0;
        spinSnd.play();
        print.drawImage(sPannel, 0, 0, 405, 515);
        print.fillText(playerMoney, 58, 277);
        print.fillText(playerBet, 188, 277)
        print.fillText(winnings, 288, 277);
        print.fillText(jackpot, 58, 332);
        print.fillText((winRatio * 100).toFixed(2), 188, 332);
        print.fillText("%", 240, 332)
        print.fillText(turn, 58, 386);
        print.fillText(winNumber, 116, 386);
        print.fillText(lossNumber, 176, 386);
        loadImages(sources, function (images) {
            print.drawImage(images.timer2, 60, 145, 75, 75);
            print.drawImage(images.timer2, 165, 145, 75, 75);
            print.drawImage(images.timer2, 270, 145, 75, 75);
        });

        setTimeout(function () {
            print.drawImage(sPannel, 0, 0, 405, 515);
            print.fillText(playerMoney, 58, 277);
            print.fillText(playerBet, 188, 277)
            print.fillText(winnings, 288, 277);
            print.fillText(jackpot, 58, 332);
            print.fillText((winRatio * 100).toFixed(2), 188, 332);
            print.fillText("%", 240, 332)
            print.fillText(turn, 58, 386);
            print.fillText(winNumber, 116, 386);
            print.fillText(lossNumber, 176, 386);
            loadImages(sources, function (images) {
                print.drawImage(images.timer1, 60, 145, 75, 75);
                print.drawImage(images.timer1, 165, 145, 75, 75);
                print.drawImage(images.timer1, 270, 145, 75, 75);
            });
        }, 330);

        setTimeout(function () {
            print.drawImage(sPannel, 0, 0, 405, 515);
            print.fillText(playerMoney, 58, 277);
            print.fillText(playerBet, 188, 277)
            print.fillText(winnings, 288, 277);
            print.fillText(jackpot, 58, 332);
            print.fillText((winRatio * 100).toFixed(2), 188, 332);
            print.fillText("%", 240, 332)
            print.fillText(turn, 58, 386);
            print.fillText(winNumber, 116, 386);
            print.fillText(lossNumber, 176, 386);
            loadImages(sources, function (images) {
                print.drawImage(images.timer2, 60, 145, 75, 75);
                print.drawImage(images.timer2, 165, 145, 75, 75);
                print.drawImage(images.timer2, 270, 145, 75, 75);
            });
        }, 660);
    }

    // Event handler for when the player clicks the reset button the game resets player stats 
    $("#resetBtn").click(function () {
        resetSnd.currentTime = 0;
        resetSnd.play();
        resetAll();
        retainReel()
        showPlayerStats();
    });
    
    // Event handler for when the player clicks the quit button the game asks for fonfirmation and then closes
    $("#quitBtn").click(function () {
        tickSnd.currentTime = 0;
        tickSnd.play();
        if (confirm("Are you sure you want to leave the casino?")) {
            quitSnd.currentTime = 0;
            quitSnd.play();
            setTimeout(function () {
                window.close();
            }, 1200);
        }
    });

    // Event handler for when the player clicks the increase bet button the game current bet is increased by 10
    $("#incBetBtn").click(function () {
        if (playerBet < playerMoney) { playerBet += 10;}
        showPlayerStats();
        retainReel()
        coinSnd.currentTime = 0;
        coinSnd.play();
    });

    // Event handler for when the player clicks the decreased bet button the game current bet is decreased by 10
    $("#decBetBtn").click(function () {
        if (playerBet > 0) { playerBet -= 10; }
        showPlayerStats();
        retainReel()
        coinSnd.currentTime = 0;
        coinSnd.play();
    });

    // Event handler for when the player clicks the spin button the game kicks off 
    $("#spinBtn").click(function () {
        //playerBet = $("div#betEntry>input").val();
        if (playerBet == 0) {
            tickSnd.currentTime = 0;
            tickSnd.play();
            alert("You must first place a bet in order to spin.");
        }
        else {
        reelSpin()
        //document.getElementById('#spinBtn').invisible = true;
        setTimeout(function () {
            if (playerMoney == 0) {
                if (confirm("You ran out of Money! \nDo you want to play again?")) {
                    resetAll();
                    showPlayerStats();
                }
            }
            /*
            else if (playerBet > playerMoney) {
                alert("You don't have enough Money to place that bet.");
            }
            else if (playerBet < 0) {
                alert("All bets must be a positive $ amount.");
            }
            */
            else if (playerBet <= playerMoney) {
                spinResult = Reels();
                // Pushes each reel result to assing images for display
                reelImgs(spinResult[0], reel1);
                reelImgs(spinResult[1], reel2);
                reelImgs(spinResult[2], reel3);
                fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
                //$("div#result>p").text(fruits);
                determineWinnings();
                turn++;
                showPlayerStats();
            }
            /*
            else {
                alert("Please enter a valid bet amount");
            }
            */
        }, 900);
        }
    });
}










