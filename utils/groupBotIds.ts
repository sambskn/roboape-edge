/**
 * Replace the values below with your own group id's/bot id's if making your own robo ape
 */
export const GROUP_BOT_IDS: {[key: number]: string} = {
    33950427: "eaa0ed22c2d45ad3a06fcf9949",
    6197845: "cdee2c3be96a30bb5e0936a66b"
}

export const getBotIdForGroup = (groupId: number) => {
    return GROUP_BOT_IDS[groupId];
}