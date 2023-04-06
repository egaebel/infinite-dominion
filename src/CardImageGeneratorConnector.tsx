import React, { useState, } from "react";

interface CardImageGeneratorConnectorProps {
    imageUrl: string;
    text: string;
}

const CardImageGeneratorConnector: React.FC<CardImageGeneratorConnectorProps> = ({ text, imageUrl }) => {
    const defaultCard = { "title": "", "description": "", "cost": "", "type": "Action" };
    const [prevImageUrl, setPrevImageUrl] = useState("");
    const [prevText, setPrevText] = useState("");
    const [curCard, setCurCard] = useState(defaultCard);

    let card = defaultCard;
    if (text !== "" && text !== prevText) {
        try {
            card = JSON.parse(text);
            console.log("Successfully parsed JSON! text: '%s'", text);
            if (card.cost.toString().indexOf("$") === -1) {
                card.cost = "$" + card.cost.toString();
            }
            console.log("card.cost: " + card.cost);
            setCurCard(card);
        } catch (error) {
            console.error("ERROR: Could not parse text: '%s' into JSON!", error);
        }
    }

    const redrawElement = document.getElementById("extra-redraw-element-in-index-html");
    const redrawFn = () => {
        if (redrawElement != null && prevText !== text) {
            setPrevText(text);
            const redrawInputElement = redrawElement as HTMLInputElement;
            if (redrawInputElement.onchange != null) {
                console.log(`Mutating extra-redraw-element-in-index-html.....`);
                redrawInputElement.onchange(new Event(""));
            } else {
                console.error("ERROR: Couldn't find element 'extra-redraw-element-in-index-html'!");
            }
        }
        return (<div></div>)
    }
    const redrawImageElement = document.getElementById("extra-redraw-element-for-picture-in-index-html");
    const redrawImageFn = () => {
        if (redrawImageElement != null && prevImageUrl !== imageUrl) {
            setPrevImageUrl(imageUrl);
            const redrawImageInputElement = redrawImageElement as HTMLInputElement;
            if (redrawImageInputElement.onchange != null) {
                console.log(`Mutating extra-redraw-element-for-picture-in-index-html with imageUrl: '${imageUrl}'.....`);
                redrawImageInputElement.onchange(new Event(imageUrl));
            } else {
                console.error("ERROR: Couldn't find element 'extra-redraw-element-for-picture-in-index-html'!");
            }
        }
        return (<div></div>)
    }

    return (
        <div style={{ display: "none" }} className="centered-rectangular">
            <img style={{ display: "none" }} id="card-image" src={imageUrl} alt={"card image"} />
            {/* <img style={{ display: "none" }} id="card-image" src={imageUrl} alt={"card image"} /> */}
            <p style={{ display: "none" }}>{text}</p>

            {/* Invisible fields that are CURRENTLY USED for card-image-generator. */}
            <input style={{ display: "none" }} id="creator" value="GPT-4" />
            <input style={{ display: "none" }} id="credit" value="Illustration: Stable Diffusion" />
            <input style={{ display: "none" }} id="description" value={curCard.description} />
            <input style={{ display: "none" }} id="picture" value={imageUrl} />
            <input style={{ display: "none" }} id="price" value={curCard.cost} />
            <input style={{ display: "none" }} id="title" value={curCard.title} />
            <input style={{ display: "none" }} id="type" value={curCard.type} />

            {/* Invisible fields that are CURRENTLY UNUSED for card-image-generator. */}
            <input style={{ display: "none" }} id="boldkeys" value="" />
            <input style={{ display: "none" }} id="color2split" value="" />
            <div style={{ display: "none" }} id="color2splitselector" />
            <input style={{ display: "none" }} id="color-switch-button" value="" />
            <input style={{ display: "none" }} id="custom-icon" value="" />
            <input style={{ display: "none" }} id="custom-icon-upload" value="" />
            <input style={{ display: "none" }} id="description2" value="" />
            <input style={{ display: "none" }} id="expansion" value="" />
            <input style={{ display: "none" }} id="expansion-upload" value="" />
            <input style={{ display: "none" }} id="legend" value="" />
            <input style={{ display: "none" }} id="linkToOriginal" value="" />
            <input style={{ display: "none" }} id="load-indicator" value="" />
            <div style={{ display: "none" }} title="Card color">
                <input type="number" name="recolor" min="0" max="10" step=".05" value="0.75" />
                <input type="number" name="recolor" min="0" max="10" step=".05" value="1.1" />
                <input type="number" name="recolor" min="0" max="10" step=".05" value="1.35" />
            </div>
            <select style={{ display: "none" }} id="normalcolor1"><option selected>Action/Event</option><option>Treasure</option><option>Victory</option><option>Reaction</option><option>Duration</option><option>Reserve</option><option>Curse</option><option>Shelter</option><option>Ruins</option><option>Landmark</option><option>Night</option><option>Boon</option><option>Hex</option><option>State</option><option>Artifact</option><option>Project</option><option>Way</option><option>Ally</option><option>Trait</option><option>CUSTOM</option><option>EXTRA CUSTOM</option></select>
            <select style={{ display: "none" }} id="normalcolor2"><option selected>SAME</option><option>Action/Event</option><option>Treasure</option><option>Victory</option><option>Reaction</option><option>Duration</option><option>Reserve</option><option>Curse</option><option>Shelter</option><option>Ruins</option><option>Landmark</option><option>Night</option><option>Boon</option><option>Hex</option><option>State</option><option>Artifact</option><option>Project</option><option>Way</option><option>Ally</option><option>Trait</option><option>CUSTOM</option><option>EXTRA CUSTOM</option></select>
            <input style={{ display: "none" }} id="picture-upload" value="0" />
            <input style={{ display: "none" }} id="picture-x" value="0" />
            <input style={{ display: "none" }} id="picture-y" value="0" />
            <input style={{ display: "none" }} id="picture-zoom" value="1" />
            <input style={{ display: "none" }} id="preview" value="" />
            <input style={{ display: "none" }} id="title2" value="" />
            <input style={{ display: "none" }} id="trait" type="checkbox" value="" />
            <input style={{ display: "none" }} id="traveller" type="checkbox" value="" />
            <input style={{ display: "none" }} id="type2" value="" />

            {redrawFn()}
            {redrawImageFn()}
        </div>
    );
};

export default CardImageGeneratorConnector;