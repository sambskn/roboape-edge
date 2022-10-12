/**
 * This is a better function to use than Math.random
 * @returns truly random float value between 0.0 and 0.99998474
 */
export const getRandomProbability = ():number => {
    const a = new Uint16Array(1);
    // will be a number between 0-65535 (inclusive)
    const randomInt16 = crypto.getRandomValues(a)[0];
    return randomInt16 / 65536.0;
}