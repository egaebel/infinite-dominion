import { Configuration, OpenAIApi } from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const cardTextFormattingPrompt = "When cards are to be drawn say \"+N cards\". When including coin costs in the description include a $ at the start of the number.";
const lengthRestrictionPrompt = "Keep the description under 2 sentences."
const jsonKeysPrompt = "Output ONLY JSON using the keys: 'title', 'type', 'description', 'cost', 'imageDescription', 'extraDescription'.";

async function getCardText(cardPrompt: string): Promise<string> {
    if (cardPrompt === undefined) {
        console.log("cardPrompt was undefined, setting to emptry string.....");
        cardPrompt = "";
    }
    console.log("getCardText called with cardPrompt: '%s'", cardPrompt);
    let textPrompt = `Generate a new card, ${cardPrompt}, from the game Dominion. ${cardTextFormattingPrompt} ${lengthRestrictionPrompt} ${jsonKeysPrompt}`;
    console.log(`Using full prompt: '${textPrompt}'`);
    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
    const openai: OpenAIApi = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion(
        {
            model: "gpt-4-0314",
            messages: [{
                role: "user",
                content: textPrompt,
            }],
        }
    )
    console.log(
        "response.status: '%s' response.data: '%s'",
        response.status, response.data);
    let text = "An error occurred"
    if (response.data.choices[0].message !== undefined) {
        text = response.data.choices[0].message.content;
    }
    console.log(`Retrieved text: '${text}' from GPT4!`);
    return text;
};

export default async function cardText(request: VercelRequest,
    response: VercelResponse) {
    console.log(`cardText called with cardPrompt: '${request.body.cardPrompt}' request.body: '${request.body}'`);
    let cardPrompt = "";
    try {
        cardPrompt = request.body.cardPrompt;
    } catch (error) {
        console.warn("WARNING: Could not parse cardPrompt from request body, error was: '%s'", error);
    }
    const cardText = await getCardText(cardPrompt);
    response.status(200).json({ "cardText": cardText });
}