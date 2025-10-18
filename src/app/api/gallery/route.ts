import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const galleryFilePath = path.join(process.cwd(), 'src/lib/gallery.json');

async function getGalleryData() {
    try {
        const data = await fs.readFile(galleryFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return default structure
        return { galleryImages: [] };
    }
}

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json(data.galleryImages);
  } catch (error) {
    console.error('Error reading gallery file:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const galleryImages = await request.json();
    const dataToSave = { galleryImages };
    await fs.writeFile(galleryFilePath, JSON.stringify(dataToSave, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving gallery file:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
