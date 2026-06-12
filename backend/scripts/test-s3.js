const { S3Client, ListObjectsV2Command, HeadBucketCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load environment variables from backend/.env
if (!process.env.DATABASE_URL) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value;
        }
      });
      console.log('Loaded environment variables.');
    }
  } catch (err) {
    console.error('Error loading .env file:', err);
  }
}

async function testS3() {
  const bucketName = 'sanpoly';
  const region = process.env.AWS_REGION || 'us-east-1'; // Default to us-east-1 matching RDS region

  console.log(`Connecting to S3 bucket "${bucketName}" in region "${region}"...`);

  // Initialize S3 Client
  const client = new S3Client({ region });

  try {
    // 1. Check bucket existence and permissions
    console.log('Checking bucket status (HeadBucket)...');
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`✓ Bucket "${bucketName}" exists and is accessible!`);

    // 2. List some objects
    console.log('Listing objects (ListObjectsV2)...');
    const response = await client.send(new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5
    }));

    console.log('✓ Successfully listed bucket objects!');
    if (response.Contents && response.Contents.length > 0) {
      console.log('Objects found in bucket:');
      response.Contents.forEach(obj => {
        console.log(`- ${obj.Key} (${obj.Size} bytes)`);
      });
    } else {
      console.log('(Bucket is currently empty)');
    }
  } catch (error) {
    console.error('✗ S3 Connection failed:');
    console.error(error);
    
    // Provide diagnostic hints
    if (error.name === 'CredentialsProviderError') {
      console.log('\nDIAGNOSTIC HINT: No AWS credentials were found on this machine.');
      console.log('Make sure AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are set in backend/.env');
    } else if (error.name === 'AccessDenied') {
      console.log('\nDIAGNOSTIC HINT: Credentials were found, but they do not have permission to access the "sanpoly" bucket.');
    }
  }
}

testS3();
