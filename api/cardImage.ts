import axios, { AxiosResponse } from 'axios';
import type { VercelRequest, VercelResponse } from "@vercel/node";

async function getCardImage(imagePrompt: string): Promise<AxiosResponse<any, any>> {
    let response = await axios.post(
        "https://stablediffusionapi.com/api/v3/text2img",
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
    console.log(
        "response.status: '%s' response.data.status: '%s' response.data: '%s'",
        response.status, response.data.status, response.data);
    return response;
}

export default async function cardImage(request: VercelRequest,
    response: VercelResponse) {
    const { imagePrompt } = request.body;
    const imageResponse = await getCardImage(imagePrompt);
    response.status(200).json({
        "fetch_result": imageResponse.data.fetch_result,
        "output": imageResponse.data.output,
        "status": imageResponse.data.status
    });
}