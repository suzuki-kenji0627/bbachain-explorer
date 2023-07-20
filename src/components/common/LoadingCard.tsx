import React from "react";

export function LoadingCard({ message }: { message?: string }) {
  return (
    <div className="card w-full bg-[#011909] shadow-xl">
      <div className="card-body text-center">
        <h2 className="card-title">{message || "Loading"}</h2>
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              {message || "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
