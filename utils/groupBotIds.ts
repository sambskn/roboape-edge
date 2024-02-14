/**
 * This function expects there to be a env var for each groupme group id with a value
 * equal to the bot id to use for that group
 * e.g. BOT_ID_<groupId>=<botId>
 * @param groupId the group id (int) to retrieve the bot id for
 * @returns bot id to use for posting groupme message
 */
export const getBotIdForGroup = (groupId: number) => {
    return Deno.env.get(`BOT_ID_${groupId}`)!;
}