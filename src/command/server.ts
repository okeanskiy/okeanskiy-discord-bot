
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserCommand } from "../interface";

const command: UserCommand = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('provides info about the server'),
    async execute(interaction: ChatInputCommandInteraction) {
        let name = interaction.guild ? interaction.guild.name : 'none';
        let member_count = interaction.guild ? interaction.guild.memberCount : 'none';
        
        await interaction.reply(`This server is ${name} and has ${member_count} members.`);
    }
};

export default command;
