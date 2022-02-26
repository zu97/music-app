import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { artistsReducer } from './store/artists.reducer';
import { ArtistsEffects } from './store/artists.effects';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { LoaderComponent } from './ui/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({artists: artistsReducer}, {}),
    EffectsModule.forRoot([ArtistsEffects]),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
