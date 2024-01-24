jest.mock('firebase/app', () => ({
    initializeApp: jest.fn()
  }));
  
  const { initializeApp } = require('firebase/app');
  require('dotenv').config();
  
  describe('Firebase Configuration', () => {
      it('initializes Firebase with the correct configuration', () => {
          // Mocking process.env values
          process.env.FIREBASE_API_KEY = 'test_api_key';
          process.env.FIREBASE_AUTH_DOMAIN = 'test_auth_domain';
          process.env.FIREBASE_PROJECT_ID = 'test_project_id';
          process.env.FIREBASE_STORAGE_BUCKET = 'test_storage_bucket';
          process.env.FIREBASE_MESSAGING_SENDER_ID = 'test_messaging_sender_id';
          process.env.FIREBASE_APP_ID = 'test_app_id';
          process.env.FIREBASE_MEASUREMENT_ID = 'test_measurement_id';
  
          // Require the module after setting the environment variables
          const firebase = require('../firebaseConfig');
  
          expect(initializeApp).toHaveBeenCalledWith({
              apiKey: 'test_api_key',
              authDomain: 'test_auth_domain',
              projectId: 'test_project_id',
              storageBucket: 'test_storage_bucket',
              messagingSenderId: 'test_messaging_sender_id',
              appId: 'test_app_id',
              measurementId: 'test_measurement_id'
          });
      });
  
      // You can add more test cases if there are other scenarios to test
  });
  