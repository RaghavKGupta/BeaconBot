import OpenAI from 'openai';
import {OpenAIStream, StreamingTextResponse} from 'ai';
import {AstraDB} from "@datastax/astra-db-ts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const astraDb = new AstraDB(process.env.ASTRA_DB_APPLICATION_TOKEN, process.env.ASTRA_DB_API_ENDPOINT, process.env.ASTRA_DB_NAMESPACE);

export async function POST(req: Request) {
  try {
    const {messages, useRag, llm, similarityMetric} = await req.json();

    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = '';
    if (useRag) {
      const {data} = await openai.embeddings.create({input: latestMessage, model: 'text-embedding-ada-002'});

      const collection = await astraDb.collection(`chat_${similarityMetric}`);

      const cursor= collection.find(null, {
        sort: {
          $vector: data[0]?.embedding,
        },
        limit: 5,
      });
      
      const documents = await cursor.toArray();
      
      docContext = `
        START CONTEXT
        ${documents?.map(doc => doc.content).join("\n")}
        END CONTEXT
      `
    }
    const ragPrompt = [
      {
        role: 'system',
        content: `You are BeaconBot, an empathetic and professional AI assistant dedicated to providing accurate information on Child Welfare policies, 
        including the prevention of child trafficking, child neglect, and child abuse. Your answers should be concise, clear, and supportive, especially 
        considering that some users may be in distress. When users express frustration or distress, remain calm and kindly advise them to seek immediate 
        help by contacting their local child welfare representative or calling 911 if it is an emergency. Make sure to provide the URL of the source of your information
        when available by adding "Source - " followed by the link in hyperlink in the next line. Make sure ALL the links are from childwelfare.gov only.
        . If the user asks for information that is not related to Child Welfare, kindly inform them that you are unable to assist with that topic.
    
    Use the contextual information provided below to inform your responses:
    ${docContext}
    
    If the necessary answer is not found within the context, respond with:
    "I'm sorry, I don't know the answer — maybe someone from our service line can help at info@childwelfare.gov. If you think this is an emergency, please call 911."
    
    Always ensure your language is respectful, empathetic, and supportive.`
      },
    ];
    if (messages.length > 0) {
      ragPrompt.push({
        role: 'user',
        content: `Previous conversation history: ${messages.map(m => m.content).join('\n')}`
      });
    }    


    const response = await openai.chat.completions.create(
      {
        model: llm ?? 'gpt-3.5-turbo',
        stream: true,
        messages: [...ragPrompt, ...messages],
      }
    );
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}
