
let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

class Position {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let indexArray = [];

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
// debugger
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                indexArray.push(new Position(i, j));
            }
        }

        shuffleArray(indexArray);

        let count= 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let rasterMap = document.createElement("canvas");
                let rasterContext = rasterMap.getContext("2d");
                let indexing = indexArray[count++];

                const pieceId = `piece-${indexing.j*4+indexing.i}`;
                rasterMap.className="puzzle drag";
                rasterMap.id = pieceId;
                rasterMap.draggable="true";
                rasterMap.width = 150;
                rasterMap.height = 75;

                let mapWidth = map.getSize().x;
                let mapHeight = map.getSize().y;

                let puzzleWidth = mapWidth/4;
                let puzzleHeight = mapHeight/4;
                rasterContext.drawImage(canvas,(puzzleWidth*indexing.i),(puzzleHeight*indexing.j),puzzleWidth,puzzleHeight,0,0,puzzleWidth,puzzleHeight);



                document.body.appendChild(rasterMap);


            }
        }


        const  rasterMapCanvas = document.getElementById("rasterMap");

        const puzzlePieces = document.querySelectorAll("canvas");

        for (let item of puzzlePieces) {
            item.addEventListener("dragstart", function(event) {
                this.style.border = "5px dashed #D8D8FF";
                event.dataTransfer.setData("text", this.id);
            });

            item.addEventListener("dragend", function(event) {
                this.style.borderWidth = "0";
            });


        }


        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {

                let divx = document.createElement("div");
                // const divId = `div-${row}-${col}`;
                divx.classList.add("div-drag");
                divx.backgroundColor ="red";
                divx.clientWidth = 150;
                divx.clientHeight = 75;
                divx.backgroundColor="#b81414";
                divx.draggable="true";
                // divx.id = divId;

                rasterMapCanvas.appendChild(divx)



            }
        }



        const puzzleZoneToDrag = document.getElementsByClassName("div-drag");


        for (let target of puzzleZoneToDrag) {

            target.addEventListener("dragover", function (event) {
                event.preventDefault();
            });
            target.addEventListener("drop", function (event) {
                let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
                myElement.classList.add("dragged");
                this.append(myElement);

                puzzleCorrection(rasterMapCanvas);

            }, false);

        }




    });
});


function puzzleCorrection(field) {
    let canvas = field.querySelectorAll(".div-drag canvas");

    if (canvas.length !== 16) {
        return;
    }

    let counter = 0;
    for (let cnvs of canvas) {
        let id = cnvs.id;
        if (`piece-${counter}` !== id) {
            return;
        }
        counter++;
    }

    let final = document.getElementById("rasterMap");
    let finalDisplay = document.createElement("div");
    let finalDisplayText = document.createElement("p");
    finalDisplayText.textContent = "Gratulacje! Udalo ci sie ulozyc";

    finalDisplay.className = "finalDisplay";
    finalDisplay.appendChild(finalDisplayText);
    final.appendChild(finalDisplay);

    alert("Brawo! Udalo ci sie ulozyc");

    if (!("Notification" in window)) {
        alert("Przeglądarka nie obsługuje powiadomień");
    } else if (Notification.permission === "granted") {
        const notification = new Notification("Brawo! Udalo ci sie poprawnie ulozyc");
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                const notification = new Notification("Brawo! Udalo ci sie poprawnie ulozyc");
            }
        });
    }
}



document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

