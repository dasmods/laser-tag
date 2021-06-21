import { t } from "@rbxts/t";
import { CircularArray } from "shared/util/CircularArray";
import { sum } from "shared/util/math";

export class RunningAverage {
	readonly size: number;

	private values: CircularArray<number>;
	private sum = 0;

	constructor(size: number) {
		this.size = size;
		this.values = new CircularArray<number>(size);
	}

	push(value: number) {
		const nextValue = this.values.peek();
		if (t.number(nextValue)) {
			this.sum -= nextValue;
		}
		this.values.push(value);
		this.sum += value;
	}

	/**
	 * Determines if there is at least 1 value to consider the average
	 * defined.
	 */
	isDefined(): boolean {
		return this.getCount() > 0;
	}

	/**
	 * Determines if the running average has as many values as the caller
	 * constructed it with. For example, if a new RunningAverage(5) can
	 * return a running average after 2 data points, but it is not well defined.
	 * It's well defined after it collects at least 5 data points. It is
	 * up to the caller to determine whether or not to wait for the average
	 * to be well defined or not.
	 */
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
