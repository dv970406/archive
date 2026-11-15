import { Button } from "@/components/ui/button";
import { mdxComponentConfigs } from "@/lib/constant/mdx-preset";

interface IMdxToolbarProps {
	onInsert: (snippet: string) => void;
}

/** 하단 MDX 컴포넌트 삽입 버튼 */
const MdxToolbar = ({ onInsert }: IMdxToolbarProps) => {
	return (
		<div className="border-t px-6 py-3">
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-sm text-muted-foreground mr-2">
					MDX 컴포넌트:
				</span>
				{mdxComponentConfigs.map((config) =>
					config.options ? (
						// 옵션이 있는 컴포넌트(Callout)는 종류를 고르면 바로 삽입한다
						<select
							key={config.id}
							aria-label={`${config.label} 삽입`}
							value=""
							onChange={(event) => {
								const option = config.options?.find(
									(item) => item.id === event.currentTarget.value,
								);
								if (option) onInsert(option.snippet);
							}}
							className="h-8 rounded-md border bg-background px-2 text-sm dark:bg-input/30"
						>
							<option value="" disabled>
								{config.label}
							</option>
							{config.options.map((option) => (
								<option key={option.id} value={option.id}>
									{option.label}
								</option>
							))}
						</select>
					) : (
						<Button
							key={config.id}
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onInsert(config.snippet)}
						>
							{config.label}
						</Button>
					),
				)}
				<span className="ml-auto text-xs text-muted-foreground">
					이미지·영상은 본문에 드래그하거나 붙여넣으세요
				</span>
			</div>
		</div>
	);
};

export default MdxToolbar;
