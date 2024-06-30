
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserCommand } from '../interface';
import database from '../database';

const command: UserCommand = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Fetch the current likes leaderboard'),
    async execute(interaction: ChatInputCommandInteraction) {
        const leaderboard = await database.getLeaderboard();

        if (leaderboard === undefined) {
            await interaction.reply({content: 'Error fetching leaderboard', ephemeral: true});
            return;
        }

        let reply_string = 'Creation Submission Likes Leaderboard:\n';

        leaderboard.forEach((row, index) => {
            reply_string += `<@${row.user_id}>: ${row.total_likes} ${row.total_likes === 1 ? 'Like' : 'Likes'}`;
            if (index !== leaderboard.length - 1) {
                reply_string += '\n';
            }
        });

        await interaction.reply({content: reply_string, ephemeral: true});
    }
}

export default command;
