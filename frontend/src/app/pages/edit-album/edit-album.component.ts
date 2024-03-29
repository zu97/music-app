import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/types';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist.model';
import { fetchArtistsRequest } from '../../store/artists.actions';
import { AddAlbumData } from '../../models/album.model';
import { addAlbumRequest } from '../../store/albums.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})
export class EditAlbumComponent implements OnInit {
  @ViewChild('f') form!: NgForm;
  isLoading: Observable<boolean>;

  artists: Observable<Artist[]>;
  artistsLoading: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    this.isLoading = store.select(state => state.albums.addLoading);
    this.artists = store.select(state => state.artists.artists);
    this.artistsLoading = store.select(state => state.artists.fetchLoading);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const artistId = <undefined | string>params['artist'];

      if (artistId) {
        this.setArtistValue(artistId);
      } else {
        this.setArtistValue('');
      }
    });

    this.store.dispatch(fetchArtistsRequest());
  }

  setArtistValue(value: string) {
    setTimeout(() => {
      this.form.form.get('artist')?.setValue(value);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const addAlbumData: AddAlbumData = this.form.value;
    this.store.dispatch(addAlbumRequest({albumData: addAlbumData}))
  }

}
