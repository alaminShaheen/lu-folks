import { Group, PrismaClient, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
	const personGenerator = async (count: number = 1) => {
		const firstNames = faker.helpers
			.uniqueArray(faker.person.firstName, count)
			.map((name) => name.toLowerCase());

		try {
			return await Promise.all(
				firstNames.map(async (firstName) => {
					return prisma.user.create({
						data: {
							email: faker.internet.email({
								firstName: firstName,
								provider: "seed.com",
								lastName: firstName,
							}),
							username: firstName,
							password: await bcrypt.hash(firstName, 10),
							imageUrl: faker.image.url({ width: 500, height: 500 }),
						},
					});
				}),
			);
		} catch (error: any) {
			console.log("Error seeding users");
			console.log(error.message);
		}
	};

	const groupGenerator = async (count: number = 1, users: User[]) => {
		const groupTitles = faker.helpers.uniqueArray(faker.company.buzzNoun, count);

		try {
			return await Promise.all(
				groupTitles.map(async (title, index) => {
					return prisma.group.create({
						data: {
							title,
							creator: {
								connect: { id: users[index % users.length].id },
							},
							groupMembers: {
								connect: users.map((user) => ({ id: user.id })),
							},
						},
					});
				}),
			);
		} catch (error: any) {
			console.log("Error seeding groups");
			console.log(error.message);
		}
	};

	const postGenerator = async (count: number = 1, users: User[], groups: Group[]) => {
		const postTitles = faker.helpers.uniqueArray(faker.company.buzzPhrase, count);

		try {
			return await Promise.all(
				postTitles.map(async (title, index) => {
					return prisma.post.create({
						data: {
							title,
							creator: {
								connect: { id: users[index % users.length].id },
							},
							group: {
								connect: { id: groups[index % groups.length].id },
							},
							content: `{"time":1700017440183,"blocks":[{"id":"DOX4diMO3t","type":"paragraph","data":{"text":"${faker.lorem.sentence()}"}}],"version":"2.28.2"}`,
							postReactions: {
								createMany: {
									data: users.map((user) => ({
										userId: user.id,
										type: faker.number.int({ min: 0, max: 1 })
											? "LIKE"
											: "UNLIKE",
									})),
								},
							},
							comments: {
								createMany: {
									data: users.map((user) => ({
										comment: faker.music.songName(),
										commenterId: user.id,
									})),
								},
							},
						},
					});
				}),
			);
		} catch (error: any) {
			console.log("Error seeding groups");
			console.log(error.message);
		}
	};

	// const users = await personGenerator(10);
	// if (users) {
	// 	const groups = await groupGenerator(25, users);
	// 	if (groups) {
	// 		const posts = await postGenerator(60, users, groups);
	// 	}
	// }
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
