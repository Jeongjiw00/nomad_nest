import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // 매 테스트마다 새로운 앱을 만드는것을 방지
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // 테스트에서도 실제 어플리케이션 환경을 그대로 적용시켜줘야함.
    // main.ts 에서 transform을 적용했기때문에 id를 number로 받아올수있었음.
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    // http://localhost:3000 안쓰기 위해서
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('welcome to my Movie API');
  });

  // it('/movies (GET)', () => {
  //   // 현재 테스트베이스가 비어있기 때문에 빈배열
  //   return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
  // });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'Test', year: 2000, genres: ['test'] })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'Test', year: 2000, genres: ['test'], other: 'thing' })
        .expect(400);
    });

    it('DELETE', () => {
      // 현재 데이터베이스에 아무런 데이터가 없고 id 지정도 안했으니 에러
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id', () => {
    // it.todo를 사용하면 테스트 해야 할 것을 미리 만들어 둘 수 있음.
    // it.todo('DELETE', () => {}); ❌
    // it.todo('DELETE'); ⭕
    it('GET 200', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });

    it('GET 404', () => {
      return request(app.getHttpServer()).get('/movies/999').expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ year: 2001 })
        .expect(200);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .patch('/movies/999')
        .send({ year: 2001 })
        .expect(404);
    });

    it('DELETE 200', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer()).delete('/movies/999').expect(404);
    });
  });
});
