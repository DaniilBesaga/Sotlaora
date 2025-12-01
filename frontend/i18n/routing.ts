import {defineRouting} from 'next-intl/routing';
 
 
export const routing = defineRouting({
  locales: ['ro', 'en'],
  localeDetection: false,
  defaultLocale: 'ro'
});