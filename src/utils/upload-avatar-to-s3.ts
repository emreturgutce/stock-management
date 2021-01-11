import { AWS_S3_BUCKET, S3Client } from '../config';

export const uploadAvatarToS3 = (avatarId: string, readStream: Buffer) => {
    return S3Client.getInstance()
        .upload({
            Bucket: AWS_S3_BUCKET!,
            Key: avatarId,
            Body: readStream,
        })
        .promise();
};
