
/**
 * keywords: array of strings that will set off this template, 
 *      robo ape will check if any of these are present anywhere in the message text
 * responses: array of string responses that robo ape will randomly select from if 
 *      they respond
 * frequency: number between 0.0 and 1.0. The chance that roboape will respond to 
 *      the keyword
 * special: put any special params here in the tempalt eif you want the main robo ape 
 *      function to act differently for this template (you'll have to implement that lol)
 */
export default interface Template {
    keywords: string[]; 
    responses: string[];
    frequency: number;
    special: string | null;
}