import BlogCard from "@/components/BlogCard";
import { Blog as BlogType } from "@/types/BlogType";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";

const blogs: BlogType[] = [
  {
    id: "1",
    title: "Khám phá Hà Giang mùa hoa tam giác mạch",
    slug: "kham-pha-ha-giang-mua-hoa-tam-giac-mach",
    content: "Hà Giang mùa hoa tam giác mạch là một trải nghiệm không thể bỏ lỡ...",
    tags: "Hà Giang,Du lịch,Phong cảnh",
    author: "Nguyễn Văn A",
    thumbnail: "src/assets/1.jpg",
    createdDate: new Date("2024-05-01"),
  },
  {
    id: "2",
    title: "Hành trình chinh phục đèo Mã Pí Lèng",
    slug: "hanh-trinh-chinh-phuc-deo-ma-pi-leng",
    content: "Đèo Mã Pí Lèng là một trong tứ đại đỉnh đèo của Việt Nam...",
    tags: "Đèo,Phượt,Trải nghiệm",
    author: "Trần Thị B",
    thumbnail: "src/assets/2.png",
    createdDate: new Date("2024-04-20"),
  },
];

function Blog() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('blog.title')}</title>
        <meta name="description" content={t('blog.description')} />
        <meta property="og:title" content={t('blog.title')} />
        <meta property="og:description" content={t('blog.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hagiangtravel.vn/blog" />
        <meta property="og:image" content="https://hagiangtravel.vn/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('blog.title')} />
        <meta name="twitter:description" content={t('blog.description')} />
        <meta name="twitter:image" content="https://hagiangtravel.vn/og-image.jpg" />
      </Helmet>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Blog Du Lịch Hà Giang</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Blog;