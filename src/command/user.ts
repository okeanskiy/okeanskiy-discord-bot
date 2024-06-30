import { GuildMember, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserCommand } from "../interface";

const command: UserCommand = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('provides info about the user'),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!(interaction.member instanceof GuildMember)) {
            await interaction.reply('Unabled to retrieve member details');
            return;
        }

        await interaction.reply(`this command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    }
};

export default command;
