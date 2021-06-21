export class TTLStore<T> {
	private store: Record<string, T | undefined> = {};
	// Number of secs
	private ttl: number;

	constructor(ttl: number) {
		this.ttl = ttl;
	}

	set(key: string, val: T) {
		this.store[key] = val;

		delay(this.ttl, () => {
			this.remove(key);
		});
	}

	get(key: string): T | undefined {
		return this.store[key];
	}

	remove(key: string) {
		this.store[key] = undefined;
	}
}
