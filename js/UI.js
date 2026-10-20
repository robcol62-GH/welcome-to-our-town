/*********************************************************************

    London Click
    File: UI.js

*********************************************************************/

const UI = {

    init() {

        messageTimer=null,
        lastStatus= "",

        this.status = document.getElementById("statusMessage");
        this.btnMenu = document.getElementById("btnMenu");
        this.menuPanel = document.getElementById("menuPanel");
        this.btnFullscreen = document.getElementById("btnFullscreen");
        this.btnTimer = document.getElementById("btnTimer");
        this.btnDice = document.getElementById("btnDice");
        this.btnConfig = document.getElementById("btnConfig");
        this.btnNumbers = document.getElementById("btnNumbers");
        this.btnExport = document.getElementById("btnExport");        
        this.dicePanel = document.getElementById("dicePanel");
        this.diceResult = document.getElementById("diceResult");
        this.btnDiceClose = document.getElementById("btnDiceClose");        
        this.btnDiceClose2 = document.getElementById("btnDiceClose2");
        this.btnDiceRoll = document.getElementById("btnDiceRoll");
        this.diceCube = document.getElementById("diceCube");

        this.timerPanel = document.getElementById("timerPanel");
        this.timerDisplay = document.getElementById("timerDisplay");
        this.timerMinutes = document.getElementById("timerMinutes");
        this.timerSeconds = document.getElementById("timerSeconds");
        this.btnTimerStart = document.getElementById("btnTimerStart");
        this.btnTimerReset = document.getElementById("btnTimerReset");
        this.btnTimerPause = document.getElementById("btnTimerPause");
        this.btnTimerResume = document.getElementById("btnTimerResume");
        this.btnTimerClose = document.getElementById("btnTimerClose");
        this.timerSound = document.getElementById("timerSound");
        this.timerInterval = null;
        this.timerRemaining = 0;
        this.timerInitial = 0;
        
        //==============================
        // VISIBILITÀ MENU
        //==============================

        if (!Config.MENU.TIMER ) {
            this.btnTimer.style.display = "none";
        }
        if (!Config.MENU.FULLVIDEO ) {
            this.btnFullscreen.style.display = "none";
        }
        if (!Config.MENU.DADO ) {
            this.btnDice.style.display = "none";
        }
        if (!Config.MENU.CONF_CASELLE ) {
            this.btnConfig.style.display = "none";
        }

        if (!Config.MENU.VEDI_NUMERI) {
            this.btnNumbers.style.display = "none";
        }
        if (!Config.MENU.EXP_JSON ) {
            this.btnExport.style.display = "none";
        }

        this.events();
        Game.log("UI inizializzata");
    },

    events() {

        this.btnMenu.addEventListener(

            "click",

            () => this.toggleMenu()

        );

        this.btnFullscreen.addEventListener(

            "click",

            () => this.fullscreen()

        );

        this.btnTimer.addEventListener(

            "click",

            () => this.showTimer()

        );        
        this.btnDice.addEventListener("click", () => {
            this.showDice();
        });        
        this.btnDiceClose2.addEventListener("click", () => {
             this.dicePanel.classList.add("hidden");
        });
        this.btnDiceRoll.addEventListener("click", () => {
            const risultato = Math.floor(Math.random() * 6) + 1;
            const orientamenti = {
                1: [90, 0],
                2: [0, 180],
                3: [0, 90],
                4: [-90, 0],
                5: [0, 0],
                6: [0, -90]
            };
            const [x, y] = orientamenti[risultato];
            this.diceCube.style.setProperty("--finalX", `${x}deg`);
            this.diceCube.style.setProperty("--finalY", `${y}deg`);
            this.diceCube.classList.remove("rolling");
            void this.diceCube.offsetWidth;
            this.diceCube.classList.add("rolling");
        });
        this.btnTimerStart.addEventListener(

            "click",

            () => this.startTimer()

        );

        this.btnTimerReset.addEventListener(

            "click",

            () => this.resetTimer()

        );
        this.btnTimerPause.addEventListener(

            "click",

            () => this.pauseTimer()

        );
        this.btnTimerResume.addEventListener(

            "click",

            () => this.resumeTimer()

        );        
        this.btnTimerClose.addEventListener(

            "click",

            () => this.closeTimer()

        );        
        // =========================================
        // WELCOME TO OUR TOWN - VALUTATORE
        // =========================================

        const btnGreen = document.getElementById("btnEvaluateGreen");
        const btnYellow = document.getElementById("btnEvaluateYellow");
        const btnRed = document.getElementById("btnEvaluateRed");

        const confermaDestinazione = () => {

            if (!Game.routePending || !Game.destinationCell) {
                return;
            }

            // Unica pedina: il Turista
            const turista = Game.players[0];

            if (!turista) {
                return;
            }

            // Sposta il Turista sulla destinazione
            turista.cellId = Game.destinationCell.id;

            // Elimina il segnalino di destinazione
            Game.destinationCell = null;
            Game.routePending = false;

            // Nasconde il Valutatore
            document.getElementById("evaluatorPanel")
                ?.classList.add("hidden");

            // Aggiorna la scacchiera
            Renderer.refresh();

            Game.log(`Turista arrivato alla casella ${turista.cellId}`);
        };


        btnGreen?.addEventListener("click", confermaDestinazione);
        btnYellow?.addEventListener("click", confermaDestinazione);


        btnRed?.addEventListener("click", () => {
            if (!Game.routePending) {
                return;
            }

            // Elimina il segnalino senza spostare il Turista
            Game.destinationCell = null;
            Game.routePending = false;

            // Nasconde il Valutatore
            document.getElementById("evaluatorPanel")
                ?.classList.add("hidden");

            // Aggiorna la scacchiera
            Renderer.refresh();

            Game.log("Valutazione ROSSA: il Turista resta nella casella attuale");

            // Mostra il messaggio di errore
            mostraMessaggioRosso();
        });

        function mostraMessaggioRosso() {
            const overlay = document.createElement("div");
            overlay.id = "sorryOverlay";

            Object.assign(overlay.style, {
                position: "fixed",
                inset: "0",
                zIndex: "100000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0, 0, 0, 0.65)",
                cursor: "pointer"
            });

            const img = document.createElement("img");
            img.src = "images/Sorry.png";
            img.alt = "Sorry, you got lost! Try again!";

            Object.assign(img.style, {
                display: "block",
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain"
            });

            overlay.appendChild(img);

            // Clic sull'immagine o sullo sfondo per chiudere
            overlay.addEventListener("click", () => {
                overlay.remove();
            });

            document.body.appendChild(overlay);
        }

        document.addEventListener(

            "keydown",

            (event) => {

                switch (event.key) {

                    case "F10":

                        event.preventDefault();
                        this.toggleMenu();
                        break;

                    case " ":

                        if (!Game.selectedPlayer)
                            return;

                        // Nel laghetto lo SPACE non ha effetto
                        if (Game.selectedPlayer.cellId === 0)
                            return;

                        event.preventDefault();

                        if (Game.selectedPlayer.stopTurns) {

                            // Sblocco la pedina
                            Game.selectedPlayer.stopTurns = 0;
                            Game.selectedPlayer = null;

                        } else {

                            // Blocco la pedina
                            Game.selectedPlayer.stopTurns = 1;
                        }

                        Renderer.refresh();
                        break;
                }

            }

        );
    },

    toggleMenu() {

        this.menuPanel.classList.toggle("hidden");

    },
    showDice() {
        this.dicePanel.classList.remove("hidden");
    },

    showTimer() {
        this.timerPanel.classList.remove("hidden");
        this.menuPanel.classList.add("hidden");
        this.updateTimerButtons();
    },
    closeTimer() {

        this.timerPanel.classList.add("hidden");

    },    
    startTimer() {

        if (this.timerInterval)
            return;

        const minutes =
            parseInt(this.timerMinutes.value) || 0;

        const seconds =
            parseInt(this.timerSeconds.value) || 0;

        this.timerRemaining =
            minutes * 60 + seconds;

        if (this.timerRemaining <= 0)
            return;
        this.timerInitial = this.timerRemaining;
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {

            this.timerRemaining--;

            if (this.timerRemaining <= 0) {

                this.timerRemaining = 0;

                clearInterval(this.timerInterval);

                this.timerInterval = null;

                this.updateTimerDisplay();

                this.timerFinished();

                return;

            }

            this.updateTimerDisplay();

        }, 1000);
        this.updateTimerButtons();
    },

    pauseTimer() {

        if (!this.timerInterval)
            return;

        clearInterval(this.timerInterval);

        this.timerInterval = null;

        this.updateTimerButtons();

    },

    resumeTimer() {

        if (this.timerInterval)
            return;

        if (this.timerRemaining <= 0)
            return;

        this.timerInterval = setInterval(() => {

            this.timerRemaining--;

            if (this.timerRemaining <= 0) {

                this.timerRemaining = 0;

                clearInterval(this.timerInterval);

                this.timerInterval = null;

                this.updateTimerDisplay();

                this.timerFinished();

                return;

            }

            this.updateTimerDisplay();

        }, 1000);
        this.updateTimerButtons();

    },    
    updateTimerButtons() {

        const running = this.timerInterval !== null;
        const paused =
            !running &&
            this.timerRemaining > 0 &&
            this.timerRemaining < this.timerInitial;

        this.btnTimerStart.disabled =
            running || paused;

        this.btnTimerPause.disabled =
            !running;

        this.btnTimerResume.disabled =
            running || !paused;

    },    
    
    timerFinished() {

        this.timerSound.currentTime = 0;
        this.timerSound.play();

        this.timerDisplay.classList.remove("timer-warning");

        this.timerPanel.classList.add("timer-finished");

    },

    updateTimerDisplay() {

        const minutes =
            Math.floor(this.timerRemaining / 60);

        const seconds =
            this.timerRemaining % 60;

        this.timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");
            console.log("TIMER:", this.timerRemaining, "SOGLIA:", Config.TIMER_COUNTDOWN_START);

        // Ultimi Config.TIMER_COUNTDOWN_START secondi
        if (this.timerRemaining <= Config.TIMER_COUNTDOWN_START && this.timerRemaining > 0) {

            this.timerDisplay.classList.add("timer-warning");

        }
        else {

            this.timerDisplay.classList.remove("timer-warning");

        }

    },
    resetTimer() {
        this.timerPanel.classList.remove("timer-finished");
        this.timerDisplay.classList.remove("timer-warning");

        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timerRemaining =
            (parseInt(this.timerMinutes.value) || 0) * 60 +
            (parseInt(this.timerSeconds.value) || 0);
        this.updateTimerDisplay();
        this.updateTimerButtons();
    },    
    
    fullscreen() {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        }
        else {

            document.exitFullscreen();

        }

    },
    
    setStatus(message) {

        this.lastStatus = message;
        this.status.textContent = message;

    },
    message(message, duration = 2000) {

        clearTimeout(this.messageTimer);

        const previousStatus = this.lastStatus;

        this.status.textContent = message;

        this.messageTimer = setTimeout(() => {

            this.setStatus(previousStatus);

        }, duration);

    },    
};

