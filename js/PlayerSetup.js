
const PlayerSetup = {

    init() {

        const setup =
            document.getElementById("playerSetup");

        // Nasconde la scelta del numero di giocatori
        if (setup) {
            setup.style.display = "none";
        }

        // Pulsante NUOVA PARTITA
        const newGameButton =
            document.getElementById("btnNewGame");

        if (newGameButton) {
            newGameButton.addEventListener(
                "click",
                () => this.newGame()
            );
        }

    },

    startGame(numberOfPlayers = 1) {

        // Mantiene la gestione di più pedine
        Game.players =
            Game.availablePlayers
                .slice(0, numberOfPlayers)
                .map(player => ({
                    ...player,
                    cellId: 0,
                    stopTurns: 0
                }));

        Game.selectedPlayer = null;
        Game.selectedCell = null;

        Renderer.refresh();

        const setup =
            document.getElementById("playerSetup");

        if (setup) {
            setup.style.display = "none";
        }

    },

    newGame() {

        // Avvia una partita con un solo turista
        this.startGame(1);

    }

};
