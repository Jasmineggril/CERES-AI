import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseStorage } from './storage.ts';

test('createUser and getUserByEmail work even when the database is unavailable', async () => {
  const storage = new DatabaseStorage();
  const user = await storage.createUser({
    email: 'fallback@example.com',
    password: 'secret123',
    name: 'Fallback User',
  });

  assert.equal(user.email, 'fallback@example.com');
  const found = await storage.getUserByEmail('fallback@example.com');
  assert.ok(found);
  assert.equal(found?.name, 'Fallback User');
});
