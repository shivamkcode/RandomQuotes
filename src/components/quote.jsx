import React, {useState, useEffect} from "react";
import axios from "axios";
import silence from '../assets/silence.mp3'

const Quote = () => {
  const [quote, setQuote] = React.useState("");
  const [displayedQuote, setDisplayedQuote] = React.useState("");
  const [audio, setAudio] = useState(null);

  const fetchQuote = async () => {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const advice = response.data.slip.advice;
    setQuote(advice);
    const display = async () => await displayQuoteWithDelay(advice);
    display();
    speakQuote(advice);
  };

  useEffect(() => {
    const soundEffect = new Audio();
    soundEffect.autoplay = true;
    soundEffect.src = silence;
    setAudio(soundEffect);
  }, []);

  const audioAuth = () => {
    if (audio) {
      audio.play();
      // audio.pause();
    }
  };

  const speakQuote = (quote) => {
    const speak = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(quote);
        speech.lang = "en-US";
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 2;
        window.speechSynthesis.speak(speech);
      } else {
        console.error("Speech synthesis not supported");
      }
    };

    if (window.speechSynthesis !== undefined) {
      speak();
    } else {
      const id = setInterval(() => {
        if (window.speechSynthesis !== undefined) {
          speak();
          clearInterval(id);
        }
      }, 10);
    }
  };

  const displayQuoteWithDelay = async (quote) => {
    const words = quote.split(" ");
    for (let i = 0; i < words.length; i++) {
      setDisplayedQuote(words.slice(0, i + 1).join(" "));
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  };

  const handleNewQuote = () => {
    setQuote("");
    setDisplayedQuote("");
    fetchQuote();
  };

  React.useEffect(() => {
    handleNewQuote();
  }, []);

  return (
    <div className="app">
      <div className="random-quote">
        <h2 className="quote-text">
          {displayedQuote === "" ? quote : displayedQuote}
        </h2>
        <button onClick={() => {
            audioAuth()
            handleNewQuote()
        }}>New Quote</button>
      </div>
    </div>
  );
};

export default Quote;
