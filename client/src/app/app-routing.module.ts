import { EditLearnerComponent } from './learners/edit-learner/edit-learner.component';
import { LoginComponent } from './auth/login/login.component';
import { DisplayWordlistComponent } from './wordlists/display-wordlist/display-wordlist.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewWordlistComponent } from './wordlists/view-wordlist/view-wordlist.component';
import { AddWordListComponent } from './wordlists/add-wordlist/add-wordlist.component';
import { ImportWordlistComponent } from './wordlists/import-wordlist/import-wordlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayContextPacksComponent } from './context-packs/display-contextPacks/display-context-packs.component';
import { AddContextPackComponent } from './context-packs/add-contextPacks/add-contextPacks.component';
import { CreateLearnerComponent } from './learners/create-learner/create-learner.component';
import { AuthGuard } from './auth/guards/auth-guard';

export const COMMON_IMPORTS = [
  MatButtonModule,
  MatCardModule,
  MatOptionModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule,
  BrowserAnimationsModule,
];

const routes: Routes = [
  {path: '', component: LoginComponent,data: {animation: 'LoginPage'}},
  {path: 'home', component: DisplayContextPacksComponent,data: {animation: 'HomePage'},canActivate:[AuthGuard]},
  {path: 'packs/new', component: AddContextPackComponent,canActivate:[AuthGuard]},
  {path: 'packs/:id', component: DisplayWordlistComponent,canActivate:[AuthGuard]},
  {path: 'packs/:id/import', component: ImportWordlistComponent,canActivate:[AuthGuard]},
  {path: 'packs/:id/new', component: AddWordListComponent,canActivate:[AuthGuard]},
  {path: 'packs/:id/:name', component: ViewWordlistComponent,canActivate:[AuthGuard]},
  {path: 'learners/new', component: CreateLearnerComponent,canActivate:[AuthGuard]},
  {path: 'learners/:id', component: EditLearnerComponent,canActivate:[AuthGuard]},
  {path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
