
import { UserEventCallback } from './interface';
import { Client, ClientEvents, Collection } from 'discord.js';

import ready_event_callback from './event/ready';
import interaction_create_event_callback from './event/interactionCreate';
import message_create_event_callback from './event/messageCreate';
import message_delete_event_callback from './event/messageDelete';
import message_reaction_add_event_callback from './event/messageReactionAdd';

const events: Collection<keyof ClientEvents, UserEventCallback<any>> = new Collection();

events.set(ready_event_callback.name, ready_event_callback);
events.set(interaction_create_event_callback.name, interaction_create_event_callback);
events.set(message_create_event_callback.name, message_create_event_callback);
events.set(message_delete_event_callback.name, message_delete_event_callback);
events.set(message_reaction_add_event_callback.name, message_reaction_add_event_callback)

export function connectEvents(client: Client) {
    events.forEach((event_callback, event_name) => {
        if (event_callback.once) {
            client.once(event_name, (...args) => event_callback.execute(...args));
        } else {
            client.on(event_name, (...args) => event_callback.execute(...args));
        }
    })
}
