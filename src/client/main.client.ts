import { makeHello } from "shared/module";

print(makeHello("main.client.ts"));

while (true) {
	wait(1);
	print("firing event...");
}
