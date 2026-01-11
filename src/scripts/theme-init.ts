export const themeInitScript = `
  const storedTheme=localStorage.getItem('ThemeStore')
  const themeStore=storedTheme ? JSON.parse(storedTheme) : null;

  const theme=themeStore.state.theme;

  const htmlTag = document.documentElement;

  htmlTag.classList.remove("dark", "light");

  if (theme === "system") {
    // ⭐️ matchMedia는 브라우저 화면 상태/사용자의 PC 설정값을 가져옴
    // https://developer.mozilla.org/ko/docs/Web/API/Window/matchMedia
    // 아래 코드는 사용자의 PC 설정이 다크모드인지 확인하는 코드
    const isDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    htmlTag.classList.add(isDarkTheme ? "dark" : "light");
  } else {
    htmlTag.classList.add(theme);
  }
`;
