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

	enable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, true);
		this.makeMoreVisible();
	}

	disable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, false);
		this.makeLessVisible();
	}

	heal(humanoid: Humanoid) {
		humanoid.Health += HealthPickupsConstants.HEAL_AMOUNT;
	}

	cooldown() {
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
