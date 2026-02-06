// Test script to verify all backend endpoints with authentication flows
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
let authToken = '';
let userId = '';
let freeCourseId = '';
let paidCourseId = '';

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? '✓' : '✗';
  console.log(`${status} ${name}`);
  if (details) console.log(`  ${details}`);
}

// Test 1: User Registration
async function testRegistration() {
  try {
    const email = `test${Date.now()}@example.com`;
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      email,
      password: 'password123',
      name: 'Test User'
    });
    
    authToken = response.data.token;
    userId = response.data.user.id;
    
    logTest('User Registration', response.status === 201 && authToken, 
      `Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    logTest('User Registration', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 2: User Login
async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test1@example.com',
      password: 'password123'
    });
    
    logTest('User Login', response.status === 200 && response.data.token,
      `User: ${response.data.user.email}`);
    return true;
  } catch (error) {
    logTest('User Login', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 3: Invalid Login
async function testInvalidLogin() {
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test1@example.com',
      password: 'wrongpassword'
    });
    logTest('Invalid Login Rejection', false, 'Should have failed');
    return false;
  } catch (error) {
    logTest('Invalid Login Rejection', error.response?.status === 401,
      'Correctly rejected invalid credentials');
    return true;
  }
}

// Test 4: Get All Courses
async function testGetCourses() {
  try {
    const response = await axios.get(`${BASE_URL}/courses`);
    const courses = response.data.courses;
    
    // Find free and paid courses (price might be string or number)
    freeCourseId = courses.find(c => parseFloat(c.price) === 0)?.id;
    paidCourseId = courses.find(c => parseFloat(c.price) > 0)?.id;
    
    logTest('Get All Courses', response.status === 200 && courses.length >= 5,
      `Found ${courses.length} courses (${courses.filter(c => parseFloat(c.price) === 0).length} free, ${courses.filter(c => parseFloat(c.price) > 0).length} paid)`);
    return true;
  } catch (error) {
    logTest('Get All Courses', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 5: Get Course by ID
async function testGetCourseById() {
  try {
    const response = await axios.get(`${BASE_URL}/courses/${freeCourseId}`);
    logTest('Get Course by ID', response.status === 200 && response.data.id === freeCourseId,
      `Course: ${response.data.title}`);
    return true;
  } catch (error) {
    logTest('Get Course by ID', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 6: Protected Route Without Auth
async function testProtectedRouteWithoutAuth() {
  try {
    await axios.get(`${BASE_URL}/subscribe/my-courses`);
    logTest('Protected Route Without Auth', false, 'Should have been rejected');
    return false;
  } catch (error) {
    logTest('Protected Route Without Auth', error.response?.status === 401,
      'Correctly rejected unauthorized request');
    return true;
  }
}

// Test 7: Subscribe to Free Course
async function testFreeSubscription() {
  try {
    const response = await axios.post(`${BASE_URL}/subscribe`, 
      { courseId: freeCourseId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    logTest('Subscribe to Free Course', 
      response.status === 201 && parseFloat(response.data.subscription.price_paid) === 0,
      `Subscription created with pricePaid: ${response.data.subscription.price_paid}`);
    return true;
  } catch (error) {
    logTest('Subscribe to Free Course', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 8: Duplicate Subscription
async function testDuplicateSubscription() {
  try {
    await axios.post(`${BASE_URL}/subscribe`, 
      { courseId: freeCourseId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Duplicate Subscription Rejection', false, 'Should have been rejected');
    return false;
  } catch (error) {
    logTest('Duplicate Subscription Rejection', error.response?.status === 409,
      'Correctly rejected duplicate subscription');
    return true;
  }
}

// Test 9: Paid Course Without Promo Code
async function testPaidWithoutPromo() {
  try {
    await axios.post(`${BASE_URL}/subscribe`, 
      { courseId: paidCourseId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Paid Course Without Promo', false, 'Should have been rejected');
    return false;
  } catch (error) {
    logTest('Paid Course Without Promo', error.response?.status === 400,
      'Correctly rejected paid course without promo code');
    return true;
  }
}

// Test 10: Paid Course With Invalid Promo
async function testPaidWithInvalidPromo() {
  try {
    await axios.post(`${BASE_URL}/subscribe`, 
      { courseId: paidCourseId, promoCode: 'INVALID' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Paid Course With Invalid Promo', false, 'Should have been rejected');
    return false;
  } catch (error) {
    logTest('Paid Course With Invalid Promo', error.response?.status === 400,
      'Correctly rejected invalid promo code');
    return true;
  }
}

// Test 11: Paid Course With Valid Promo
async function testPaidWithValidPromo() {
  try {
    // First get the course to check original price
    const courseResponse = await axios.get(`${BASE_URL}/courses/${paidCourseId}`);
    const originalPrice = parseFloat(courseResponse.data.price);
    
    const response = await axios.post(`${BASE_URL}/subscribe`, 
      { courseId: paidCourseId, promoCode: 'BFSALE25' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const pricePaid = parseFloat(response.data.subscription.price_paid);
    const expectedPrice = originalPrice * 0.5;
    
    logTest('Paid Course With Valid Promo', 
      response.status === 201 && Math.abs(pricePaid - expectedPrice) < 0.01,
      `Original: $${originalPrice}, Paid: $${pricePaid} (50% discount)`);
    return true;
  } catch (error) {
    logTest('Paid Course With Valid Promo', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 12: Get My Courses
async function testGetMyCourses() {
  try {
    const response = await axios.get(`${BASE_URL}/subscribe/my-courses`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const subscriptions = response.data.subscriptions;
    logTest('Get My Courses', 
      response.status === 200 && subscriptions.length >= 2,
      `Found ${subscriptions.length} subscriptions`);
    
    // Verify subscription data structure
    if (subscriptions.length > 0) {
      const sub = subscriptions[0];
      const hasAllFields = sub.id && sub.price_paid !== undefined && 
                          sub.subscribed_at && sub.course;
      logTest('Subscription Data Structure', hasAllFields,
        `Fields: id, price_paid, subscribed_at, course`);
    }
    return true;
  } catch (error) {
    logTest('Get My Courses', false, error.response?.data?.error || error.message);
    return false;
  }
}

// Test 13: Invalid JWT Token
async function testInvalidToken() {
  try {
    await axios.get(`${BASE_URL}/subscribe/my-courses`,
      { headers: { Authorization: 'Bearer invalid-token' } }
    );
    logTest('Invalid JWT Token Rejection', false, 'Should have been rejected');
    return false;
  } catch (error) {
    logTest('Invalid JWT Token Rejection', error.response?.status === 401,
      'Correctly rejected invalid token');
    return true;
  }
}

// Test 14: 404 for Non-existent Course
async function testNonExistentCourse() {
  try {
    await axios.get(`${BASE_URL}/courses/00000000-0000-0000-0000-000000000000`);
    logTest('Non-existent Course 404', false, 'Should have returned 404');
    return false;
  } catch (error) {
    logTest('Non-existent Course 404', error.response?.status === 404,
      'Correctly returned 404');
    return true;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n=== Backend Endpoint Testing ===\n');
  console.log('Testing Authentication Flows...');
  await testRegistration();
  await testLogin();
  await testInvalidLogin();
  
  console.log('\nTesting Course Endpoints...');
  await testGetCourses();
  await testGetCourseById();
  await testNonExistentCourse();
  
  console.log('\nTesting Protected Routes...');
  await testProtectedRouteWithoutAuth();
  await testInvalidToken();
  
  console.log('\nTesting Subscription Flows...');
  await testFreeSubscription();
  await testDuplicateSubscription();
  await testPaidWithoutPromo();
  await testPaidWithInvalidPromo();
  await testPaidWithValidPromo();
  await testGetMyCourses();
  
  console.log('\n=== All Tests Complete ===\n');
}

runAllTests().catch(console.error);
