export class TTLStore<T> {
	private store: Record<string | number, T | undefined> = {};
	// Number of secs
	private ttl: number;
	private size = 0;

	constructor(ttl: number) {
		this.ttl = ttl;
	}

	set(key: string | number, val: T) {
		if (!(key in this.store)) {
			this.size++;
		}

		this.store[key] = val;

		delay(this.ttl, () => {
			this.remove(key);
		});
	}

	get(key: string | number): T | undefined {
		return this.store[key];
	}

	getSize() {
		return this.size;
	}

	remove(key: string | number) {
		if (key in this.store) {
			this.size--;
		}

		this.store[key] = undefined;
	}
}
