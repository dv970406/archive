import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTextareaController } from "@/hooks/post/use-textarea-controller";
import { TEXTAREA_POST_EDITOR_ID } from "@/lib/constant/element-id";
import {
	type IMdxComponentConfig,
	mdxComponentConfigs,
} from "@/lib/constant/mdx-preset";

type IMdxButton = {
	config: IMdxComponentConfig;
	onInsert: (snippet: string) => void;
};

const MdxButton = ({ config, onInsert }: IMdxButton) => {
	if (config.options) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="outline" size="sm" className="w-24">
						{config.label}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-28" align="start">
					{config.options.map((item) => (
						<DropdownMenuItem key={item.id} asChild>
							<button
								type="button"
								onClick={() => onInsert(item.snippet)}
								className="w-full"
							>
								{item.label}
							</button>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={() => onInsert(config.snippet)}
		>
			{config.label}
		</Button>
	);
};

const TipsForMdx = () => {
	const { insertTextAtCursor } = useTextareaController(TEXTAREA_POST_EDITOR_ID);

	return (
		<div className="border-t px-6 py-3">
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground mr-2">
					MDX 컴포넌트:
				</span>
				{mdxComponentConfigs.map((config) => (
					<MdxButton
						key={config.id}
						config={config}
						onInsert={insertTextAtCursor}
					/>
				))}
			</div>
		</div>
	);
};

export default TipsForMdx;
