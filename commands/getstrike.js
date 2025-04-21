const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');
const { getInvalidPermissionReply, isAdmin } = require('../modules/authCheck.ts');
const { getStrikeById } = require('../types/strike.ts');
const { timeStampToUnixSeconds, getDiscordFormattedTimeStamp } = require('../modules/timeHelper.ts');
const { embedColors } = require('../types/embedColors.ts');
const { interactionReply } = require('../modules/replyHelper.ts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getstrike")
        .setDescription("Get's a single strike by ID")
        .addStringOption(option =>
            option.setName("strike")
                .setDescription("The strike ID to view")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        if (!await isAdmin(interaction.user)) {
            await interactionReply(interaction, await getInvalidPermissionReply(), embedColors.error);
            return;
        }

        const strikeId = interaction.options.getString("strike");

        getStrikeById(strikeId).then(async (strike) => {
            if (strike) {
                let content = '';

                if (strike.appeal_date != null) {
                    content += `**:warning: Appealed**\n`;
                }

                content += `- Strike ID: \`${strike.strike_id}\`\n  - Applied To User: <@${strike.user_id}>\n  - Moderator: <@${strike.moderator_id}>\n  - Reason: \`${strike.strike_reason}\`\n  - Date: ${await getDiscordFormattedTimeStamp(await timeStampToUnixSeconds(strike.strike_date))}\n\n`;

                // add a link to a picture of a dog
                content += `\n\n[Click here for a picture of a dog](https://dog.ceo/dog-api/)`;

                await interactionReply(interaction, content, embedColors.default);
            } else {
                await interactionReply(interaction, `Strike \`${strikeId}\` not found.`, embedColors.error);
            }
        }
        ).catch(async (error) => {
            await interactionReply(interaction, `Failed to retrieve strike \`${strikeId}\`.\nError:\`${error}\``, embedColors.error);
        });
    }
}