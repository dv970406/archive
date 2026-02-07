"use client";

import { RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type MouseEventHandler, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import {
	CSS3DObject,
	CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { Button } from "@/components/ui/button";
import { useGetAllPosts } from "@/hooks/queries/post";
import { PLACEHOLDER_THUMBNAIL_PATH } from "@/lib/constant/image";
import { cn } from "@/lib/style/tailwind";
import { getCategoryColor } from "@/lib/utils/color";
import { parseMarkdownToPlainText } from "@/lib/utils/markdown";
import { formatTimeAgo } from "@/lib/utils/time";
import type { Post } from "@/types/post";

interface IPostsList3DProps {
	posts: IPostItem[];
}

interface Targets {
	grid: THREE.Object3D[];
	sphere: THREE.Object3D[];
	helix: THREE.Object3D[];
	wave: THREE.Object3D[];
}

type IPostItem = Pick<
	Post,
	| "title"
	| "content"
	| "published_at"
	| "thumbnail"
	| "slug"
	| "created_at"
	| "category"
>;

const PostItem = ({
	category,
	content,
	created_at,
	published_at,
	slug,
	thumbnail,
	title,
}: IPostItem) => {
	const colors = getCategoryColor(category?.id ?? 1);
	return (
		<Link
			href={`/post/${slug}`}
			className={cn(
				"group overflow-hidden",
				"inline-block w-80 rounded-xl border",
				"shadow-lg hover:shadow-2xl",
				"transition-all duration-1500 ease-out will-change-transform",
				colors.bg,
				colors.border,
			)}
		>
			<div className={`w-full h-[200px]`}>
				<Image
					src={thumbnail || PLACEHOLDER_THUMBNAIL_PATH}
					alt={title}
					className="relative! w-full h-full rounded-t-xl object-cover group-hover:scale-110 transition-transform duration-300  "
					fill
					loading="lazy"
				/>
			</div>
			<div className="p-4">
				<div
					className={`
					inline-block px-3 py-1.5 rounded-full text-[11px] font-semibold
					text-white uppercase tracking-wider mb-3
					${colors.category}
				`}
				>
					{category?.title}
				</div>
				<h2 className="text-base font-bold text-white mb-2 leading-tight line-clamp-2">
					{title}
				</h2>
				<p className="text-[13px] text-white/70 leading-relaxed mb-3 line-clamp-2 break-all">
					{parseMarkdownToPlainText(content)}
				</p>
				<time
					className="text-xs text-white/50"
					dateTime={published_at || created_at}
				>
					{formatTimeAgo(published_at || created_at)}
				</time>
			</div>
		</Link>
	);
};

const PostsList3D = () => {
	const { data: postsList } = useGetAllPosts();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<CSS3DRenderer | null>(null);
	const controlsRef = useRef<TrackballControls | null>(null);
	const objectsRef = useRef<CSS3DObject[]>([]);
	const targetsRef = useRef<Targets>({
		grid: [],
		sphere: [],
		helix: [],
		wave: [],
	});
	const [isTransitioning, setIsTransitioning] = useState(false);

	const createCards = () => {
		postsList?.forEach((post) => {
			const container = document.createElement("div");
			container.className = "transition-all duration-1500 ease-in-out";

			createRoot(container).render(<PostItem {...post} />);

			container.addEventListener("pointerenter", () => {
				if (controlsRef.current) {
					controlsRef.current.enabled = false;
				}
			});
			container.addEventListener("pointerleave", () => {
				if (controlsRef.current) {
					controlsRef.current.enabled = true;
				}
			});

			const objectCSS = new CSS3DObject(container);
			objectCSS.position.x = Math.random() * 4000 - 1500;
			objectCSS.position.y = Math.random() * 4000 - 1500;
			objectCSS.position.z = Math.random() * 4000 - 1500;
			sceneRef.current?.add(objectCSS);

			objectsRef.current.push(objectCSS);
		});
	};

	const createLayoutTargets = () => {
		const objects = objectsRef.current;
		const targets = targetsRef.current;

		// GRID
		for (let i = 0; i < objects.length; i++) {
			const object = new THREE.Object3D();
			object.position.x = (i % 4) * 350 - 525;
			object.position.y = -(Math.floor(i / 4) % 3) * 400 + 400;
			object.position.z = Math.floor(i / 12) * 800 - 400;
			targets.grid.push(object);
		}

		// SPHERE
		const vector = new THREE.Vector3();
		for (let i = 0, l = objects.length; i < l; i++) {
			const phi = Math.acos(-1 + (2 * i) / l);
			const theta = Math.sqrt(l * Math.PI) * phi;
			const object = new THREE.Object3D();
			object.position.setFromSphericalCoords(900, phi, theta);
			vector.copy(object.position).multiplyScalar(2);
			object.lookAt(vector);
			targets.sphere.push(object);
		}

		// HELIX
		for (let i = 0, l = objects.length; i < l; i++) {
			const theta = i * 0.35 + Math.PI;
			const y = -(i * 35) + 400;
			const object = new THREE.Object3D();
			object.position.setFromCylindricalCoords(900, theta, y);
			vector.x = object.position.x * 2;
			vector.y = object.position.y;
			vector.z = object.position.z * 2;
			object.lookAt(vector);
			targets.helix.push(object);
		}

		// WAVE
		for (let i = 0; i < objects.length; i++) {
			const object = new THREE.Object3D();
			const x = (i % 6) * 350 - 875;
			const z = Math.floor(i / 6) * 450 - 450;
			const y = Math.sin(i * 0.5) * 250;
			object.position.set(x, y, z);
			targets.wave.push(object);
		}
	};

	const transform = (targets: THREE.Object3D[]) => {
		objectsRef.current.forEach((object, i) => {
			const target = targets[i];
			object.position.copy(target.position);
			object.rotation.copy(target.rotation);
		});
		render();
	};

	const render = () => {
		if (rendererRef.current && sceneRef.current && cameraRef.current) {
			rendererRef.current.render(sceneRef.current, cameraRef.current);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <postsList가 준비되면 씬 전체 초기화>
	useEffect(() => {
		if (!containerRef.current || !postsList?.length) return;

		const container = containerRef.current;

		// 클라이언트 사이드 네비게이션 시 이전 페이지의 스크롤 오프셋이 남아있으면
		// TrackballControls의 마우스 좌표 계산이 틀어지므로 스크롤을 리셋
		window.scrollTo(0, 0);

		const scene = new THREE.Scene();
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.z = 1700;
		cameraRef.current = camera;

		const renderer = new CSS3DRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		const controls = new TrackballControls(camera, renderer.domElement);
		controls.minDistance = 400;
		controls.maxDistance = 5000;
		controls.addEventListener("change", render);
		controlsRef.current = controls;

		createCards();
		createLayoutTargets();
		transform(targetsRef.current["grid"]);

		let animationFrameId: number;
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			controls.update();
		};
		animate();

		const handleResize = () => {
			if (!camera || !renderer) return;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			controls.handleResize();
			render();
		};
		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
			controls.dispose();
			for (const obj of objectsRef.current) {
				scene.remove(obj);
			}
			objectsRef.current = [];
			targetsRef.current = { grid: [], sphere: [], helix: [], wave: [] };
			if (container && renderer.domElement) {
				container.removeChild(renderer.domElement);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postsList]);

	const handleLayoutChange = (layoutName: keyof Targets) => () => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		transform(targetsRef.current[layoutName]);

		setTimeout(() => {
			setIsTransitioning(false);
		}, 1500);
	};

	const resetView = () => {
		if (!cameraRef.current || !controlsRef.current) return;

		// 카메라 위치 초기화
		cameraRef.current.position.set(0, 0, 1700);
		cameraRef.current.up.set(0, 1, 0);

		// controls 리셋
		controlsRef.current.reset();

		render();
	};

	return (
		<div className="relative">
			<div
				ref={containerRef}
				className="fixed top-0 left-0 w-screen h-screen"
			/>

			<div className="fixed bottom-8 inset-x-0 flex flex-col items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={resetView}
					aria-label="시점 초기화"
				>
					<RotateCcw className="size-5" />
				</Button>
				<div className="flex gap-3">
					<LayoutChangeButton
						onClick={handleLayoutChange("grid")}
						text="Grid"
						disabled={isTransitioning}
					/>
					<LayoutChangeButton
						onClick={handleLayoutChange("sphere")}
						text="Sphere"
						disabled={isTransitioning}
					/>
					<LayoutChangeButton
						onClick={handleLayoutChange("helix")}
						text="Helix"
						disabled={isTransitioning}
					/>
					<LayoutChangeButton
						onClick={handleLayoutChange("wave")}
						text="Wave"
						disabled={isTransitioning}
					/>
				</div>
			</div>
		</div>
	);
};

interface ILayoutChangeButton {
	disabled?: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
	text: "Helix" | "Grid" | "Sphere" | "Wave";
}
const LayoutChangeButton = ({
	onClick,
	disabled,
	text,
}: ILayoutChangeButton) => {
	return (
		<Button
			type="button"
			variant={"outline"}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</Button>
	);
};

export default PostsList3D;
export type { IPostsList3DProps };
