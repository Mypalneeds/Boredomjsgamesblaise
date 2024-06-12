var MovesCount = 0;
var timerInterval;
var startTime;

// Start the timer
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - startTime;
    var minutes = Math.floor(elapsedTime / (1000 * 60));
    var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    document.getElementById("timer").textContent = 
        (minutes < 10 ? "0" : "") + minutes + ":" + 
        (seconds < 10 ? "0" : "") + seconds;
}

// Handle image upload and create puzzle pieces
document.getElementById('imageUpload').addEventListener('change', function (event) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
            document.getElementById('uploadedImage').src = e.target.result;
            createPuzzlePieces(img);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
});

// Shuffle the puzzle pieces
function shufflePuzzle() {
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++) {
        var randomIndex = Math.floor(Math.random() * tiles.length);
        var tempStyle = tiles[i].style.cssText;
        tiles[i].style.cssText = tiles[randomIndex].style.cssText;
        tiles[randomIndex].style.cssText = tempStyle;
    }
}


// Create puzzle pieces from uploaded image
function createPuzzlePieces(img) {
    var tiles = document.getElementsByClassName('tile');
    var pieceSize = 150; // Size of each tile
    for (let i = 0; i < tiles.length; i++) {
        var x = (i % 3) * pieceSize;
        var y = Math.floor(i / 3) * pieceSize;
        tiles[i].style.backgroundImage = `url(${img.src})`;
        tiles[i].style.backgroundPosition = `-${x}px -${y}px`;
        tiles[i].style.backgroundSize = '450px 450px';
    }
    startTimer();
}

// Generate random positions for the puzzle pieces
function randomPos() {
    var arr = [];
    while (arr.length < 9) {
        var r = ((Math.floor(Math.random() * 3) + 1).toString()) + ((Math.floor(Math.random() * 3) + 1).toString());
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
}

var RandomPos = randomPos();

for (let i = 0; i < document.getElementsByClassName("tile").length; i++) {
    document.getElementsByClassName("tile")[i].style.gridArea = RandomPos[i][0] + "/" + RandomPos[i][1];
}

// Move the tile
function MoveMe(tile) {
    var EmptyTile = document.querySelector(".emtile");
    var Possibilties = [
        parseInt(RandomPos[tile][0]) + 1 == parseInt(RandomPos[8][0]) && parseInt(RandomPos[tile][1]) == parseInt(RandomPos[8][1]),
        parseInt(RandomPos[tile][0]) - 1 == parseInt(RandomPos[8][0]) && parseInt(RandomPos[tile][1]) == parseInt(RandomPos[8][1]),
        parseInt(RandomPos[tile][1]) + 1 == parseInt(RandomPos[8][1]) && parseInt(RandomPos[tile][0]) == parseInt(RandomPos[8][0]),
        parseInt(RandomPos[tile][1]) - 1 == parseInt(RandomPos[8][1]) && parseInt(RandomPos[tile][0]) == parseInt(RandomPos[8][0]),
    ]
    if (Possibilties[0] || Possibilties[1] || Possibilties[2] || Possibilties[3]) {
        MovesCount++;
        EmptyTile.style.gridArea = RandomPos[tile][0] + "/" + RandomPos[tile][1];
        document.querySelectorAll(".tile")[tile].style.gridArea = RandomPos[8][0] + "/" + RandomPos[8][1];

        var CurrentTile = RandomPos[tile];
        RandomPos[tile] = RandomPos[8];
        RandomPos[8] = CurrentTile;
        NeededPos = ["11", "12", "13", "21", "22", "23", "31", "32", "33"]
        if (RandomPos.join(".") == NeededPos.join(".")) {
            console.log("Game Beated");
            clearInterval(timerInterval); // Stop the timer
            document.querySelector(".blscreen").style.display = 'flex'
            document.querySelector(".MovesCount").innerHTML = MovesCount;
            var stars = 0;
            if (MovesCount < 100) {
                stars = 3
            } else if (MovesCount < 200) {
                stars = 2
            } else if (MovesCount < 300) {
                stars = 1
            } else {
                stars = 0
            }
            for (let i = 0; i < 2; i++) {
                document.getElementsByTagName("path").style.fill = "yellow"
            }
        }
    }
}

