export const sum = (nums: number[]): number => nums.reduce((total, num) => total + num, 0);

export const avg = (nums: number[]): number => {
	if (nums.size() === 0) {
		error("cannot average empty data");
	}
	return sum(nums) / nums.size();
};
