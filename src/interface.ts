
import { SlashCommandBuilder, ChatInputCommandInteraction, Events, ClientEvents, Awaitable } from "discord.js";

export interface UserCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    cooldown: number,
    execute: (interaction: ChatInputCommandInteraction) => any;
}

export interface UserEventCallback<TEvent extends keyof ClientEvents> {
    name: TEvent,
    once: boolean,
    execute: (...args: ClientEvents[TEvent]) => Awaitable<any>,
}
