
import { Client, GatewayIntentBits } from "discord.js";
import config from '../config.json';
import { connectEvents } from "./events";
import database from "./database";
import { loadCommands } from "./commands";

console.log(`\n\nInitiating bot...\n[${new Date().toUTCString()}]\n`);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ]
});

loadCommands();
connectEvents(client);

client.on('error', error => {
    console.error('Error encountered:', error);
});

client.login(config.token).catch(console.error);

database.testDatabase().catch((e) => {
    console.error(e);
});
