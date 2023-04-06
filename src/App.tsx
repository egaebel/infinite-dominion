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

    const fetchImageOld2 = async (imagePromptArg: string) => {
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
    const fetchText = async () => {
        console.log(`fetchText called with cardPrompt: ${cardPrompt}!`);
        const fetchTextResponse = await axios.post(
            "/api/cardText",
            { "cardPrompt": cardPrompt }, {
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
                "/api/cardImageBanana",
                { "imagePrompt": imagePrompt }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log("response.data.output: '%s'", response.data.output);
            setImageUrl("data:image/png;base64," + response.data.output);
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
            <button className="generate" onClick={fetchData}>Generate</button>
        </div>
    );
};

export default App;