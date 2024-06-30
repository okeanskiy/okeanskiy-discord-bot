
import { Client, DiscordAPIError, Message, MessageReaction, PartialMessage, PartialMessageReaction, TextChannel } from "discord.js";
import database from "../database";
import { channel_id, emoji } from "../constant";

export async function onCreationsMessageReactionAdd(reaction: MessageReaction | PartialMessageReaction) {
    if (reaction.emoji.name === emoji.thumbs_up) {
        try {
            if (reaction.count === null) {
                reaction = await reaction.fetch();
            }
            const new_likes = reaction.count - 1;
            await database.updateSubmissionLikes(reaction.message.id, new_likes);
            console.log(`Updated submission likes, message_id: ${reaction.message.id}, new_likes: ${new_likes}`)
        } catch (error) {
            console.error(`Failed to fetch partial message reaction ${reaction.message.id}: ${error}`);
        }
    }
}

async function handleNewSubmission(message: Message) {
    try {
        await database.newSubmission(message.id, message.author.id);
        console.log("Submission saved successfully");

        await message.react(emoji.thumbs_up);
        console.log(`Reacted to new message from ${message.author.username}`);
    } catch (error) {
        console.error("Failed to process submission or react:", error);
    }
}

const media_websites = [
    'gyazo.com', // Gyazo
    'twitter.com', 'x.com', 'fxtwitter.com', // Twitter
    'devforum.roblox.com' // Roblox Devforum
]

function stringHasMediaLink(content: string): boolean {
    for (const website of media_websites) {
        const regex  = new RegExp(website.replace('.', '\\.'), 'i');
        if (regex.test(content)) {
            return true;
        }
    }
    return false;
}

export async function onCreationsMessageCreate(message: Message) {
    console.log(`New message in #creations by ${message.author.displayName}: ${message.content}`)

    // TODO: handle gyazo and twitter links as well
    if (message.attachments.size > 0) {
        handleNewSubmission(message);
    } else if (stringHasMediaLink(message.content)) {
        handleNewSubmission(message);
    }
}

export async function onCreationsMessageDelete(message: Message | PartialMessage) {
    try {
        console.log("Handling crations message deleted")
        await database.removeSubmission(message.id);
    } catch (error) {
        console.error('Error on #creations message delete:', error)
    }
}

function isDiscordAPIError(error: unknown): error is DiscordAPIError {
    return (error as DiscordAPIError).code !== undefined;
}

async function checkIfMessageExists(client: Client, channelId: string, messageId: string): Promise<boolean> {
    try {
        const channel = await client.channels.fetch(channelId) as TextChannel;
        const message = await channel.messages.fetch(messageId);
        return !!message;
    } catch (error) {
        if (isDiscordAPIError(error) && error.code === 10008) { // Unknown Message error code
            return false;
        } else {
            console.error('Error fetching message:', error);
            throw error;
        }
    }
}

export async function onCreationsReady(client: Client) {
    const user_ids = await database.getUserIds(100);
    if (user_ids === undefined) {
        console.error("Error fetching userIds in onCreationsReady");
        return;
    }

    user_ids.forEach(async (user_id) => {
        const message_ids = await database.getUserSubmissionMessageIds(user_id, 10);
        if (message_ids === undefined) {
            console.error(`Error fetching message_ids for user_id: ${user_id}`);
            return;
        }

        message_ids.forEach(async (message_id) => {
            try {
                const message_exists = await checkIfMessageExists(client, channel_id.creations, message_id);
                if (!(message_exists)) {
                    console.log(`Message_id ${message_id} by user_id ${user_id} does not exist, attempting to remove submission associated.`);
                    await database.removeSubmission(message_id);
                    console.log('Submission removed.');
                }
            } catch (error) {
                console.error(`Unable to confirm existence of message_id ${message_id} in #creations`);
            }
        })
    })
}
