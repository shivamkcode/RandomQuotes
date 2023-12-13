import React from 'react';
import axios from 'axios';
import { useSpeechSynthesis } from 'react-speech-kit';

const Quote = () => {
    const [quote, setQuote] = React.useState('')
    const [displayedQuote, setDisplayedQuote] = React.useState('');
    const { speak, voices } = useSpeechSynthesis();

    const fetchQuote = async () => {
        const response = await axios.get('https://api.adviceslip.com/advice');
        const advice = response.data.slip.advice
        setQuote(advice);
        return advice;
    }

    const displayQuoteWithDelay = async (quote) => {
        const words = quote.split(' ');
        for (let i = 0; i < words.length; i++) {
            setDisplayedQuote(words.slice(0, i + 1).join(' '));
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    };

    const handleNewQuote = () => {
        setQuote('');
        setDisplayedQuote('');
        fetchQuote().then(advice => {
            const display = async () => await displayQuoteWithDelay(advice);
            display()
            speak({ text: advice, voice: voices[1] }); // Change the index to use a different voice. Try above 10
        });
    }; 

    

    React.useEffect(() => {
        handleNewQuote()
    },[])

    return (
        <div className='app'>
            <div className='random-quote'>
                <h2 className='quote-text' >{displayedQuote === '' ? quote : displayedQuote}</h2>
                <button onClick={handleNewQuote}>New Quote</button>
            </div>
        </div>
    )
}

export default Quote
