/*********************************************************************

    London Click
    File: storage.js

*********************************************************************/

const Storage = {

    saveCells() {

        const json = JSON.stringify(Game.cells, null, 4);

        const blob = new Blob([json], {

            type: "application/json"

        });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "caselle.json";

        link.click();

        URL.revokeObjectURL(link.href);

    },

    async loadCells() {

        try {

            const response = await fetch("data/caselle.json?v=30131620260925", {
                cache: "no-store"
            });

            if (!response.ok) {

                throw new Error("Impossibile leggere caselle.json");

            }

            const data = await response.json();

            Game.cells = data.cells;

            Game.log("Caselle caricate");

        }
        catch (error) {

            console.error(error);

        }

    }

};

