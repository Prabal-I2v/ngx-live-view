import { ElementRef, NgModule, Renderer2 } from '@angular/core';
import { NgxLiveViewComponent } from './ngx-live-view.component';
import { VideoGridComponent } from './video-grid/video-grid.component';
import { GridComponent } from './grid/grid.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { I2vVideoGridComponent } from './i2v-video-grid/i2v-video-grid.component';
import { EventCardComponent } from './event-card/event-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WebPlayerComponent } from './web-player/web-player.component';
import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NgxLiveViewService } from './ngx-live-view.service';
import { MatDialogModule } from '@angular/material/dialog';
import { EventDetailsComponent } from './event-details/event-details.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { FaceCardComponent } from './face-card/face-card.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GridToolbarComponent } from './grid-toolbar/grid-toolbar.component';
import { TitlecasePipe } from './titlecase.pipe';
import { i2vUtilityModule } from 'node_modules/@i2v-systems/i2v-utility';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';



export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    NgxLiveViewComponent,
    VideoGridComponent,
    GridComponent,
    I2vVideoGridComponent,
    EventCardComponent,
    WebPlayerComponent,
    EventDetailsComponent,
    FaceCardComponent,
    GridToolbarComponent,
    TitlecasePipe, 

    
  ],
  imports: [
    MatMenuModule,
    //ColorsUtilityModule,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDividerModule, 
    MatListModule, 
    MatIconModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      defaultLanguage: 'English',
    }),
    i2vUtilityModule,
    MatButtonToggleModule,

    
    
    
  ],
  exports: [
    NgxLiveViewComponent,
    VideoGridComponent,
    EventCardComponent,
    GridToolbarComponent,
    EventDetailsComponent

  ],
  providers: [ { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    NgxLiveViewService, TranslateModule, 
  ],
})
export class NgxLiveViewModule {}
