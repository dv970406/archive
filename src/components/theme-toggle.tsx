"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, useToggleTheme } from "@/store/theme";

const ThemeToggle = () => {
	const currentTheme = useTheme();
	const toggleTheme = useToggleTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="rounded-lg"
			aria-label="테마 전환"
		>
			{currentTheme === "dark" ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</Button>
	);
};

export default ThemeToggle;
