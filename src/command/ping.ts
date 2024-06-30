
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserCommand } from '../interface';

const command: UserCommand = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with ping'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({content: 'Ping', ephemeral: true});
    }
}

export default command;
