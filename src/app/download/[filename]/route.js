// app/download/[filename]/route.js
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { filename } = params;

  const imageUrl = `https://bicicleta-bucket.s3.sa-east-1.amazonaws.com/${filename}`;

  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  return new NextResponse(Buffer.from(arrayBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
