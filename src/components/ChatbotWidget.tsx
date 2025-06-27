import { useState, useRef, useEffect } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "user", text: input },
      { from: "bot", text: "Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất." },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Nút mở chatbot */}
      {!open && (
        <>
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none"
              aria-label="Mở chatbot"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z"/></svg>
            </button>
            {/* Bong bóng Zalo */}
            <a
              href="https://zalo.me/0983648362"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-400 hover:bg-blue-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all"
              aria-label="Chat Zalo"
            >
              {/* SVG logo Zalo */}
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="24" fill="#008EE6"/>
                <path d="M24 12C17.3726 12 12 16.4772 12 22C12 25.3137 14.6863 28 18 28C18.5523 28 19 28.4477 19 29V32.382C19 32.8881 19.5386 33.2212 19.9706 32.9706L24.4472 30.2764C24.7866 30.0701 25.2134 30.0701 25.5528 30.2764L30.0294 32.9706C30.4614 33.2212 31 32.8881 31 32.382V29C31 28.4477 31.4477 28 32 28C35.3137 28 38 25.3137 38 22C38 16.4772 32.6274 12 26 12H24Z" fill="white"/>
                <text x="24" y="26" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#008EE6" fontFamily="Arial, Helvetica, sans-serif">Zalo</text>
              </svg>
            </a>
            {/* Bong bóng WhatsApp */}
            <a
              href="https://wa.me/84983648362"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-green-500 hover:bg-green-50 rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all"
              aria-label="Chat WhatsApp"
            >
              {/* SVG logo WhatsApp */}
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="24" fill="#25D366"/>
                <path d="M34.6 28.2c-.5-.2-2.9-1.4-3.3-1.6-.4-.2-.7-.2-1 .2-.3.4-1.1 1.6-1.4 1.9-.3.3-.5.4-1 .1-.5-.2-2-0.7-3.8-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-.9.2-.2.4-.5.6-.7.2-.2.2-.4.3-.7.1-.3 0-.5 0-.7 0-.2-.9-2.2-1.2-3-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.5 0 1.5 1.1 3 1.2 3.2.1.2 2.2 3.4 5.3 4.6.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6z" fill="white"/>
              </svg>
            </a>
          </div>
        </>
      )}
      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-blue-500 rounded-t-xl">
            <span className="text-white font-semibold">Chatbot hỗ trợ</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 h-64 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 rounded-b-xl">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r">Gửi</button>
          </form>
        </div>
      )}
    </>
  );
} 