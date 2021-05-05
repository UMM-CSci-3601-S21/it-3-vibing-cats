import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AddWordListComponent } from './wordlists/add-wordlist/add-wordlist.component';
import { DisplayWordlistComponent } from './wordlists/display-wordlist/display-wordlist.component';
import { ImportWordlistComponent } from './wordlists/import-wordlist/import-wordlist.component';
import { WordCardComponent } from './words/word-card/word-card.component';
import { AddWordComponent } from './words/add-word/add-word.component';
import { WordListService } from './services/wordlist.service';
import { ViewWordlistComponent } from './wordlists/view-wordlist/view-wordlist.component';
import { WordlistCardComponent } from './wordlists/wordlist-card/wordlist-card.component';
import { WordFormComponent } from './words/word-form/word-form.component';
import { DisplayContextPacksComponent } from './context-packs/display-contextPacks/display-context-packs.component';
import { ContextPackCardComponent } from './context-packs/contextPack-card/context-pack-card.component';
import { AddContextPackComponent } from './context-packs/add-contextPacks/add-contextPacks.component';
import { ContextPackService } from './services/contextPack-service/contextpack.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './auth/login/login.component';
import {MatTabsModule} from '@angular/material/tabs';
import { UserService } from './services/user-service/user.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LearnerCardComponent } from './learners/learner-card/learner-card.component';
import { CreateLearnerComponent } from './learners/create-learner/create-learner.component';
import { EditLearnerComponent } from './learners/edit-learner/edit-learner.component';

const MATERIAL_MODULES: any[] = [
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatMenuModule,
  MatSidenavModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatSelectModule,
  MatOptionModule,
  MatFormFieldModule,
  MatDividerModule,
  MatRadioModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    AddWordListComponent,
    DisplayWordlistComponent,
    ImportWordlistComponent,
    WordCardComponent,
    AddWordComponent,
    ViewWordlistComponent,
    WordlistCardComponent,
    WordFormComponent,
    DisplayContextPacksComponent,
    ContextPackCardComponent,
    AddContextPackComponent,
    LoginComponent,
    LearnerCardComponent,
    CreateLearnerComponent,
    EditLearnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MATERIAL_MODULES,
    LayoutModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
  providers: [
    WordListService,
    ContextPackService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
