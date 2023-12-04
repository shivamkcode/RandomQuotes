import React from 'react'
import axios from 'axios'

const Quote = () => {
    const [quote, setQuote] = React.useState('')
    const [displayedQuote, setDisplayedQuote] = React.useState('');

    const fetchQuote = async () => {
        const response = await axios.get('https://api.adviceslip.com/advice');
        const advice = response.data.slip.advice
        setQuote(advice);

        const display = async () => await displayQuoteWithDelay(advice);
        display()
    }

    const speakQuote = (quote) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(quote);
            speech.lang = 'en-US';
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        } else {
            console.error('Speech synthesis not supported');
        }
    }

    const displayQuoteWithDelay = async (quote) => {
        const words = quote.split(' ');
        for (let i = 0; i < words.length; i++) {
            setDisplayedQuote(words.slice(0, i + 1).join(' '));
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        console.log(quote)
        speakQuote(quote);
    };

    const handleNewQuote = () => {
        setQuote('');
        setDisplayedQuote('');
        fetchQuote();
    };

    React.useEffect(() => {
        handleNewQuote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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