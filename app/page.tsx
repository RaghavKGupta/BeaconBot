"use client";
import {useEffect, useRef, useState} from 'react';
import Bubble from '../components/Bubble'
import { useChat, Message } from 'ai/react';
import Footer from '../components/Footer';
import PromptSuggestionRow from '../components/PromptSuggestions/PromptSuggestionsRow';
import ThemeButton from '../components/ThemeButton';
import useConfiguration from './hooks/useConfiguration';


export default function Home() {
  const { append, messages, input, handleInputChange, handleSubmit } = useChat();
  const { useRag, llm, similarityMetric, setConfiguration } = useConfiguration();

  const messagesEndRef = useRef(null);
  const [configureOpen, setConfigureOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    handleSubmit(e, { options: { body: { useRag, llm, similarityMetric}}});
  }

  const handlePrompt = (promptText) => {
    const msg: Message = { id: crypto.randomUUID(),  content: promptText, role: 'user' };
    append(msg, { options: { body: { useRag, llm, similarityMetric}}});
  };

  return (
    <>
    <main className="flex h-screen flex-col items-center justify-center">
      <section className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
        <div className='chatbot-header pb-6'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <svg width="24" height="25" viewBox="0 0 24 25">
                <path d="M20 9.96057V7.96057C20 6.86057 19.1 5.96057 18 5.96057H15C15 4.30057 13.66 2.96057 12 2.96057C10.34 2.96057 9 4.30057 9 5.96057H6C4.9 5.96057 4 6.86057 4 7.96057V9.96057C2.34 9.96057 1 11.3006 1 12.9606C1 14.6206 2.34 15.9606 4 15.9606V19.9606C4 21.0606 4.9 21.9606 6 21.9606H18C19.1 21.9606 20 21.0606 20 19.9606V15.9606C21.66 15.9606 23 14.6206 23 12.9606C23 11.3006 21.66 9.96057 20 9.96057ZM7.5 12.4606C7.5 11.6306 8.17 10.9606 9 10.9606C9.83 10.9606 10.5 11.6306 10.5 12.4606C10.5 13.2906 9.83 13.9606 9 13.9606C8.17 13.9606 7.5 13.2906 7.5 12.4606ZM16 17.9606H8V15.9606H16V17.9606ZM15 13.9606C14.17 13.9606 13.5 13.2906 13.5 12.4606C13.5 11.6306 14.17 10.9606 15 10.9606C15.83 10.9606 16.5 11.6306 16.5 12.4606C16.5 13.2906 15.83 13.9606 15 13.9606Z" />
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

            </div>
          </div>
          <p className="chatbot-text-secondary-inverse text-sm md:text-base mt-2 md:mt-4">This chatbot is designed to provide users with quick and reliable information from the official childwelfare.gov website. By leveraging Retrieval-Augmented Generation (RAG), it can understand your questions related to child welfare topics – such as child abuse and neglect, foster care, adoption, family support, and relevant laws and policies. The chatbot searches the extensive content of childwelfare.gov and generates answers based on the most relevant information found, providing you with direct and trustworthy responses. This aims to streamline access to crucial child welfare resources and support understanding of complex issues</p>
        </div>
        <div className='flex-1 relative overflow-y-auto my-4 md:my-6'>
          <div className='absolute w-full overflow-x-hidden'>
            {messages.map((message, index) => <Bubble ref={messagesEndRef} key={`message-${index}`} content={message} />)}
          </div>
        </div>
        {!messages || messages.length === 0 && (
          <PromptSuggestionRow onPromptClick={handlePrompt} />
        )}
        <form className='flex h-[40px] gap-2' onSubmit={handleSend}>
          <input onChange={handleInputChange} value={input} className='chatbot-input flex-1 text-sm md:text-base outline-none bg-transparent rounded-md p-2' placeholder='Send a message...' />
          <button type="submit" className='chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z" />
            </svg>
            <span className='hidden origin:block font-semibold text-sm ml-2'>Send</span>
          </button>
        </form>
        <Footer />
      </section>
    </main>
    </>
  )
}