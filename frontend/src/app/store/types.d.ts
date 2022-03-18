import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';
import { RegisterError, User } from '../models/user.model';

export type ArtistsState = {
  artists: Artist[],
  fetchLoading: boolean,
  fetchError: null | string,
};

export type AlbumsState = {
  artist: null | Artist,
  albums: Album[],
  fetchLoading: boolean,
  fetchError: null | string,
};

export type UsersState = {
  user: null | User,
  registerLoading: boolean,
  registerError: null | RegisterError
};

export type AppState = {
  artists: ArtistsState,
  albums: AlbumsState,
  users: UsersState
};
