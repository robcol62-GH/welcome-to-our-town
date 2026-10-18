
const DirectorAction = {

    MOVE: "MOVE"

};

const Director = {

    init() {

        document.addEventListener("keydown", (event) => {

            if (event.ctrlKey &&
                event.shiftKey &&
                event.key.toUpperCase() === "D") {

                event.preventDefault();

                Director.begin(DirectorAction.MOVE);

            }

        });

        Game.log("Director inizializzato");

    },

    begin(action) {

        Game.director.enabled = true;

        Game.director.action = action;

        Game.director.step = 1;

        Game.director.selectedPlayer = null;

        UI.setStatus("ðŸŽ¯ Seleziona una pedina");

        Game.log("Director: modalitÃ  attiva");

    },

    cancel() {

        Game.director.enabled = false;

        Game.director.action = null;

        Game.director.step = 0;

        Game.director.selectedPlayer = null;

        // Togli anche la selezione del gioco normale
        Game.selectedPlayer = null;

        UI.setStatus("🟢 Applicazione pronta");

        Renderer.refresh();

        Game.log("Director: modalitÃ  terminata");

    },
    
    isActive() {

        return Game.director.enabled;

    },

    isWaitingPlayer() {

        return (
            Game.director.enabled &&
            Game.director.step === 1
        );

    },

    selectPlayer(player) {

        Game.director.selectedPlayer = player;

        Game.director.step = 2;

        UI.setStatus("ðŸŽ¯ Seleziona una casella");

        Renderer.refresh();

        Game.log(
            "Director: selezionata " +
            player.name
        );

    },

    moveSelectedPlayer(cell) {


        Game.director.selectedPlayer.cellId = cell.id;
        Game.log(
            `Director: ${Game.director.selectedPlayer.name} â†’ casella ${cell.id}`
        );

        Renderer.refresh();

        this.cancel();

    }
};

