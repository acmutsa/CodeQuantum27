// Tri Nguyen: Every image the sky schedule uses lives in /public/img/schedule. Swapping art is a one line change here.
const ART_DIR = "/img/schedule";

export const HERO_ART = {
	castle: `${ART_DIR}/castle-art.jpg`,
	cloudBank: `${ART_DIR}/cloud-bank.png`,
	windSwirls: `${ART_DIR}/wind-swirls.svg`,
} as const;

export const DRAGONS = {
	plum: `${ART_DIR}/dragon-plum.png`,
	gold: `${ART_DIR}/dragon-gold.png`,
	ice: `${ART_DIR}/dragon-ice.png`,
	chestnut: `${ART_DIR}/dragon-chestnut.png`,
} as const;

const PEAKS = {
	a: `${ART_DIR}/peaks-a.png`,
	b: `${ART_DIR}/peaks-b.png`,
} as const;

export const FINALE_LANDSCAPE = `${ART_DIR}/finale-landscape.png`;

// Tri Nguyen: Cloud art behind one event card. x, y, width, height are pixels inside a 560 x 246 card, copied from Figma.
export type CloudVariant = {
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

// Tri Nguyen: Cards cycle through these in order, so event 11 reuses cloud 1.
export const CLOUD_VARIANTS: CloudVariant[] = [
	{ src: `${ART_DIR}/cloud-01.png`, x: -31, y: -27, width: 500, height: 247 },
	{ src: `${ART_DIR}/cloud-02.png`, x: -32, y: -15, width: 495, height: 237 },
	{ src: `${ART_DIR}/cloud-03.png`, x: -86, y: -14, width: 507, height: 238 },
	{ src: `${ART_DIR}/cloud-04.png`, x: -30, y: -38, width: 513, height: 254 },
	{
		src: `${ART_DIR}/cloud-05.png`,
		x: -102,
		y: -26,
		width: 512,
		height: 248,
	},
	{ src: `${ART_DIR}/cloud-06.png`, x: -27, y: -34, width: 558, height: 258 },
	{ src: `${ART_DIR}/cloud-07.png`, x: -19, y: -26, width: 521, height: 250 },
	{ src: `${ART_DIR}/cloud-08.png`, x: -55, y: -75, width: 676, height: 327 },
	{ src: `${ART_DIR}/cloud-09.png`, x: -14, y: -37, width: 513, height: 254 },
	{ src: `${ART_DIR}/cloud-10.png`, x: -29, y: -63, width: 586, height: 290 },
];

// Tri Nguyen: A background picture in the sky section. left, top, and width are Figma pixels on a 1440 frame.
export type Decoration = {
	src: string;
	left: number;
	width: number;
	height: number;
	top: number;
	opacity: number;
	animationClass?: string;
};

export const SKY_DECORATIONS: Decoration[] = [
	{ src: PEAKS.a, left: 0, top: 353, width: 580, height: 227, opacity: 0.9 },
	{
		src: PEAKS.b,
		left: 840,
		top: 968,
		width: 600,
		height: 212,
		opacity: 0.9,
	},
	{ src: PEAKS.a, left: 0, top: 1503, width: 580, height: 227, opacity: 0.9 },
	{
		src: DRAGONS.ice,
		left: 1130,
		top: 300,
		width: 240,
		height: 190,
		opacity: 0.6,
		animationClass: "motion-safe:animate-cq-float-slow",
	},
	{
		src: DRAGONS.chestnut,
		left: 40,
		top: 1110,
		width: 230,
		height: 166,
		opacity: 0.55,
		animationClass: "motion-safe:animate-cq-float",
	},
	{
		src: DRAGONS.gold,
		left: 1170,
		top: 1600,
		width: 210,
		height: 113,
		opacity: 0.5,
		animationClass: "motion-safe:animate-cq-float-slow",
	},
	{
		src: `${ART_DIR}/deco-cloud-01.png`,
		left: 780,
		top: -6,
		width: 206,
		height: 102,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-02.png`,
		left: 1230,
		top: 640,
		width: 166,
		height: 82,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-03.png`,
		left: 40,
		top: 1480,
		width: 236,
		height: 112,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-04.png`,
		left: 1190,
		top: 1840,
		width: 206,
		height: 96,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
	{
		src: `${ART_DIR}/deco-cloud-05.png`,
		left: 600,
		top: 2020,
		width: 186,
		height: 92,
		opacity: 0.7,
		animationClass: "motion-safe:animate-cq-drift",
	},
];
