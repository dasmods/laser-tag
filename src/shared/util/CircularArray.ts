export class CircularArray<T> {
	private ndx = 0;
	private size: number;
	private actualArray: T[] = [];

	constructor(size: number) {
		assert(size > 0);
		this.size = size;
		this.actualArray = [];
	}

	push(value: T) {
		if (this.isAtEndOfActualArray()) {
			this.ndx = 0;
		}
		this.actualArray[this.ndx] = value;
		this.ndx++;
	}

	getValues(): T[] {
		return [...this.actualArray];
	}

	getLength(): number {
		return this.actualArray.size();
	}

	private isAtEndOfActualArray(): boolean {
		return this.ndx === this.size - 1;
	}
}
