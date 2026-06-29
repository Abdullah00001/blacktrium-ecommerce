const STAGING_URL = 'http://72.244.153.29:5080/api/v1';
const EMAIL = 'kefom76841@fishnone.com';
const PASSWORD = '12345678aA';

async function runTests() {
  let token = '';
  let cookies = [];

  const loginRes = await fetch(`${STAGING_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  
  const setCookieHeader = loginRes.headers.get('set-cookie');
  if (setCookieHeader) cookies = setCookieHeader.split(',').map(c => c.split(';')[0]);
  
  const loginData = await loginRes.json();
  if (loginData.success) {
    token = loginData.data.accessToken;
    if (cookies.length === 0) cookies.push(`accesstoken=${token}`);
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Cookie': cookies.join('; ')
  };

  // Test /admin/earning/stats specifically
  const statsRes = await fetch(`${STAGING_URL}/admin/earning/stats`, { headers: authHeaders });
  const statsData = await statsRes.json();
  console.log('GET /admin/earning/stats ->', statsData);
  
  // Test /admin/users specifically
  const usersRes = await fetch(`${STAGING_URL}/admin/users`, { headers: authHeaders });
  const usersData = await usersRes.json();
  console.log('GET /admin/users ->', usersData);
}
runTests();
