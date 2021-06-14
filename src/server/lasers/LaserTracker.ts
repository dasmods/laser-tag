import { Debris, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import {
	LASER_HITBOX_MULTIPLIER,
	LASER_LIFETIME_SEC,
	LASER_SIZE_X_STUDS,
	LASER_SIZE_Y_STUDS,
	LASER_SIZE_Z_STUDS,
	LASER_SPEED_STUDS_PER_SEC,
} from "shared/lasers/LasersConstants";
import { Block, RotatedRegion3 } from "shared/util/RotatedRegion3";

export type LaserTrackEvent = { firedFrom: CFrame; firedBy: Player; firedAt: number };

type LaserTrackerStore = { [laserId: string]: LaserTrackEvent | undefined };

export class LaserTracker {
	private store: LaserTrackerStore = {};

	detectHits(laserId: string): BasePart[] {
		const trackEvent = this.get(laserId);
		if (t.nil(trackEvent)) {
			return [];
		}
		const now = tick();
		const laserHitBox = this.calculateLaserHitboxRegion(now, trackEvent);
		return laserHitBox.Cast();
	}

	track(laserId: string, trackEvent: LaserTrackEvent) {
		if (this.isTracked(laserId)) {
			warn(`laser is already tracked, ignoring laserId: ${laserId}`);
			return;
		}

		this.store[laserId] = trackEvent;

		// Ensure that the laser gets untracked to prevent memory leaks.
		delay(LASER_LIFETIME_SEC, () => {
			this.untrack(laserId);
		});
	}

	untrack(laserId: string) {
		print(this.store);
		this.store[laserId] = undefined;
	}

	isTracked(laserId: string) {
		const trackEvent = this.get(laserId);
		return !t.nil(trackEvent);
	}

	private get(laserId: string): LaserTrackEvent | undefined {
		return this.store[laserId];
	}

	private calculateLaserHitboxRegion(at: number, trackEvent: LaserTrackEvent): RotatedRegion3 {
		const laserHitBoxSize = new Vector3(LASER_SIZE_X_STUDS, LASER_SIZE_Y_STUDS, LASER_SIZE_Z_STUDS).mul(
			LASER_HITBOX_MULTIPLIER,
		);

		const timeElapsedSec = at - trackEvent.firedAt;
		const distanceTraveledStuds = timeElapsedSec * LASER_SPEED_STUDS_PER_SEC;
		const offsetCFrame = new CFrame(0, 0, -distanceTraveledStuds);
		const approximateHitCFrame = trackEvent.firedFrom.ToWorldSpace(offsetCFrame);

		// TODO(jared) Remove this when done testing.
		this.renderPart(approximateHitCFrame, laserHitBoxSize);

		return Block(approximateHitCFrame, laserHitBoxSize);
	}

	private renderPart(cFrame: CFrame, size: Vector3) {
		const part = new Instance("Part");
		part.Anchored = true;
		part.CanCollide = false;
		part.CFrame = cFrame;
		part.Size = size;
		part.Color = new Color3(1, 0, 0);
		part.Transparency = 0.5;
		part.Parent = Workspace;
		Debris.AddItem(part, 20);
	}
}
