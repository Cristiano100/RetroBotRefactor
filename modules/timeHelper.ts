export function timeStampToUnixSeconds(timeStamp: string): number {
    const date = new Date(timeStamp);
    return Math.floor(date.getTime() / 1000);

}