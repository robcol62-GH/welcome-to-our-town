const Popup = {


    async launchSelector(diceId, cell, startElement) {

        if (Game.routePending) return;
        if (!cell || !startElement) return;

        const oldBall = document.querySelector(".selectorBall");
        if (oldBall) oldBall.remove();
        console.log("LAUNCH SELECTOR AVVIATO");
console.log("CELLA:", cell);
console.log("START ELEMENT:", startElement);

        const rect = startElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        const board = document.getElementById("board");
        if (!board) return;

        const boardRect = board.getBoundingClientRect();
        const endX = boardRect.left + boardRect.width / 2;
        const endY = boardRect.top + boardRect.height / 2;

        const ball = document.createElement("div");
        ball.className = "selectorBall";
        document.body.appendChild(ball);

        const finalFace = await Dice.animateBall(ball, diceId, cell);

        if (!finalFace) {
            ball.remove();
            return;
        }
        const destinazioniDisponibili = Game.cells.filter(
            c => c.id !== 0 && c.id !== cell.id
        );
        const destinazione = destinazioniDisponibili[
            Math.floor(Math.random() * destinazioniDisponibili.length)
        ];
        if (!destinazione) {
            ball.remove();
            return;
        }
        Game.destinationCell = destinazione;
        Game.routePending = true;

        Game.log(`Destinazione estratta: ${destinazione.id}`);

        // Sostituisce l'immagine del selettore con il marker Maps
        ball.innerHTML = "";
        ball.style.background = "transparent";
        ball.style.borderRadius = "0";
        ball.style.width = "120px";
        ball.style.height = "150px";        
        ball.style.border = "none";
        ball.style.boxShadow = "none";
        ball.style.outline = "none";

        const pinSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        pinSvg.setAttribute("width", "120");
        pinSvg.setAttribute("height", "150");
        pinSvg.setAttribute("viewBox", "-25 -35 50 70");
        pinSvg.style.background = "transparent";
        pinSvg.style.display = "block";
        pinSvg.style.backgroundColor = "transparent";
        pinSvg.style.border = "none";
        pinSvg.style.boxShadow = "none";        
        pinSvg.style.overflow = "visible";

        const pin = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        pin.setAttribute(
            "d",
            "M 0 30 C -5 22 -20 9 -20 -5 A 20 20 0 1 1 20 -5 C 20 9 5 22 0 30 Z"
        );
        pin.setAttribute("fill", "#ff1717");
        pin.setAttribute("stroke", "#ffffff");
        pin.setAttribute("stroke-width", "4");
        pin.setAttribute("stroke-linejoin", "round");

        pinSvg.appendChild(pin);

        const center = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        center.setAttribute("cx", "0");
        center.setAttribute("cy", "-5");
        center.setAttribute("r", "6");
        center.setAttribute("fill", "#ffffff");

        pinSvg.appendChild(center);
        ball.appendChild(pinSvg);

        const duration = 2800;
        const startTime = performance.now();

        const points = [
            { x: startX, y: startY },
            { x: globalThis.innerWidth * 0.34, y: globalThis.innerHeight * 0.55 },
            { x: globalThis.innerWidth * 0.50, y: globalThis.innerHeight * 0.72 },
            { x: globalThis.innerWidth * 0.67, y: globalThis.innerHeight * 0.43 },
            { x: globalThis.innerWidth * 0.80, y: globalThis.innerHeight * 0.57 },
            { x: endX, y: endY }
        ];

        const bounceHeights = [180, 110, 210, 95, 45];

        function animate(time) {
            const progress = Math.min((time - startTime) / duration, 1);

            /*
            if (progress >= 1) {
                ball.remove();
                Renderer.refresh();
                document.getElementById("evaluatorPanel")
                    ?.classList.remove("hidden");
                return;
            }
            */
           if (progress >= 1) {
                console.log("ANIMAZIONE TERMINATA");
                console.log("Destinazione:", Game.destinationCell);
                console.log("routePending:", Game.routePending);
                console.log("evaluatorPanel:", document.getElementById("evaluatorPanel"));

                ball.remove();

                Renderer.refresh();

                document.getElementById("evaluatorPanel")
                    ?.classList.remove("hidden");

                return;
            }
            const segments = points.length - 1;
            const scaledProgress = Math.max(
                0,
                Math.min(progress * segments, segments - 0.000001)
            );

            const segment = Math.floor(scaledProgress);
            const localProgress = scaledProgress - segment;

            const p1 = points[segment];
            const p2 = points[segment + 1];

            const x = p1.x + (p2.x - p1.x) * localProgress;
            const baseY = p1.y + (p2.y - p1.y) * localProgress;
            const bounce = Math.sin(localProgress * Math.PI) * bounceHeights[segment];
            const y = baseY - bounce;

            ball.style.left = `${x - 60}px`;
            ball.style.top = `${y - 60}px`;

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    },

    createOverlay() {

        // Evita di aprire piÃ¹ popup contemporaneamente
        if (document.getElementById("gamePopup")) {
            return null;
        }

        const overlay = document.createElement("div");

        overlay.id = "gamePopup";

        document.body.appendChild(overlay);

        return overlay;

    },
    
    showImage(imageName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const img = document.createElement("img");

        img.src = "images/card/" + imageName;

        img.alt = "Contenuto della casella";

        overlay.appendChild(img);

    },


    showVideo(videoName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const video = document.createElement("video");

        video.src = "video/" + videoName;

        video.controls = true;

        video.autoplay = true;

        overlay.appendChild(video);

    },


    showAudio(audioName) {

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const audio = document.createElement("audio");

        audio.src = "audio/" + audioName;

        audio.controls = true;

        audio.autoplay = true;

        overlay.appendChild(audio);

    },


    close() {

        const overlay =
            document.getElementById("gamePopup");

        if (overlay) {

            const media =
                overlay.querySelector("video, audio");

            if (media) {

                media.pause();

            }

            overlay.remove();

        }

    },

    showDice(diceId) {

        const dice = Dice.get(diceId);
        UI.setStatus("ðŸŽ² " + dice.name);

        const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        const window = document.createElement("div");

        window.id = "diceWindow";

        overlay.appendChild(window);

        const faceBox = document.createElement("div");

        faceBox.id = "diceFace";

        faceBox.textContent = "?";

        window.appendChild(faceBox);

        faceBox.addEventListener("click", async () => {
            await Dice.animate(faceBox, diceId);
        });

    },
    buildPopup(data, cell) {
    const overlay = this.createOverlay();

        if (!overlay) {
            return;
        }

        //==============================
        // Finestra principale
        //==============================

        const window = document.createElement("div");
        window.id = "cellWindow";

        //==============================
        // AREA CONTENUTO
        //==============================

        const contentArea = document.createElement("div");

        contentArea.className = "contentArea";

        window.appendChild(contentArea);

        //==============================
        // COLONNA SINISTRA
        //==============================

        const leftPanel = document.createElement("div");

        leftPanel.className = "leftPanel";

        contentArea.appendChild(leftPanel);

        //==============================
        // COLONNA DESTRA
        //==============================

        const rightPanel = document.createElement("div");

        rightPanel.className = "rightPanel";

        contentArea.appendChild(rightPanel);

        overlay.appendChild(window);

        //==============================
        // AREA CONTENUTO
        //==============================

        const mediaArea = document.createElement("div");

        mediaArea.className = "mediaArea";

        //window.appendChild(mediaArea);
        leftPanel.appendChild(mediaArea);

        //==============================
        // Immagine
        //==============================

        if (data.image) {

            const img = document.createElement("img");
            img.src = "images/card/" + data.image;
            img.alt = "";
            mediaArea.appendChild(img);

        }
        //==============================
        // CHIODO DELLA CARD
        //==============================

        if (data.image) {     

            const pin = document.createElement("div");

            pin.className = "cardPin";

            pin.title = "Chiudi";

            pin.addEventListener("click", (event) => {

                event.stopPropagation();

                const ball = document.querySelector(".selectorBall");

                if (ball) {
                    ball.remove();
                }

                Popup.close();

            });

            mediaArea.insertBefore(pin, mediaArea.firstChild);
        }

        //==============================
        // Audio
        //==============================

        if (data.audio) {

            const audio = document.createElement("audio");

            audio.src = "audio/" + data.audio;

            audio.controls = true;

            audio.autoplay = true;

            mediaArea.appendChild(audio);

        }

        //==============================
        // Video
        //==============================

        if (data.video) {

            const video = document.createElement("video");

            video.src = "video/" + data.video;

            video.controls = true;

            video.autoplay = true;

            mediaArea.appendChild(video);

        }

        //==============================
        // AREA TESTO
        //==============================
        
        if (data.txt && data.txt.trim() !== "") {

            const textArea = document.createElement("div");

            textArea.className = "textArea";

            textArea.textContent = data.txt;

            //window.appendChild(textArea);
            rightPanel.appendChild(textArea);

        }

        //==============================
        // AREA SELETTORE
        //==============================
        /*
        if (data.selector) {

            const selectorArea = document.createElement("div");

            selectorArea.className = "selectorArea";
            
            console.log("SELECTOR =", data.selector);
            selectorArea.appendChild(this.createDice(data.selector, cell));

            //window.appendChild(selectorArea);
            rightPanel.appendChild(selectorArea);

        }
        */
    },

    createDice(diceId, cell) {

        const dice = Dice.get(diceId);

        UI.setStatus("ðŸŽ² " + dice.name);

        const window = document.createElement("div");

        window.id = "diceWindow";

        const faceBox = document.createElement("div");

        faceBox.id = "diceFace";

        faceBox.textContent = "?";

        window.appendChild(faceBox);

        faceBox.addEventListener("click", async () => {

            await Dice.animate(faceBox, diceId, cell);

        });

        return window;

    },

    showCell(cell) {

        if (!cell) return;

        const hasContent =
            cell.txt?.trim() ||
            cell.image ||
            cell.audio ||
            cell.video;

        if (!hasContent) {
            return;
        }
        this.buildPopup(cell);
    },

    showEvent(event, cell, players) {

        this.buildPopup(event, cell);            
    },
    openSelector(parent, diceId, cell){

        const selector = this.createDice(diceId, cell);

        selector.style.position = "absolute";

        selector.style.top = "55px";

        selector.style.right = "-20px";

        parent.appendChild(selector);

    }

};

