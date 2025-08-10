export interface VerificationTokenRepository {
    [x: string]: any;
    saveVerificationToken(email: string, token: string, expiresAt: Date): Promise<void>;
    findVerificationToken(token: string): Promise<{ email: string; expiresAt: Date } | null>;
    deleteVerificationToken(token: string): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
}