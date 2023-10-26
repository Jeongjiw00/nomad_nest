import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';
import { title } from 'process';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2020 });
      const movie = service.getOne(1);

      expect(movie).toBeDefined();
    });

    it('should throw 404 error by getOne', () => {
      try {
        service.getOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 Not Found!');
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2020 });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      // expect(afterDelete).toEqual(beforeDelete - 1);
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw 404 error by deleteOne', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 Not Found!');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;
      service.create({ title: 'Test Movie', genres: ['test'], year: 2020 });
      const afterCreate = service.getAll().length;

      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({ title: 'Test Movie', genres: ['test'], year: 2020 });
      service.update(1, { title: 'Updated Test' });
      const updateMovie = service.getOne(1).title;

      expect(updateMovie).toEqual('Updated Test');
    });

    it('should throw 404 error by update', () => {
      try {
        service.update(999, { title: 'Updated Test' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Movie with ID 999 Not Found!');
      }
    });
  });
});
