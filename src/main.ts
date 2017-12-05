import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { CeiboShare } from 'ng2-social-share';
import { UiSwitchModule } from 'angular2-ui-switch';
import { InfiniteScroll } from 'angular2-infinite-scroll';
//import { Ng2ImgToolsModule } from 'ng2-img-tools'; // <-- import the module
// import { MasonryModule } from 'angular2-masonry'; // Import MasonryModule
// import { APP_ROUTERR_PROVIDERS } from './app/Home/home.routes';

// import  { LoginComponent } from './app/AuthModule/login.component'
if (process.env.ENV === 'production') {
  enableProdMode();
}

// bootstrap(AppComponent, [HTTP_PROVIDERS]);
// bootstrap(LoginComponent, []);
bootstrap(AppComponent, [HTTP_PROVIDERS,
  disableDeprecatedForms(),
  provideForms(),
  APP_ROUTER_PROVIDERS,
  CeiboShare 
  // APP_ROUTERR_PROVIDERS
]);