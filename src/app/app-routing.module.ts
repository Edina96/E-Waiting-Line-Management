import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'shopSelection', loadChildren: () => import('./shop-selection/shop-selection.module').then(m => m.ShopSelectionPageModule) },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'signup2',
    loadChildren: () => import('./signup2/signup2.module').then( m => m.Signup2PageModule)
  },
  {
    path: 'queue-info',
    loadChildren: () => import('./queue-info/queue-info.module').then( m => m.QueueInfoPageModule)
  },
  {
    path: 'user-info',
    loadChildren: () => import('./scan-qr/user-info/user-info.module').then( m => m.UserInfoPageModule)
  },
  {
    path: 'add-dependent',
    loadChildren: () => import('./scan-qr/add-dependent/add-dependent.module').then( m => m.AddDependentPageModule)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule)
  },
  {
    path: 'saved-favourite',
    loadChildren: () => import('./scan-qr/saved-favourite/saved-favourite.module').then( m => m.SavedFavouritePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
