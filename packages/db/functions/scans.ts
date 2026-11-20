import { db, eq } from "..";
import { scans } from "../schema";

// Tri Nguyen: Every event check-in for one hacker. The hacker pass Quest Log uses it to mark events as scanned and show the scan time.
export function getScansForUser(userID: string) {
	return db.query.scans.findMany({
		where: eq(scans.userID, userID),
		columns: { eventID: true, updatedAt: true },
	});
}
