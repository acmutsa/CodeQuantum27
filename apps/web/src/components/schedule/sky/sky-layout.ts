// Tri Nguyen: All numbers come from the Figma frame (1440px wide). Change them here and every card, the path, and the markers move together.
export const LANE_WIDTH = 480;
export const CARD_WIDTH = 560;
export const CARD_HEIGHT = 246;

const LANE_CENTER = LANE_WIDTH / 2;
const BEND = 90;
const FIRST_CARD_TOP = 40;
const ROW_STEP = 200;
const MARKER_OFFSET = 120;
const FINALE_SPACE = 354;
const PATH_START_Y = -20;
const PATH_END_LIFT = 200;
const READING_LINE = 0.75;

export type SkyPoint = { x: number; y: number };

export type SkyLayout = {
	height: number;
	path: string;
	markers: SkyPoint[];
	cardTops: number[];
};

// Tri Nguyen: Works out where each card sits and builds the SVG path that winds between them.
export function buildSkyLayout(eventCount: number): SkyLayout {
	if (eventCount <= 0) {
		return { height: 0, path: "", markers: [], cardTops: [] };
	}

	const cardTops = Array.from(
		{ length: eventCount },
		(_, index) => FIRST_CARD_TOP + index * ROW_STEP,
	);
	const height = cardTops[cardTops.length - 1] + CARD_HEIGHT + FINALE_SPACE;

	// Tri Nguyen: Even cards are on the left, so their marker bends right, and odd cards bend left.
	const markers = cardTops.map((top, index) => ({
		x: index % 2 === 0 ? LANE_CENTER + BEND : LANE_CENTER - BEND,
		y: top + MARKER_OFFSET,
	}));

	const points: SkyPoint[] = [
		{ x: LANE_CENTER, y: PATH_START_Y },
		...markers,
		{ x: LANE_CENTER, y: height - PATH_END_LIFT },
	];

	// Tri Nguyen: Each segment is a cubic curve with vertical handles, which gives the soft S shape from Figma.
	const curves = points.slice(1).map((point, index) => {
		const previous = points[index];
		const midY = (previous.y + point.y) / 2;
		return `C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
	});

	return {
		height,
		path: `M ${points[0].x} ${points[0].y} ${curves.join(" ")}`,
		markers,
		cardTops,
	};
}

// Tri Nguyen: How much of the path to draw (0 to 1) based on how far it has scrolled past 75% of the screen.
export function getDrawProgress(
	rectTop: number,
	rectHeight: number,
	viewportHeight: number,
): number {
	if (rectHeight <= 0) {
		return 1;
	}
	const drawnPixels = viewportHeight * READING_LINE - rectTop;
	return Math.min(1, Math.max(0, drawnPixels / rectHeight));
}
