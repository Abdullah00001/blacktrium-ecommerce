const STAGING_URL = 'http://localhost:5080/api/v1';

const credentials = {
  admin: { email: 'kefom76841@fishnone.com', password: 'Password123!' },
  user: { email: 'user1@example.com', password: 'Password123!' },
  merchant: { email: 'merchant@example.com', password: 'Password123!' }
};

let tokens = { admin: '', user: '', merchant: '' };
let cookies = { admin: '', user: '', merchant: '' };

// State for carrying IDs across flows
let testState = {
  categoryId: '',
  productId: '',
  cartItemId: ''
};

async function makeRequest(path, method, body, role = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (role && tokens[role]) headers['Authorization'] = `Bearer ${tokens[role]}`;
  if (role && cookies[role]) headers['Cookie'] = cookies[role];

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${STAGING_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));
  
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
  if (setCookie) {
    const matchAccessToken = setCookie.match(/accesstoken=([^;]+)/);
    const matchRefreshToken = setCookie.match(/refreshtoken=([^;]+)/);
    let cookieStr = [];
    if (matchAccessToken) cookieStr.push(`accesstoken=${matchAccessToken[1]}`);
    if (matchRefreshToken) cookieStr.push(`refreshtoken=${matchRefreshToken[1]}`);
    cookies[role] = cookieStr.join('; ');
  }

  const data = await res.json().catch(() => ({}));
  
  if (data.success) {
    tokens[role] = data.data?.accessToken;
    // Fallback for admin cookie
    if (!tokens[role] && cookies[role]) {
       const match = cookies[role].match(/accesstoken=([^;]+)/);
       if (match) tokens[role] = match[1];
    }
    if (!cookies[role] && tokens[role]) cookies[role] = `accesstoken=${tokens[role]}`;
    return true;
  }
  return false;
}

function assertLog(testName, res, expectedStatus = 200) {
  if (res.status === expectedStatus || res.ok) {
    console.log(`✅ [SUCCESS] ${testName}`);
  } else {
    console.log(`❌ [FAIL] ${testName} - HTTP ${res.status}`);
    console.log(JSON.stringify(res.data || res.error, null, 2));
  }
}

async function runTests() {
  console.log('====== STARTING E2E FLOW TESTS ======\n');

  console.log('--- 1. IDENTITY & AUTH FLOW ---');
  let adminLogin = await login('admin', true);
  console.log(adminLogin ? '✅ Admin Login' : '❌ Admin Login');
  
  let userLogin = await login('user');
  console.log(userLogin ? '✅ User Login' : '❌ User Login');
  
  let merchantLogin = await login('merchant');
  console.log(merchantLogin ? '✅ Merchant Login' : '❌ Merchant Login');

  let res = await makeRequest('/profile', 'GET', null, 'user');
  assertLog('Fetch User Profile', res);

  res = await makeRequest('/profile', 'PATCH', { firstName: 'UpdatedName' }, 'user');
  assertLog('Update User Profile', res);

  console.log('\n--- 2. CATALOG & DISCOVERY FLOW ---');
  res = await makeRequest('/dashboard/home', 'GET', null, 'user');
  assertLog('GET /dashboard/home', res);

  res = await makeRequest('/category', 'GET', null, null);
  assertLog('Fetch Categories', res);
  if (res.data?.data?.length > 0) {
    testState.categoryId = res.data.data[0]._id;
  }

  res = await makeRequest('/product', 'GET', null, null);
  assertLog('Fetch Global Product List', res);
  if (res.data?.data?.data?.length > 0) {
    testState.productId = res.data.data.data[0]._id;
  } else {
    console.log('⚠️ No products found in DB. Skipping dependent purchasing tests.');
  }

  if (testState.productId) {
    console.log('\n--- 3. PURCHASING FLOW ---');
    res = await makeRequest('/favorite/toggle', 'POST', { itemType: 'product', targetId: testState.productId }, 'user');
    assertLog('Toggle Favorite Product', res);

    res = await makeRequest('/cart/add', 'POST', { productId: testState.productId, quantity: 1, size: 'M', color: 'Red' }, 'user');
    assertLog('Add Product to Cart', res, 201);

    res = await makeRequest('/cart', 'GET', null, 'user');
    assertLog('View Cart', res);
  }

  console.log('\n--- 4. MERCHANT CENTRAL FLOW ---');
  res = await makeRequest('/dashboard/merchant', 'GET', null, 'merchant');
  assertLog('GET /dashboard/merchant', res);

  res = await makeRequest('/product', 'GET', null, 'merchant');
  assertLog('Fetch Global Product List (Merchant View)', res);

  res = await makeRequest('/wallet/me', 'GET', null, 'merchant');
  assertLog('Fetch Merchant Wallet', res);

  console.log('\n--- 5. ADMIN GOVERNANCE FLOW ---');
  res = await makeRequest('/admin/dashboard', 'GET', null, 'admin');
  assertLog('GET Admin Dashboard', res);

  res = await makeRequest('/admin/users', 'GET', null, 'admin');
  assertLog('GET Admin Users List', res);

  res = await makeRequest('/admin/merchant', 'GET', null, 'admin');
  assertLog('GET Admin Merchants List', res);

  res = await makeRequest('/admin/earning/stats', 'GET', null, 'admin');
  assertLog('GET Admin Earning Stats', res);

  console.log('\n====== E2E FLOW TESTS COMPLETE ======');
}

runTests();
