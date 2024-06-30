
import { Events, Message } from "discord.js";
import { UserEventCallback } from "../interface";
import { channel_id } from "../constant";
import { onCreationsMessageCreate } from "../channel/creations";

const event_callback: UserEventCallback<Events.MessageCreate> = {
    name: Events.MessageCreate,
    once: false,
    execute(message: Message) {
        if (message.author.bot) {
            return;
        }

        if (message.channel.id === channel_id.creations) {
            console.log(`New message in creations (message_id: ${message.id}): ${message.author.username}: ${message.content}`)
            if (message.attachments.size > 0) {
                console.log(`Number of attachments: ${message.attachments.size}`)
            }
            onCreationsMessageCreate(message);
        }
    }
};

export default event_callback;
