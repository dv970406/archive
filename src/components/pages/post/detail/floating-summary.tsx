"use client";

import { ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IFloatingSummaryProps {
	summary: string[];
}

const FloatingSummary = ({ summary }: IFloatingSummaryProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="ml-auto fixed bottom-4 inset-x-4 md:bottom-6 md:right-6 z-50 md:max-w-sm">
			<div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-out">
				<Button
					variant="ghost"
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full flex items-center justify-between gap-2 px-4 py-3 hover:bg-muted/50"
				>
					<div className="flex items-center gap-2">
						<Sparkles className="w-4 h-4 text-primary" />
						<span className="font-medium text-sm text-foreground">요약</span>
					</div>
					<div
						className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
					>
						<ChevronUp className="w-4 h-4 text-muted-foreground" />
					</div>
				</Button>

				<div
					className={`grid transition-all duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
				>
					<div className="overflow-hidden">
						<div className="px-4 pb-4 border-t border-border">
							<ul className="mt-3 space-y-2">
								{summary.map((line, index) => (
									<li
										key={line}
										className="flex gap-2 text-sm text-foreground transition-all duration-300"
										style={{
											transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
											opacity: isExpanded ? 1 : 0,
											transform: isExpanded
												? "translateY(0)"
												: "translateY(-8px)",
										}}
									>
										<span className="text-primary font-medium mt-0.5">
											{index + 1}.
										</span>
										<span className="leading-relaxed">{line}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FloatingSummary;
