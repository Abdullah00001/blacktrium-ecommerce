const STAGING_URL = 'http://72.244.153.29:5080/api/v1';

const credentials = {
  admin: { email: 'kefom76841@fishnone.com', password: '12345678aA' },
  user: { email: 'user1@example.com', password: 'Password123!' },
  merchant: { email: 'merchant@example.com', password: 'Password123!' }
};

let tokens = { admin: '', user: '', merchant: '' };
let cookies = { admin: '', user: '', merchant: '' };

async function makeRequest(path, method, body, role = null) {
  const headers = { 'Content-Type': 'application/json' };
  
  if (role && tokens[role]) headers['Authorization'] = `Bearer ${tokens[role]}`;
  if (role && cookies[role]) headers['Cookie'] = cookies[role];

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${STAGING_URL}${path}`, options);
    const data = await res.json();
    return { status: res.status, ok: res.ok, data };
  } catch (err) {
    return { status: 500, ok: false, error: err.message };
  }
}

async function login(role, isAdminRoute = false) {
  const path = isAdminRoute ? '/admin/auth/login' : '/auth/login';
  const res = await fetch(`${STAGING_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials[role])
  });

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookies[role] = setCookie.split(',').map(c => c.split(';')[0]).join('; ');

  const data = await res.json();
  if (data.success) {
    tokens[role] = data.data?.accessToken;
    if (!tokens[role] && cookies[role]) {
       const match = cookies[role].match(/accesstoken=([^;]+)/);
       if (match) tokens[role] = match[1];
    }
    if (!cookies[role] && tokens[role]) cookies[role] = `accesstoken=${tokens[role]}`;
    return true;
  }
  return false;
}

async function runTests() {
  await login('admin', true);
  await login('user');
  await login('merchant');

  console.log('--- ADMIN FAILING TESTS ---');
  let res = await makeRequest('/admin/users', 'GET', null, 'admin');
  console.log('GET /admin/users ->', res.data);

  res = await makeRequest('/admin/complains', 'GET', null, 'admin');
  console.log('GET /admin/complains ->', res.data);

  console.log('--- MERCHANT FAILING TESTS ---');
  res = await makeRequest('/business-profile/me', 'GET', null, 'merchant');
  console.log('GET /business-profile/me ->', res.data);
  
  res = await makeRequest('/wallet/me', 'GET', null, 'merchant');
  console.log('GET /wallet/me ->', res.data);
}
runTests();
