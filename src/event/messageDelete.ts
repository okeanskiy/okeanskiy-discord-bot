
import { Events, Message, PartialMessage } from "discord.js";
import { UserEventCallback } from "../interface";
import { channel_id } from "../constant";
import { onCreationsMessageDelete } from "../channel/creations";

const event_callback: UserEventCallback<Events.MessageDelete> = {
    name: Events.MessageDelete,
    once: false,
    execute(message: Message | PartialMessage) {
        if (message.channel.id === channel_id.creations) {
            console.log(`Deleted message in #creations (message_id: ${message.id}): ${message.author ? message.author.username : 'Unknown user'}: ${message.content}`)
            onCreationsMessageDelete(message);
        }
    }
};

export default event_callback;
