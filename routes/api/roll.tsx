import { GroupmeCallback } from "../../types/groupmeCallback.ts";
import probabilities from "../../static/rollProbabilities.json" assert { type: "json" } 
import { getRandomProbability } from "../../utils/random.ts";

// the strign values that will be used as the faces of the die
// randomly selected from when doing a defualt roll
export const ROLL_OPTIONS =  ["1", "2", "3", "4", "4", "5", "6", "20"]
export const NORMAL_ROLL_OPTIONS = ROLL_OPTIONS.filter(o => o !== "20")

/**
 * implements a rigged roll based on the person who sent the roll request to the groupme
 * 
 * @param message - the GroupmeCallback object which encapsulates the message and the sender, among other things
 */
export function specialRoll(message : GroupmeCallback): string {
    // attempt to find the sender in the people listed
    const sender = probabilities.people.find(sender => sender.id == message.sender_id)

    // if the person was found, use their probability space, otherwise do a normal roll
    const probability = sender ? sender.probability : "default";
    
    const rollRegex = /^on a (\d|20|one|two|three|four|five|six|twenty)/gmi
    // splits the message text into the number they want and the dare text (maybe we could save them for posterity/judgement? or get @'s from it and use them in determining probability?)
    let [desiredNumber, dareText] = message.text.toLowerCase().split(rollRegex).slice(1,3);
    
    // convert the number to a number string (instead of 'five' we want '5')
    if (isNaN(parseInt(desiredNumber))) {
        switch (desiredNumber) {
            case'one':
                desiredNumber = '1'
                break;
            case 'two':
                desiredNumber = '2'
                break;
            case 'three':
                desiredNumber = '3'
                break;
            case 'four':
                desiredNumber = '4'
                break;
            case 'five':
                desiredNumber = '5'
                break;
            case 'six':
                desiredNumber = '6'
                break;
            case 'twenty':
                desiredNumber = '20'
                break;
            default:
                break;
        }
    }

    
    console.log(`Roll incoming: Looking for a ${desiredNumber} -- Dare: ${dareText}`)
    // if there's no landing number, just do the roll like normal
    if (!desiredNumber) return getDefaultRoll();

    // decide if the roll lands, doesn't, or bounces back
    const space = probabilities.probability_spaces.find(space => space.title == probability)
    let outcome = "undecided";
    if (space){
        const totalSpace = space.dist.bounceback + space.dist.land + space.dist.miss
        const rollFactor = getRandomProbability() * totalSpace

        if (rollFactor < space.dist.bounceback){
            outcome = "bounceback";
        }else if (rollFactor < space.dist.bounceback + space.dist.land){
            outcome = "land";
        }else {
            outcome = "miss";
        }

        console.log(`roll outcome: ${outcome}`)

        switch (outcome){
            case "bounceback":
                return "20";
            case "land":
                return desiredNumber;
            case "miss":
                const MISSES = NORMAL_ROLL_OPTIONS.filter(num => num != desiredNumber);
                return MISSES[Math.floor(getRandomProbability() * (MISSES.length - 1))];
        }
    }
    
    // if for some reason, somebody is listed with a probability that doesn't exist, do a normal roll.
    return getDefaultRoll();
    
}

const getDefaultRoll = (): string => {
    return ROLL_OPTIONS[Math.floor(getRandomProbability() * ROLL_OPTIONS.length)];
}