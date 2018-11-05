import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { ComptabiliteComponent } from './components/comptabilite.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'comptabilite',
        pathMatch: 'full'
    },
    {
        path: 'comptabilite',
        component: ComptabiliteComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComptabiliteRoutingModule { } 
