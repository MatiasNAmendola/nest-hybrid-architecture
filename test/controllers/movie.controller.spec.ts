import { validate } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from '../../src/domain/entities';
import { MoviesController } from '../../src/application/controllers';
import { MoviesService } from '../../src/domain/services';
import { MovieCreateDTO, MovieGetDTO } from '../../src/application/dtos';
import { fakeMovie } from '../factories';
import { ValidationsModule } from '../../src/infrastructure/modules/validations';
import { I18nModule } from 'nestjs-i18n';
import path from 'path';

describe('Movie Controller', () => {
  let movieService: jest.Mocked<MoviesService>;
  let movieController: MoviesController;

  const movieServiceMock: Partial<MoviesService> = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '../../src/i18n/'),
          },
        }),
        ValidationsModule,
      ],
      providers: [
        {
          provide: MoviesService,
          useValue: movieServiceMock,
        },
        MoviesController,
      ],
    }).compile();

    movieService = module.get(MoviesService);
    movieController = module.get<MoviesController>(MoviesController);
  });

  describe('Controller status', () => {
    it('Should be defined', () => {
      expect(movieController).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('findAll should return valid DTOs', async () => {
      const movie: Movie = new MovieGetDTO(fakeMovie);
      const movies: Movie[] = [movie];

      movieService.findAll.mockResolvedValue(movies);

      const dtos = await movieController.findAll();

      dtos.map(async (dto) => {
        const errors = await validate(dto, {
          whitelist: true,
        });

        expect(errors).toHaveLength(0);
        expect(dto).toBeInstanceOf(MovieGetDTO);
      });
    });
  });

  describe('create', () => {
    it('New movies should be an DTO instance', async () => {
      const movie: Movie = new MovieGetDTO(fakeMovie);
      movieService.create.mockResolvedValue(movie);

      const result = await movieController.create('en', movie as MovieCreateDTO);

      expect(result).toBeInstanceOf(MovieGetDTO);
    });
  });
});
