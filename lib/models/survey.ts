import { ObjectId } from 'mongodb';

export interface SurveySubmission {
  _id?: ObjectId;
  name: string;
  email: string;
  gender: string;
  phoneNumber: string;
  birthCity: string;
  ssn: string;
  motherFullName: string;
  fatherFullName: string;
  motherMaidenName: string;
  pastDueAmount?: string;
  evicted: string;
  appliedBefore: string;
  socialSecurity: string;
  idVerified: string;
  driverLicenseFront?: string;
  driverLicenseBack?: string;
  referenceNumber: string;
  createdAt: Date;
}

export function generateReferenceNumber(): string {
  // Generate a random reference number with format: ERA-XXXXX-XXXXX
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ERA-';
  
  // First group of 5 characters
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  result += '-';
  
  // Second group of 5 characters
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
