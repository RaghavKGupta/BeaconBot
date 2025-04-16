import { forwardRef, JSXElementConstructor, RefObject, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBox: JSXElementConstructor<any> = forwardRef(function ChatBox({ content }, ref) {
  const { role } = content;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide tooltip after 2s
  };

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={`block mt-4 md:mt-6 pb-[7px] clear-both ${isUser ? "float-right" : "float-left"
        }`}
    >
      <div className="flex justify-end">
        <div className={`talk-bubble${isUser ? " user" : ""} p-2 md:p-4`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content?.content}
          </ReactMarkdown>
          {!isUser && (
            <>
              <p className="text-[11px] text-gray-500 mt-1">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>

              <div className="flex justify-end items-center gap-2 mt-2 relative">
                <button
                  className="text-xs text-blue-600 relative hover:bg-gray-300 rounded-full p-2"
                  onClick={handleCopy}
                >
                  Copy
                </button>

                {copied && (
                  <span className="absolute -top-6 right-0 bg-black text-white text-xs px-2 py-1 rounded-md shadow-md">
                    Copied!
                  </span>
                )}

                <button
                  className="hover:bg-gray-300 rounded-full p-2"
                  onClick={() => {
                    console.log("thumbs up clicked");
                  }}
                >
                  👍
                </button>
                <button
                  className="hover:bg-gray-300 rounded-full p-2"
                  onClick={() => {
                    console.log("thumbs down clicked");
                  }}
                >
                  👎
                </button>
              </div>
            </>
          )}


        </div>
      </div>
    </div>
  );
});

export default ChatBox;
