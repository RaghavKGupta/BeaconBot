import Link from "next/link";
import {forwardRef, JSXElementConstructor, useMemo, RefObject} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Bubble:JSXElementConstructor<any> = forwardRef(function Bubble({ content }, ref) {
  const { role } = content;
  const isUser = role === "user"

  return (
    <div ref={ref  as RefObject<HTMLDivElement>} className={`block mt-4 md:mt-6 pb-[7px] clear-both ${isUser ? 'float-right' : 'float-left'}`}>
      <div className="flex justify-end">
        <div className={`talk-bubble${isUser ? ' user' : ''} p-2 md:p-4`}>
          {content.processing ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="dot-flashing" />
            </div>
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, children, ...props }) {
                  return (
                    <code {...props}>
                       {children}
                   </code>
                   )
                }
              }}
            >
              {content?.content}
            </Markdown>
          )}
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.730278 0.921112C-3.49587 0.921112 12 0.921112 12 0.921112V5.67376C12 6.8181 9.9396 7.23093 9.31641 6.27116C6.83775 2.45382 3.72507 0.921112 0.730278 0.921112Z" />
          </svg>
        </div>
      </div>
    </div>
  )
})

export default Bubble;