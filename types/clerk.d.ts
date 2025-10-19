export interface CustomJwtSessionClaims {
  metadata?: {
    role?: string;
  };
}

declare global {
  interface UserPublicMetadata {
    role?: string;
  }
}
