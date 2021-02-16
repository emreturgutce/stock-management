import { v4 as uuid } from 'uuid';
import { CONFIRM_USER_PREFIX } from '../constants';
import { FRONTEND_URL, RedisClient } from '../config';

export async function createConfirmationUrl(userId: string): Promise<string> {
	const token = uuid();

	await RedisClient.getInstance().set(
		`${CONFIRM_USER_PREFIX}${token}`,
		userId,
		'ex',
		60 * 5,
	);

	return `${FRONTEND_URL}/user/confirm/${token}`;
}
