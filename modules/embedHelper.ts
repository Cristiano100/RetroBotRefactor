import { EmbedBuilder } from "discord.js";
import { embedColors } from "../types/embedColors";

export async function buildSimpleEmbed(message: string, color: number = embedColors.default) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(message)

    return embed;
}

export async function buildSimpleEmbedWithFootnote(message: string, footnote: string, color: number = embedColors.default) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(message)
        .setFooter({ text: footnote });

    return embed;
}