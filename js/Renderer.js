/*********************************************************************

    London Click

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

    drawPlayer(player) {

        if (
            !player ||
            player.id === undefined ||
            player.cellId === undefined
        ) {
            return;
        }

        /* ==================================================
        PEDINE NELLA POSIZIONE INIZIALE
        cellId === 0
        ================================================== */

        if (player.cellId === 0) {

            // Recupera la posizione dell'aiuola dai dati della scacchiera
            const cell = Game.cells.find(c => c.id === 0);

            if (!cell) {
                Game.log("Casella 0 non trovata");
                return;
            }

            const point = Board.relativeToBoard(
                cell.position.x,
                cell.position.y
            );

            // Crea il gruppo del segnalino
            const group = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

            group.classList.add("player");
            group.dataset.playerId = player.id;
            group.style.cursor = "pointer";

            Game.svg.appendChild(group);

            // Disegna il turista
            const dimensione = Config.TOKEN_SIZE * 1.8 ;

            const token = this.create("image");

            token.setAttribute("href", player.pawnImage);
            token.setAttribute("width", dimensione);
            token.setAttribute("height", dimensione);
            token.setAttribute(
                "x",
                point.x - dimensione / 2
            );
            token.setAttribute(
                "y",
                point.y - dimensione / 2
            );

            group.appendChild(token);

            player.element = token;

            // Mantiene l'evidenziazione della pedina selezionata
            if (
                Game.selectedPlayer &&
                Game.selectedPlayer.id === player.id
            ) {
                this.drawCircle(
                    group,
                    point.x,
                    point.y,
                    dimensione / 2 + 4,
                    player.stopTurns > 0 ? "red" : "black",
                    player.stopTurns > 0 ? 6 : 4
                );
            }

            // Mantiene il comportamento al clic
            group.addEventListener("click", (event) => {

                event.stopPropagation();

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

            return;
        }
            /* ==================================================
            PEDINE SUL TABELLONE
            DA QUI IN POI Ãˆ IL CODICE ORIGINALE
            ================================================== */

            const cell = Game.cells.find(
                cell => cell.id === player.cellId
            );

            console.log(
                player.name,
                player.cellId,
                cell.id
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

            let baseX = point.x;
            let baseY = point.y;

            // Trova tutte le pedine presenti sulla stessa casella
            const playersOnSameCell = Game.players.filter(
                p => p.cellId === player.cellId
            );

            // Trova la posizione di questa pedina nel gruppo
            const playerIndex = playersOnSameCell.findIndex(
                p => p.id === player.id
            );

            // Distanza tra le pedine
            const spacing = 22;

            let offsetX = 0;
            let offsetY = 0;

            // ==============================
            // ALTRE CASELLE:
            // disposizione centrata
            // ==============================

            offsetX =
                (playerIndex - (playersOnSameCell.length - 1) / 2)
                * spacing;

            const selected =
                Game.selectedPlayer &&
                Game.selectedPlayer.id === player.id;

            const group = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

            group.classList.add("player");
            group.dataset.playerId = player.id;
            group.style.cursor = "pointer";
            group.style.pointerEvents = "all";

            Game.svg.appendChild(group);
            group.parentNode.appendChild(group);

            const ringRadius =
                Math.round(Config.TOKEN_SIZE / 2) + 3;

            console.log(
                "PLAYER",
                player.id,
                "selected=", selected,
                "stopTurns=", player.stopTurns
            );

            if (selected) {

                this.drawCircle(
                    group,
                    baseX + offsetX,
                    baseY + offsetY,
                    ringRadius,
                    "black",
                    4
                );
            }

            const ocaSize = selected
                ? Config.TOKEN_SIZE + 6
                : Config.TOKEN_SIZE;

            const pawn = this.drawToken(
                group,
                player,
                ocaSize
            );

            this.positionPlayer(
                player,
                baseX + offsetX,
                baseY + offsetY,
                ocaSize
            );
            // ==============================
            // PEDINA FERMA: VELO SCURO
            // ==============================

            if (player.stopTurns > 0) {

                const overlay = this.create("circle");

                overlay.setAttribute(
                    "cx",
                    baseX + offsetX
                );

                overlay.setAttribute(
                    "cy",
                    baseY + offsetY
                );

                overlay.setAttribute(
                    "r",
                    ocaSize / 2
                );

                overlay.setAttribute(
                    "fill",
                    "black"
                );

                overlay.setAttribute(
                    "opacity",
                    "0.55"
                );

                overlay.setAttribute(
                    "pointer-events",
                    "none"
                );

                group.appendChild(overlay);

            }            

            pawn.classList.add("player");
            pawn.dataset.playerId = player.id;

            pawn.addEventListener("click", (event) => {

                console.log(
                    "CLICK PEDINA",
                    player.id
                );

                event.stopPropagation();

                // ModalitÃ  Director
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

            if (
                Game.selectedPlayer &&
                Game.selectedPlayer.id !== player.id
            ) {

                pawn.style.pointerEvents = "none";

            } else {

                pawn.style.pointerEvents = "auto";

            }
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

