import { Blog } from "@/types/BlogType";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
    >
      <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">{blog.title}</h3>
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-semibold">Tác giả:</span> {blog.author} | {new Date(blog.createdDate).toLocaleDateString()}
        </div>
        <div className="flex flex-wrap gap-2 text-xs mb-2">
          {blog.tags.split(",").map((tag) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{tag.trim()}</span>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">{blog.content}</p>
        <Link
          to={`/blogs/${blog.slug}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors mt-2 inline-block"
        >
          Đọc tiếp
        </Link>
      </div>
    </motion.div>
  );
} 