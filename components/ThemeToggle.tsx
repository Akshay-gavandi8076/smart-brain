import { MoonIcon, SunIcon } from "lucide-react";

export const ThemeToggle: React.FC<{
  isDarkMode: boolean;
  isExpanded: boolean;
  toggleTheme: () => void;
}> = ({ isDarkMode, isExpanded, toggleTheme }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleTheme();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className="flex w-full cursor-pointer items-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
      {isExpanded && (
        <span className="ml-2">{isDarkMode ? "Light" : "Dark"}</span>
      )}
    </div>
  );
};
