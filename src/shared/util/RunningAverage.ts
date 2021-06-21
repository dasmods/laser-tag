import { t } from "@rbxts/t";
import { CircularArray } from "shared/util/CircularArray";

export class RunningAverage {
	readonly size: number;

	private values: CircularArray<number>;
	private sum = 0;

	constructor(size: number) {
		this.size = size;
		this.values = new CircularArray<number>(size);
	}

	push(value: number) {
		const nextValue = this.values.peekNext();
		if (t.number(nextValue)) {
			this.sum -= nextValue;
		}
		this.values.push(value);
		this.sum += value;
	}

	isDefined(): boolean {
		return this.getCount() > 0;
	}

	isWellDefined(): boolean {
		return this.getCount() === this.size;
	}

	get(): number {
		const count = this.getCount();
		if (count === 0) {
			error("running average is undefined");
		}
		return this.sum / count;
	}

	private getCount() {
		return this.values.getLength();
	}
}
