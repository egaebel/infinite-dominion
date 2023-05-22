import * as banana from '@banana-dev/banana-dev';
import type { VercelRequest, VercelResponse } from "@vercel/node";

async function getCardImage(imagePrompt: string): Promise<object> {
    if (imagePrompt === undefined) {
        imagePrompt = "";
    }
    // TODO: Tweak settings like steps, sampler, etc.
    const modelInputs = {
        "endpoint": "txt2img",
        "params": {
            "prompt": imagePrompt,
            "negative_prompt": "low quality",
            "steps": 25,
            "sampler_name": "Euler a",
            "cfg_scale": 7.5,
            "seed": 42,
            "batch_size": 1,
            "n_iter": 1,
            "width": 768,
            "height": 768,
            "tiling": false
        }
    }
    const response = await banana.run(
        process.env.REACT_APP_BANANA_API_KEY,
        process.env.REACT_APP_BANANA_STABLE_DIFFUSION_MODEL_KEY,
        modelInputs);

    console.log("response: '%s'", response);
    if (response !== undefined) {
        console.log("response.modelOutputs[0]: '%s'", response["modelOutputs"][0]);
    }
    return response;
}

export default async function cardImage(request: VercelRequest,
    response: VercelResponse) {
    const imagePrompt = request.body.imagePrompt;
    console.log("Making request with imagePrompt: '%s'", imagePrompt);
    const imageResponse = await getCardImage(imagePrompt);
    response.status(200).json({
        "output": imageResponse["modelOutputs"][0]["images"][0]
    });
}
