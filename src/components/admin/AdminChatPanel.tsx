import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

// const SOCKET_URL = "https://hagiangtravel.onrender.com";
const SOCKET_URL = "http://localhost:5000";


// Lấy SOCKET_URL từ env

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
    const [loading, setLoading] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});

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
            const s = io(SOCKET_URL, { 
                transports: ["websocket"],
                timeout: 10000
            });
            setSocket(s);
            
            s.on("connect", () => {
                console.log("✅ Admin socket connected:", s.id);
                s.emit("join", admin._id);
            });
            
            s.on("connect_error", (error) => {
                console.error("❌ Admin socket connection error:", error);
            });
            
            s.on("receive_message", (msg: Message) => {
                console.log("📨 Admin received message:", msg);
                if (selectedUser && (msg.from === selectedUser._id || msg.to === selectedUser._id)) {
                    setMessages(prev => [...prev, msg]);
                }
                // Update unread count for other users
                if (msg.from !== admin._id && msg.to === admin._id) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [msg.from]: (prev[msg.from] || 0) + 1
                    }));
                }
            });
            
            s.on("message_error", (error) => {
                console.error("❌ Message error:", error);
                alert("Lỗi gửi tin nhắn. Vui lòng thử lại!");
            });
            
            s.on("user_online", (userId: string) => {
                console.log("🟢 User online:", userId);
            });
            
            s.on("user_offline", (userId: string) => {
                console.log("🔴 User offline:", userId);
            });
            
            return () => {
                s.disconnect();
            };
        }
    }, [admin, selectedUser]);

    // Lấy lịch sử chat khi chọn user
    useEffect(() => {
        if (selectedUser && admin?._id) {
            setLoading(true);
            axios.get(`/api/users/chat/${selectedUser._id}`).then(res => {
                setMessages(res.data);
                setLoading(false);
            }).catch(() => {
                setMessages([]);
                setLoading(false);
            });
        }
    }, [selectedUser, admin]);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        // Nếu không có admin, thử lấy lại
        if (!admin?._id) {
            axios.get("/api/users/admin").then(res => {
                const adminData = res.data.admin;
                if (adminData && selectedUser?._id && socket) {
                    const newMsg: Message = {
                        _id: Date.now().toString(),
                        from: adminData._id,
                        to: selectedUser._id,
                        content: input,
                        createdAt: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, newMsg]);
                    socket.emit("send_message", {
                        from: adminData._id,
                        to: selectedUser._id,
                        content: input,
                        createdAt: new Date().toISOString(),
                    });
                    setInput("");
                }
            }).catch(() => {
                alert('Không thể kết nối với server!');
            });
            return;
        }
        
        // Nếu không có user được chọn
        if (!selectedUser?._id) {
            alert('Vui lòng chọn khách hàng để chat!');
            return;
        }
        
        // Nếu không có socket
        if (!socket) {
            alert('Đang kết nối lại...');
            return;
        }
        
        const newMsg: Message = {
            _id: Date.now().toString(), // Temporary ID for optimistic update
            from: admin._id,
            to: selectedUser._id,
            content: input,
            createdAt: new Date().toISOString(),
        };
        
        // Optimistic update
        setMessages(prev => [...prev, newMsg]);
        socket.emit("send_message", {
            from: admin._id,
            to: selectedUser._id,
            content: input,
            createdAt: new Date().toISOString(),
        });
        setInput("");
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        // Reset unread count for this user
        setUnreadCounts(prev => ({
            ...prev,
            [user._id]: 0
        }));
    };

    return (
        <div className="flex h-[600px] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Sidebar user list */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-800">💬 Khách hàng</h3>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {users.length} online
                    </span>
                </div>
                
                {users.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-6xl mb-2">💭</div>
                        <div className="text-gray-500">Chưa có khách hàng nào chat</div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users.map(u => (
                            <div
                                key={u._id}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                                    selectedUser?._id === u._id ? "bg-blue-100 border-l-4 border-blue-500" : ""
                                }`}
                                onClick={() => handleUserSelect(u)}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                        {u.avatarUrl ? (
                                            <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            u.name?.[0]?.toUpperCase() || '?'
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{u.name}</div>
                                    <div className="text-sm text-gray-500 truncate">{u.email}</div>
                                    {unreadCounts[u._id] > 0 && (
                                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mt-1 inline-block">
                                            {unreadCounts[u._id]} tin nhắn mới
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Chat panel */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                                    {selectedUser.avatarUrl ? (
                                        <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        selectedUser.name?.[0]?.toUpperCase() || '?'
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{selectedUser.name}</div>
                                    <div className="text-sm opacity-90">{selectedUser.email}</div>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-sm">Online</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <div className="text-gray-500">Đang tải tin nhắn...</div>
                                    </div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-4xl mb-2">💬</div>
                                    <div className="text-gray-500">Bắt đầu cuộc trò chuyện với {selectedUser.name}</div>
                                </div>
                            ) : (
                                messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.from === admin?._id ? "justify-end" : "justify-start"}`}>
                                        <div className={`px-4 py-3 rounded-2xl max-w-[70%] shadow-sm ${
                                            msg.from === admin?._id 
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" 
                                                : "bg-white text-gray-900 border border-gray-200"
                                        }`}>
                                            <div className="text-sm leading-relaxed">{msg.content}</div>
                                            <div className={`text-xs mt-2 ${msg.from === admin?._id ? "text-blue-100" : "text-gray-500"}`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit'
                                                }) : ""}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        
                        {/* Input */}
                        <form onSubmit={handleSend} className="border-t border-gray-200 p-4 bg-white">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tin nhắn..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                />
                                                                 <button 
                                     type="submit" 
                                     className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                 >
                                    Gửi
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">💬</div>
                            <div className="text-xl font-semibold text-gray-600 mb-2">Chọn khách hàng để chat</div>
                            <div className="text-gray-500">Chọn một khách hàng từ danh sách bên trái để bắt đầu cuộc trò chuyện</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 