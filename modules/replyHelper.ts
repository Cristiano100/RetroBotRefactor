import { CommandInteraction, User } from "discord.js";
import { embedColors } from "../types/embedColors";
import { buildSimpleEmbed, buildSimpleEmbedWithFootnote } from "./embedHelper";

export async function interactionReply(interaction: CommandInteraction, message: string, color: number = embedColors.default, ephemeral: boolean = true) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [await buildSimpleEmbed(message, color)], ephemeral: ephemeral });
    } else {
        await interaction.reply({ embeds: [await buildSimpleEmbed(message, color)], ephemeral: ephemeral });
    }
}

export async function interactionReplyFootnote(interaction: CommandInteraction, message: string, footnote: string, color: number = embedColors.default, ephemeral: boolean = true) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [await buildSimpleEmbedWithFootnote(message, footnote, color)], ephemeral: ephemeral });
    } else {
        await interaction.reply({ embeds: [await buildSimpleEmbedWithFootnote(message, footnote, color)], ephemeral: ephemeral });
    }
}

export async function dmUser(user: User, message: string, color: number = embedColors.default) {
    user.send({ embeds: [await buildSimpleEmbed(message, color)] }).catch(async (error) => {
        console.log(`Failed to send DM to ${user}: ${error}`);
    });
}

export async function dmUserWithFootnote(user: User, message: string, footnote: string, color: number = embedColors.default) {
    user.send({ embeds: [await buildSimpleEmbedWithFootnote(message, footnote, color)] }).catch(async (error) => {
        console.log(`Failed to send DM to ${user}: ${error}`);
    });
}