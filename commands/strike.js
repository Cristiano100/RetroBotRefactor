const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');
const { isAdmin, getInvalidPermissionReply, isBot, getBotReply, userHasHigherRole } = require('../modules/authCheck.ts');
const { strikeUser } = require('../types/strike.ts');
const { buildSimpleEmbed } = require('../modules/embedHelper.ts');
const { embedColors } = require('../types/embedColors.ts');
const { interactionReply, dmUser, dmUserWithFootnote } = require('../modules/replyHelper.ts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("strike")
        .setDescription("Strike a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to strike")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("The reason for the strike")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        if (!await isAdmin(interaction.user)) {
            await interactionReply(interaction, await getInvalidPermissionReply(), embedColors.error);
            return;
        }

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        const moderatorId = interaction.user.id;

        if (await isBot(user)) {
            await interactionReply(interaction, await getBotReply(), embedColors.error);
            return;
        }

        if (await userHasHigherRole(user, interaction.user)) {
            await interactionReply(interaction, `You do not have permission to strike ${user} as they have a higher role than you.`, embedColors.error);
            return;
        }

        if (user == interaction.user && Bun.env.ENVIRONMENT != "dev") {
            await interactionReply(interaction, `You cannot strike yourself.`, embedColors.error);
            return;
        }

        strikeUser(user.id, moderatorId, reason).then(async (result) => {
            if (result) {
                await interactionReply(interaction, `Successfully striked ${user} for \`${reason}\``, embedColors.success);
                await dmUserWithFootnote(user, `You have been striked for \`${reason}\` by ${interaction.user}.\nYou can check your strikes using the \`/viewstrikes\` command.`, `If you believe this strike is unjustified, you may appeal at the support server: https://discord.gg/8pFpUeh5KP`)
            } else {
                await interactionReply(interaction, `Failed to strike ${user}`, embedColors.error);
            }
        }
        ).catch(async (error) => {
            await interactionReply(interaction, `Failed to strike ${user}. Error:\`${error}\``, embedColors.error);
        });
    }
}