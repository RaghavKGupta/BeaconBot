import {forwardRef, JSXElementConstructor, RefObject} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBox:JSXElementConstructor<any> = forwardRef(function ChatBox({ content }, ref) {
  const { role } = content;
  const isUser = role === "user"

  return (
    <div ref={ref  as RefObject<HTMLDivElement>} className={`block mt-4 md:mt-6 pb-[7px] clear-both ${isUser ? 'float-right' : 'float-left'}`}>
      <div className="flex justify-end">
        <div className={`talk-bubble${isUser ? ' user' : ''} p-2 md:p-4`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content?.content}
        </ReactMarkdown>
          <div className={`flex justify-end ${isUser ? 'hidden' : ''}`}>
        <button className="flex space-x-2 hover:bg-gray-300 rounded-full p-2 mr-2" onClick={() => {
            console.log('thumbs up clicked');
          }}>
          
          👍
        </button>
        <button className="hover:bg-gray-300 rounded-full p-2" onClick={() => {
            console.log('thumbs down clicked');
          }
        }>
          👎
        </button>
        </div>
        </div>
      </div>
    </div>
  )
})

export default ChatBox;