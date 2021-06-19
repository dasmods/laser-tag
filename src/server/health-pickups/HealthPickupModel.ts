import { t } from "@rbxts/t";
import { HealthPickupsConstants } from "server/health-pickups/HealthPickupsConstants";
import { Model } from "shared/util/models";

type TouchedCallback = (otherPart: BasePart, healthPickup: HealthPickupModel) => void;

type HealableEntity = {
	Health: number;
};

export class HealthPickupModel extends Model {
	private basePart: BasePart;

	constructor(basePart: BasePart) {
		super();
		this.basePart = basePart;
	}

	init() {
		this.enable();
	}

	onTouched(callback: TouchedCallback) {
		this.basePart.Touched.Connect((otherPart) => callback(otherPart, this));
	}

	isEnabled(): boolean {
		const isEnabled = this.basePart.GetAttribute(HealthPickupsConstants.ENABLED_ATTR);
		assert(t.boolean(isEnabled));
		return isEnabled;
	}

	heal(entity: HealableEntity) {
		if (!this.isEnabled()) {
			return;
		}
		if (entity.Health === 100) {
			return;
		}
		entity.Health = math.min(100, entity.Health + HealthPickupsConstants.HEAL_AMOUNT);
		this.cooldown();
	}

	private enable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, true);
		this.increaseVisibility();
	}

	private disable() {
		this.basePart.SetAttribute(HealthPickupsConstants.ENABLED_ATTR, false);
		this.decreaseVisibility();
	}

	private cooldown() {
		this.disable();
		wait(HealthPickupsConstants.COOLDOWN_SEC);
		this.enable();
	}

	private decreaseVisibility() {
		this.basePart.Transparency = HealthPickupsConstants.LESS_VISIBLE_TRANSPARENCY;
	}

	private increaseVisibility() {
		this.basePart.Transparency = HealthPickupsConstants.MORE_VISIBLE_TRANSPARENCY;
	}
}
