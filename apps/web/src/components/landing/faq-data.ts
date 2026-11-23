import config from "config";

// The hub describes the event across editions. Keep annual rules separate.
export const faqItems = [
	{
		id: "event",
		question: "What is CodeQuantum?",
		answer: "CodeQuantum is a student-run hackathon hosted by ACM at UTSA. Students spend a day turning an idea into a project, with a focus on making space for people underrepresented in tech.",
	},
	{
		id: "experience",
		question: "Can this be my first hackathon?",
		answer: "Yes! You can come with no coding experience. Pick something you’d like to try, ask questions as you build, and learn from the students around you.",
	},
	{
		id: "duration",
		question: "How long does it last?",
		answer: "CodeQuantum is traditionally a 12-hour event. The exact start and end times for 2027 are still to come.",
	},
	{
		id: "date",
		question: "When and where is it?",
		answer: "The 2027 schedule lists February 20 at UTSA. Building, room, and check-in details are still to come.",
	},
	{
		id: "eligibility",
		question: "Who can participate?",
		answer: "The 2027 registration form currently requires participants to be at least 18. Eligibility for high school students and students from other universities is still being confirmed.",
	},
	{
		id: "teams",
		question: "Do I need a team to sign up?",
		answer: "Team sizes, solo participation, and how to find teammates are still to be confirmed for 2027.",
	},
	{
		id: "registration",
		question: "How do I register, and is it free?",
		answer: "Registration dates, fees, and sign-up instructions for 2027 are still to be confirmed.",
	},
	{
		id: "past-events",
		question: "What did students build last time?",
		answer: "In 2026, students built projects around a Formula 1 theme. Tracks included working with data and pitching a tech product.",
		link: {
			href: "https://2026.cqhacks.org/",
			label: "Explore CodeQuantum 2026",
		},
	},
	{
		id: "contact",
		question: "Where can I ask another question?",
		answer: "Ask the organizers in the CodeQuantum Discord. It’s a good place to check a detail before making plans.",
		link: {
			href: config.links.discord,
			label: "Join the CodeQuantum Discord",
		},
	},
] as const;
