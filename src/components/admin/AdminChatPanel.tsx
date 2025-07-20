import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:5000";

interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

interface Message {
    _id: string;
    from: string;
    to: string;
    content: string;
    createdAt: string;
}

export default function AdminChatPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [admin, setAdmin] = useState<User | null>(null);

    // Lấy admin info
    useEffect(() => {
        axios.get("/api/users/admin").then(res => setAdmin(res.data.admin));
    }, []);

    // Lấy danh sách user đã chat (từ message collection)
    useEffect(() => {
        axios.get("/api/messages/users").then(res => setUsers(res.data?.users || []));
    }, []);

    // Kết nối socket khi có admin
    useEffect(() => {
        if (admin?._id) {
            const s = io(SOCKET_URL, { transports: ["websocket"] });
            setSocket(s);
            s.emit("join", admin._id);
            s.on("receive_message", (msg: Message) => {
                if (selectedUser && (msg.from === selectedUser._id || msg.to === selectedUser._id)) {
                    setMessages(prev => [...prev, msg]);
                }
            });
            return () => {
                s.disconnect();
            };
        }
        // Không return gì ở đây (tức là return void)
    }, [admin, selectedUser]);

    // Lấy lịch sử chat khi chọn user
    useEffect(() => {
        if (selectedUser && admin?._id) {
            axios.get(`/api/users/chat/${selectedUser._id}`).then(res => setMessages(res.data));
        }
    }, [selectedUser, admin]);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !admin?._id || !selectedUser?._id) return;
        socket?.emit("send_message", {
            from: admin._id,
            to: selectedUser._id,
            content: input,
        });
        setInput("");
    };

    return (
        <div className="flex h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Sidebar user list */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-2 overflow-y-auto">
                <h3 className="font-bold text-lg mb-2">Khách hàng</h3>
                {(users && users.length === 0) && <div className="text-gray-400">Chưa có user nào chat</div>}
                {users && users.map(u => (
                    <div
                        key={u._id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-100 ${selectedUser?._id === u._id ? "bg-blue-200" : ""}`}
                        onClick={() => setSelectedUser(u)}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
                            {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full" /> : u.name?.[0]}
                        </div>
                        <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Chat panel */}
            <div className="flex-1 flex flex-col">
                <div className="border-b border-gray-200 p-3 bg-blue-50">
                    <span className="font-semibold">{selectedUser ? selectedUser.name : "Chọn khách hàng để chat"}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.from === admin?._id ? "justify-end" : "justify-start"}`}>
                            <div className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow ${msg.from === admin?._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                                <div>{msg.content}</div>
                                <div className="text-xs text-right mt-1 opacity-60">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ""}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                {selectedUser && (
                    <form onSubmit={handleSend} className="flex border-t border-gray-200 p-2 bg-white">
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 rounded-l border border-gray-300 focus:outline-none"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r">Gửi</button>
                    </form>
                )}
            </div>
        </div>
    );
} 