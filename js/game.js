/*********************************************************************

   Welcome to...
    File: game.js
    Versione: 0.1.0

*********************************************************************/

const Game = {

    version: "0.1.0",

    title: "London Click",

    debug: true,

    board: null,

    overlay: null,

    boardRect: null,

    players: [],

    availablePlayers: [],

    // Elenco delle caselle configurate
    cells: [],

    // ModalitÃ  corrente
    mode: "play",

    configurationMode: false,

    showNumbers: false,

    selectedCell: null,

    selectedPlayer: null,

    initialized: false,

    boardRect: null,

    containerRect: null,

    renderQueue: [],

    pawnImage: null,

    director: {

        enabled: true,

        action: null,    //DirectorAction.MOVE,

        selectedPlayer: null,   //player

        selectedCell: null,

        status: ""
    },

    log(message) {

        if (this.debug) {

            console.log(message);

        }

    },
 
    getPlayersOnCell(cellId) {

       return this.players.filter(player => player.cellId === cellId);

    },

    checkCrowding(cell, players) {

        if (players.length < Config.CROWDING_LIMIT) {
            return;
        }
        // Casella esente dal controllo di affollamento
        if (cell.ignoreCrowding) {
            return;
        }

        const event = Events.get("CROWDING");
        Popup.showEvent(event, cell, players);

    },

    createAvailablePlayers() {

        this.availablePlayers = [];

        const colors = [
            "blue",
            "red",
            "green",
            "gold",
            "orange",
            "purple",
            "cyan",
            "magenta",
            "brown",
            "lime",
            "pink",
            "teal",
            "navy",
            "olive",
            "coral",
            "turquoise",
            "crimson",
            "chocolate",
            "violet",
            "gray"
        ];

        for (let i = 1; i <= Config.MAX_PLAYERS; i++) {

            this.availablePlayers.push({

                id: i,
                name: `Giocatore ${i}`,
                cellId: 0,
                stopTurns: 0,
                color: colors[(i - 1) % colors.length],
                pawnImage: "images/segnalini/pedina_base.png"

            });
        }
    }

};

