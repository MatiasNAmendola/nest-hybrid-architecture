import path from 'path';
import { AcceptLanguageResolver, I18nOptionResolver, I18nOptions, QueryResolver } from 'nestjs-i18n';

const options: string[] = ['lang', 'locale', 'l'];

const resolvers: I18nOptionResolver[] = [{ use: QueryResolver, options }, AcceptLanguageResolver];

export const i18nOptions: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '/../../../i18n/'),
    watch: true,
  },
  resolvers,
};
