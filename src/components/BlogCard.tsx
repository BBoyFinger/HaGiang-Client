import { Blog } from "@/types/BlogType";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaCalendar, FaTag, FaArrowRight, FaEye, FaHeart, FaClock } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

export default function BlogCard({ blog }: { blog: any }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const getTimeAgo = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };
  // Lấy tags theo ngôn ngữ
  const tagsArr = blog.tags && blog.tags[lang] ? blog.tags[lang] : (blog.tags?.vi || []);
  return (
    <div className="blog-card bg-light rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-earth group">
      {/* Image Container */}
      <div className="blog-image-container relative h-56 overflow-hidden">
        <img 
          src={blog.thumbnail} 
          alt={blog.title?.[lang] || blog.title?.vi || ''} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-light/95 text-[#1a1a1a] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {tagsArr[0]}
          </span>
        </div>

        {/* Stats */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-2">
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <FaEye className="text-xs" />
              <span>1.2k</span>
            </div>
            <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <FaHeart className="text-xs" />
              <span>89</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author and Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <FaUser className="text-[#1a1a1a] text-xs" />
            </div>
            <span className="text-sm font-medium text-[#1a1a1a]">{blog.author}</span>
          </div>
          <div className="flex items-center space-x-1 text-[#555]">
            <FaClock className="text-xs" />
            <span className="text-xs">{getTimeAgo(blog.createdAt || blog.createdDate)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {blog.title?.[lang] || blog.title?.vi || ''}
        </h3>

        {/* Content */}
        <p className="text-[#555] text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.content?.[lang] || blog.content?.vi || ''}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tagsArr.slice(0, 2).map((tag: string, index: number) => (
            <span 
              key={index} 
              className="bg-secondary/20 text-[#1a1a1a] px-2 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {tagsArr.length > 2 && (
            <span className="bg-accent/20 text-[#555] px-2 py-1 rounded-full text-xs">
              +{tagsArr.length - 2}
            </span>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/blogs/${blog.slug}`}
          className="w-full bg-gradient-to-r from-primary to-accent text-[#1a1a1a] py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-between hover:from-accent hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span>{t('blog.readMore')}</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
} 