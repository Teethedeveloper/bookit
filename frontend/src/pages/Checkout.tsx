import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/api";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Clock, Calendar, Tag, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type FormData = {
  name: string;
  email: string;
  promoCode: string;
};

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const experienceId = searchParams.get("experienceId")!;
  const slotId = searchParams.get("slotId")!;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    promoCode: "",
  });

  const [agreed, setAgreed] = useState<boolean>(false);

  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState<{ type: string; value: number }>({
    type: "",
    value: 0,
  });

  const { data: experience } = useQuery<Tables<"experiences"> | undefined>({
    queryKey: ["experience", experienceId],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINTS.experiences}/${experienceId}`);
      if (!res.ok) throw new Error(`Failed to load experience: ${res.statusText}`);
      return (await res.json()) ?? undefined;
    },
    enabled: !!experienceId,
  });

  const { data: slot } = useQuery<Tables<"slots"> | undefined>({
    queryKey: ["slot", slotId],
    queryFn: async () => {
      const res = await fetch(`${API_ENDPOINTS.experiences}/${experienceId}/slots`);
      if (!res.ok) throw new Error(`Failed to load slots: ${res.statusText}`);
      const slots = (await res.json()) as Tables<"slots">[];
      return slots.find((s) => s.id === slotId) ?? undefined;
    },
    enabled: !!slotId,
  });

  const applyPromoMutation = useMutation<Tables<"promo_codes">, Error, string>({
    mutationFn: async (code: string) => {
      const res = await fetch(`${API_ENDPOINTS.promo}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Promo validation failed");
      }
      return (await res.json()) as Tables<"promo_codes">;
    },
    onSuccess: (data) => {
      setDiscount({ type: data.discount_type, value: Number(data.discount_value) });
      setPromoApplied(true);
      toast.success("Promo code applied successfully!");
    },
    onError: () => {
      toast.error("Invalid or expired promo code");
    },
  });

  const bookingMutation = useMutation<Tables<"bookings">, Error>({
    mutationFn: async () => {
      const basePrice = Number(experience?.price);
      let discountAmount = 0;

      if (promoApplied) {
        discountAmount =
          discount.type === "percentage"
            ? (basePrice * discount.value) / 100
            : discount.value;
      }

      const totalPrice = basePrice - discountAmount;

      const res = await fetch(API_ENDPOINTS.bookings, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Include credentials so the browser accepts any Set-Cookie header from the backend
        // (backend enables credentials in CORS). This is safe for non-sensitive booking id cookie.
        credentials: "include",
        body: JSON.stringify({
          experience_id: experienceId,
          slot_id: slotId,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: "",
          num_people: 1,
          promo_code: promoApplied ? formData.promoCode.toUpperCase() : null,
          discount_amount: discountAmount,
          total_price: totalPrice,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Booking failed");
      }
      return (await res.json()) as Tables<"bookings">;
    },
    onSuccess: (data) => {
      navigate(`/result?bookingId=${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Booking failed. Please try again.");
    },
  });

  const handleApplyPromo = () => {
    if (!formData.promoCode) {
      toast.error("Please enter a promo code");
      return;
    }
    applyPromoMutation.mutate(formData.promoCode);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!agreed) {
      toast.error("You must agree to the terms and safety policy");
      return;
    }
    bookingMutation.mutate();
  };

  if (!experience || !slot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="animate-pulse text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  const basePrice = Number(experience.price);
  const discountAmount =
    promoApplied && discount.type === "percentage"
      ? (basePrice * discount.value) / 100
      : promoApplied
      ? discount.value
      : 0;
  const totalPrice = basePrice - discountAmount;

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 relative">
      {/* Back Arrow */}
      <div
        className="flex items-center gap-2 cursor-pointer mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 text-black" />
        <span className="text-sm font-medium text-black">Checkout</span>
      </div>

      <div className="container mx-auto px-4 max-w-[1440px] grid lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-[#EFEFEF] rounded-xl p-6 flex flex-col gap-6"
        >
          <h1 className="text-2xl font-semibold text-[#161616]">Complete Your Booking</h1>

          <div className="flex flex-col gap-4">
            <label className="text-sm text-[#5B5B5B]">Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-[#DDDDDD] rounded-md px-4 py-3 text-[#161616]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-sm text-[#5B5B5B]">Email Address *</label>
            <input
              type="email"
              placeholder="test@test.com"
              className="w-full bg-[#DDDDDD] rounded-md px-4 py-3 text-[#161616]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#5B5B5B]">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 bg-[#DDDDDD] rounded-md px-4 py-3 text-[#161616]"
                value={formData.promoCode}
                onChange={(e) =>
                  setFormData({ ...formData, promoCode: e.target.value })
                }
                disabled={promoApplied}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className={`px-4 py-3 rounded-lg font-medium text-sm ${
                  promoApplied
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#161616] text-[#F9F9F9] hover:bg-black"
                }`}
                disabled={promoApplied || applyPromoMutation.isPending}
              >
                {promoApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {promoApplied && (
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <Tag className="w-3 h-3" />
                Promo code applied successfully!
              </p>
            )}
          </div>

          {/* Agreement checkbox (Figma: small text, 236x16 layout) */}
          <div className="mt-2">
            <label className="flex items-center gap-2 w-[236px] h-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-black rounded-sm"
              />
              <span className="text-xs text-[#5B5B5B]">I agree to the terms and safety policy</span>
            </label>
          </div>
        </form>

        {/* Order Summary */}
        <div className="bg-[#EFEFEF] rounded-xl p-6 sticky top-24 flex flex-col gap-4">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-32 object-cover rounded-lg"
          />
          <h2 className="font-semibold text-[#161616] text-lg">{experience.title}</h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-[#656565]">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </div>
            <div className="flex items-center gap-2 text-[#656565]">
              <Calendar className="w-4 h-4" />
              {format(new Date(slot.date), "EEEE, MMMM d, yyyy")}
            </div>
            <div className="flex items-center gap-2 text-[#656565]">
              <Clock className="w-4 h-4" />
              {slot.time}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#656565]">${experience.price}</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-300">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full sm:w-[339px] h-[44px] bg-[#D7D7D7] rounded-md text-[#7F7F7F] text-base font-medium disabled:opacity-60"
              disabled={bookingMutation.isPending || !agreed}
            >
              {bookingMutation.isPending ? "Processing..." : "Pay and Confirm"}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
