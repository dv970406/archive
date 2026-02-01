import type { ReactNode } from "react";
import type { Thing, WithContext } from "schema-dts";

interface IJsonLdProvider {
	jsonLd: WithContext<Thing>;
	children: ReactNode;
}
const JsonLdProvider = ({ jsonLd, children }: IJsonLdProvider) => {
	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <JSON-LD를 위해서 예외적으로 dangerouslySetInnerHTML 허용>
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			{children}
		</>
	);
};

export default JsonLdProvider;
