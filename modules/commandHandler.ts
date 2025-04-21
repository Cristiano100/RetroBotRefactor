import chalk from "chalk";
import { Collection, REST, Routes } from "discord.js";
import { client } from "../main";
const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');

export function initCommandHandler() {
    client.commands = new Collection();
    client.commandsJSON = []
    const foldersPath = path.join(__dirname, "../commands");
    const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            client.commandsJSON.push(command.data.toJSON());
            console.log(chalk.blue.bold(`Loaded command: ${command.data.name}`));

        }
        else {
            console.log(chalk.red.bold(`The command at ${filePath} is missing a required "data" or "execute" property.`));
        }
    }

    console.log(chalk.blue.bold(`\nLoaded ${client.commands.size} commands.`));
}



export function registerSlashCommands() {
    if (!Bun.env.DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN is not defined in the environment variables.");
    }

    const rest = new REST().setToken(Bun.env.DISCORD_TOKEN);

    (async () => {
        try {
            console.log(chalk.blue.bold("Started refreshing application (/) commands."));

            if (!Bun.env.DISCORD_CLIENT_ID) {
                throw new Error("DISCORD_CLIENT_ID is not defined in the environment variables.");
            }

            const data = await rest.put(
                Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID),
                { body: client.commandsJSON },
            ) as { length: number };

            console.log(chalk.blue.bold(`Successfully reloaded ${data.length} application (/) commands.`));
        } catch (error) {
            console.error(chalk.red.bold(`Error registering commands: ${error}`));
        }
    })();
}

export async function removeAllGuildCommands(guildId: string) {
    if (!Bun.env.DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN is not defined in the environment variables.");
    }

    if (!Bun.env.DISCORD_CLIENT_ID) {
        throw new Error("DISCORD_CLIENT_ID is not defined in the environment variables.");
    }

    const rest = new REST().setToken(Bun.env.DISCORD_TOKEN);

    try {
        console.log(chalk.blue.bold(`Started removing all application (/) commands for guild: ${guildId}.`));

        await rest.put(Routes.applicationGuildCommands(Bun.env.DISCORD_CLIENT_ID, guildId), { body: [] });

        console.log(chalk.green.bold(`Successfully removed all application (/) commands for guild: ${guildId}.`));
    } catch (error) {
        console.error(chalk.red.bold(`Error removing guild commands: ${error}`));
    }
}

export async function removeAllGlobalCommands() {
    if (!Bun.env.DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN is not defined in the environment variables.");
    }

    if (!Bun.env.DISCORD_CLIENT_ID) {
        throw new Error("DISCORD_CLIENT_ID is not defined in the environment variables.");
    }

    const rest = new REST().setToken(Bun.env.DISCORD_TOKEN);

    try {
        console.log(chalk.blue.bold("Started removing all global application (/) commands."));

        await rest.put(Routes.applicationCommands(Bun.env.DISCORD_CLIENT_ID), { body: [] });

        console.log(chalk.green.bold("Successfully removed all global application (/) commands."));
    } catch (error) {
        console.error(chalk.red.bold(`Error removing global commands: ${error}`));
    }
}