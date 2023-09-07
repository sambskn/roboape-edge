import { Handlers } from "$fresh/server.ts";
import chatBank from "../../static/chatBank.json" assert { type: "json" } 
import { GroupmeCallback } from "../../types/groupmeCallback.ts";
import Template from "../../types/template.ts";
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";
import { getRandomProbability } from "../../utils/random.ts";
import { specialRoll } from "./roll.tsx";
import { RoboResponse } from "../../types/roboResponse.ts";

// Change this to your bot's name (exactly) if you're making a copy
export const BOT_NAME = "ROBO APE";

export interface groupme_group {
    id: number;
    created_at: string;
    group_id: string;
    bot_id: string;
    name: string;
    chatbank_id: number;
}

export const handler: Handlers = {
    async POST(req, ctx): Promise<Response> {

        // in theory we could check here to make sure the request comes from GroupMe,
        // that way no bad actors can spam our API and get us to post to the GroupMe
        // ... we'll just call it a TODO for now
        console.log('req received')
        const reqBody = await req.json() as GroupmeCallback;

        // check to make sure the bot is not responding to itself
        if (reqBody.name !== BOT_NAME) {
            const response = getResponseForMessage(reqBody);
            if (response) {
                const botID = await getBotIdForMessage(reqBody);
                // Post to groupme
                if (!botID) {
                    throw new Error("No Bot ID provided")
                }
                // Go ahead and post message to group using provided bot ID
                try {
                    await postBotMessage(response, botID);
                } catch (error) {
                    throw new Error("Failure while trying to post to GroupMe")
                }
                
            }      
        }
        return new Response(JSON.stringify({message: `read by ${BOT_NAME} at ${new Date().toLocaleString()} local ${BOT_NAME} time`}),  {
            headers: { "Content-Type": "application/json" }
        });
    }
}

export function getResponseForMessage(msg: GroupmeCallback): RoboResponse | undefined {
    if (msg.text === "") return undefined
    
    const matchingTemplate = chatBank.templates.find(template => templateIncludesText(msg.text, template))
    // if we found a matching template and our random number is under the frequency threshold, go ahead
    if (matchingTemplate && getRandomProbability() <= matchingTemplate.frequency) {
        // TODO: Handle 'special' case responses is the template has any
        if (matchingTemplate.special){
            return specialResponse(matchingTemplate.special, msg);
        }else{
        // Randomly select response from responses
        const response: RoboResponse = {
            message: matchingTemplate?.responses[Math.floor(getRandomProbability() * matchingTemplate.responses.length)],
            attachments: ""
        } 
        return response;
        }
    } 
    // if we didn't find one, or freq didn't hit, return nothing
    return undefined;
}

function specialResponse(specialIndicator: string, message: GroupmeCallback): RoboResponse | undefined {
    // this function is meant to interpret the special responses and return whatever the custom functions want to
    switch (specialIndicator){
        case "roll":
            return specialRoll(message);
        default:
            return undefined;
    }
}

function postBotMessage(response: RoboResponse, botId: string) {
    return fetch('https://api.groupme.com/v3/bots/post',{
        method: "POST",
        body: JSON.stringify({
            bot_id: botId,
            text: response.message,
            attachments: response.attachments
        }),
        headers: { "Content-Type": "application/json" }
    })
}

export function templateIncludesText(text: string, template: Template) {
    const keywordMatch = template.keywords.find(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    return !!keywordMatch;
}

async function getBotIdForMessage(message: GroupmeCallback) {
    // Get the connection string from the environment variable "DATABASE_URL"
    const databaseUrl = Deno.env.get("DATABASE_URL")!;
    console.log('about to check db')
    // Create a database pool with three connections that are lazily established
    const pool = new postgres.Pool(databaseUrl, 3, true);
    const connection = await pool.connect();
    try {
        // fidn the group assocaited with the group_id on the message
        const result = await connection.queryObject<groupme_group>`
            SELECT * FROM groupme_groups g WHERE g.group_id = ${message.group_id} 
        `
        const group = result.rows[0]
        return group.bot_id
    }  catch (err) {
        console.error(err);
        throw new Error('Databse issue')
    } finally {
        // Release the connection back into the pool
        connection.release();
    }

}