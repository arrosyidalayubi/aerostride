import { Star } from 'lucide-react';

// Data simulasi ulasan pelanggan
const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: "Rizky Firmansyah",
    role: "Daily Commuter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    review: "Solnya gigit banget pas nahan motor Aerox di jalanan basah. Dipakai kerja harian menembus rute macet Tangerang Selatan, kaki tetap kering 100% meski kena hujan deras.",
  },
  {
    id: 2,
    name: "Aditya Pratama",
    role: "Mahasiswa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    review: "Desainnya minimalis. Transisi dari bawa motor ke kelas pas ngampus jadi lebih praktis. Nggak perlu lagi sedia jas hujan sepatu atau sandal jepit di jok motor.",
  },
  {
    id: 3,
    name: "Dina Karmila",
    role: "Urban Worker",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    review: "Awalnya ragu soal sirkulasi udara karena klaimnya waterproof. Tapi ternyata breathable banget. Dipakai jalan dari stasiun KRL ke kantor kaki nggak bau dan nggak pegal.",
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
            TER-UJI DI JALANAN.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            Jangan hanya percaya kata kami. Dengarkan dari mereka yang sudah merasakan ketangguhan AeroStride setiap hari.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 min-h-30">
                "{testimonial.review}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}