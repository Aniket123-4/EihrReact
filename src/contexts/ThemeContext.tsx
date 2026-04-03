import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "sky-blue" | "aqua-teal" | "soft-purple" | "sunset-warm" | "mint-green";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: { id: ThemeName; label: string; icon: string; colors: [string, string] }[] = [
  { id: "sky-blue", label: "Sky Blue", icon: "☁️", colors: ["#38bdf8", "#6366f1"] },
  { id: "aqua-teal", label: "Aqua Teal", icon: "🌊", colors: ["#06b6d4", "#14b8a6"] },
  { id: "soft-purple", label: "Soft Purple", icon: "💜", colors: ["#a78bfa", "#c084fc"] },
  { id: "sunset-warm", label: "Sunset", icon: "🌅", colors: ["#fb923c", "#f472b6"] },
  { id: "mint-green", label: "Mint Green", icon: "🌿", colors: ["#34d399", "#a3e635"] },
];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = localStorage.getItem("mediflow-theme");
    return (saved as ThemeName) || "sky-blue";
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("mediflow-theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
