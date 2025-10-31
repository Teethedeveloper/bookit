import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredExperiences = experiences?.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      {/* Header/Hero Section */}
      <header className="fixed top-0 left-0 right-0 h-[87px] bg-[#F9F9F9] shadow-[0px_2px_16px_rgba(0,0,0,0.1)] z-50">
        <nav className="flex justify-between items-center px-[124px] h-full max-w-[1440px] mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.svg" alt="Booking Hero" className="h-8" />
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4 w-[443px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C6C6C] w-5 h-5" />
              <Input
                placeholder="Search experiences or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-[42px] bg-white border border-[#D6D6D6] rounded-lg"
              />
            </div>
            <Button className="h-[42px] bg-[#FFD643] text-[#161616] hover:bg-[#FFE063] font-medium">
              Search
            </Button>
          </div>
        </nav>
      </header>

      {/* Experiences Grid */}
      <section className="max-w-[1440px] mx-auto px-[124px] pt-[120px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[280px] h-[312px] rounded-xl bg-[#F0F0F0] animate-pulse">
                <div className="h-[170px] bg-[#D6D6D6] rounded-t-xl" />
                <div className="p-4 space-y-4">
                  <div className="h-6 bg-[#D6D6D6] rounded w-3/4" />
                  <div className="h-4 bg-[#D6D6D6] rounded w-1/2" />
                  <div className="h-4 bg-[#D6D6D6] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperiences?.map((experience) => (
              <article
                key={experience.id}
                className="w-[280px] rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate(`/experience/${experience.id}`)}
              >
                <div className="relative h-[170px]">
                  <img
                    src={experience.image_url}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4 bg-[#F0F0F0]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-base font-medium text-[#161616] line-clamp-1">
                      {experience.title}
                    </h3>
                    <Badge className="bg-[#D6D6D6] text-[11px] font-medium text-[#161616] px-2 py-1 rounded">
                      {experience.location}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-[#6C6C6C] line-clamp-2 mb-5 h-8">
                    {experience.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-[20px] font-medium text-[#161616]">
                      ₹{experience.price}
                    </div>
                    <Button
                      className="h-[30px] px-4 bg-[#FFD643] hover:bg-[#FFE063] text-[14px] font-medium text-[#161616]"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredExperiences?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-[#6C6C6C]">
              No experiences found. Try a different search term.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Index;
