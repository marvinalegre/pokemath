declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export {}; // makes this a module, required for global augmentation to work
