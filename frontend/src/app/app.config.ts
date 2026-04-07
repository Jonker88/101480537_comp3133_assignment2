import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const auth = setContext((_, { headers }) => {
        const token = localStorage.getItem('ems_auth_token');
        let next = headers ?? new HttpHeaders();
        if (token) {
          next = next.set('Authorization', `Bearer ${token}`);
        }
        return { headers: next };
      });
      const http = httpLink.create({
        uri: environment.graphqlUrl,
      });
      return {
        link: ApolloLink.from([auth, http]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
