import { useState } from "react";
import { AppProviders } from "./context";
import Header from "./components/Header";
import PostsPanel from "./components/PostsPanel";
import UsersPanel from "./components/UsersPanel";
import ConsolePanel from "./components/ConsolePanel";

const TABS = [
  { key: "posts", label: "POSTS" },
  { key: "users", label: "USERS" },
  { key: "console", label: "CONSOLE" },
];

function TabNav({ active, onSwitch }) {
  return (
    <nav
      className="flex gap-1 mb-6 border-b border-[rgba(0,255,65,0.27)]"
      role="tablist"
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onSwitch(tab.key)}
          className={`font-[family-name:var(--font-pixel)] text-[9px] px-5 py-2.5 border border-b-0 tracking-widest transition-all duration-200 cursor-pointer relative bottom-[-1px] ${
            active === tab.key
              ? "text-[#00ff41] border-[rgba(0,255,65,0.27)] bg-[#0d140d] [box-shadow:inset_0_1px_0_#00b32d] [text-shadow:0_0_8px_#00ff4188]"
              : "text-[#4a7a4a] border-[#1a3a1a] bg-transparent hover:text-[#00ff41] hover:border-[rgba(0,255,65,0.27)]"
          }`}
        >
          {active === tab.key && <span className="mr-1">▶</span>}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function AppInner() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-6">
        <TabNav active={activeTab} onSwitch={setActiveTab} />
        {activeTab === "posts" && <PostsPanel />}
        {activeTab === "users" && <UsersPanel />}
        {activeTab === "console" && <ConsolePanel />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  );
}
