import { env } from "bun";
import chalk from "chalk";
import { MessageFlags } from "discord.js";
import { initCommandHandler, registerSlashCommands } from "./modules/commandHandler";
const { Client, Events, GatewayIntentBits } = require("discord.js");
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

console.log(chalk.green.bold("Bot starting..."));

client.once(Events.ClientReady, () => {
    console.log(chalk.green.bold("Bot is ready!\n"));
    initCommandHandler();
    registerSlashCommands();
});

client.login(env.DISCORD_TOKEN).then(() => {
    console.log(chalk.green.bold("Logged in successfully!"));
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});