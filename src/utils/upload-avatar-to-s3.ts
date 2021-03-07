import sharp from 'sharp';
import { AWS_S3_BUCKET, S3Client } from '../config';

export const uploadAvatarToS3 = async (
	avatarId: string,
	readStream: Buffer,
) => {
	return S3Client.getInstance()
		.upload({
			Bucket: AWS_S3_BUCKET!,
			Key: avatarId,
			Body: await sharp(readStream)
				.webp({ lossless: true })
				.resize(680, 480, { fit: 'contain', background: '#fdfdfd' })
				.toBuffer(),
		})
		.send();
};
