import { Handlers } from "$fresh/server.ts";
import chatBank from "../../static/chatBank.json" assert { type: "json" } 
import { GroupmeCallback } from "../../types/groupmeCallback.ts";
import Template from "../../types/template.ts";

// Change this to your bot's name (exactly) if you're making a copy
export const BOT_NAME = "ROBO APE";

export const handler: Handlers = {
    async POST(req, ctx): Promise<Response> {

        // in theory we could check here to make sure the request comes from GroupMe,
        // that way no bad actors can spam our API and get us to post to the GroupMe
        // ... we'll just call it a TODO for now

        const reqBody = await req.json() as GroupmeCallback;

        // check to make sure the bot is not responding to itself
        if (reqBody.name !== BOT_NAME) {
            const message = getResponseForMessage(reqBody.text);
            if (message) {
                const botID =  Deno.env.get("BOT_ID");
                // Post to groupme
                if (!botID) {
                    throw new Error("No Bot ID provided")
                }
                // Go ahead and post message to group using provided bot ID
                try {
                    await postBotMessage(message, botID);
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

export function getResponseForMessage(msg: string): string | undefined {
    if (msg === "") return undefined
    
    const matchingTemplate = chatBank.templates.find(template => templateIncludesText(msg, template))
    // if we foudn a matching template and our random number is under the frequency threshold, go ahead
    if (matchingTemplate && Math.random() <= matchingTemplate.frequency) {
        // TODO: Handle 'special' case responses is the tempalte has any
        
        // Randomly select response from responses
        return matchingTemplate?.responses[Math.floor(Math.random() * matchingTemplate.responses.length)];
    } 
    // if we didn't find one, or freq didn't hit, return nothing
    return undefined;
}

function postBotMessage(message: string, botId: string) {
    return fetch('https://api.groupme.com/v3/bots/post',{
        method: "POST",
        body: JSON.stringify({
            bot_id: botId,
            text: message
        }),
        headers: { "Content-Type": "application/json" }
    })
}

function templateIncludesText(text: string, template: Template) {
    const keywordMatch = template.keywords.find(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
    return !!keywordMatch;
}