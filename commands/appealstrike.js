const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');
const { getInvalidPermissionReply, isSupervisor } = require('../modules/authCheck.ts');
const { appealStrike } = require('../types/strike.ts');
const { embedColors } = require('../types/embedColors.ts');
const { interactionReply } = require('../modules/replyHelper.ts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("appealstrike")
        .setDescription("Appeal a strike")
        .addStringOption(option =>
            option.setName("strike")
                .setDescription("The strike ID to appeal")
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        if (!await isSupervisor(interaction.user)) {
            await interactionReply(interaction, await getInvalidPermissionReply(), embedColors.error);
            return;
        }

        const strikeId = interaction.options.getString("strike");

        appealStrike(strikeId).then(async (result) => {
            if (result) {
                await interactionReply(interaction, `Successfully appealed strike \`${strikeId}\``, embedColors.success);
            } else {
                await interactionReply(interaction, `Failed to appeal strike \`${strikeId}\``, embedColors.error);
            }
        }
        ).catch(async (error) => {
            await interactionReply(interaction, `Failed to appeal strike \`${strikeId}\`.Error:\`${error}\``, embedColors.error);
        });
    }
}