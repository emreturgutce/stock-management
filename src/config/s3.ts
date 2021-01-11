import { S3 } from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '.';
class S3Client {
    private static client: S3;

    static getInstance(): S3 {
        if (!S3Client.client) {
            S3Client.client = new S3({
                credentials: {
                    accessKeyId: AWS_ACCESS_KEY_ID,
                    secretAccessKey: AWS_SECRET_ACCESS_KEY,
                },
            });
        }

        return S3Client.client;
    }
}

S3Client.getInstance();

export { S3Client };
