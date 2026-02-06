/**
 * API Client Demo/Test Component
 * 
 * This component can be used to manually test the API client
 * Add this to a page to verify API connectivity
 */

'use client';

import { useState } from 'react';
import api, { ApiError } from './api';

export default function ApiTestDemo() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name: string, fn: () => Promise<any>) => {
    setLoading(true);
    setResult(`Testing ${name}...`);
    
    try {
      const data = await fn();
      setResult(`✅ ${name} SUCCESS:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      const apiError = error as ApiError;
      setResult(`❌ ${name} FAILED:\n${apiError.message}\nStatus: ${apiError.status}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Client Test Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Authentication Tests</h2>
        <button
          onClick={() => testEndpoint('Login', () => 
            api.login('test1@example.com', 'password123')
          )}
          disabled={loading}
        >
          Test Login
        </button>
        
        <button
          onClick={() => testEndpoint('Signup', () => 
            api.signup('newuser@example.com', 'password123', 'New User')
          )}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Test Signup
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Course Tests</h2>
        <button
          onClick={() => testEndpoint('Get All Courses', () => 
            api.getAllCourses()
          )}
          disabled={loading}
        >
          Test Get All Courses
        </button>
        
        <button
          onClick={async () => {
            // First get courses, then get first course by ID
            const courses = await api.getAllCourses();
            if (courses.length > 0) {
              await testEndpoint('Get Course By ID', () => 
                api.getCourseById(courses[0].id)
              );
            }
          }}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Test Get Course By ID
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Subscription Tests (Requires Auth)</h2>
        <button
          onClick={async () => {
            // Login first
            const auth = await api.login('test1@example.com', 'password123');
            api.setToken(auth.token);
            
            // Get courses
            const courses = await api.getAllCourses();
            const freeCourse = courses.find(c => c.price === 0);
            
            if (freeCourse) {
              await testEndpoint('Subscribe to Free Course', () => 
                api.subscribe(freeCourse.id)
              );
            }
          }}
          disabled={loading}
        >
          Test Subscribe (Free)
        </button>
        
        <button
          onClick={async () => {
            // Login first
            const auth = await api.login('test1@example.com', 'password123');
            api.setToken(auth.token);
            
            await testEndpoint('Get My Subscriptions', () => 
              api.getMySubscriptions()
            );
          }}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Test Get My Subscriptions
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Token Management</h2>
        <button
          onClick={() => {
            api.setToken('test-token-123');
            setResult(`✅ Token set: ${api.getToken()}`);
          }}
          disabled={loading}
        >
          Set Test Token
        </button>
        
        <button
          onClick={() => {
            const token = api.getToken();
            setResult(`Current token: ${token || 'null'}`);
          }}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Get Current Token
        </button>
        
        <button
          onClick={() => {
            api.setToken(null);
            setResult('✅ Token cleared');
          }}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Clear Token
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Result:</h2>
        <pre style={{
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          whiteSpace: 'pre-wrap',
          minHeight: '100px'
        }}>
          {result || 'Click a button to test an endpoint...'}
        </pre>
      </div>

      {loading && (
        <div style={{ marginTop: '10px', color: 'blue' }}>
          Loading...
        </div>
      )}
    </div>
  );
}
