
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserCommand } from '../interface';

const command: UserCommand = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('Replies with pong'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({content: `Pong`, ephemeral: true});
    }
}

export default command;
