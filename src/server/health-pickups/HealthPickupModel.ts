import { HealthPickupsConstants } from "server/health-pickups/HealthPickupsConstants";

export type TouchedCallback = (otherPart: BasePart, healthPickup: HealthPickupModel) => void;

export class HealthPickupModel {
	private basePart: BasePart;

	constructor(basePart: BasePart) {
		this.basePart = basePart;
	}

	init() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, true);
	}

	addTouchedEventListener(callback: TouchedCallback) {
		this.basePart.Touched.Connect((otherPart) => callback(otherPart, this));
	}

	isEnabled(): boolean {
		const isEnabled = this.basePart.GetAttribute(HealthPickupsConstants.ENABLED_ATTR);
		if (typeIs(isEnabled, "boolean")) {
			return isEnabled;
		}
		error(`unexpected attribute type for ${HealthPickupsConstants.ENABLED_ATTR}: ${typeOf(isEnabled)}`);
	}

	heal(humanoid: Humanoid) {
		if (!this.isEnabled()) {
			return;
		}
		if (humanoid.Health === 100) {
			return;
		}
		humanoid.Health = math.min(100, humanoid.Health + HealthPickupsConstants.HEAL_AMOUNT);
		this.cooldown();
	}

	private enable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, true);
		this.makeMoreVisible();
	}

	private disable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, false);
		this.makeLessVisible();
	}

	private cooldown() {
		this.disable();
		wait(HealthPickupsConstants.COOLDOWN_SEC);
		this.enable();
	}

	private makeLessVisible() {
		this.basePart.Transparency = HealthPickupsConstants.LESS_VISIBLE_TRANSPARENCY;
	}

	private makeMoreVisible() {
		this.basePart.Transparency = HealthPickupsConstants.MORE_VISIBLE_TRANSPARENCY;
	}
}
