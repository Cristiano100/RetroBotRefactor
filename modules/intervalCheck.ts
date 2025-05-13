import { Message, User } from "discord.js";
import { embedColors } from "../types/embedColors";
import { isBooster } from "./authCheck";
import { getDataStoreEntry, setDataStoreEntry } from "./datastore";
import { buildSimpleEmbed } from "./embedHelper";
import { getRobloxUserInfoFromDiscordId } from "./fetchRobloxUserInfo";

export async function intervalCheck(user: User, message: Message) {
    if (!await isBooster(user)) {
        return;
    }

    let robloxUserInfo: any = await getRobloxUserInfoFromDiscordId(user.id);
    if (robloxUserInfo == null || !robloxUserInfo.robloxId) {
        return;
    }

    let data = await getDataStoreEntry("BoosterInfo", robloxUserInfo.robloxId)
    if (data != null) {
        return;
    }

    await setDataStoreEntry("BoosterInfo", robloxUserInfo.robloxId, {
        "LinkedDiscordId": user.id,
        "TimeActivated": Math.floor(Date.now() / 1000)
    }).then(async () => {
        message.reply({
            embeds: [await buildSimpleEmbed(`Your Roblox account (${robloxUserInfo.cachedUsername}) has been verified as a Discord Nitro Booster.`, embedColors.default)],
        });
    }
    ).catch((err: any) => {
    })
}
