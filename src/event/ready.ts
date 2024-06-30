
import { Client, Events } from "discord.js";
import { UserEventCallback } from "../interface";
import { onCreationsReady } from "../channel/creations";

const event_callback: UserEventCallback<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        if (client.user === null) {
            console.log(`Ready, logged in at [${new Date().toUTCString()}]`);
            return;
        }

        console.log(`Ready, logged in as ${client.user.tag} at [${new Date().toUTCString()}]`);

        onCreationsReady(client);
    }
};

export default event_callback;
