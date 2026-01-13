import Link from "next/link";
import ThemeToggle from "../../ui/theme-toggle";
import NavigateCreatePostButton from "./navigate-create-post-button";
import { fetchUser } from "@/api/auth";

const GlobalHeader = async () => {
  const { user } = await fetchUser();

  return (
    <header className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                D
              </span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              Dev Post
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            {user?.id && <NavigateCreatePostButton />}
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              글 목록
            </Link>
            <Link
              href="/career"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              커리어
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
