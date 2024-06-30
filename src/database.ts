
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserIds(limit: number) {
    try {
        const result = await prisma.users.findMany({
            take: limit,
        });

        const user_ids = result.map(row => row.user_id);

        return user_ids;
    } catch (error) {
        console.error(`Error fetching ${limit} user_ids:`, error);
    }
}

async function getUserSubmissionMessageIds(user_id: string, limit: number) {
    try {
        const result = await prisma.submissions.findMany({
            take: limit,
            where: { user_id: user_id },
        })

        const message_ids = result.map(row => row.message_id).filter((id): id is string => id !== null);

        return message_ids;
    } catch (error) {
        console.error(`Error fetching ${limit} message_ids from user_id: ${user_id}`);
    }
}

async function getLeaderboard(): Promise<{user_id: string, total_likes: number}[] | undefined> {
    try {
        const leaderboard = await prisma.submissions.groupBy({
            by: 'user_id',
            _sum: {
                likes: true,
            },
            orderBy: {
                _sum: {
                    likes: 'desc',
                },
            },
            take: 10
        });

        const result = leaderboard
            .filter((row): row is {user_id: string, _sum: { likes: number }} => row.user_id !== null && row._sum.likes !== null)
            .map(row => {
                return {
                    user_id: row.user_id,
                    total_likes: row._sum.likes
                };
            });

        return result;
    } catch (error) {
        console.error('Unable to fetch leaderboard')
        return undefined;
    }
}

async function updateSubmissionLikes(message_id: string, new_likes: number) {
    try {
        const result = await prisma.submissions.updateMany({
            where: { message_id: message_id },
            data: { likes: new_likes },
        });

        if (result.count > 0) {
            console.log(`Updated submission associated with message_id ${message_id} to a like count of ${new_likes}`);
        } else {
            console.log(`No submission found with message_id ${message_id} to update.`);
        }
    } catch (error) {
        console.error(`Error updating likes for submission associated with message_id ${message_id}:`, error);
    }
}

async function newUserIfNotExist(user_id: string) {
    try {
        await prisma.users.upsert({
            where: { user_id: user_id },
            update: {},
            create: { user_id: user_id }
        })
        console.log(`User ensured with user_id: ${user_id}`);
    } catch (error) {
        console.error(`Error ensuring user with user_id ${user_id}:`, error);
    }
}

async function newSubmission(message_id: string, user_id: string) {
    try {
        await newUserIfNotExist(user_id);

        await prisma.submissions.create({
            data: {
                message_id: message_id,
                user_id: user_id
            }
        });

    } catch (error) {
        console.error(`Error adding new submission with message_id ${message_id} and user_id ${user_id}:`, error);
    }
}

async function removeSubmission(message_id: string) {
    try {
        const result = await prisma.submissions.deleteMany({
            where: {
                message_id: message_id
            }
        })
        console.log(`${result.count} submissions deleted for message_id ${message_id}`);
    } catch (error) {
        console.error(`Error attempting to remove any submissions associated with message_id ${message_id}`, error);
    }
}

async function getTotalLikes(user_id: string): Promise<number> {
    const result = await prisma.submissions.aggregate({
        _sum: {
            likes: true
        },
        where: {
            user_id: user_id,
        }
    });

    return result._sum.likes ?? 0;
}

async function testDatabase() {
    await prisma.$connect();
    await prisma.$disconnect();

    console.log("prisma database online");
}

class UserDatabase {
    getUserIds = getUserIds;
    getUserSubmissionMessageIds = getUserSubmissionMessageIds;
    getLeaderboard = getLeaderboard;
    updateSubmissionLikes = updateSubmissionLikes;
    newSubmission = newSubmission;
    removeSubmission = removeSubmission;
    getTotalLikes = getTotalLikes;
    testDatabase = testDatabase;
}

const database: UserDatabase = new UserDatabase();

export default database;
