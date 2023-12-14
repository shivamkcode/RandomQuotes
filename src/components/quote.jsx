import React from 'react'
import axios from 'axios'

const Quote = () => {
    const [quote, setQuote] = React.useState('')
    const [displayedQuote, setDisplayedQuote] = React.useState('');

    const fetchQuote = async () => {
        const response = await axios.get('https://api.adviceslip.com/advice');
        const advice = response.data.slip.advice
        setQuote(advice);
        return advice;
    }

    // const speakQuote = (quote) => {
    //     const speak = () => {
    //         if ('speechSynthesis' in window) {
    //             window.speechSynthesis.cancel();
    
    //             const speech = new SpeechSynthesisUtterance(quote);
    //             speech.lang = 'en-US';
    //             speech.volume = 1;
    //             speech.rate = 1;
    //             speech.pitch = 2;
    //             window.speechSynthesis.speak(speech);
    //         } else {
    //             console.error('Speech synthesis not supported');
    //         }
    //     }
    
    //     if (window.speechSynthesis !== undefined) {
    //         speak();
    //     } else {
    //         const id = setInterval(() => {
    //             if (window.speechSynthesis !== undefined) {
    //                 speak();
    //                 clearInterval(id);
    //             }
    //         }, 10);
    //     }
    // }

    const speakQuote = (quote) => {
        const speak = () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
        
                const speech = new SpeechSynthesisUtterance(quote);
                speech.lang = 'en-US';
                speech.volume = 1;
                speech.rate = 1;
                speech.pitch = 2;
    
                // Get the list of voices available
                let voices = window.speechSynthesis.getVoices();
    
                // Choose a voice. Here we're choosing the first available voice.
                // You can choose a different voice by changing the index.
                speech.voice = voices[1]; 
    
                window.speechSynthesis.speak(speech);
            } else {
                console.error('Speech synthesis not supported');
            }
        }
        
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
            speakQuote(advice);
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
