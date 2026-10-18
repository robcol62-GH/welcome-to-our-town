/*********************************************************************

    London Click
    File: Config.js

*********************************************************************/

const Config = {

    // VOCI MENU
    MENU: {
        CONF_CASELLE: false,
        VEDI_NUMERI: false,
        EXP_JSON: false,
        NUOVA_PARTITA: true,
        TIMER: true,
        DADO: false,        
        FULLVIDEO: true
    },


    // Numero Massimo di Giocatori (0 no gioco)
    MAX_PLAYERS:20,

    // Numero massimo di pedine sulla stessa casella per attivare l'evento di affollamento.
    CROWDING_LIMIT:4,

    // Grandezza Segnalino
    TOKEN_SIZE: 90,

    // Ingrandimento Segnalino
    TOKEN_HOVER_FACTOR: 3.0,

    PLAYER_RADIUS:12,
    PLAYER_CIRCLE_RADIUS: 26,
    CLICK_RADIUS:0.04,

    START_CELL_OFFSET_X: 28,
    START_CELL_OFFSET_Y: 0,

    TIMER_DEFAULT_MINUTES: 1,
    TIMER_DEFAULT_SECONDS: 0,
    TIMER_WARNING_SECONDS: 10,

    TIMER_COUNTDOWN_START: 10,

    init() {

        this.button =
            document.getElementById("btnConfig");

        if (this.button) {

            this.button.addEventListener(

                "click",

                () => this.start()

            );

        };
        this.exportButton =
                document.getElementById("btnExport");

        if (this.exportButton) {

            this.exportButton.addEventListener(

                "click",

                () => this.exportJSON()

            );

        }

        this.numbersButton =
            document.getElementById("btnNumbers");

        if (this.numbersButton) {

            this.updateNumbersButton();

            this.numbersButton.addEventListener(

                "click",

                () => {

                    Game.showNumbers = !Game.showNumbers;

                    Renderer.refresh();

                    this.updateNumbersButton();

                }

            );

        }

        Game.log("Configuratore pronto");
        Game.overlay.addEventListener(

            "click",

            (event) => {
                this.handleClick(event);
            }

        )
    },

    start() {

        Game.mode = "config";
        Game.overlay.style.pointerEvents = "auto";

        UI.setStatus("ðŸŸ¡ ModalitÃ  configurazione");

        Game.log("ModalitÃ  configurazione attiva");

    },

    createCell(x, y) {

        const cell = {

            id: Game.cells.length + 1,

            position: {

                x,

                y

            },

            image: null

        };

        Game.cells.push(cell);

        return cell;

    },

    handleClick(event) {

        const point = Board.screenToBoard(
            event.clientX,
            event.clientY
        );

        const relative = Board.boardToRelative(
            point.x,
            point.y
        );


        // ==============================
        // MODALITÃ€ PLAY
        // ==============================

        if (Game.mode === "play") {
            // ==============================
            // CLICK SULLA PEDINA
            // ==============================

            // Se sto giÃ  spostando una pedina,
            // ignoro eventuali click sulle altre pedine.
            let nearestCell = null;
            let nearestDistance = Infinity;

            for (const cell of Game.cells) {

                const dx = relative.x - cell.position.x;
                const dy = relative.y - cell.position.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < nearestDistance) {

                    nearestDistance = distance;
                    nearestCell = cell;

                }

            }

            const clickRadius = Config.CLICK_RADIUS;

            // ==============================
            // MODALITÃ€ DIRECTOR
            // ==============================

            if (
                Game.director.enabled &&
                Game.director.step === 2
            ) {

                Director.moveSelectedPlayer(nearestCell);

                return;

            }            

            if (
                nearestCell &&
                nearestDistance <= clickRadius
            ) {
                
                console.log("CLICK CASELLA");
                console.log(
                    "Casella cliccata:",
                    nearestCell.id
                );
console.log(
    "Distanza:",
    nearestDistance,
    "Raggio consentito:",
    Config.CLICK_RADIUS
);
console.log(
    "Giocatore selezionato:",
    Game.selectedPlayer
);

console.log(
    "Giocatori:",
    Game.players.map(p => ({
        id: p.id,
        cellId: p.cellId
    }))
);

                // ==============================
                // PEDINA SELEZIONATA:
                // SPOSTAMENTO SULLA CASELLA
                // ==============================
console.log("ENTRO NEL CONTROLLO SELEZIONE");                

                if (Game.selectedPlayer) {
console.log("SELEZIONE ATTIVA:", Game.selectedPlayer);

                    // La pedina Ã¨ ferma: non puÃ² essere spostata.
                    if (Game.selectedPlayer.stopTurns > 0) {

                        UI.message("â›” OCA ferma. Premi SPACE.");

                        Game.selectedPlayer = null;

                        Renderer.refresh();

console.log("PRIMA DI Popup.showCell", nearestCell.id);
                        Popup.showCell(nearestCell);

console.log("DOPO Popup.showCell");
                        return;
                    }
                    Game.selectedPlayer.cellId = nearestCell.id;

                    const players = Game.getPlayersOnCell(nearestCell.id);
                   
                    Game.checkCrowding(
                        nearestCell,
                        players
                    );

                    console.log(
                        "Pedine presenti:",
                        players.length,
                        players.map(p => p.color)
                    );

                    Game.selectedPlayer = null;

                    Renderer.refresh();
                    Laghetto.refresh();

                    return;

                }

console.log("NESSUNA PEDINA SELEZIONATA: apro il popup");
                // ==============================
                // NESSUNA PEDINA SELEZIONATA:
                // APRE IL CONTENUTO DELLA CASELLA
                // ==============================

                Popup.showCell(nearestCell);
            }
            return;
        }

        // ==============================
        // MODALITÃ€ CONFIG
        // ==============================

        if (Game.mode !== "config") {
            return;
        }

        const cell = {
            id: Game.cells.length,
            position: relative,
            image: null,
            txt: null,
            video: null,
            audio: null,
            selector: null
        };

        Game.cells.push(cell);

        Renderer.drawCellNumber(cell);

        Game.log(
            `Click: x=${relative.x.toFixed(4)}  y=${relative.y.toFixed(4)}`
        );

    },

    exportJSON() {
        console.log(Game.cells);
        
        const data = {

            version: "1.0",

            cells: Game.cells

        };

        const json = JSON.stringify(

            data,

            null,

            4

        );

        const blob = new Blob(

            [json],

            {

                type: "application/json"

            }

        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "caselle.json";

        link.click();

        URL.revokeObjectURL(link.href);

        Game.log("JSON esportato");

    },

    updateNumbersButton() {

        if (!this.numbersButton) return;

        this.numbersButton.textContent =
            Game.showNumbers
                ? "Nascondi Numeri"
                : "Mostra Numeri";

    }
};

