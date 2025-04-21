const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');
const { isAdmin } = require('../modules/authCheck.ts');
const { getStrikesByUserId } = require('../types/strike.ts');
const { timeStampToUnixSeconds, getDiscordFormattedTimeStamp } = require('../modules/timeHelper.ts');
const { buildSimpleEmbed } = require('../modules/embedHelper.ts');
const { embedColors } = require('../types/embedColors.ts');
const { interactionReply, interactionReplyFootnote } = require('../modules/replyHelper.ts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("viewstrikes")
        .setDescription("View all the strikes of a user. You can only view your own strikes unless you are an admin.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to view strikes for")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const user = interaction.options.getUser("user");
        let userIsAdmin = await isAdmin(interaction.user)

        if (!userIsAdmin && user != interaction.user) {
            await interactionReply(interaction, "You may only view strikes for yourself.\nYou lack the correct permissions to view the strikes of others.", embedColors.error);
            return;
        }

        getStrikesByUserId(user.id).then(async (strikes) => {
            if (strikes.length > 0) {

                let content = '';

                if (interaction.user == user) {
                    content += `**You are viewing your own strikes.**\n\n`;
                } else {
                    content += `You are viewing the strikes of ${user}.\n\n`;
                }
                for (strike of strikes) {

                    if (strike.appeal_date != null) {
                        content += `**:warning: Appealed**\n`;
                    }

                    content += `- Strike ID: \`${strike.strike_id}\`\n  - Moderator: <@${strike.moderator_id}>\n  - Reason: \`${strike.strike_reason}\`\n  - Date: ${await getDiscordFormattedTimeStamp(await timeStampToUnixSeconds(strike.strike_date))}\n\n`;

                }

                if (interaction.user == user) {
                    await interactionReplyFootnote(interaction, content, `If you believe any of these strikes are unjustified, you may appeal them at the support server: https://discord.gg/8pFpUeh5KP`, embedColors.default);
                } else {
                    await interactionReply(interaction, content, embedColors.default)
                }


            } else {
                await interactionReply(interaction, `${user} has no strikes.`, embedColors.success);
            }
        }).catch(async (error) => {
            console.warn(error);
            await interactionReply(interaction, `Failed to retrieve strikes for ${user}. Error: \`${error}\``, embedColors.error);
        }
        );
    }
}