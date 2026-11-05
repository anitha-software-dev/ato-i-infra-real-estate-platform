import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProperties, fetchPropertyById } from "@/lib/api";
import MapPlaceholder from "@/components/ui/MapPlaceholder";
import Link from "next/link";
import { CONTACT_DETAILS } from "@/config/constants";
import PropertyGallery from "./PropertyGallery";
import PropertyInquiryForm from "./PropertyInquiryForm";

export async function generateStaticParams() {
  try {
    const res = await fetchProperties();
    return (res.data || [])
      .filter((prop: any) => prop && typeof prop.slug === 'string' && prop.slug.trim() !== '')
      .map((prop: any) => ({
        slug: prop.slug,
      }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await fetchPropertyById(resolvedParams.slug);
    const property = res.data;
    if (!property) return { title: "Property Not Found" };
    
    return {
      title: `${property.name} | Premium ${property.type} in ${property.city}`,
      description: property.description,
    };
  } catch (err) {
    return { title: "Property Not Found" };
  }
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let property;
  try {
    const res = await fetchPropertyById(resolvedParams.slug);
    property = res.data;
  } catch (error) {
    notFound();
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-40 lg:pt-48 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-[#64748B] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#FBBF24] transition-colors">Home</Link>
          <svg className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/properties" className="hover:text-[#FBBF24] transition-colors">Properties</Link>
          <svg className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href={`/destinations`} className="hover:text-[#FBBF24] transition-colors">{property.city}</Link>
          <svg className="w-4 h-4 mx-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#0F172A] truncate" aria-current="page">{property.name}</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {property.type}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                property.status === 'Ready_to_Move' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                property.status === 'Under_Construction' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {property.status?.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mb-3 leading-tight">{property.name}</h1>
            <div className="flex items-center text-[#64748B] text-lg">
              <svg className="w-5 h-5 mr-2 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {property.location}, {property.city}
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-1">Starting Price</p>
            <div className="text-4xl font-bold  text-[#0F172A]">{property.priceRange || property.price}</div>
          </div>
        </div>

        {/* Immersive Gallery */}
        <PropertyGallery images={[property.coverImage, ...(property.galleryImages || property.gallery || [])].filter((img: any) => typeof img === 'string' && img.trim() !== '')} />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-rose-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Configuration</span>
                <span className="text-[#0F172A] font-bold mt-1">{property.configurations?.join(', ') || 'N/A'}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Area Range</span>
                <span className="text-[#0F172A] font-bold mt-1">{property.areaRangeSqFt || property.area || 'N/A'}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Property Type</span>
                <span className="text-[#0F172A] font-bold mt-1">{property.type}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <svg className="w-8 h-8 text-amber-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Developer</span>
                <span className="text-[#0F172A] font-bold mt-1">{property.developer?.name || 'Unknown'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6">About {property.name}</h2>
              <p className="text-[#475569] leading-relaxed text-lg whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Key Highlights
              </h2>
              <ul className="space-y-4">
                {(property.highlights || []).map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start bg-[#F8FAFC] p-4 rounded-xl">
                    <svg className="w-6 h-6 text-[#2563EB] mr-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[#0F172A] font-medium leading-relaxed">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-8">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {(property.amenities || []).map((amenity: string, index: number) => (
                  <div key={index} className="flex flex-col items-center text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/5 text-[#2563EB] flex items-center justify-center mb-4 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-[#0F172A]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-6">Location Map</h2>
              <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.name + ", " + property.location + ", " + property.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${property.name} Location Map`}
                />
              </div>
            </div>

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Contact Card with API integration */}
              <PropertyInquiryForm property={property} />

              {/* Similar Properties Promo */}
              <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FBBF24]/20 rounded-full blur-2xl" />
                <h4 className="text-xl font-bold mb-3">Looking for Similar Properties?</h4>
                <p className="text-white/70 text-sm mb-6">Our experts can share curated options matching your requirements in {property.city}.</p>
                <Link href="/properties" className="block text-center border-2 border-white/20 hover:bg-white hover:text-[#0F172A] py-3 rounded-xl font-bold transition-colors text-sm">
                  View {property.type} Projects
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
