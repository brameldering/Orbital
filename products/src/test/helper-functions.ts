import jwt from 'jsonwebtoken';
import {
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  CUST_TEST_ROLE,
  ADMIN_TEST_NAME,
  ADMIN_TEST_EMAIL,
  ADMIN_TEST_ROLE,
} from '@orbitelco/common';

interface IPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

const payloadTestCustomer: IPayload = {
  id: '653fde3e3d8aa2dec2ee96d5', // Dummy but valid mongodb objectId
  name: CUST_TEST_NAME,
  email: CUST_TEST_EMAIL,
  role: CUST_TEST_ROLE,
};

const payloadTestAdmin: IPayload = {
  id: '653fde3e3d8aa2dec2ee96d5', // Dummy but valid mongodb objectId
  name: ADMIN_TEST_NAME,
  email: ADMIN_TEST_EMAIL,
  role: ADMIN_TEST_ROLE,
};

// Function to fake login of a test customer
const signup = (payload: IPayload): string => {
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  // Turn that session into JSON
  const sessionJSON = JSON.stringify({
    jwt: token,
  });
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string that represents the cookie with the encoded data
  return `session=${base64}`;
};

export const signupCustomer = (): string => {
  return signup(payloadTestCustomer);
};

// Function to fake login of a test admin user
export const signupAdmin = (): string => {
  return signup(payloadTestAdmin);
};