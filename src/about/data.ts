import { getPhotoCached, getPhotosCached } from '@/photo/cache';
import { About } from '.';
import { TAG_FAVS } from '@/tag';
import { getAbout } from './query';
import { getAboutCached } from './cache';

const getAboutAvatar = (about?: About) =>
  about?.photoIdAvatar
    ? getPhotoCached(about?.photoIdAvatar ?? '', true)
    : undefined;

const getAboutHero = (about?: About) =>
  about?.photoIdHero
    ? getPhotoCached(about?.photoIdHero ?? '', true)
    // Fall back to favorite photos if no hero photo is set
    : getPhotosCached({ tag: TAG_FAVS, limit: 1 })
      .then(photos => photos.length > 0
        ? photos[0]
        // Fall back to oldest photo if no favorite photos exist
        : getPhotosCached({ limit: 1, sortBy: 'takenAtAsc' })
          .then(photos => photos[0]));

export const getAboutData = () =>
  getAbout()
    .then(async about => ({
      about,
      photoAvatar: await getAboutAvatar(about),
      photoHero: await getAboutHero(about),
    }));

export const getAboutDataCached = () =>
  getAboutCached()
    .then(async about => ({
      about,
      photoAvatar: await getAboutAvatar(about),
      photoHero: await getAboutHero(about),
    }));
