import { Routes } from '@angular/router';

import { HomepageComponent } from './pages/homepage/homepage.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HomepageMaincontentComponent } from './component/homepage-maincontent/homepage-maincontent.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path: '', component: HomepageComponent},
    {path: 'main', component: HomepageMaincontentComponent},
    {path: 'login', component:LoginComponent}
];
