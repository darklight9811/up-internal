export const setLerpout = (
	cb: (progress: number) => void,
	miliseconds = 1000,
) => {
	const timeStart = Date.now();
	const abortController = new AbortController();

	function interval() {
		const timeElapsed = Date.now() - timeStart;
		const progress = Math.min(timeElapsed / miliseconds, 1);
		cb(progress);

		if (progress < 1 && !abortController.signal.aborted) {
			requestAnimationFrame(interval);
		} else {
			abortController.abort();
		}
	}

	requestAnimationFrame(interval);

	return () => abortController.abort();
};
