import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const Result: React.FC = () => {
  const navigate = useNavigate();

  // Static reference ID per design
  const refId = "HUF56&SO";

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#24AC39] flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>

        <h1 className="mt-6 text-[32px] leading-[40px] font-medium text-[#161616]">
          Booking Confirmed
        </h1>

        <p className="mt-3 text-[20px] leading-[24px] font-normal text-[#656565]">
          Ref ID: {refId}
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-[#E3E3E3] text-[#656565] text-[16px] leading-[20px] font-normal rounded-md px-6 py-2 hover:bg-[#d9d9d9]"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Result;
