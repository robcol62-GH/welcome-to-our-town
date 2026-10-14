const Popup = {

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

            if (data.selector) {

                const selectorButton = document.createElement("div");

                selectorButton.className = "selectorButton";

                const icon = document.createElement("img");
                icon.src = "images/selector.png";
                icon.alt = "Selector";
                selectorButton.appendChild(icon);

                selectorButton.onclick = async () => {

                    const oldBall = document.querySelector(".selectorBall");
                    if (oldBall) {
                        oldBall.remove();
                    }

                    const rect = selectorButton.getBoundingClientRect();
                    //========================================
                    // PARTENZA
                    //========================================
                    const startX = rect.left + rect.width / 2;
                    const startY = rect.top + rect.height / 2;

                    //========================================
                    // ARRIVO: CENTRO DEL TABELLONE
                    //========================================

                    const board = document.getElementById("board");

                    const boardRect = board.getBoundingClientRect();

                    const endX =
                        boardRect.left + boardRect.width / 2;

                    const endY =
                        boardRect.top + boardRect.height / 2;

                    //========================================
                    // PALLINA
                    //========================================

                    const ball = document.createElement("div");
                    ball.className = "selectorBall";
                    document.body.appendChild(ball);

                    const resultPromise =
                        Dice.animateBall(ball, data.selector, cell);                    
                        resultPromise.then(finalFace => {
                        });                        

                    //========================================
                    // TRAIETTORIA E RIMBALZI
                    //========================================

                    const duration = 1900;
                    const startTime = performance.now();

                    //========================================
                    // PUNTI DI ATTERRAGGIO
                    //========================================

                    const points = [

                        // PARTENZA
                        {
                            x: startX,
                            y: startY
                        },

                        // 1Â° atterraggio
                        {
                            x: globalThis.innerWidth * 0.34,
                            y: globalThis.innerHeight * 0.55
                        },

                        // 2Â° atterraggio
                        {
                            x: globalThis.innerWidth * 0.50,
                            y: globalThis.innerHeight * 0.72
                        },

                        // 3Â° atterraggio
                        {
                            x: globalThis.innerWidth * 0.67,
                            y: globalThis.innerHeight * 0.43
                        },

                        // 4Â° atterraggio
                        {
                            x: globalThis.innerWidth * 0.80,
                            y: globalThis.innerHeight * 0.57
                        },

                        // ARRIVO
                        {
                            x: endX,
                            y: endY
                        }

                    ];

                    // Altezza dei singoli rimbalzi
                    const bounceHeights = [
                        180,
                        110,
                        210,
                        95,
                        45
                    ];

                    function animate(time) {

                        const progress =
                            Math.min(
                                (time - startTime) / duration,
                                1
                            );

                        //========================================
                        // FINE
                        //========================================

                        if (progress >= 1) {

                            ball.style.left =
                                `${endX - 60}px`;

                            ball.style.top =
                                `${endY - 60}px`;

                            //ball.classList.add("selectorBallFinal");

                            return;
                        }

                        //========================================
                        // DETERMINA IL RIMBALZO ATTUALE
                        //========================================

                        const segments = points.length - 1;

                        let scaledProgress =
                            progress * segments;

                        // Protezione contro eventuali valori
                        // leggermente superiori al limite
                        scaledProgress =
                            Math.max(
                                0,
                                Math.min(scaledProgress, segments - 0.000001)
                            );

                        const segment =
                            Math.floor(scaledProgress);

                        const localProgress =
                            scaledProgress - segment;

                        const p1 = points[segment];
                        const p2 = points[segment + 1];
                        
                        //========================================
                        // MOVIMENTO ORIZZONTALE
                        //========================================

                        const x =
                            p1.x +
                            (p2.x - p1.x) *
                            localProgress;

                        //========================================
                        // MOVIMENTO VERTICALE
                        //========================================

                        const baseY =
                            p1.y +
                            (p2.y - p1.y) *
                            localProgress;

                        //========================================
                        // RIMBALZO
                        //========================================

                        const bounce =
                            Math.sin(localProgress * Math.PI) *
                            bounceHeights[segment];

                        const y =
                            baseY - bounce;

                        //========================================
                        // POSIZIONE PALLINA
                        //========================================

                        ball.style.left =
                            `${x - 60}px`;

                        ball.style.top =
                            `${y - 60}px`;

                        requestAnimationFrame(animate);
                    }


                    requestAnimationFrame(animate);                
                };
                mediaArea.appendChild(selectorButton);
            }            
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

        //console.log("CELL =", cell);
        //console.log("TXT =", cell.txt);
        
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

        if (!cell || cell.id == 0) return;

        const hasContent =
            cell.txt?.trim() ||
            cell.image ||
            cell.audio ||
            cell.video ||
            cell.selector;

        if (!hasContent) {
            return;
        }

        this.buildPopup(cell);

    },

    showEvent(event, cell, players) {

       console.log(event);
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

