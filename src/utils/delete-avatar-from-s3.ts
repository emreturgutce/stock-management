import { AWS_S3_BUCKET, S3Client } from '../config';

export const deleteAvatarFromS3 = async (avatarId: string) => {
	return S3Client.getInstance()
		.deleteObject({
			Bucket: AWS_S3_BUCKET,
			Key: avatarId,
		})
		.promise();
};
