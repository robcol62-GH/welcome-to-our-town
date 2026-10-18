class Events {

    static events = [];

    static async load() {

        const response = await fetch("data/events.json?v=30131620260925");

        this.events = await response.json();

    }

    static get(id) {

        return this.events.find(
            event => event.id === id
        );

    }

}

