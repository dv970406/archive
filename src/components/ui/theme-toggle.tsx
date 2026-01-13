"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	const handleToggleTheme = () => {
		if (theme === "dark") {
			setTheme("light");
			return;
		}

		setTheme("dark");
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={handleToggleTheme}
			className="rounded-lg"
			aria-label="테마 전환"
		>
			<Sun className="h-5 w-5 dark:block hidden" />
			<Moon className="h-5 w-5 dark:hidden block" />
		</Button>
	);
};

export default ThemeToggle;
