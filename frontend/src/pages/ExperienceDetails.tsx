import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/api";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users } from "lucide-react";

type Experience = Tables<'experiences'>;
type Slot = Tables<'slots'>;

const ExperienceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [numPeople, setNumPeople] = useState<number>(1);

  const { data: experience, isLoading: expLoading } = useQuery({
    queryKey: ["experience", id],
    queryFn: async (): Promise<Experience | null> => {
      const res = await fetch(`${API_ENDPOINTS.experiences}/${id}`);
      if (!res.ok) throw new Error(`Failed to load experience: ${res.statusText}`);
      return (await res.json()) as Experience;
    },
    enabled: !!id,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ["slots", id],
    queryFn: async (): Promise<Slot[] | null> => {
      const res = await fetch(`${API_ENDPOINTS.experiences}/${id}/slots`);
      if (!res.ok) throw new Error(`Failed to load slots: ${res.statusText}`);
      return (await res.json()) as Slot[];
    },
    enabled: !!id,
  });

  const grouped = (slots || []).reduce<Record<string, Slot[]>>((acc, s) => {
    acc[s.date] = acc[s.date] || [];
    acc[s.date].push(s);
    return acc;
  }, {});

  if (expLoading || slotsLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <section className="text-center">
          <h2 className="text-2xl font-medium text-[#161616]">Experience not found</h2>
          <Button onClick={() => navigate("/")} className="mt-4">Back</Button>
        </section>
      </main>
    );
  }

  const selectedSlotObj = (slots || []).find((s) => s.id === selectedSlot) || null;

  const basePrice = Number(experience.price || 0) * numPeople;
  const taxes = +(basePrice * 0.0).toFixed(2); // placeholder, 0% in Figma
  const total = +(basePrice + taxes).toFixed(2);

  return (
    <main className="bg-[#F9F9F9] min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16 grid lg:grid-cols-3 gap-8">
        {/* Left: Image + Info */}
        <section className="lg:col-span-2 space-y-6">
          <article className="relative">
            <img
              src={experience.image_url}
              alt={experience.title}
              className="w-full max-h-[420px] object-cover rounded-lg shadow-sm"
            />
          </article>

          <article className="bg-transparent">
            <header className="mb-4">
              <h1 className="text-2xl font-medium text-[#161616]">{experience.title}</h1>
              <p className="mt-2 text-base text-[#6C6C6C]">{experience.location} • {experience.duration}</p>
            </header>

            <div className="space-y-6">
              {/* Dates */}
              <div>
                <h3 className="text-lg font-medium text-[#161616] mb-2">Choose a date</h3>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(grouped).length === 0 && (
                    <p className="text-sm text-[#838383]">No dates available</p>
                  )}
                  {Object.keys(grouped).map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedSlot(grouped[date][0]?.id ?? null)}
                      className="px-3 h-9 rounded-md text-sm font-normal flex items-center justify-center bg-white border border-gray-300 text-[#161616] hover:shadow"
                      aria-pressed={selectedSlot === grouped[date][0]?.id}
                    >
                      {format(new Date(date), "MMM d")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Times */}
              <div>
                <h3 className="text-lg font-medium text-[#161616] mb-2">Available times</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(slots || []).map((slot) => {
                    const isSoldOut = slot.available_slots === 0;
                    const isSelected = selectedSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        disabled={isSoldOut}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`h-9 rounded-md text-sm font-normal flex items-center justify-center
                          ${isSoldOut ? "bg-gray-200 text-[#838383] opacity-60 cursor-not-allowed" : isSelected ? "bg-[#FFD643] text-[#161616]" : "bg-white text-[#161616] border border-gray-300 hover:shadow"}`}
                        aria-pressed={isSelected}
                        aria-label={`Time ${slot.time} - ${slot.available_slots} spots`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* About */}
              <section aria-labelledby="about-label">
                <h4 id="about-label" className="text-base font-medium text-[#161616]">About</h4>
                <p className="text-xs text-[#838383] mt-2">{experience.description}</p>
              </section>
            </div>
          </article>
        </section>

        {/* Right: Booking Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-[#EFEFEF] rounded-lg p-6 w-full">
            <header className="mb-4">
              <h3 className="text-lg font-medium text-[#161616]">Booking Summary</h3>
              <p className="text-sm text-[#838383] mt-1">Price per person</p>
              <div className="text-2xl font-semibold text-[#161616] mt-2">${experience.price}</div>
            </header>

            <div className="space-y-4">
              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#838383]">Quantity</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      aria-label="Decrease"
                      onClick={() => setNumPeople((n) => Math.max(1, n - 1))}
                      className="px-3 py-2 bg-white border-r"
                    >
                      −
                    </button>
                    <div className="px-4 py-2 bg-white text-sm">{numPeople}</div>
                    <button
                      aria-label="Increase"
                      onClick={() => {
                        if (selectedSlotObj) {
                          setNumPeople((n) => Math.min(selectedSlotObj.available_slots, n + 1));
                        } else {
                          setNumPeople((n) => n + 1);
                        }
                      }}
                      className="px-3 py-2 bg-white border-l"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#161616]">
                  <Users className="w-4 h-4 text-[#161616]" />
                </div>
              </div>

              <div className="flex justify-between text-sm text-[#838383]">
                <span>Subtotal</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#838383]">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-base font-medium text-[#161616]">Total</span>
                <span className="text-base font-semibold text-[#161616]">${total.toFixed(2)}</span>
              </div>

              <div>
                <Button
                  className="w-full mt-4 bg-[#D7D7D7] text-[#7F7F7F] hover:bg-[#d7d7d7]"
                  onClick={() => {
                    if (!selectedSlot) return;
                    navigate(`/checkout?experienceId=${experience.id}&slotId=${selectedSlot}&numPeople=${numPeople}`);
                  }}
                  disabled={!selectedSlot}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ExperienceDetails;

