
const baseUrl = "https://registry.rover.link/api";

export async function getRobloxUserInfoFromDiscordId(discordId: string) {
    const response = await fetch(`${baseUrl}/guilds/${Bun.env.DISCORD_MAIN_GUILD_ID}/discord-to-roblox/${discordId}`,
        {
            headers: { "Authorization": `Bearer ${Bun.env.ROVER_API_KEY}` },
        }
    )
        .then(async (res) => {
            const body = await res.json();
            if (res.status !== 200) {
                return null;
            } else {

                return body;
            }
        })
        .catch((err) => {
            console.log("Error fetching user info:", err);
            return null;
        });

    return response

}