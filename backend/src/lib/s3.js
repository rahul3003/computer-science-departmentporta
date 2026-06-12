const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = 'sanpoly';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

/**
 * Uploads a file buffer to the S3 bucket and returns the public file URL.
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @param {string} mimeType 
 * @returns {Promise<string>} S3 Object URL
 */
const uploadToS3 = async (fileBuffer, originalName, mimeType) => {
  const extension = path.extname(originalName);
  const cleanName = path.basename(originalName, extension)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
  
  // Create a unique file key
  const uniqueKey = `uploads/${Date.now()}_${cleanName}${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: mimeType
  });

  await s3Client.send(command);

  // Return S3 Object URL
  return `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueKey}`;
};

module.exports = {
  s3Client,
  uploadToS3,
  bucketName
};
