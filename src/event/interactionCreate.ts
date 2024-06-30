
import { Events, Collection, Interaction } from "discord.js";
import { commands, cooldowns } from "../commands";
import { UserEventCallback } from "../interface";

const event_callback: UserEventCallback<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        console.log("new chat input interaction: ", interaction.commandName);
    
        const command = commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return;
        }

        const now = Date.now();
        let timestamps = cooldowns.get(command.data.name);

        if (timestamps === undefined) {
            timestamps = new Collection<string, number>();
            cooldowns.set(command.data.name, timestamps)
        }

        const user_timestamp = timestamps.get(interaction.user.id);
        if (user_timestamp !== undefined) {
            const expiration_time = user_timestamp + command.cooldown;

            if (now < expiration_time) {
                return interaction.reply({ content: `please wait to use ${command.data.name}. use it again in ${Math.ceil((expiration_time - now) / 1000)} seconds.`, ephemeral: true });
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), command.cooldown);
    
        try {
            console.log('executing command');
            await command.execute(interaction);
        } catch (error) {
            console.log('error occured while executing command');
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error executing this command', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error executing this command', ephemeral: true });
            }
        }
    }
};

export default event_callback;
