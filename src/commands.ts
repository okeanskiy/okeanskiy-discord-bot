
import { Collection } from 'discord.js';
import { UserCommand } from './interface';

import ping_command from './command/ping';
import pong_command from './command/pong';
import server_command from './command/server';
import user_command from './command/user';
import likes_command from './command/likes';
import leaderboard_command from './command/leaderboard';

export const commands = new Collection<string, UserCommand>();
export const cooldowns = new Collection<string, Collection<string, number>>();

export function loadCommands() {
    commands.set(pong_command.data.name, pong_command);
    commands.set(ping_command.data.name, ping_command);
    commands.set(server_command.data.name, server_command);
    commands.set(user_command.data.name, user_command);
    commands.set(likes_command.data.name, likes_command);
    commands.set(leaderboard_command.data.name, leaderboard_command);
}
