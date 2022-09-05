import { GroupmeCallback } from "../../types/groupmeCallback.ts";
import probabilities from "../../static/rollProbabilities.json" assert { type: "json" } 
import chatBank from "../../static/chatBank.json" assert {type: "json"}
import {templateIncludesText} from "../api/gmCallback.tsx"

/**
 * implements a rigged roll based on the person who sent the roll request to the groupme
 * 
 * @param message - the GroupmeCallback object which encapsulates the message and the sender, among other things
 */
export function specialRoll(message : GroupmeCallback): string {
    // attempt to find the sender in the people listed
    const sender = probabilities.people.find(sender => sender.id == message.sender_id)

    // if the person was found, use their probability space, otherwise do a normal roll
    if (sender){
        var probability = sender.probability;
    }else{
        // the person was not found
        var probability = "default";
    }

    // to do the roll, we need to figure out which number they were attempting to land (if possible)
    // find the keyword that was triggered and extract the landing number from there

    // find the keyword
    const matchingTemplate = chatBank.templates.find(template => templateIncludesText(message.text, template));
    const keywordMatch = matchingTemplate ? matchingTemplate.keywords.find(keyword => message.text.toLowerCase().includes(keyword.toLowerCase())) : "";

    // extract the landing number
    const key = {
        "on a 1": 1,
        "on a one": 1,
        "on a 2": 2,
        "on a two": 2,
        "on a 3": 3,
        "on a three": 3,
        "on a 4": 4,
        "on a four": 4,
        "on a 5": 5,
        "on a five": 5,
        "on a 6": 6,
        "on a six": 6
    }    
    const landingNumber = keywordMatch ? key[keywordMatch] : undefined;

    // if there's no landing number, just do the roll like normal
    if (!landingNumber) return ["1", "2", "3", "4", "4", "5", "6", "20"][Math.floor(Math.random() * 7)];

    // decide if the roll lands, doesn't, or bounces back
    var space = probabilities.probability_spaces.find(space => space.title == probability)
    var outcome = "undecided";
    if (space){
        const totalSpace = space.dist.bounceback + space.dist.land + space.dist.miss
        var rollFactor = Math.random() * totalSpace

        if (rollFactor < space.dist.bounceback){
            outcome = "bounceback";
        }else if (rollFactor < space.dist.bounceback + space.dist.land){
            outcome = "land";
        }else {
            outcome = "miss";
        }

        switch (outcome){
            case "bounceback":
                return "20";
            case "land":
                return landingNumber;
            case "miss":
                return ["1", "2", "3", "4", "5", "6"].filter(num => num != landingNumber)[Math.floor(Math.random() * 5)];
        }
    }else{
        // if for some reason, somebody is listed with a probability that doesn't exist, do a normal roll.
        return ["1", "2", "3", "4", "4", "5", "6", "20"][Math.floor(Math.random() * 7)];
    }
}