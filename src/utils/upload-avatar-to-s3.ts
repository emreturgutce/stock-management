import { AWS_S3_BUCKET, s3 } from '../config';

export const uploadAvatarToS3 = (avatarId: string, readStream: Buffer) => {
    return s3
        .upload({
            Bucket: AWS_S3_BUCKET!,
            Key: avatarId,
            Body: readStream,
        })
        .promise();
};
