import * as httpStatus from 'http-status';
import request from 'supertest';
import { App } from '../../app';

describe('CurrencyConverter Controller', () => {
  it('Should response 200 if everithing is OK', done => {
    request(App)
      .get('/v1/converter/20/USD')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK, done);
  });

  it('Should response 404 if Currency not exists', done => {
    request(App)
      .get('/v1/converter/20/BRA')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND, done);
  });
});
