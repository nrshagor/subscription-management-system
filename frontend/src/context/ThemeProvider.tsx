import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./themeContext";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState<boolean>(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(!dark) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
