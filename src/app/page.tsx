import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import { PHOTO_COUNT_QUERY, PHOTO_BY_INDEX_QUERY } from "@/lib/queries";

interface Photo {
  _id: string;
  title?: string;
  image: any;
  alt?: string;
  description?: string;
}

async function getRandomPhoto(): Promise<Photo & { isVertical?: boolean } | null> {
  try {
    const photoCount = await client.fetch(PHOTO_COUNT_QUERY);
    
    if (photoCount === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * photoCount);
    const photo = await client.fetch(PHOTO_BY_INDEX_QUERY, { index: randomIndex });
    
    if (photo?.image?.asset?.metadata?.dimensions) {
      const { width, height } = photo.image.asset.metadata.dimensions;
      const isVertical = height > width;
      return { ...photo, isVertical };
    }
    
    return photo;
  } catch (error) {
    console.error('Error fetching photo:', error);
    return null;
  }
}

export default async function Home() {
  const photo = await getRandomPhoto();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Cevichepedia
        </h1>
        {photo ? (
          <div className={`${photo.isVertical ? "w-[600px]" : "w-[1000px]"} mx-auto`}>
            <div className="relative mb-4 overflow-hidden shadow-lg">
              <Image
                src={urlFor(photo.image).width(photo.isVertical ? 600 : 1000).url()}
                alt={photo.alt || photo.title || 'Photo'}
                width={photo.isVertical ? 600 : 1000}
                height={0}
                className={`${photo.isVertical ? "w-[600px]" : "w-[1000px]"} h-auto`}
                priority
              />
            </div>
            {photo.title && (
              <h2 className="text-2xl font-semibold mb-2 text-black">
                {photo.title}
              </h2>
            )}
            {photo.description && (
              <p className="text-black">
                {photo.description}
              </p>
            )}
          </div>
        ) : (
          <div className="text-black">
            <p>No photos available</p>
            <p className="text-sm mt-2">
              Make sure you have photos in your Sanity dataset
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
