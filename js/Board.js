/*********************************************************************

    London Click
    File: Board.js
    Versione: 0.2.0

*********************************************************************/

const Board = {

    svgNS: "http://www.w3.org/2000/svg",

    init() {

        Game.board = document.getElementById("board");
        Game.overlay = document.getElementById("overlay");
        Game.svg = Game.overlay;

        if (!Game.board) {

            console.error("Board: immagine non trovata.");

            return;

        }

        Game.board.addEventListener(

            "load",

            () => this.resize()

        );

        window.addEventListener(

            "resize",

            () => this.resize()

        );

        this.resize();

        Game.log("Board inizializzata");

    },

    debug() {

        console.log("===== BOARD =====");

        console.log(Game.boardRect);

        console.log(Game.svg.getBoundingClientRect());

        console.log(Game.svg.getAttribute("viewBox"));

    },    

    resize() {

        const rect = Game.board.getBoundingClientRect();
        
        Game.log(
            `Board: ${Math.round(rect.width)} x ${Math.round(rect.height)}`
        );

        Game.log(
            `Posizione: left=${Math.round(rect.left)} top=${Math.round(rect.top)}`
        );        

        Game.boardRect = rect;

        Game.svg.setAttribute(

            "viewBox",

            `0 0 ${rect.width} ${rect.height}`

        );
        
        this.updateOverlay(rect);

        if (Renderer && Renderer.refresh) {

            Renderer.refresh();

        }
        
        //Game.svg.setAttribute(
        //  "width",

        // rect.width
        //);
        //Game.svg.setAttribute(
        //    "height",
        //    rect.height
        //);

    },

    updateOverlay(rect) {

    Game.svg.style.left = rect.left + "px";
    Game.svg.style.top = rect.top + "px";
    Game.svg.style.width = rect.width + "px";
    Game.svg.style.height = rect.height + "px";

    },
    
    screenToBoard(clientX, clientY) {

        const rect = Game.boardRect;

        return {

            x: clientX - rect.left,

            y: clientY - rect.top

        };

    },

    boardToRelative(x, y) {

        return {

            x: x / Game.boardRect.width,

            y: y / Game.boardRect.height

        };

    },

    relativeToBoard(x, y) {

        const size = this.getBoardSize();

        return {

            x: x * size.width,

            y: y * size.height

        };

    },

    createSVG(tag) {

        return document.createElementNS(

            this.svgNS,

            tag

        );

    },

    clearOverlay() {

        Game.svg.innerHTML = "";

    },

    drawDebugCircle(x, y, color = "red") {

        const c = this.createSVG("circle");

        c.setAttribute("cx", x);

        c.setAttribute("cy", y);

        c.setAttribute("r", 12);

        c.setAttribute("fill", color);

        c.setAttribute("stroke", "white");

        c.setAttribute("stroke-width", 3);

        Game.svg.appendChild(c);

    },

    getBoardSize() {

        return {

            width: Game.boardRect.width,

            height: Game.boardRect.height

        };

    },

    drawDebugCross(x, y) {

        const h = this.createSVG("line");

        h.setAttribute("x1", x - 10);
        h.setAttribute("y1", y);

        h.setAttribute("x2", x + 10);
        h.setAttribute("y2", y);

        h.setAttribute("stroke", "yellow");
        h.setAttribute("stroke-width", 2);

        Game.svg.appendChild(h);

        const v = this.createSVG("line");

        v.setAttribute("x1", x);
        v.setAttribute("y1", y - 10);

        v.setAttribute("x2", x);
        v.setAttribute("y2", y + 10);

        v.setAttribute("stroke", "yellow");
        v.setAttribute("stroke-width", 2);

        Game.svg.appendChild(v);

    }

};

