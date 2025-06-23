import { useParams } from "react-router-dom";
import { useState } from "react";
import { Blog as BlogType } from "@/types/BlogType";

const blogs: BlogType[] = [
  {
    id: "1",
    title: "Khám phá Hà Giang mùa hoa tam giác mạch",
    slug: "kham-pha-ha-giang-mua-hoa-tam-giac-mach",
    content: "Hà Giang mùa hoa tam giác mạch là một trải nghiệm không thể bỏ lỡ...",
    tags: "Hà Giang,Du lịch,Phong cảnh",
    author: "Nguyễn Văn A",
    thumbnail: "/src/assets/1.jpg",
    createdDate: new Date("2024-05-01"),
  },
  {
    id: "2",
    title: "Hành trình chinh phục đèo Mã Pí Lèng",
    slug: "hanh-trinh-chinh-phuc-deo-ma-pi-leng",
    content: "Đèo Mã Pí Lèng là một trong tứ đại đỉnh đèo của Việt Nam...",
    tags: "Đèo,Phượt,Trải nghiệm",
    author: "Trần Thị B",
    thumbnail: "/src/assets/2.png",
    createdDate: new Date("2024-04-20"),
  },
];

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "Minh",
    content: "Bài viết rất hay và hữu ích!",
    createdAt: new Date("2024-06-01T10:00:00"),
  },
  {
    id: "c2",
    author: "Lan",
    content: "Cảm ơn bạn đã chia sẻ kinh nghiệm du lịch Hà Giang.",
    createdAt: new Date("2024-06-02T14:30:00"),
  },
];

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const blog = blogs.find((b) => b.slug === slug);

  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  if (!blog) return <div className="text-center py-10">Không tìm thấy bài viết.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setComments([
      {
        id: Math.random().toString(36).slice(2),
        author,
        content,
        createdAt: new Date(),
      },
      ...comments,
    ]);
    setAuthor("");
    setContent("");
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        <span className="font-semibold">Tác giả:</span> {blog.author} | {new Date(blog.createdDate).toLocaleDateString()}
      </div>
      <div className="flex flex-wrap gap-2 text-xs mb-4">
        {blog.tags.split(",").map((tag) => (
          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag.trim()}</span>
        ))}
      </div>
      <div className="text-base text-gray-800 dark:text-gray-200 whitespace-pre-line mb-10">
        {blog.content}
      </div>

      {/* Comment Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Bình luận</h2>
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <input
            type="text"
            placeholder="Tên của bạn"
            className="w-full mb-2 p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          />
          <textarea
            placeholder="Nội dung bình luận"
            className="w-full mb-2 p-2 rounded border border-gray-300 dark:bg-gray-700 dark:text-white"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Gửi bình luận
          </button>
        </form>
        <div className="space-y-4">
          {comments.length === 0 && <div className="text-gray-500">Chưa có bình luận nào.</div>}
          {comments.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-700 p-4 rounded shadow">
              <div className="font-semibold text-blue-600 mb-1">{c.author}</div>
              <div className="text-gray-700 dark:text-gray-200 mb-1">{c.content}</div>
              <div className="text-xs text-gray-400">{c.createdAt.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 