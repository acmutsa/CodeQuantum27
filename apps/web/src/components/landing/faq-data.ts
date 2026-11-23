import config from "config";

// The hub describes the event across editions. Keep annual rules separate.
export const faqItems = [
	{
		id: "event",
		question: "What is CodeQuantum?",
		answer: "CodeQuantum is a 12-hour, beginner-friendly hackathon hosted by ACM at UTSA. Bring your ideas and build a software or hardware project in a team of up to four people. You’ll have a chance to show mentors and judges what you made.",
	},
	{
		id: "experience",
		question: "Can this be my first hackathon?",
		answer: "Yes! You can come with no coding experience. Pick something you’d like to try, ask questions as you build, and learn from the students around you.",
	},
	{
		id: "duration",
		question: "How long does it last?",
		answer: "CodeQuantum lasts 12 hours.",
	},
	{
		id: "date",
		question: "When and where is it?",
		answer: "February 20, 2027, at UTSA.",
	},
	{
		id: "eligibility",
		question: "How old do I need to be to participate?",
		answer: "You must be 18 or older to register.",
	},
	{
		id: "schools",
		question: "Can students from other universities participate?",
		answer: "",
	},
	{
		id: "teams",
		question: "Do I need a team to sign up?",
		answer: "",
	},
	{
		id: "registration",
		question: "How do I register, and is it free?",
		answer: "",
	},
	{
		id: "bring",
		question: "What should I bring?",
		answer: "Bring your laptop and charger, wear comfortable clothes, and pack any extras you like to use, such as a mouse. We’ll provide drinks and snacks.",
	},
	{
		id: "start",
		question: "Can I work on my project before CodeQuantum?",
		answer: "No. Start building your project at the competition.",
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
