"use client";

import QRCode from "react-qr-code";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { PASS_COPY } from "./content";

// Tri Nguyen: The card's QR wrapper has this id so SavePassButton can find the code on the page.
export const PASS_QR_ID = "pass-qr";

// Tri Nguyen: The check-in QR. Volunteers scan it with the admin scanner (components/admin/scanner/PassScanner.tsx). Dark plum on white for contrast.
export function PassQrCode({ payload }: { payload: string }) {
	return (
		<QRCode
			value={payload}
			fgColor="#3D2340"
			bgColor="#FFFFFF"
			level="M"
			style={{ width: "100%", height: "auto" }}
		/>
	);
}

// Tri Nguyen: Opens a big QR so it scans easily. Used by tapping the card's QR and by the "Show QR full screen" button.
export function QrDialog({
	payload,
	children,
}: {
	payload: string;
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-[92vw] max-w-[460px] rounded-2xl border-cq-gold bg-white p-6">
				<DialogTitle className="text-center font-grenze text-xl font-semibold text-cq-ink">
					{PASS_COPY.qrDialogTitle}
				</DialogTitle>
				<PassQrCode payload={payload} />
			</DialogContent>
		</Dialog>
	);
}

// Tri Nguyen: Saves the card's QR as a PNG (white border included) so hackers can check in without signing in again.
export function SavePassButton({ className }: { className?: string }) {
	function savePass() {
		const svg = document.querySelector(`#${PASS_QR_ID} svg`);
		if (!svg) return;
		const svgUrl = URL.createObjectURL(
			new Blob([new XMLSerializer().serializeToString(svg)], {
				type: "image/svg+xml",
			}),
		);
		const image = new Image();
		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = canvas.height = 1024;
			const context = canvas.getContext("2d");
			if (!context) return;
			context.fillStyle = "#FFFFFF";
			context.fillRect(0, 0, 1024, 1024);
			context.drawImage(image, 64, 64, 896, 896);
			URL.revokeObjectURL(svgUrl);
			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = PASS_COPY.qrFileName;
			link.click();
		};
		image.src = svgUrl;
	}

	return (
		<button type="button" onClick={savePass} className={className}>
			{PASS_COPY.savePass}
		</button>
	);
}
