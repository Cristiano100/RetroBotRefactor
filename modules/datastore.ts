export async function getDataStoreEntry(Datastore: string, key: string) {
    let result = await fetch(`https://apis.roblox.com/cloud/v2/universes/${Bun.env.ROBLOX_UNIVERSE_ID}/data-stores/${Datastore}/entries/${key}`, {
        method: "GET",
        headers: {
            "x-api-key": `${Bun.env.ROBLOX_OPEN_CLOUD?.toString()}`,
            "Content-Type": "application/json",
        }
    })

    if (result.status == 200) {
        let data = await result.json()
        return data;
    }

    return null;
}
export async function setDataStoreEntry(Datastore: string, key: string, value: any) {
    let result = await fetch(`https://apis.roblox.com/cloud/v2/universes/${Bun.env.ROBLOX_UNIVERSE_ID}/data-stores/${Datastore}/entries/${key}?allowMissing=true`, {
        method: "PATCH",
        headers: {
            "x-api-key": `${Bun.env.ROBLOX_OPEN_CLOUD?.toString()}`,
            "Content-Type": "application/json",
        },
        body: await JSON.stringify({
            "value": value,
            "users": [
                `users/${key}`
            ],
        })
    })
}
