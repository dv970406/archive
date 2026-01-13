"use client";

import { useState } from "react";

interface CodeDemoProps {
	code: string;
	title?: string;
}

const CodeDemo = ({ code, title }: CodeDemoProps) => {
	const [output, setOutput] = useState<string>("");

	const runCode = () => {
		try {
			// 간단한 예시 - 실제로는 더 안전한 방식 필요
			const result = eval(code);
			setOutput(String(result));
		} catch (error) {
			setOutput(`Error: ${error}`);
		}
	};

	return (
		<div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
			{title && (
				<div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-semibold">
					{title}
				</div>
			)}
			<div className="p-4">
				<pre className="bg-gray-900 text-gray-100 p-4 rounded mb-4 overflow-x-auto">
					<code>{code}</code>
				</pre>
				<button
					type="button"
					onClick={runCode}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
				>
					Run Code
				</button>
				{output && (
					<div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
						<div className="text-sm text-gray-500 mb-1">Output:</div>
						<div className="font-mono">{output}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CodeDemo;
