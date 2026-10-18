const Laghetto = {

    firstShow: true,

    init() {
        const body = document.getElementById("laghettoBody");

        body.addEventListener("click", (event) => {

            // Se ho cliccato una pedina, lascia gestire il click alla pedina
            if (event.target.closest(".laghettoPawn")) {
                return;
            }

            // Nessuna pedina selezionata
            if (!Game.selectedPlayer) {
                return;
            }

            console.log(
                "Pedina",
                Game.selectedPlayer.id,
                "ritornata nel Laghetto"
            );

            Game.selectedPlayer.cellId = 0;
            Game.selectedPlayer = null;

            Renderer.refresh();
            Laghetto.refresh();

        });    
        Game.log("Laghetto inizializzato");
    },

    show() {
        

        const panel = document.getElementById("laghettoPanel");
        panel.style.display = "block";
        document.getElementById("laghettoPanel").style.display="block";
        this.refresh();
    },

    hide() {

        const panel = document.getElementById("laghettoPanel");
        panel.style.display = "none";

    },

    refresh() {

        return;
            
        const body = document.getElementById("laghettoBody");
        body.innerHTML = "";
    
        let count = 0;
    
        Game.players.forEach((player, index) => {
            if (player.cellId !== 0) {
                return;
            }
            count++;
            const pawn = document.createElement("div");
            pawn.className = "laghettoPawn";
            if (
                Game.selectedPlayer &&
                Game.selectedPlayer.id === player.id
            ) {
                pawn.classList.add("selected");
            }
            if (this.firstShow) {

                pawn.style.opacity = "0";

                setTimeout(() => {

                    requestAnimationFrame(() => {

                        pawn.style.opacity = "1";

                    });

                }, index * 120);

            } else {

                pawn.style.opacity = "1";

            }
                pawn.style.backgroundColor = player.color;
                pawn.dataset.playerId = player.id;

                const number = document.createElement("div");
                number.className = "laghettoNumber";
                number.textContent = player.id;

                pawn.appendChild(number);
                body.appendChild(pawn);            
    
                pawn.addEventListener("click", (event) => {

                event.stopPropagation();

                Game.selectedPlayer = player;

                Renderer.refresh();
                Laghetto.refresh();

            });
        });
        this.firstShow = false;

        // Se il Laghetto Ã¨ vuoto lo nasconde
        if (count === 0) {
            this.hide();
        }
    }
};


