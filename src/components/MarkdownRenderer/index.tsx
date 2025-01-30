import ReactMarkdown from "react-markdown";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { sanitizeUri } from "micromark-util-sanitize-uri";
import MarkdownImage from "./MarkdownImage";
import { LinkExternal } from "../ui/link";
import MarkdownImageServer from "./MarkdownImageServer";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeUnwrapImages]}
      urlTransform={(url) => {
        const protocolSanitized = sanitizeUri(
          url,
          /^(https?|ircs?|mailto|xmpp)$/i,
        );
        const dataProtocol = sanitizeUri(url, /^data$/i);
        const dataProtocolSanitized = /^data:image\/png/.test(dataProtocol)
          ? dataProtocol
          : "";
        return protocolSanitized != ""
          ? protocolSanitized
          : dataProtocolSanitized;
      }}
      components={{
        a: (props) => (
          <LinkExternal className="text-semantic-accent" {...props} />
        ),
        h1: ({ children }) => <h2 className="pt-4 heading-4">{children}</h2>,
        h2: ({ children }) => <h3 className="pt-2 heading-5">{children}</h3>,
        h3: ({ children }) => <h4 className="pt-2 heading-6">{children}</h4>,
        blockquote: (props) => (
          <blockquote className="border-l-2 pl-2" {...props} />
        ),
        img: (props) => <MarkdownImageServer src={props.src} alt={props.alt} />,
        code: (props) => (
          <code
            className="flex max-w-full overflow-x-auto rounded-md bg-background-ternary p-2 scrollbar-thin"
            {...props}
          />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
