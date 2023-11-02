import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'fail-email@gmail.com', password: 'FailPassword' })
      .expect(401);
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'fail' })
      .expect(400);
  });

  it('/admin/brands (POST)', () => {
    return request(app.getHttpServer()).post('/admin/brands').expect(401);
  });

  it('/admin/brands (GET)', () => {
    return request(app.getHttpServer()).get('/admin/brands').expect(401);
  });

  it('/admin/brands/1 (GET)', () => {
    return request(app.getHttpServer()).get('/admin/brands/1').expect(401);
  });

  it('/admin/brands/1 (PATCH)', () => {
    return request(app.getHttpServer()).patch('/admin/brands/1').expect(401);
  });

  it('/admin/brands/1 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/admin/brands/1').expect(401);
  });

  it('/api/brands (GET)', () => {
    return request(app.getHttpServer()).get('/api/brands').expect(200);
  });

  it('/api/brands/1 (GET)', () => {
    return request(app.getHttpServer()).get('/api/brands/1').expect(200);
  });

  it('/admin/cars (POST)', () => {
    return request(app.getHttpServer()).post('/admin/cars').expect(401);
  });

  it('/admin/cars (GET)', () => {
    return request(app.getHttpServer()).get('/admin/cars').expect(401);
  });

  it('/admin/cars/1 (GET)', () => {
    return request(app.getHttpServer()).get('/admin/cars/1').expect(401);
  });

  it('/admin/cars/1 (PATCH)', () => {
    return request(app.getHttpServer()).patch('/admin/cars/1').expect(401);
  });

  it('/admin/cars/1 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/admin/cars/1').expect(401);
  });

  it('/api/cars (POST)', () => {
    return request(app.getHttpServer()).post('/api/cars').expect(401);
  });

  it('/api/cars (GET)', () => {
    return request(app.getHttpServer()).get('/api/cars').expect(200);
  });

  it('/api/cars/1 (GET)', () => {
    return request(app.getHttpServer()).get('/api/cars/1').expect(200);
  });

  it('/api/cars/1 (PATCH)', () => {
    return request(app.getHttpServer()).patch('/api/cars/1').expect(401);
  });

  it('/api/cars/1 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/api/cars/1').expect(401);
  });

  it('/admin/categories (POST)', () => {
    return request(app.getHttpServer()).post('/admin/categories').expect(401);
  });

  it('/admin/categories (GET)', () => {
    return request(app.getHttpServer()).get('/admin/categories').expect(401);
  });

  it('/admin/categories/1 (GET)', () => {
    return request(app.getHttpServer()).get('/admin/categories/1').expect(401);
  });

  it('/admin/categories/1 (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/admin/categories/1')
      .expect(401);
  });

  it('/admin/categories/1 (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/admin/categories/1')
      .expect(401);
  });

  it('/api/categories (GET)', () => {
    return request(app.getHttpServer()).get('/api/categories').expect(200);
  });

  it('/api/categories/1 (GET)', () => {
    return request(app.getHttpServer()).get('/api/categories/1').expect(200);
  });

  it('/admin/users (POST)', () => {
    return request(app.getHttpServer()).post('/admin/users').expect(401);
  });

  it('/admin/users (GET)', () => {
    return request(app.getHttpServer()).get('/admin/users').expect(401);
  });

  it('/admin/users/1 (GET)', () => {
    return request(app.getHttpServer()).get('/admin/users/1').expect(401);
  });

  it('/admin/users/1 (PATCH)', () => {
    return request(app.getHttpServer()).patch('/admin/users/1').expect(401);
  });

  it('/admin/users/1 (DELETE)', () => {
    return request(app.getHttpServer()).delete('/admin/users/1').expect(401);
  });

  afterAll((done) => {
    app.close();
    done();
  });
});
