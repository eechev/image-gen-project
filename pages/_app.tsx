import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import getConfig from "next/config";

import "./App.css";

export default function App({ Component, pageProps }: AppProps) {
  const defaultImage =
    "https://clipground.com/images/image-placeholder-clipart-1.png";
  const [result, setResult] = useState(defaultImage);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const text = "Generating image... Please Wait...";

  const { publicRuntimeConfig } = getConfig();

  const aiApiKey =
    typeof publicRuntimeConfig !== "undefined" && publicRuntimeConfig.aiApiKey
      ? publicRuntimeConfig.aiApiKey
      : process.env.AI_API_KEY;

  if (!aiApiKey) {
    throw new Error("AI Api Key not defined in config file");
  }

  const config = new Configuration({ apiKey: aiApiKey });
  const openai = new OpenAIApi(config);

  const generateImage = async () => {
    try {
      setLoading(true);
      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
      });
      const data = response.data;
      setResult(data.data[0].url || "no image found");
    } catch (err) {
      console.log("Failured occurred!");
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      let i = 0;
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i));
        i++;
        if (i > text.length + 1) {
          i = 0;
          setTypedText("");
        }
      }, 100);
      return () => clearInterval(typing);
    }
  }, [loading]);

  const sendEmail = (url = "") => {
    url = result;
    const message = `Here's your image download link: ${url}`;
    window.location.href = `mailto:someone@example.com?subject=Image Download Link&body=${message}`;
  };

  return (
    <div className="app-main">
      <h2> Create Images With Your Mind </h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with as much added descripton you would like"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage}>Generate Image</button>
      <>
        {loading ? (
          <>
            <h3>{typedText}</h3>
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="result-image" src={result} alt="result" onClick={() => sendEmail(result)} style={{cursor:"pointer"}}></img>
          </>
        )}
      </>
    </div>
  );
}
