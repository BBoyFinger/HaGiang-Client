import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const SOCKET_URL = "http://localhost:5000";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Lấy adminId khi mở chat
  useEffect(() => {
    if (open) {
      axios.get('/api/users/admin').then(res => {
        setAdminId(res.data?.admin?._id || null);
      }).catch(() => setAdminId(null));
    }
  }, [open]);

  // Kết nối socket khi mở chat và có userId
  useEffect(() => {
    if (open && user?._id) {
      const s = io(SOCKET_URL, { transports: ["websocket"] });
      setSocket(s);
      s.on("connect", () => {
        console.log("Socket connected!", s.id);
      });
      s.emit("join", user._id);
      s.on("receive_message", (msg: any) => {
        setMessages(prev => {
          // Tránh lặp tin nhắn nếu đã có (so sánh createdAt + content)
          if (prev.some(m => m.createdAt === msg.createdAt && m.content === msg.content && m.from === msg.from)) {
            return prev;
          }
          return [...prev, msg];
        });
      });
      return () => {
        s.disconnect();
      };
    }
  }, [open, user?._id]);

  // Lấy lịch sử chat khi mở
  useEffect(() => {
    if (open && user?._id) {
      setLoading(true);
      axios.get(`/api/users/chat/${user._id}`).then(res => {
        let msgs = Array.isArray(res.data) ? res.data : [];
        // Nếu chưa có tin nhắn chào, thêm vào đầu mảng
        if (!msgs.length || (msgs[0]?.from !== 'bot' && msgs[0]?.from !== 'system')) {
          msgs = [{ from: 'bot', content: 'Xin chào! Bạn cần hỗ trợ gì?', createdAt: new Date().toISOString() }, ...msgs];
        }
        setMessages(msgs);
        setLoading(false);
      }).catch(() => {
        setMessages([{ from: 'bot', content: 'Xin chào! Bạn cần hỗ trợ gì?', createdAt: new Date().toISOString() }]);
        setLoading(false);
      });
    }
  }, [open, user?._id]);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?._id || !adminId || !socket) return;
    const newMsg = {
      from: user._id,
      to: adminId,
      content: input,
      createdAt: new Date().toISOString(),
    };
    // Optimistic update: thêm tin nhắn vào state ngay
    setMessages(prev => [...prev, newMsg]);
    socket.emit("send_message", newMsg);
    setInput("");
  };

  // Hàm mở Zalo
  const openZalo = () => {
    window.open('https://zalo.me/84983648362', '_blank');
  };

  // Hàm mở Messenger
  const openMessenger = () => {
    window.open('https://m.me/homietravel42', '_blank');
  };

  // Nếu chưa đăng nhập, cho phép chat với bot ảo, nhưng khi gửi tin nhắn sẽ hiện thông báo cần đăng nhập
  if (!user?._id) {
    return (
      <>
        {!open && (
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Nút Zalo */}
            <button
              onClick={openZalo}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Chat Zalo"
              title="Chat Zalo"
            >
              <SiZalo size={24} />
            </button>
            
            {/* Nút Messenger */}
            <button
              onClick={openMessenger}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Chat Messenger"
              title="Chat Messenger"
            >
              <FaFacebookMessenger size={24} />
            </button>
            
            {/* Nút Chatbot */}
            <button
              onClick={() => setOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
              aria-label="Mở chat"
              title="Chat với chúng tôi"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z" /></svg>
            </button>
          </div>
        )}
        {open && (
          <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-green-500 rounded-t-xl">
              <span className="text-white font-semibold">{t('common.supportChat') || 'Support Chat'}</span>
              <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 h-64 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  Xin chào! Bạn cần hỗ trợ gì?
                </div>
              </div>
            </div>
            <form onSubmit={e => { e.preventDefault(); alert('Bạn cần đăng nhập để chat với admin!'); }} className="flex border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 rounded-b-xl">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none"
                placeholder={t('common.inputMessage') || 'Nhập tin nhắn...'}
              />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r">{t('common.send') || 'Gửi'}</button>
            </form>
          </div>
        )}
      </>
    );
  }

  // Giao diện chat
  return (
    <>
      {/* Nút mở chatbot */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
          {/* Nút Zalo */}
          <button
            onClick={openZalo}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Chat Zalo"
            title="Chat Zalo"
          >
            <SiZalo size={24} />
          </button>
          
          {/* Nút Messenger */}
          <button
            onClick={openMessenger}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Chat Messenger"
            title="Chat Messenger"
          >
            <FaFacebookMessenger size={24} />
          </button>
          
          {/* Nút Chatbot */}
          <button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none transition-all duration-300 hover:scale-110"
            aria-label="Mở chat"
            title="Chat với chúng tôi"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.92 2 10.5c0 2.54 1.54 4.81 4 6.32V22l4.29-2.15c.56.08 1.13.13 1.71.13 5.52 0 10-3.92 10-8.5S17.52 2 12 2Z" /></svg>
          </button>
        </div>
      )}
      {/* Khung chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-green-500 rounded-t-xl">
            <span className="text-white font-semibold">{t('common.supportChat') || 'Support Chat'}</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 h-64 bg-gray-50 dark:bg-gray-900">
            {loading ? (
              <div className="text-center text-gray-400">Đang tải...</div>
            ) : (
              Array.isArray(messages) && messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === user._id ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow ${msg.from === user._id ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                    <div>{msg.content}</div>
                    <div className="text-xs text-right mt-1 opacity-60">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 rounded-b-xl">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-l border border-gray-300 dark:bg-gray-700 dark:text-white focus:outline-none"
              placeholder={t('common.inputMessage') || 'Nhập tin nhắn...'}
              value={input}
              onChange={e => setInput(e.target.value)}

            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r" disabled={loading}>{t('common.send') || 'Gửi'}</button>
          </form>
        </div>
      )}
    </>
  );
} 