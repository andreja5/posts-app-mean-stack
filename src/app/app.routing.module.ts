import { AuthGuard } from './auth/auth.guard';
import { KreirajPostComponent } from './postovi/kreiraj-post/kreiraj-post.component';
import { ListaPostovaComponent } from './postovi/lista-postova/lista-postova.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListaPostovaComponent },
  { path: 'kreiraj', component: KreirajPostComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: KreirajPostComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}