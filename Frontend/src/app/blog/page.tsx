import { Metadata } from "next";
import Link from "next/link";
import { fetchContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog & Insights | A to I Infra",
  description: "Latest real estate news, market trends, and investment guides.",
};

function formatPublishDate(dateVal?: string | Date) {
  if (!dateVal) return "";
  try {
    return new Date(dateVal).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return String(dateVal);
  }
}

export default async function BlogPage() {
  const res = await fetchContent({ type: 'Blog' });
  const blogsData: any[] = Array.isArray(res) ? res : (res?.data || []);
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#0F172A] py-24 pt-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-[#0F172A]/80 to-[#0F172A]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-xl">
            Insights & News
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Real Estate Insights
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            News, trends, and expert advice for property investors navigating the Indian real estate market.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogsData.map((blog, i) => {
            const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
            const hoverColors = ["group-hover:text-blue-600", "group-hover:text-emerald-600", "group-hover:text-amber-600", "group-hover:text-rose-600"];
            return (
            <article key={blog.slug} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{ backgroundImage: `url(${blog.featuredImage})` }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-[#64748B] mb-3">
                  <span>{formatPublishDate(blog.publishDate || blog.createdAt || blog.date)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className={`${textColors[i % 4]} font-medium`}>{blog.category}</span>
                </div>
                <h2 className={`text-xl font-bold text-[#0F172A] mb-3 ${hoverColors[i % 4]} transition-colors`}>
                  {blog.title}
                </h2>
                <p className="text-[#64748B] text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                <Link href={`/blog/${blog.slug}`} className={`${textColors[i % 4]} font-medium text-sm hover:underline mt-auto`}>
                  Read Article →
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
