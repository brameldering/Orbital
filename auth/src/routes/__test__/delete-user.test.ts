import request from 'supertest';
import { app } from '../../app';
import {
  signupCustomer,
  signupCustomer2,
  signupAdmin,
} from '../../test/helper-functions';
import { CUST_TEST_EMAIL, CUST_TEST_PASSWORD } from '@orbitelco/common';

describe('Test delete user', () => {
  it('returns a 200 on succesfully deleting a user account', async () => {
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Try to delete user by Admin
    await request(app)
      .delete('/api/users/v2/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(200);
    // Test customer can no longer log in
    await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(401);
  });
  it('returns a 401 when a customer tries to delete a user', async () => {
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    const signUpResponse2 = await signupCustomer2();
    const cookie = signUpResponse2.get('Set-Cookie');
    // Try to delete a user by a customer
    await request(app)
      .delete('/api/users/v2/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(401);
  });
  it('returns a 300 when an admin tries to delete with an invalid Object Id', async () => {
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Try to delete a user with an invalid Object id
    const dummyUserId = 'invalid_object_id';
    await request(app)
      .delete('/api/users/v2/' + dummyUserId)
      .set('Cookie', cookie)
      .send()
      .expect(300);
    // Check that error message contains message "('Param id has to be a valid id')"
  });
});
