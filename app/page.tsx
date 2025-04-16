"use client";
import { useEffect, useRef, useState } from 'react';
import ChatBox from '../components/ChatBox'
import { useChat, Message } from 'ai/react';
import Footer from '../components/Footer';
import PromptGroup from '../components/Prompt/PromptGroup';
import ThemeButton from '../components/ThemeButton';
import useConfiguration from './hooks/useConfiguration';

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}


export default function Home() {
  const { append, messages, input, handleInputChange, handleSubmit } = useChat();
  const { useRag, llm, similarityMetric, setConfiguration } = useConfiguration();

  const messagesEndRef = useRef(null);
  const [configureOpen, setConfigureOpen] = useState(false);


  const [isListening, setIsListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakTimeout = useRef<NodeJS.Timeout | null>(null);
  const speakEnabledRef = useRef(speakEnabled);

  useEffect(() => {
    speakEnabledRef.current = speakEnabled;
  }, [speakEnabled]);
  
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!speakEnabled) {
      speechSynthesis.cancel();
      setIsSpeaking(false); 
    }
  }, [speakEnabled]);
  


  const lastSpokenMessageId = useRef<string | null>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
  
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false); 
  
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };
  



  useEffect(() => {
    scrollToBottom();

    if (speakEnabledRef.current && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];

      if (
        lastMsg.role === 'assistant' &&
        lastMsg.id !== lastSpokenMessageId.current
      ) {
        // Debounce speak until assistant message is stable
        if (speakTimeout.current) clearTimeout(speakTimeout.current);

        speakTimeout.current = setTimeout(() => {
          speak(lastMsg.content);
          lastSpokenMessageId.current = lastMsg.id;
        }, 500); // wait 500ms after last change before speaking
      }
    }
  }, [messages]);




  const handleSend = (e) => {
    handleSubmit(e, { options: { body: { useRag, llm, similarityMetric } } });
  }

  const handlePrompt = (promptText) => {
    const msg: Message = { id: crypto.randomUUID(), content: promptText, role: 'user' };
    append(msg, { options: { body: { useRag, llm, similarityMetric } } });
  };


  const handleAudio = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true); 

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const msg: Message = {
        id: crypto.randomUUID(),
        content: transcript,
        role: 'user',
      };
      append(msg, { options: { body: { useRag, llm, similarityMetric } } });
      setIsListening(false); 
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };




  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        <section className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
          <div className='chatbot-header pb-6'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <svg className='w-10 h-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L9 7h6l-3-5z"></path>
                  <path d="M9 7v10h6V7"></path>
                  <path d="M10 17h4v2h-4z"></path>
                  <path d="M4 22h16"></path>
                  <path d="M2 7h20"></path>
                </svg>
                <h1 className='chatbot-text-primary text-xl md:text-2xl font-medium'>BeaconBot</h1>
              </div>
              <div className='flex gap-1'>
                <ThemeButton />

                <button
                  onClick={() => window.location.reload()}
                  className="chatbot-refresh-button flex rounded-md items-center justify-center px-2.5 origin:px-3"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 1.66667C5.4 1.66667 1.66667 5.4 1.66667 10C1.66667 14.6 5.4 18.3333 10 18.3333C13.3333 18.3333 16.1667 16.3333 17.3333 13.3333H15.3333C14.3333 15.3333 12.3333 16.6667 10 16.6667C6.66667 16.6667 4 14 4 10.6667C4 7.33333 6.66667 4.66667 10 4.66667C11.6667 4.66667 13.1667 5.33333 14.3333 6.33333L11.6667 9H18.3333V2.33333L15.6667 5C14.1667 3.66667 12.1667 2.66667 10 2.66667C5.4 2.66667 1.66667 6.4 1.66667 10C1.66667 13.6 5.4 17.3333 10 17.3333C14.6 17.3333 18.3333 13.6 18.3333 10H16.3333C16.3333 13.3333 13.3333 16.3333 10 16.3333C6.66667 16.3333 4 13.6667 4 10.3333C4 7 6.66667 4.33333 10 4.33333C12.3333 4.33333 14.3333 5.66667 15.3333 7.66667H17.3333C16.1667 4.66667 13.3333 2.66667 10 2.66667Z" />
                  </svg>
                </button>

                <button
                  onClick={() => setSpeakEnabled(prev => !prev)}
                  className={`chatbot-audio-button flex items-center justify-center px-3.5 origin:px-3 ${speakEnabled ? 'text-blue-600' : 'text-gray-400'}`}
                  title="Toggle voice"
                >
                  {speakEnabled ? '🔊' : '🔇'}
                </button>


              </div>
            </div>
            <p className="chatbot-text-secondary-inverse text-sm md:text-base mt-2 md:mt-4">This chatbot is designed to provide users with quick and reliable information from the official childwelfare.gov website. By leveraging Retrieval-Augmented Generation (RAG), it can understand your questions related to child welfare topics – such as child abuse and neglect, foster care, adoption, family support, and relevant laws and policies. The chatbot searches the extensive content of childwelfare.gov and generates answers based on the most relevant information found, providing you with direct and trustworthy responses. This aims to streamline access to crucial child welfare resources and support understanding of complex issues</p>
          </div>
          <div className='flex-1 relative overflow-y-auto my-4 md:my-6'>
            <div className='absolute w-full overflow-x-hidden'>
              {messages.map((message, index) => <ChatBox ref={messagesEndRef} key={`message-${index}`} content={message} />)}
            </div>
          </div>
          {!messages || messages.length === 0 && (
            <PromptGroup onClick={handlePrompt} />
          )}

          {isListening && (
            <div className="flex items-center gap-2 text-sm text-blue-500 mb-1 animate-pulse">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1.5a2.5 2.5 0 00-2.5 2.5v6a2.5 2.5 0 005 0v-6A2.5 2.5 0 0010 1.5zM5 10a5 5 0 0010 0h-1.25a3.75 3.75 0 11-7.5 0H5zM9 18h2v-2H9v2z" />
              </svg>
              Listening...
            </div>
          )}

          {isSpeaking && (
            <div className="text-sm text-green-600 mb-1 animate-pulse">
              🗣 Speaking...
            </div>
          )}




          <button
            onClick={() => handlePrompt("Can you summarize the conversation so far?")}
            className="chatbot-summary-button mt-2 text-sm text-blue-600 hover:underline"
          >
            📋 Summarize Chat
          </button>


          <form className='flex h-[40px] gap-2' onSubmit={handleSend}>
            <input
              onChange={handleInputChange}
              value={input}
              className='chatbot-input flex-1 text-sm md:text-base outline-none bg-transparent rounded-md p-2'
              placeholder='Send a message...'
            />

            <button
              type="button"
              onClick={handleAudio}
              className="chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 1.5a2.5 2.5 0 00-2.5 2.5v6a2.5 2.5 0 005 0v-6A2.5 2.5 0 0010 1.5zM5 10a5 5 0 0010 0h-1.25a3.75 3.75 0 11-7.5 0H5zM9 18h2v-2H9v2z" />
              </svg>
            </button>

            <button
              type="submit"
              className='chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3'
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z" />
              </svg>
              <span className='hidden origin:block font-semibold text-sm ml-2'>Send</span>
            </button>
          </form>



          <Footer />
        </section>

        <button
          onClick={() => handlePrompt("I need help urgently")}
          className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-700"
        >
          🚨 Get Help
        </button>

      </main>
    </>
  )
}