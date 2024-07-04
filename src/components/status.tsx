import React, { useEffect, useState } from "react";

const OpenAIStatus: React.FC = () => {
  const [status, setStatus] = useState("checking");

  const checkServerStatus = async () => {
    try {
      const response = await fetch("/api/check-ai-status");
      const data = await response.json();

      if (data.status === "ok") {
        setStatus("ok");
      } else {
        setStatus("down");
      }
    } catch (error) {
      setStatus("down");
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 font-mono">
      {status === "checking" && (
        <>
          <div className="h-4 w-4 bg-yellow-500 rounded-full animate-ping"></div>
          <p>Checking server status...</p>
        </>
      )}
      {status === "ok" && (
        <>
          <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
          <p>All Systems Operational</p>
        </>
      )}
      {status === "down" && (
        <>
          <div className="h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
          <p>OpenAI servers are down. Switching to fallback.</p>
        </>
      )}
    </div>
  );
};

export default OpenAIStatus;
