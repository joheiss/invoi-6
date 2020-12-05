import {NgModule} from '@angular/core';
import {AuthenticationGuard, AuthorizationGuard} from '../auth/guards';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ShellComponent} from './shell/shell.component';

const APP_ROUTES: Routes = [
  { path: '', component: ShellComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'invoicing',
        // loadChildren: () => import('../invoicing/invoicing.module').then(m => m.InvoicingModule),
        loadChildren: '../invoicing/invoicing.module#InvoicingModule',
        canLoad: [AuthenticationGuard, AuthorizationGuard],
        canActivate: [AuthenticationGuard, AuthorizationGuard],
        data: { roles: ['sales-user', 'auditor'] }
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES, {
    preloadingStrategy: PreloadAllModules,
    paramsInheritanceStrategy: 'always',
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
}) // , enableTracing: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
