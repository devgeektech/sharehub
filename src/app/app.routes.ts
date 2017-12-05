import { provideRouter, RouterConfig } from '@angular/router';

import {LoginComponent} from './AuthModule/login.component';
import {HomeComponent} from './Home/home.component';
import {ContentComponent} from './Home/content/content.component';
import {PersonComponent} from './Home/person/person.component';
import {PersonlocationComponent} from './Home/personlocation/personlocation.component';
import {PersoncaptionComponent} from './Home/personcaption/personcaption.component';
import {HomepostComponent} from './Home/homepost/homepost.component';
import {DiscoverpostComponent} from './Home/discoverpost/discoverpost.component';
import {DiscoverComponent} from './Home/discover/discover.component';
import {ProfileComponent} from './Home/profile/profile.component';
import {ProfileeditComponent} from './Home/profileedit/profile-edit.component';
import {ResetpasswordComponent} from './Resetpassword/reset.component';
import {PrivacyComponent} from './Privacy/privacy.component';
import {TermsComponent} from './Terms/terms.component';
import {EulaComponent} from './eula/eula.component';
import {PageComponent} from './Home/pageloading.component';
import {ShopComponent} from './Home/shop/shop.component';
import {ProductComponent} from './Home/product/product.component';
import { CreatepostComponent } from './Home/createpost/createpost.component';
import { UpdatepostComponent } from './Home/updatepost/updatepost.component';
import { ListComponent } from './Home/list/list.component';
export const routes: RouterConfig = [
  // { path: '', redirectTo: 'login', terminal: true },
  { path: 'login', component: LoginComponent },
  { path: 'reset/:reset_token', component: ResetpasswordComponent },
  { path: 'createpost', component: CreatepostComponent },
   { path: 'updatepost/:postId', component: UpdatepostComponent },
  { path: ':name/lists', component: ListComponent },
  { path: ':name/lists/:listname', component: ListComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'eula', component: EulaComponent },
  { path: 'terms', component: TermsComponent },
  { path: ':name/shop', component: ShopComponent }, 
  { path: ':name/shop/category/:categoryName', component: ShopComponent }, 
  { path: ':name/shop/:Productid', component: ProductComponent }, 
  { path: '', component: ContentComponent, terminal: true },  
  { path: 'location/:name', component: PersonlocationComponent },
  { path: 'caption/:name', component: PersoncaptionComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: ProfileeditComponent },
  { path: 'settings/:tab', component: ProfileeditComponent },
  { path: 'explore', component: DiscoverComponent },
  { path: 'discoverpost', component: DiscoverpostComponent },
  { path: ':name', component: PersonComponent },
  { path: ':name/:id', component: HomepostComponent },  
  { path: 'page', component: PageComponent }
   
];
  // {
  //   path: '', component: HomeComponent, terminal: true,
  //   children: [
  //     { path: '', component: ContentComponent },
  //     { path: 'homepost/:name/:id', component: HomepostComponent },
  //     // { path: 'person/:name', component: PersonComponent },
  //     { path: 'personlocation/:name', component: PersonlocationComponent },
  //     { path: 'personcaption/:name', component: PersoncaptionComponent },
  //     { path: 'profile', component: ProfileComponent },
  //     { path: 'profile-edit', component: ProfileeditComponent },
  //     { path: 'discover', component: DiscoverComponent },
  //      { path: 'discoverpost', component: DiscoverpostComponent }
  //     // { path: 'reset', component: ResetpasswordComponent }
  //   ]
  // },
  
//];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
