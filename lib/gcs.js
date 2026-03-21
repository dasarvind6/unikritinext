import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const bucketName = process.env.GCP_BUCKET_NAME || 'lms-secure-videos';

export const bucket = storage.bucket(bucketName);

/**
 * Generate a signed URL for uploading to GCS directly from client
 * @param {string} filename 
 * @param {string} contentType 
 */
export async function generateV4UploadSignedUrl(filename, contentType) {
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  };

  const [url] = await bucket.file(filename).getSignedUrl(options);
  return url;
}

/**
 * Generate a signed URL for secure download/streaming access
 * @param {string} filename 
 */
export async function generateV4ReadSignedUrl(filename) {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  };

  const [url] = await bucket.file(filename).getSignedUrl(options);
  return url;
}
