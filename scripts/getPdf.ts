import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;
const PREFIX = process.env.S3_PREFIX || '';
const outputPath = path.resolve(__dirname, 'data.json');

async function listPdfFiles(): Promise<string[]> {
  const listCommand = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: PREFIX,
  });
  const res = await s3.send(listCommand);
  return res.Contents?.filter(obj => obj.Key?.endsWith('.pdf')).map(obj => obj.Key!) || [];
}

async function getPdfBuffer(key: string): Promise<Buffer> {
  const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  const res = await s3.send(getCommand);
  const stream = res.Body as any as AsyncIterable<Uint8Array>;

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function extractUrlFromKey(key: string): string {
  return `https://www.childwelfare.gov/${key}`;
}

function extractTitleFromKey(key: string): string {
  const filename = key.split('/').pop();
  return filename?.replace(/\.pdf$/, '').replace(/[-_]/g, ' ') || 'Untitled';
}

async function main() {
  if (!BUCKET_NAME) throw new Error('Missing required environment variable: S3_BUCKET_NAME');

  const files = await listPdfFiles();
  const results: any[] = [];

  for (const key of files) {
    try {
      console.log(`Processing: ${key}`);
      const buffer = await getPdfBuffer(key);
      const data = await pdfParse(buffer);

      results.push({
        url: extractUrlFromKey(key),
        title: extractTitleFromKey(key),
        content: data.text,
      });
    } catch (err) {
      console.error(`Failed to process ${key}:`, err);
    }
  }

  let existingData: any[] = [];
  if (fs.existsSync(outputPath)) {
    const raw = fs.readFileSync(outputPath, 'utf-8');
    existingData = JSON.parse(raw);
  }

  const seen = new Set(existingData.map(item => item.url));
  const merged = [...existingData];
  for (const result of results) {
    if (!seen.has(result.url)) {
      merged.push(result);
      seen.add(result.url);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`Merged ${results.length} new PDF entries into ${outputPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
});