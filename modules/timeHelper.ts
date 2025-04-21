export function timeStampToUnixSeconds(timeStamp: string): number {
    if (!timeStamp || timeStamp.length === 0) {
        console.log(timeStamp);
        return -1;
    }
    const date = new Date(timeStamp);
    return Math.floor(date.getTime() / 1000);

}

export function getDiscordFormattedTimeStamp(unixSeconds: number) {
    console.log(unixSeconds);
    if (!unixSeconds || unixSeconds === -1) {
        return "**\\*UNKNOWN\\***";
    }
    const date = new Date(unixSeconds * 1000);
    return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
}