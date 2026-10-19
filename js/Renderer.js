/*********************************************************************

    WTOT

    File: Renderer.js

    Versione: 0.2.0

*********************************************************************/

const Renderer = {

        init() {

        Game.log("Renderer inizializzato");

    },

    clear() {

        Game.svg.innerHTML = "";

    },

    create(tag) {

        return document.createElementNS(

            "http://www.w3.org/2000/svg",

            tag

        );

    },

    drawCircle(parent, x, y, radius, color, strokeWidth = 4) {

        const circle = this.create("circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", strokeWidth);

        parent.appendChild(circle);

        return circle;

    },

    drawText(text, x, y) {

        const label = this.create("text");

        label.textContent = text;

        label.setAttribute("x", x);

        label.setAttribute("y", y);

        label.setAttribute("text-anchor", "middle");

        label.setAttribute("dominant-baseline", "middle");

        label.setAttribute("font-size", 22);

        label.setAttribute("font-weight", "bold");

        label.setAttribute("fill", "#003366");

        Game.svg.appendChild(label);

        return label;

    },

    refresh() {

        Game.log("Renderer refresh");
        //console.log("=== INIZIO REFRESH ===");
        //console.table(Game.players);
        Board.clearOverlay();


        if (Game.showNumbers) {

            for (const cell of Game.cells) {

                this.drawCellNumber(cell);

            }

        }
        //console.log("=== PLAYERS ===");
        //console.table(Game.players);


        for (const player of Game.players) {

            this.drawPlayer(player);

        }

        // Disegna lo spillo sulla destinazione estratta
        this.drawDestinationMarker();

    },

    drawCellNumber(cell) {

        const point = Board.relativeToBoard(

            cell.position.x,

            cell.position.y

        );

        this.drawText(

            cell.id,

            point.x,

            point.y

        );

    },

    drawDestinationMarker() {

        if (!Game.routePending || !Game.destinationCell) {
            return;
        }

        const cell = Game.destinationCell;

        const point = Board.relativeToBoard(
            cell.position.x,
            cell.position.y
        );

        const group = this.create("g");

        group.setAttribute("pointer-events", "none");

        // Spillo rosso, con bordo bianco
        const pin = this.create("path");

        //MISURE SEGNALINO DI ARRIVO
        pin.setAttribute(
            "d",
            "M 0 30 C -5 22 -20 9 -20 -5 A 20 20 0 1 1 20 -5 C 20 9 5 22 0 30 Z"
        );

        pin.setAttribute(
            "transform",
            `translate(${point.x} ${point.y - 25})`
        );

        pin.setAttribute("fill", "#ff1717");
        pin.setAttribute("stroke", "#ffffff");
        pin.setAttribute("stroke-width", "4");
        pin.setAttribute("stroke-linejoin", "round");

        group.appendChild(pin);

        // Cerchio centrale bianco
        const center = this.create("circle");

        center.setAttribute("cx", point.x);
        center.setAttribute("cy", point.y - 30);
        center.setAttribute("r", "6");
        center.setAttribute("fill", "#ffffff");

        group.appendChild(center);

        Game.svg.appendChild(group);
    },
    
    drawToken(parent, player, dimensione = Config.TOKEN_SIZE) {

        // -------------------------------------------------
        // SFONDO COLORATO
        // -------------------------------------------------

        const sfondo = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        sfondo.setAttribute(
            "r",
            dimensione * 0.46
        );

        sfondo.setAttribute(
            "fill",
            player.color
        );

        // Non deve intercettare il mouse
        sfondo.setAttribute(
            "pointer-events",
            "none"
        );

        player.backgroundElement = sfondo;

        parent.appendChild(sfondo);


        // -------------------------------------------------
        // OCA NEUTRA
        // -------------------------------------------------

        const token = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "image"
        );

        token.setAttribute(
            "href",
            player.pawnImage
        );

        token.setAttribute(
            "width",
            dimensione
        );

        token.setAttribute(
            "height",
            dimensione
        );

        token.classList.add("player");

        token.dataset.playerId = player.id;

        player.element = token;

        // -------------------------------------------------
        // SELEZIONE
        // -------------------------------------------------

        if (Game.selectedPlayer === player) {

            token.classList.add("player-selected");

        }


        parent.appendChild(token);


            
        // -------------------------------------------------
        // NUMERO DEL GIOCATORE
        // -------------------------------------------------

        const numero = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        numero.textContent = player.id;

        numero.setAttribute(
            "text-anchor",
            "middle"
        );

        numero.setAttribute(
            "dominant-baseline",
            "central"
        );

        numero.setAttribute(
            "font-family",
            "Arial, sans-serif"
        );

        numero.setAttribute(
            "font-weight",
            "bold"
        );

        numero.setAttribute(
            "font-size",
            dimensione * 0.22
        );

        numero.setAttribute(
            "fill",
            "white"
        );

        numero.setAttribute(
            "pointer-events",
            "none"
        );

        numero.setAttribute(
            "style",
            "paint-order: stroke; stroke: black; stroke-width: 2px;"
        );

        player.numberElement = numero;

        parent.appendChild(numero);    


        // -------------------------------------------------
        // INGRANDIMENTO AL PASSAGGIO DEL MOUSE
        // -------------------------------------------------

        const fattoreHover = Config.TOKEN_HOVER_FACTOR;

        token.addEventListener("mouseenter", () => {

            const x = parseFloat(token.getAttribute("x"));
            const y = parseFloat(token.getAttribute("y"));

            const cx = x + dimensione / 2;
            const cy = y + dimensione / 2;

            const nuovaDimensione =
                dimensione * fattoreHover;
            numero.setAttribute(
                "font-size",
                nuovaDimensione * 0.11
            );

            numero.setAttribute(
                "x",
                cx - nuovaDimensione * 0.02
            );

            numero.setAttribute(
                "y",
                cy + nuovaDimensione * 0.28
            );

            // OCA

            token.setAttribute(
                "width",
                nuovaDimensione
            );

            token.setAttribute(
                "height",
                nuovaDimensione
            );

            token.setAttribute(
                "x",
                cx - nuovaDimensione / 2
            );

            token.setAttribute(
                "y",
                cy - nuovaDimensione / 2
            );


            // SFONDO COLORATO

            sfondo.setAttribute(
                "r",
                nuovaDimensione / 2
            );

            sfondo.setAttribute(
                "cx",
                cx
            );

            sfondo.setAttribute(
                "cy",
                cy
            );

            token.classList.add("player-hover");

        });


        token.addEventListener("mouseleave", () => {

            const nuovaDimensione =
                dimensione * fattoreHover;

            const x =
                parseFloat(token.getAttribute("x"));

            const y =
                parseFloat(token.getAttribute("y"));

            const cx =
                x + nuovaDimensione / 2;

            const cy =
                y + nuovaDimensione / 2;


            // OCA TORNA NORMALE

            token.setAttribute(
                "width",
                dimensione
            );

            token.setAttribute(
                "height",
                dimensione
            );

            token.setAttribute(
                "x",
                cx - dimensione / 2
            );

            token.setAttribute(
                "y",
                cy - dimensione / 2
            );


            // SFONDO TORNA NORMALE

            sfondo.setAttribute(
                "r",
                dimensione * 0.45
            );

            sfondo.setAttribute(
                "cx",
                cx
            );

            sfondo.setAttribute(
                "cy",
                cy
            );
            // NUMERO TORNA NORMALE

            numero.setAttribute(
                "font-size",
                dimensione * 0.22
            );

            numero.setAttribute(
                "x",
                cx
            );

            numero.setAttribute(
                "y",
                cy + dimensione * 0.18
            );
            token.classList.remove("player-hover");

        });


        return token;

    },

    drawPlayer(player) {

        if (
            !player ||
            player.id === undefined ||
            player.cellId === undefined
        ) {
            return;
        }

        const cell = Game.cells.find(
            c => c.id === player.cellId
        );

        if (!cell) {
            Game.log(
                `Casella ${player.cellId} non trovata per ${player.name}`
            );
            return;
        }

        const point = Board.relativeToBoard(
            cell.position.x,
            cell.position.y
        );

        // Posizione condivisa: una sola pedina per giocatore.
        const playersOnSameCell = Game.players.filter(
            p => p.cellId === player.cellId
        );

        const playerIndex = playersOnSameCell.findIndex(
            p => p.id === player.id
        );

        const spacing = 22;

        const offsetX =
            (playerIndex - (playersOnSameCell.length - 1) / 2)
            * spacing;

        const x = point.x + offsetX;
        // SPOSTAMENTO VERTICALE DEL TURISTA
        const TURISTA_OFFSET_Y = 5;
        const y = point.y + TURISTA_OFFSET_Y;
        const dimensione = Config.TOKEN_SIZE;

        const group = this.create("g");

        group.classList.add("player");
        group.dataset.playerId = player.id;
        group.style.cursor = "pointer";

        Game.svg.appendChild(group);

        const token = this.create("image");

        token.setAttribute("href", player.pawnImage);
        token.setAttribute("width", dimensione);
        token.setAttribute("height", dimensione);
        token.setAttribute("x", x - dimensione / 2);
        token.setAttribute("y", y - dimensione / 2);

        token.style.pointerEvents = "all";

        group.appendChild(token);

        player.element = token;
        player.backgroundElement = null;
        player.numberElement = null;

        const selectorIcon = this.drawSelectorIcon(
            group,
            player,
            x,
            y,
            dimensione
        );

        // Ingrandisce il selettore anche passando sul Turista
        if (selectorIcon) {
            group.addEventListener("mouseenter", () => {
                selectorIcon.style.transform = "scale(1.3)";
            });

            group.addEventListener("mouseleave", () => {
                selectorIcon.style.transform = "scale(1)";
            });
        }

        // Evidenziazione della pedina selezionata.
        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id
        ) {
            this.drawCircle(
                group,
                x,
                y,
                dimensione / 2 + 4,
                player.stopTurns > 0 ? "red" : "black",
                player.stopTurns > 0 ? 6 : 4
            );
        }

        // Velo scuro per una pedina ferma.
        if (player.stopTurns > 0) {
            const overlay = this.create("circle");

            overlay.setAttribute("cx", x);
            overlay.setAttribute("cy", y);
            overlay.setAttribute("r", dimensione / 2);
            overlay.setAttribute("fill", "black");
            overlay.setAttribute("opacity", "0.55");
            overlay.setAttribute("pointer-events", "none");

            group.appendChild(overlay);
        }

        // Effetti hover: sfondo colorato e ingrandimento.
        const fattoreHover = Config.TOKEN_HOVER_FACTOR;

    },

    drawStartPlayer(player, point) {

        const group = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        group.classList.add("player");
        group.dataset.playerId = player.id;

        Game.svg.appendChild(group);

        const radius = Config.TOKEN_SIZE / 2;

        // Cerchio colorato
        const circle = this.create("circle");

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", radius);

        circle.setAttribute("fill", player.color);
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", 3);

        group.appendChild(circle);

        // Numero della pedina
        const number = this.create("text");

        number.textContent = player.id;

        number.setAttribute("x", point.x);
        number.setAttribute("y", point.y);

        number.setAttribute("text-anchor", "middle");
        number.setAttribute("dominant-baseline", "central");

        number.setAttribute("font-size", radius);
        number.setAttribute("font-weight", "bold");
        number.setAttribute("font-family", "Arial, sans-serif");
        number.setAttribute("fill", "white");

        number.setAttribute(
            "style",
            "paint-order: stroke; stroke: black; stroke-width: 2px;"
        );

        group.appendChild(number);

        // Evidenziazione della pedina selezionata
        if (
            Game.selectedPlayer &&
            Game.selectedPlayer.id === player.id
        ) {

            this.drawCircle(
                group,
                point.x,
                point.y,
                radius + 4,
                "black",
                4
            );

        }

        // Click sulla pedina
        group.addEventListener("click", (event) => {

            event.stopPropagation();

            console.log(
                "CLICK PEDINA INIZIALE",
                player.id
            );

            if (
                Game.director.enabled &&
                Game.director.step === 1
            ) {

                Director.selectPlayer(player);

                return;

            }

            Game.selectedPlayer = player;

            Renderer.refresh();

        });

    },


    drawSelectorIcon(group, player, x, y, dimensione) {

        //if (Game.routePending) return;

        const cell = Game.cells.find(
            c => c.id === player.cellId
        );

        if (!cell?.selector) return;

        const iconSize = dimensione * 0.75;
        // POSIZIONE DEL SELETTORE
        const SELECTOR_OFFSET_X = -dimensione * 0.20;
        const SELECTOR_OFFSET_Y = -dimensione * 1.15;        

        const icon = this.create("image");

        icon.setAttribute("href", "images/selector.png");
        icon.setAttribute("width", iconSize);
        icon.setAttribute("height", iconSize);
        icon.setAttribute("x", x + SELECTOR_OFFSET_X);
        icon.setAttribute("y", y + SELECTOR_OFFSET_Y);

        icon.style.cursor = "pointer";
        // Ingrandimento al passaggio del mouse
        icon.style.transformBox = "fill-box";
        icon.style.transformOrigin = "center";
        icon.style.transition = "transform 0.2s ease";

        icon.addEventListener("mouseenter", () => {
            icon.style.transform = "scale(1.3)";
        });

        icon.addEventListener("mouseleave", () => {
            icon.style.transform = "scale(1)";
        });        

        icon.style.pointerEvents = "all";
        icon.addEventListener("click", (event) => {

            event.stopPropagation();

            if (Game.routePending) {
                Game.destinationCell = null;
                Game.routePending = false;
                Renderer.refresh();
            }
            Popup.launchSelector(
                cell.selector,
                cell,
                icon
            );
        });

        group.appendChild(icon);
        return icon;
    },

    positionPlayer(player, x, y, dimensione = Config.TOKEN_SIZE) {

        const token = player.element;

        if (!token) return;

        token.setAttribute(
            "x",
            x - dimensione / 2
        );

        token.setAttribute(
            "y",
            y - dimensione / 2
        );

        if (player.backgroundElement) {

            player.backgroundElement.setAttribute(
                "cx",
                x
            );

            player.backgroundElement.setAttribute(
                "cy",
                y
            );

            player.backgroundElement.setAttribute(
                "r",
                dimensione / 2
            );

        }
        if (player.numberElement) {

            player.numberElement.setAttribute(
                "x",
                x
            );

            player.numberElement.setAttribute(
                "y",
                y + dimensione * 0.18
            );

        }        
    }
};

