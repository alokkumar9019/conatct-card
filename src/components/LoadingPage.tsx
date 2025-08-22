// components/LoadingWelcome.tsx
import React from "react";

export default function LoadingWelcome({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md">
        <div className="mt-8 flex justify-center">
          <img
            src="/PCLnXAI.png"
            alt="Welcome"
            className="max-w-[150px] max-h-[150px]"
            style={{
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationName: "bounce",
              animationDuration: "1.5s",
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes loading-progress {
          0% { left: -50%; }
          100% { left: 100%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
