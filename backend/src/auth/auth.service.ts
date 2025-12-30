import { Injectable } from '@nestjs/common';
import { firebaseAuth, firebaseDb } from '../config/firebase.config';

@Injectable()
export class AuthService {
  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, name: string) {
    try {
      // Create user in Firebase Auth
      const userRecord = await firebaseAuth.createUser({
        email,
        password,
        displayName: name,
      });

      // Store user data in Firestore
      await firebaseDb.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      return {
        success: true,
        message: 'User registered successfully',
        userId: userRecord.uid,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get custom token for client-side login
   */
  async login(uid: string) {
    try {
      const customToken = await firebaseAuth.createCustomToken(uid);
      return {
        success: true,
        token: customToken,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify ID token sent from client
   */
  async verifyToken(idToken: string) {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      return {
        success: true,
        userId: decodedToken.uid,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid token',
      };
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string) {
    try {
      const userDoc = await firebaseDb.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return {
          success: false,
          message: 'User not found',
        };
      }
      return {
        success: true,
        user: userDoc.data(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
