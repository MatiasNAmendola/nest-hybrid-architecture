import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MovieCreateDTO } from '../../src/application/dtos';
import { MovieGetDTO } from '../../src/application/dtos';
import { fakeMovie, fakeMovieMaxLength, fakeMovieDTO, fakeMovieCreateDTO } from '../factories';

describe('Movie DTO', () => {
  describe('Movie create', () => {
    it('Requires [title] property', async () => {
      const data = {
        url: fakeMovie.url,
      };
      const dto = plainToClass(MovieCreateDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('title');
    });

    it('Requires [url] property', async () => {
      const data = {
        title: fakeMovie.url,
      };
      const dto = plainToClass(MovieCreateDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('url');
    });

    it('Failed with max length', async () => {
      const dto = plainToClass(MovieCreateDTO, fakeMovieMaxLength);

      const errors = await validate(dto);

      expect(errors).toHaveLength(2);

      errors &&
        errors.map((error) => {
          expect(error).toBeInstanceOf(ValidationError);
        });
    });

    it('Success with a valid properties', async () => {
      const errors = await validate(fakeMovieCreateDTO);

      expect(errors).toHaveLength(0);
    });
  });

  describe('Movie get', () => {
    it('Success with a valid properties', async () => {
      const errors = await validate(fakeMovieDTO);

      expect(errors).toHaveLength(0);
    });

    it('Requires [id] property', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = fakeMovie;
      const dto = plainToClass(MovieGetDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('id');
    });

    it('Requires [title] property', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { title, ...data } = fakeMovie;
      const dto = plainToClass(MovieGetDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('title');
    });

    it('Requires [url] property', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url, ...data } = fakeMovie;
      const dto = plainToClass(MovieGetDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toHaveLength(1);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('url');
    });

    it('Requires [categories] property', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categories, ...data } = fakeMovie;
      const dto = plainToClass(MovieGetDTO, data);

      const errors = await validate(dto);
      const [error] = errors;

      expect(errors).toBeDefined();
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.property).toBe('categories');
    });
  });
});
