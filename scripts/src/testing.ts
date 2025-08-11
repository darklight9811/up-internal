import { beforeAll, jest, mock } from "bun:test";

beforeAll(() => {
	jest.clearAllMocks();
	mock.restore();
})