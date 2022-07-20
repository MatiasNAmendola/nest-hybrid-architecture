import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesController } from '../../src/application/controllers';
import { MovieCreateDTO } from '../../src/application/dtos';
import { MoviesService } from '../../src/domain/services';
import { MovieEntity } from '../../src/domain/entities';
import { fakeMovieCreateDTO, fakeMovieEntity } from '../factories';

describe('Movie endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockRepository: Partial<Repository<MovieEntity>> = {
      find: jest.fn(() => Promise.resolve([fakeMovieEntity])),
      findOneBy: jest.fn(() => Promise.resolve(null)),
      save: jest.fn().mockImplementation((_dto: MovieCreateDTO) => Promise.resolve(fakeMovieEntity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MoviesController],
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('Check findAll method', () => {
    it('Should received status code 200', () => {
      return request(app.getHttpServer()).get('/movies').expect(HttpStatus.OK);
    });

    it('Should received an array of movies', async () => {
      const { body } = await request(app.getHttpServer()).get('/movies');

      expect(body).toHaveLength(1);
    });
  });

  describe('Check create method', () => {
    it('Should received status code 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(fakeMovieCreateDTO)
        .set('Accept', 'application/json')
        .expect(HttpStatus.CREATED);
    });

    it('Should create new movies and received it in the response object', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/movies')
        .send(fakeMovieCreateDTO)
        .set('Accept', 'application/json');

      const { title, url } = fakeMovieCreateDTO;

      expect(body).toMatchObject({
        title,
        url,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
