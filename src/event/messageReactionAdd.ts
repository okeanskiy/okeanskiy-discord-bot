
import { Events, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { UserEventCallback } from "../interface";
import { channel_id } from "../constant";
import { onCreationsMessageReactionAdd } from "../channel/creations";

const event_callback: UserEventCallback<Events.MessageReactionAdd> = {
    name: Events.MessageReactionAdd,
    once: false,
    execute(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        if (user.bot) {
            console.log('Ignoring reaction added by bot', user.displayName);
            return;
        }

        if (reaction.message.channel.id === channel_id.creations) {
            onCreationsMessageReactionAdd(reaction);
        }
    }
};

export default event_callback;
