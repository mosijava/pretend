import { assert } from 'chai';
import * as nock from 'nock';

import { Pretend, Get, Post, Put, Delete } from '../src';

/* tslint:disable */
class Test {
  @Get('/path/{id}')
  public async get(id: string) {}
  @Post('/path')
  public async post(body: any) {}
  @Put('/path')
  public async put() {}
  @Delete('/path')
  public async delete() {}
}
/* tslint:enable */

const response = {
  key: 'value'
};

describe('RestJs', () => {
  let test: Test;

  beforeEach(() => {
    test = Pretend.builder().target(Test, 'http://host:port/');
  });

  it('should call a get method', async () => {
    nock('http://host:port/').get('/path/id').reply(200, response);
    assert.deepEqual(await test.get('id'), response);
  });

  it('should call a post method', async () => {
    nock('http://host:port/').post('/path', {response}).reply(200, response);
    assert.deepEqual(await test.post({response}), response);
  });

  it('should call a put method', async () => {
    test = Pretend.builder().target(Test, 'http://host:port');
    nock('http://host:port/').put('/path').reply(200, response);
    assert.deepEqual(await test.put(), response);
  });

  it('should call a delete method', async () => {
    nock('http://host:port/').delete('/path').reply(200, response);
    assert.deepEqual(await test.delete(), response);
  });

  it('should throw on error', async () => {
    nock('http://host:port/').delete('/path').replyWithError('server-fail');
    try {
      await test.delete();
      assert.fail('should throw');
    } catch (e) {
      // Ignore here
    }
  });
});
