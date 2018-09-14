 import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import * as fromContainers from './containers';
import * as fromGuards from './guards';

const INVOICING_ROUTES: Routes = [
  {
    path: '',
    component: fromContainers.InvoicingComponent,
    canActivate: [
      fromGuards.NumberRangesGuard, fromGuards.SettingsGuard,
      fromGuards.ReceiversGuard, fromGuards.ContractsGuard, fromGuards.InvoicesGuard
    ],
    children: [
      {
        path: '',
        component: fromContainers.OverviewComponent,
        canActivate: [
          fromGuards.RevenuesGuard, fromGuards.OpenInvoicesGuard
        ]
      },
      {
        path: 'receivers',
        component: fromContainers.ReceiversComponent,
        canActivate: [
          fromGuards.NumberRangesGuard, fromGuards.SettingsGuard,
          fromGuards.ReceiversGuard, fromGuards.ContractsGuard, fromGuards.InvoicesGuard
        ]
      },
      {
        path: 'receivers/:id',
        component: fromContainers.ReceiverDetailsComponent,
        canActivate: [
          fromGuards.ReceiverExistsGuard
        ]
      },
      {
        path: 'contracts',
        component: fromContainers.ContractsComponent,
        canActivate: [
          fromGuards.NumberRangesGuard, fromGuards.SettingsGuard,
          fromGuards.ContractsGuard, fromGuards.ReceiversGuard, fromGuards.InvoicesGuard
        ]
      },
      {
        path: 'contracts/:id',
        component: fromContainers.ContractDetailsComponent,
        canActivate: [
          fromGuards.ContractExistsGuard
        ]
      },
      {
        path: 'confirmations',
        component: fromContainers.ConfirmationsComponent
      },
      {
        path: 'invoices',
        component: fromContainers.InvoicesComponent,
        canActivate: [
          fromGuards.NumberRangesGuard, fromGuards.SettingsGuard,
          fromGuards.ContractsGuard, fromGuards.ReceiversGuard, fromGuards.InvoicesGuard
        ]
      },
      {
        path: 'invoices/:id',
        component: fromContainers.InvoiceDetailsComponent,
        canActivate: [
          fromGuards.InvoiceExistsGuard
        ]
      },
      {
        path: 'settings',
        component: fromContainers.SettingsComponent,
        canActivate: [
          fromGuards.SettingsGuard
        ]
      },
      {
        path: 'settings/countries',
        component: fromContainers.CountryListComponent,
        canActivate: [
          fromGuards.SettingsGuard
        ]
      },
      {
        path: 'settings/vats',
        component: fromContainers.VatListComponent,
        canActivate: [
          fromGuards.SettingsGuard
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(INVOICING_ROUTES)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ...fromGuards.guards
  ]
})
export class InvoicingRoutingModule {}
