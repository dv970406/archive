import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import type { Theme } from "@/types/theme";

type State = {
	theme: Theme;
};

const initialState: State = {
	theme: "light",
};

const useThemeStore = create(
	devtools(
		persist(
			combine(initialState, (set) => ({
				actions: {
					toggleTheme: () => {
						const htmlTag = document.documentElement;

						const isDarkMode = htmlTag.classList.contains("dark");
						htmlTag.classList.toggle("dark");

						set({ theme: isDarkMode ? "light" : "dark" });
					},
				},
			})),
			{
				name: "ThemeStore",
				partialize: (store) => ({
					theme: store.theme,
				}),
			},
		),
		{
			name: "ThemeStore",
		},
	),
);

export const useTheme = () => {
	const theme = useThemeStore((store) => store.theme);
	return theme;
};

export const useToggleTheme = () => {
	const toggleTheme = useThemeStore((store) => store.actions.toggleTheme);
	return toggleTheme;
};
