import { MessageFlags, User } from "discord.js";

async function userHasRoleWithId(user: User, roleId: string): Promise<boolean> {
    if (!Bun.env.DISCORD_MAIN_GUILD_ID) {
        throw new Error("DISCORD_MAIN_GUILD_ID is not defined in the environment variables.");
    }

    const guildId = Bun.env.DISCORD_MAIN_GUILD_ID;

    if (!guildId) {
        throw new Error("DISCORD_MAIN_GUILD_ID is not defined in the environment variables.");
    }

    const guild = await user.client.guilds.fetch(guildId);

    if (!guild) {
        throw new Error("Guild not found");
    }

    const member = await guild.members.fetch({ user: user.id, force: true });
    if (!member) {
        throw new Error("Member not found");
    }

    return member.roles.cache.has(roleId);
}

export async function isAdmin(user: User) {
    return userHasRoleWithId(user, "663178862938685473");
}

export async function isSupervisor(user: User) {
    return userHasRoleWithId(user, "855133120621707296");
}

export async function isDeveloper(user: User) {
    return userHasRoleWithId(user, "645632252419506222");
}

export async function isBot(user: User) {
    return user.bot;
}

export async function getInvalidPermissionReply() {
    return {
        content: "You do not have permission to use this command.",
        flags: MessageFlags.Ephemeral,
    };
}

export async function userHasHigherRole(user: User, otherUser: User) {
    if (!Bun.env.DISCORD_MAIN_GUILD_ID) {
        throw new Error("DISCORD_MAIN_GUILD_ID is not defined in the environment variables.");
    }

    const guild = await user.client.guilds.fetch(Bun.env.DISCORD_MAIN_GUILD_ID);
    if (!guild) {
        throw new Error("Guild not found");
    }
    const member = await guild.members.fetch({ user: user.id, force: true });
    if (!member) {
        throw new Error("Member not found");
    }
    const otherMember = await guild.members.fetch({ user: otherUser.id, force: true });
    if (!otherMember) {
        throw new Error("Other member not found");
    }
    return member.roles.highest.comparePositionTo(otherMember.roles.highest) > 0;
}

export async function getBotReply() {
    return {
        content: "Requested user is a bot.",
        flags: MessageFlags.Ephemeral,
    };
}