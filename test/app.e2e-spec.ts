import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from 'src/users/users.service';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  /** DATA FOR TESTING */
  let access_token = '';
  let register_id = 0;
  let user_id = 0;
  let category_id = 0;
  let brand_id = 0;
  let car_id = 0;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    /** GET OR CREATE ADMIN */
    const usersService = moduleFixture.get<UsersService>(UsersService);
    await usersService.getAdmin(process.env.ADMIN_EMAIL);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  /**
   * START AUTH
   */
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      })
      .expect(201)
      .expect((res) => {
        access_token = res.body['access_token'];

        expect(res.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String),
          }),
        );
      });
  });
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'FailEmail@test.com', password: 'FailPassword' })
      .expect(401);
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.internet.userName(),
        email: faker.number.int(2)+faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201)
      .expect((res) => {
        register_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({})
      .expect(400);
  });
  /**
   * END AUTH
   */

  /**
   * START ADMIN-USERS
   */
  it('/admin/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/users')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        name: faker.internet.userName(),
        email: faker.number.int(2)+faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201)
      .expect((res) => {
        user_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/admin/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/users')
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/users')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              email: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          ]),
        );
      });
  });
  it('/admin/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/users/${user_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/users/${user_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/admin/users/${user_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/users/${user_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/users/${user_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/users/${user_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.internet.userName() })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/admin/users/${user_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/users/${user_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/users/${user_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/users/${user_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/users/${user_id} (DELETE REGISTERED USER)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/users/${register_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  it('/admin/users/${user_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/users/${user_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  it('/admin/users/${user_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/users/${user_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });
  /**
   * END: ADMIN-USERS
   */

  /**
   * START: ADMIN-CATEGORIES
   */
  it('/admin/categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(201)
      .expect((res) => {
        category_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/categories')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/categories')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          ]),
        );
      });
  });
  it('/admin/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/categories')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/categories/${category_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/categories/${category_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/categories/${category_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/categories/${category_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/categories/${category_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/categories/${category_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/categories/${category_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/categories/${category_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/categories/${category_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/categories/${category_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/categories/${category_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/categories/${category_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });
  /**
   * END: ADMIN-CATEGORIES
   */

  /**
   * START: ADMIN-BRANDS
   */
  it('/admin/brands (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/brands')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(201)
      .expect((res) => {
        brand_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/brands (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/brands')
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/brands (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/brands')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/brands (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/brands')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          ]),
        );
      });
  });
  it('/admin/brands (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/brands')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/brands/${brand_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/brands/${brand_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/brands/${brand_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/brands/${brand_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/brands/${brand_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/brands/${brand_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  it('/admin/brands/${brand_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/brands/${brand_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/brands/${brand_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/brands/${brand_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/brands/${brand_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/brands/${brand_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });
  /**
   * END: ADMIN-BRANDS
   */

  /**
   * START: ADMIN-CARS
   */
  it('/admin/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        category_id: category_id, // Comment @Validate(CategoryExists) for test
        brand_id: brand_id, // Comment @Validate(BrandExists) for test
        name: faker.string.uuid(),
        description: faker.word.words({ count: { min: 3, max: 12 } }),
        price: faker.number.int({ min: 1, max: 100000 }),
      })
      .expect(201)
      .expect((res) => {
        car_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            user_id: expect.any(Number),
            category_id: expect.any(Number),
            brand_id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            status: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/admin/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/admin/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/admin/cars')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/cars (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                category_id: expect.any(Number),
                brand_id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(String),
                status: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                category: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),  
                }),
                brand: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),  
                }),
                user: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String), 
                  email: expect.any(String),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              })
            ]),
            meta: expect.objectContaining({
              page: expect.any(Number),
              per_page: expect.any(Number),
            })
          }),
        );
      });
  });
  it('/admin/cars (GET)', () => {
    return request(app.getHttpServer())
      .get('/admin/cars')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/cars/${car_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
             id: expect.any(Number),
             user_id: expect.any(Number),
             category_id: expect.any(Number),
             brand_id: expect.any(Number),
             name: expect.any(String),
             description: expect.any(String),
             price: expect.any(String),
             status: expect.any(String),
             created_at: expect.any(String),
             updated_at: expect.any(String),
             category: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String),  
             }),
             brand: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String),  
             }),
             user: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String), 
               email: expect.any(String),
               created_at: expect.any(String),
               updated_at: expect.any(String),
             }),
           })
         );
      });
  });
  it('/admin/cars/${car_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/admin/cars/${car_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/cars/${car_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/admin/cars/${car_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/admin/cars/${car_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/admin/cars/${car_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  it('/admin/cars/${car_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/cars/${car_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });
  /**
   * END: ADMIN-CARS
   */

  /**
   * START: API-CATEGORIES
   */
  it('/api/categories (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/categories')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          ]),
        );
      });
  });

  it('/api/categories/${category_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/categories/${category_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  /**
   * END: API-CATEGORIES
   */

  /**
   * START: API-BRANDS
   */
  it('/api/brands (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/brands')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          ]),
        );
      });
  });

  it('/api/brands/${brand_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/brands/${brand_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
          }),
        );
      });
  });
  /**
   * END: API-BRANDS
   */

  /**
   * START: API-CARS
   */
  it('/api/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        category_id: category_id, // Comment @Validate(CategoryExists) for test
        brand_id: brand_id, // Comment @Validate(BrandExists) for test
        name: faker.string.uuid(),
        description: faker.word.words({ count: { min: 3, max: 12 } }),
        price: faker.number.int({ min: 1, max: 100000 }),
      })
      .expect(201)
      .expect((res) => {
        car_id = res.body['id'];

        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            user_id: expect.any(Number),
            category_id: expect.any(Number),
            brand_id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            price: expect.any(Number),
            status: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/api/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .send({})
      .expect(400);
  });
  it('/api/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/cars')
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/api/cars (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/cars')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                user_id: expect.any(Number),
                category_id: expect.any(Number),
                brand_id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(String),
                status: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                category: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),  
                }),
                brand: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String),  
                }),
                user: expect.objectContaining({
                  id: expect.any(Number),
                  name: expect.any(String), 
                  email: expect.any(String),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                }),
              })
            ]),
            meta: expect.objectContaining({
              page: expect.any(Number),
              per_page: expect.any(Number),
            })
          }),
        );
      });
  });

  it('/api/cars/${car_id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
             id: expect.any(Number),
             user_id: expect.any(Number),
             category_id: expect.any(Number),
             brand_id: expect.any(Number),
             name: expect.any(String),
             description: expect.any(String),
             price: expect.any(String),
             status: expect.any(String),
             created_at: expect.any(String),
             updated_at: expect.any(String),
             category: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String),  
             }),
             brand: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String),  
             }),
             user: expect.objectContaining({
               id: expect.any(Number),
               name: expect.any(String), 
               email: expect.any(String),
               created_at: expect.any(String),
               updated_at: expect.any(String),
             }),
           })
         );
      });
  });

  it('/api/cars/${car_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/api/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: faker.string.uuid() })
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
  it('/api/cars/${car_id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/api/cars/${car_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });

  it('/api/cars/${car_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/api/cars/${car_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  it('/api/cars/${car_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/api/cars/${car_id}`)
      .set('Authorization', 'Bearer FailToken')
      .expect(401);
  });
  /**
   * END: API-CARS
   */

  /**
   * START: REMOVE ANOTHER
   */
  it('/admin/categories/${category_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/categories/${category_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  it('/admin/brands/${brand_id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/admin/brands/${brand_id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });
  /**
   * END: REMOVE CATEGORY AND BRAND
   */

  afterAll((done) => {
    app.close();
    done();
  });
});
