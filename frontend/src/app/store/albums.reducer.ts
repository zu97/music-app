import { createReducer, on } from '@ngrx/store';
import {
  addAlbumFailure,
  addAlbumRequest,
  addAlbumSuccess,
  fetchAlbumsFailure,
  fetchAlbumsRequest,
  fetchAlbumsSuccess,
  publishAlbumFailure,
  publishAlbumRequest,
  publishAlbumSuccess,
  removeAlbumFailure,
  removeAlbumRequest,
  removeAlbumSuccess
} from './albums.actions';
import { AlbumsState } from './types';

const initialState: AlbumsState = {
  artist: null,
  albums: [],
  fetchLoading: false,
  fetchError: null,
  addLoading: false,
  addError: null,
  publishLoading: false,
  removeLoading: false,
};

export const albumsReducer = createReducer(
  initialState,
  on(fetchAlbumsRequest, state => ({...state, fetchLoading: true})),
  on(fetchAlbumsSuccess, (state, { artist, albums }) => ({...state, artist, albums , fetchLoading: false})),
  on(fetchAlbumsFailure, (state, { error }) => ({...state, fetchLoading: false, fetchError: error})),

  on(addAlbumRequest, state => ({...state, addLoading: true, addError: null})),
  on(addAlbumSuccess, state => ({...state, addLoading: false})),
  on(addAlbumFailure, (state, {error}) => ({...state, addLoading: false, addError: error})),

  on(publishAlbumRequest, (state, { id }) => ({...state, publishLoading: id})),
  on(publishAlbumSuccess, state => ({...state, publishLoading: false})),
  on(publishAlbumFailure, state => ({...state, publishLoading: false})),

  on(removeAlbumRequest, (state, { id }) => ({...state, removeLoading: id})),
  on(removeAlbumSuccess, state => ({...state, removeLoading: false})),
  on(removeAlbumFailure, state => ({...state, removeLoading: false})),
);
