import { Message } from "discord.js";
import { shouldRunIntervalCheck, updateLastIntervalCheck } from "../types/userInfo";
import { intervalCheck } from "./intervalCheck";

export async function messageHandler(message: Message) {
    // Check if the message is from a bot
    if (message.author.bot) return;

    // Ensure message is in a guild
    if (!message.guild) {
        return;
    }

    // Check if the message is outside of main server
    if (!Bun.env.DISCORD_MAIN_GUILD_ID) {
        throw new Error("DISCORD_MAIN_GUILD_ID is not defined in the environment variables.");
    }
    if (message.guild.id !== Bun.env.DISCORD_MAIN_GUILD_ID) {
        return;
    }

    // Check if user can have interval check ran
    if (await shouldRunIntervalCheck(message.author.id)) {
        // Run interval check
        intervalCheck(message.author, message);
        updateLastIntervalCheck(message.author.id);
    };
}
