import path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nModule } from 'nestjs-i18n';
import { IndexController } from '../../src/application/controllers';
import { IndexService } from '../../src/domain/services';

describe('IndexController', () => {
  let indexController: IndexController;

  beforeEach(async () => {
    const index: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '../../src/i18n/'),
          },
        }),
      ],
      controllers: [IndexController],
      providers: [IndexService],
    }).compile();

    indexController = index.get<IndexController>(IndexController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(indexController.getHello('en')).toBe('Hello World!');
    });
  });
});
