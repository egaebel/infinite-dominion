import axios from 'axios';
import CardImageGeneratorConnector from "./CardImageGeneratorConnector";
import { OpenAIApi } from "openai";
import React, { useEffect, useMemo, useState, } from "react";

import "./App.css";


interface Props { }

const App: React.FC<Props> = () => {
    const [cardPrompt, setCardPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [text, setText] = useState("");


    const { Configuration, OpenAIApi } = require("openai");
    const openai: OpenAIApi = useMemo(() => {
        const configuration = new Configuration({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        return new OpenAIApi(configuration);
    }, [Configuration, OpenAIApi]);

    const cardTextFormattingPrompt = "When cards are to be drawn say \"+N cards\". When including coin costs in the description include a $ at the start of the number.";
    const lengthRestrictionPrompt = "Keep the description under 2 sentences."
    const jsonKeysPrompt = "Output ONLY JSON using the keys: 'title', 'type', 'description', 'cost', 'imageDescription', 'extraDescription'.";
    let textPrompt = `Generate a new card, ${cardPrompt}, from the game Dominion. ${cardTextFormattingPrompt} ${lengthRestrictionPrompt} ${jsonKeysPrompt}`;

    const fetchTextOld = async () => {
        console.log("fetchText called!");
        const response = await openai.createChatCompletion(
            {
                model: "gpt-4-0314",
                messages: [{
                    role: "user",
                    content: textPrompt,
                }],
            }
        )
        let text = "An error occurred"
        if (response.data.choices[0].message !== undefined) {
            text = response.data.choices[0].message.content;
        }
        setText(text);
        setImageUrl("");
        console.log(`Retrieved text: '${text}' from GPT4!`);
        return text;
    };
    const fetchImageOld = async (imagePromptArg: string) => {
        console.log("fetchImage called!");
        const imagePrompt = `Dominion art of "${imagePromptArg}" in the style of art from the game dominion`
        try {
            let response = await axios.post(
                "/api/v3/text2img",
                {
                    "key": process.env.REACT_APP_STABLE_DIFFUSION_API_KEY,
                    "prompt": imagePrompt,
                    "negative_prompt": null,
                    "width": "512",
                    "height": "512",
                    "samples": "1",
                    "num_inference_steps": "20",
                    "seed": null,
                    "guidance_scale": 7.5,
                    "safety_checker": "yes",
                    "webhook": null,
                    "track_id": null
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
            if (response.data.status === "processing") {
                console.log("response.data.fetch_result: " + response.data.fetch_result);
                const fetchId = response.data.fetch_result.match(/\/[0-9]+$/)[0].replace("/", "");
                while (response.data.status === "processing") {
                    console.log("response.data: " + Object.entries(response.data).toString());
                    console.log(`Fetching id: ${fetchId} in 2 seconds.....`);
                    setTimeout(async () => {
                        response = await axios.post(
                            `/api/v3/fetch/${fetchId}`,
                            {
                                "key": process.env.REACT_APP_STABLE_DIFFUSION_API_KEY,
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                }
                            });
                    }, 2000);
                }
            }
            setImageUrl(response.data.output[0]);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchText = async () => {
        console.log("fetchText called!");
        const fetchTextResponse = await axios.post(
            "/api/cardText",
            { "textPrompt": cardPrompt }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        console.log(
            "response.status: '%d' response.data: '%s'",
            fetchTextResponse.status, fetchTextResponse.data);
        if (fetchTextResponse.data.cardText !== undefined) {
            const text = fetchTextResponse.data.cardText;
            setText(text);
            setImageUrl("");
            console.log(`Retrieved text: '${text}' from GPT4!`);
            return text;
        }
        return undefined;
    };
    const fetchImage = async (imagePromptArg: string) => {
        console.log("fetchImage called!");
        const imagePrompt = `Dominion art of "${imagePromptArg}" in the style of art from the game dominion`
        try {
            let response = await axios.post(
                "/api/cardImage",
                { "textPrompt": imagePrompt }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log("response.data: '%s'", response.data);
            console.log("response.data.status: '%s'", response.data.status);
            if (response.data.status === "processing") {
                console.log("response.data.fetch_result: " + response.data.fetch_result);
                const fetchId = response.data.fetch_result.match(/\/[0-9]+$/)[0].replace("/", "");
                while (response.data.status === "processing") {
                    console.log(`Fetching id: ${fetchId} in 2 seconds.....`);
                    setTimeout(async () => {
                        response = await axios.post("/api/fetchCardImage");
                    }, 2000);
                }
            }
            setImageUrl(response.data.output[0]);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchData = async () => {
        console.log("fetchData called!");
        const text = await fetchText();
        try {
            const card = JSON.parse(text);
            fetchImage(card.imageDescription);
        } catch (error) {
            console.error("ERROR: Could not parse text: '%s' as JSON. Error was: '%s'", text, error);
        }
    }


    useEffect(() => {
    }, []);

    return (
        <div className="app">
            <CardImageGeneratorConnector text={text} imageUrl={imageUrl} />
            <input
                className="cardPrompt"
                onChange={(event) => setCardPrompt(event.target.value)}
                onMouseOver={() => ({})}
                placeholder="Village"
                value={cardPrompt}
            />
            <button onClick={fetchData}>Generate</button>
        </div>
    );
};

export default App;