import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchContent } from "@/lib/api";
import Link from "next/link";
import { CONTACT_DETAILS } from "@/config/constants";

const DEFAULT_BLOG_IMAGE = "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=800&auto=format&fit=crop&q=80";

function getSafeBlogImage(item: any): string {
  const img = item?.featuredImage || item?.coverImage;
  if (typeof img === "string" && img.trim().length > 0) {
    return img.trim();
  }
  return DEFAULT_BLOG_IMAGE;
}

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

export async function generateStaticParams() {
  const res = await fetchContent({ type: 'Blog' });
  const blogsData: any[] = Array.isArray(res) ? res : (res?.data || []);
  return blogsData.map((blog: any) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await fetchContent({ type: 'Blog' });
  const blogsData: any[] = Array.isArray(res) ? res : (res?.data || []);
  const blog = blogsData.find((b: any) => b.slug === resolvedParams.slug);
  
  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return {
    title: `${blog.title} | A to I Infra Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const res = await fetchContent({ type: 'Blog' });
  const blogsData: any[] = Array.isArray(res) ? res : (res?.data || []);
  const blog = blogsData.find((b: any) => b.slug === resolvedParams.slug);

  if (!blog) {
    notFound();
  }

  const currentIndex = blogsData.findIndex((b: any) => b.slug === resolvedParams.slug);
  const prevBlog = currentIndex > 0 ? blogsData[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogsData.length - 1 ? blogsData[currentIndex + 1] : null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-36 lg:pt-48 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-[#64748B] mb-10" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <svg className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/blog" className="hover:text-rose-500 transition-colors">Blog</Link>
          <svg className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#0F172A] truncate" aria-current="page">{blog.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Article Content */}
          <article className="w-full lg:w-2/3">
            
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {blog.category}
                </span>
                <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {blog.readTime}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0F172A] mb-8 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-4 text-[#64748B] text-sm pb-8 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-base">{blog.author}</p>
                  <p className="font-medium">{formatPublishDate(blog.publishDate || blog.createdAt || blog.date)}</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-12 shadow-[0_20px_50px_rgb(0,0,0,0.1)] group">
              <img 
                src={getSafeBlogImage(blog)} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
              <div 
                className="prose prose-lg max-w-none font-medium
                           prose-headings:font-serif prose-headings:text-[#0F172A] prose-headings:font-bold
                           prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                           prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                           text-[#0f172a] prose-p:text-[#0f172a] prose-li:text-[#0f172a] prose-strong:text-[#0f172a]
                           prose-p:leading-relaxed prose-p:mb-6
                           prose-a:text-[#0F172A] prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Social Share & Tags */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
                <div className="flex gap-2">
                  <span className="bg-[#F8FAFC] border border-gray-200 text-[#64748B] px-4 py-1.5 rounded-full text-sm font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer">Real Estate</span>
                  <span className="bg-[#F8FAFC] border border-gray-200 text-[#64748B] px-4 py-1.5 rounded-full text-sm font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer">Investment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Share:</span>
                  <button className="w-12 h-12 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Prev/Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {prevBlog ? (
                <Link href={`/blog/${prevBlog.slug}`} className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-xl transition-all group flex flex-col justify-center">
                  <span className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 group-hover:text-blue-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Previous Article
                  </span>
                  <span className="font-serif font-bold text-xl text-[#0F172A] line-clamp-2">{prevBlog.title}</span>
                </Link>
              ) : <div />}
              {nextBlog ? (
                <Link href={`/blog/${nextBlog.slug}`} className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-rose-500 hover:shadow-xl transition-all group flex flex-col justify-center text-right">
                  <span className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2 flex items-center justify-end gap-2 group-hover:text-rose-500">
                    Next Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                  <span className="font-serif font-bold text-xl text-[#0F172A] line-clamp-2">{nextBlog.title}</span>
                </Link>
              ) : <div />}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 space-y-8">
            
            {/* CTA Widget */}
            <div className="bg-[#0F172A] rounded-[2rem] p-8 text-center text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/20 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">Ready to Invest?</h3>
                <p className="text-white/80 text-sm mb-8 font-medium">Get expert advice on the best properties in the market today from our dedicated consultants.</p>
                <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} className="block w-full bg-[#FBBF24] text-[#0F172A] py-4 rounded-xl font-bold hover:bg-[#F59E0B] transition-colors mb-3">
                  Call Now
                </a>
                <Link href="/contact" className="block w-full bg-white/10 border border-white/20 text-white py-4 rounded-xl font-bold hover:bg-white/20 transition-colors">
                  Book Consultation
                </Link>
              </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                Recent Articles
              </h3>
              <div className="space-y-6">
                {blogsData.filter(b => b.slug !== blog.slug).slice(0, 4).map((recentBlog) => (
                  <Link href={`/blog/${recentBlog.slug}`} key={recentBlog.slug} className="group flex gap-5">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img 
                        src={getSafeBlogImage(recentBlog)} 
                        alt={recentBlog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-[#0F172A] text-sm line-clamp-2 group-hover:text-emerald-500 transition-colors mb-2 leading-snug">
                        {recentBlog.title}
                      </h4>
                      <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{recentBlog.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Categories
              </h3>
              <ul className="space-y-3">
                {['Market Trends', 'Investment Guide', 'Infrastructure', 'Legal & Compliance'].map(cat => (
                  <li key={cat}>
                    <Link href="/blog" className="flex justify-between items-center bg-[#F8FAFC] px-5 py-4 rounded-xl border border-transparent hover:border-rose-500/30 hover:bg-white group transition-all">
                      <span className="font-semibold text-[#475569] group-hover:text-rose-500">{cat}</span>
                      <span className="bg-white text-[#64748B] text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-colors">
                        {blogsData.filter((b: any) => b.category === cat).length || 1}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
          </aside>
        </div>
      </div>
    </div>
  );
}
