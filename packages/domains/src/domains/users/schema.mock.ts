import { createMockGenerator } from "../../utils/mock-generator";
import { randomCuid2 } from "../../utils/random";

export const mockUser = createMockGenerator({
	generator: ({ faker }) => {
		const now = new Date();
		const createdAt = faker.date.recent({ days: 30 });
		const updatedAt = faker.datatype.boolean(0.8)
			? faker.date.between({ from: createdAt, to: now })
			: null;

		return {
			id: randomCuid2(),
			isAnonymous: faker.datatype.boolean(),
			type: faker.helpers.arrayElement(["user", "admin"]),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			emailVerified: faker.datatype.boolean(),
			image: faker.image.avatar(),
			createdAt,
			updatedAt,
		};
	},
});
