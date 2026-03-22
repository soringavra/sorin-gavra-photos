import AdminAboutEditPage from '@/about/AdminAboutEditPage';
import { getAboutData } from '@/about/data';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import { feedQueryOptions } from '@/feed';
import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import { TAG_FAVS } from '@/tag';

const PHOTO_CHOOSER_QUERY_OPTIONS = feedQueryOptions({
  isGrid: true,
  excludeFromFeeds: false,
});

export default async function AboutEditPage() {
  const [
    {
      about,
      photoAvatar,
      photoHero,
    },
    photos,
    photosCount,
    photosFavs,
  ] = await Promise.all([
    getAboutData()
      .catch(() => ({
        about: undefined,
        photoAvatar: undefined,
        photoHero: undefined,
      })),
    getPhotosCached(PHOTO_CHOOSER_QUERY_OPTIONS)
      .catch(() => []),
    getPhotosMetaCached(PHOTO_CHOOSER_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosCached({ tag: TAG_FAVS })
      .catch(() => []),
  ]);

  return (
    <AdminAboutEditPage {...{
      about,
      photoAvatar,
      photoHero,
      photos,
      photosCount,
      photosFavs,
      shouldResizeImages: !PRESERVE_ORIGINAL_UPLOADS,
    }} />
  );
}
