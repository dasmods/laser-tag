export class CircularArray<T> {
	public readonly capacity: number;

	private ndx = 0;
	private values: T[];

	constructor(capacity: number) {
		assert(capacity > 0);
		this.capacity = capacity;
		this.values = new Array<T>(capacity);
	}

	push(value: T) {
		this.values[this.ndx] = value;
		this.ndx = this.getNextIndex();
	}

	peek(): T | undefined {
		return this.values[this.ndx];
	}

	getValues(): T[] {
		return [...this.values];
	}

	getLength(): number {
		return this.values.size();
	}

	private getNextIndex() {
		return (this.ndx + 1) % this.capacity;
	}
}
