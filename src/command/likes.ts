
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserCommand } from '../interface';
import database from '../database';

const command: UserCommand = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('likes')
        .setDescription('Fetches the number of likes on your submissions to #creations'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const likes = await database.getTotalLikes(interaction.user.id);
            await interaction.reply({content: `<@${interaction.user.id}> has ${likes} ${likes === 1 ? 'like' : 'likes'} on their submissions`, ephemeral: true});
        } catch (error) {
            console.error('Error fetching likes:', error);
            await interaction.reply({content: 'There was an error fetching your likes. Please try again later.', ephemeral: true});
        }
    }
}

export default command;
