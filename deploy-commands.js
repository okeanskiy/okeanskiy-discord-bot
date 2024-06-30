
const { REST, Routes } = require('discord.js');
const { client_id, server_id, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const folder_path = path.join(__dirname, 'out/command');
const command_files = fs.readdirSync(folder_path).filter(file => file.endsWith('.js'));
console.log(command_files)

for (const file of command_files) {
    const file_path = path.join(folder_path, file);
    const command = require(file_path).default;
    if ('data' in command && 'execute' in command) {
        console.log(`loading command ${command.data.name}`)
        commands.push(command.data.toJSON());
    } else {
        console.log(`[warning] the command at ${file_path} is missing a required 'data' or 'execute' property`);
    }
}

const rest = new REST().setToken(token);

// deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} applictation slash commands`);

        // use put method to refresh all commands in guild with current set
        const data = await rest.put(
            Routes.applicationGuildCommands(client_id, server_id),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application slash commands`);
    } catch (error) {
        console.error(error);
    }
})();
