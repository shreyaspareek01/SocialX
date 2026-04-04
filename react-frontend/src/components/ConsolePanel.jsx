import { useRef, useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useConsole } from "../context";
import { RetroButton } from "./ui";

const ICONS = {
  success: "✓",
  error: "✗",
  info: "·",
  request: "→",
  response: "←",
  welcome: "▶",
};

const LINE_COLORS = {
  success: "text-[#00ff41]",
  error: "text-[#ff3c3c]",
  info: "text-[#4a7a4a]",
  request: "text-[#00d4ff]",
  response: "text-[#ffb000]",
  welcome: "text-[#00ff41]",
};

function ConsoleLine({ type, msg, data }) {
  return (
    <div
      className={`flex gap-2 items-start ${LINE_COLORS[type] || "text-[#c8ffc8]"}`}
    >
      <span className="text-[#4a7a4a] flex-shrink-0">{ICONS[type] || "·"}</span>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="break-all"> {msg}</span>
        {data !== null && data !== undefined && (
          <pre className="console-pre">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default function ConsolePanel() {
  const { logs, logConsole, clearLogs } = useConsole();
  const [rawInput, setRawInput] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll on new logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const executeRaw = async () => {
    const raw = rawInput.trim();
    if (!raw) return;
    setRawInput("");

    const parts = raw.split(/\s+/);
    const method = (parts[0] || "GET").toUpperCase();
    const path = parts[1] || "/";

    if (!["GET", "DELETE"].includes(method)) {
      logConsole(
        "error",
        "Raw console supports GET and DELETE only. Use the form panels for POST/PUT.",
      );
      return;
    }

    logConsole("request", `${method} http://localhost:8000${path}`);
    try {
      const { ok, status, data } = await apiFetch(method, path);
      logConsole(ok ? "response" : "error", `${status}`, data);
    } catch (e) {
      logConsole("error", `Network error: ${e.message}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") executeRaw();
  };

  return (
    <div className="border border-[rgba(0,255,65,0.27)] bg-[#060e06] flex flex-col min-h-[500px] panel-enter">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a3a1a] bg-[rgba(0,255,65,0.04)]">
        <span className="text-[#4a7a4a] text-[11px] tracking-wider">
          // REQUEST LOG
        </span>
        <RetroButton variant="red" small onClick={clearLogs}>
          CLEAR
        </RetroButton>
      </div>

      {/* Output */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-1.5 text-xs leading-relaxed font-[family-name:var(--font-mono)]">
        {logs.map((log, i) => (
          <ConsoleLine key={i} {...log} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[#1a3a1a]">
        <span className="text-[#4a7a4a] flex-shrink-0">$&gt;</span>
        <input
          type="text"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="GET /posts"
          autoComplete="off"
          className="flex-1 bg-transparent border-none text-[#00ff41] font-[family-name:var(--font-mono)] text-[13px] outline-none caret-[#00ff41] placeholder:text-[#2a4a2a]"
        />
        <RetroButton variant="green" small onClick={executeRaw}>
          RUN
        </RetroButton>
      </div>

      {/* Hint */}
      <p className="px-4 pb-3 text-[#4a7a4a] text-[10px] opacity-70">
        // Supports: GET /posts &nbsp;|&nbsp; GET /posts/1 &nbsp;|&nbsp; GET
        /users &nbsp;|&nbsp; DELETE /posts/1
      </p>
    </div>
  );
}
