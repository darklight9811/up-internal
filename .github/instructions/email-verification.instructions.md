---
applyTo: "**/auth/**"
---
# Email Verification Implementation Instructions

This document provides step-by-step instructions for implementing email verification in the monorepo using better-auth.

## Overview

The project uses better-auth for authentication with email verification. The system automatically sends verification emails on signup and provides routes for manual verification and resending emails.

## Key Components

### 1. Better-Auth Configuration
- Located in `packages/domains/src/domains/auth/helpers/auth.server.ts`
- Uses `emailVerification` plugin with `sendOnSignUp: true`
- Integrates with the email service to send verification emails

### 2. Email Templates
- Verification email template: `packages/emails/src/emails/verify.tsx`
- Uses the shared email structure and localization

### 3. Verification Schema
- Add verification schema to `packages/domains/src/domains/auth/schema.ts`
- Use `token` field for URL-based verification (not codes)

### 4. Service Layer
- Add verification methods to `packages/domains/src/domains/auth/server/service.server.ts`
- Include `verifyEmail` and `resendVerificationEmail` methods

### 5. API Routes
- Add verification endpoints to `packages/domains/src/domains/auth/server/router.server.ts`
- Expose `verifyEmail` and `resendVerificationEmail` mutations

### 6. UI Components
- Create verification component in `packages/domains/src/domains/auth/components/auth-verify.tsx`
- Handle both manual token input and automatic URL verification

### 7. Page Routes
- Create verification page at `apps/dashboard/src/routes/(auth)/verify/page.tsx`
- Handle URL parameters for automatic verification
- Provide manual verification form and resend functionality

## Implementation Steps

### Step 1: Update Auth Configuration
Ensure better-auth is configured with email verification:

```typescript
emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail(data, request) {
        const locale = await starti18n();
        await email.emails.send(
            sendVerifyEmail({
                email: data.user.email,
                url: data.url,
                locale: (await locale.getLocale(request!)) as "pt-br" | "en-us",
            }),
        );
    },
},
```

### Step 2: Add Verification Schema
```typescript
export const verifyEmailSchema = v.object({
    token: v.string(),
});

export type VerifyEmailSchema = v.infer<typeof verifyEmailSchema>;
```

### Step 3: Implement Service Methods
```typescript
async verifyEmail(payload: VerifyEmailSchema, token: string) {
    const response = await auth.api.verifyEmail({
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
        query: {
            token: payload.token,
        },
    });

    if (!response?.status)
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "verification_failed",
        });

    return response.user;
},

async resendVerificationEmail(
    token: string,
    email: string,
    locale?: string,
) {
    const response = await auth.api.sendVerificationEmail({
        headers: new Headers({
            Authorization: `Bearer ${token}`,
            "Accept-Language": locale || "en-us",
        }),
        body: {
            email,
        },
    });

    return response;
},
```

### Step 4: Add API Routes
```typescript
verifyEmail: t.protected
    .input(verifyEmailSchema)
    .mutation(async ({ input, ctx }) => {
        const token = ctx.cookie.get("token");
        const user = await authService.verifyEmail(input, token!);
        return user;
    }),

resendVerificationEmail: t.protected.mutation(async ({ ctx }) => {
    const token = ctx.cookie.get("token");
    const user = await authService.session(token);
    const i18n = await ctx.i18n();

    if (!user?.email)
        throw new Error("User not found or email not available");

    await authService.resendVerificationEmail(
        token!,
        user.email,
        await i18n.getLocale(ctx.req),
    );

    return { success: true };
}),
```

### Step 5: Create Verification Component
Create a reusable component that handles:
- Manual token input form
- Resend functionality
- Error display
- Loading states

### Step 6: Implement Verification Page
The page should:
- Check URL parameters for automatic verification
- Redirect verified users
- Provide manual verification form
- Handle resend requests
- Show appropriate loading/success states

### Step 7: Update Localization
Add verification-related translations to both `en-us` and `pt-br` locale files:

```json
"verify": {
    "title": "Verify Your Email",
    "description": "We've sent a verification link to your email address.",
    "processing": "Processing verification...",
    "token": "Verification Token",
    "tokenPlaceholder": "Paste verification token here",
    "submit": "Verify Email",
    "resend": "Resend Link",
    "resending": "Sending...",
    "success": "Email verified successfully!"
}
```

### Step 8: Update Registration Flow
Modify the registration page to redirect to `/verify` after successful registration instead of the home page.

### Step 9: Add Auth Routes to Server
Ensure the app server handles better-auth routes:

```typescript
.all("/auth/*", async (c) => {
    return auth.handler(c.req.raw);
});
```

## Important Notes

1. **URL-based Verification**: Better-auth uses URL tokens, not 6-digit codes
2. **Automatic Processing**: Verification links should work automatically when clicked
3. **Fallback Form**: Provide manual token input for edge cases
4. **User Session**: Check if user is already verified before showing verification page
5. **Error Handling**: Properly handle verification failures and expired tokens
6. **Localization**: Support both English and Portuguese
7. **Email Integration**: Ensure email service is properly configured
8. **Security**: Use HTTPS in production for secure verification links

## Testing Checklist

- [ ] Registration sends verification email
- [ ] Verification link in email works
- [ ] Manual token verification works
- [ ] Resend functionality works
- [ ] Verified users are redirected appropriately
- [ ] Error states are handled properly
- [ ] Localization works for both languages
- [ ] Email templates render correctly

## Common Issues

1. **Missing Auth Routes**: Ensure `/auth/*` routes are configured in the server
2. **CORS Issues**: Check trusted origins in better-auth config
3. **Email Service**: Verify email service is configured and working
4. **Token Expiration**: Handle expired verification tokens gracefully
5. **Redirect Loops**: Ensure proper session checking to avoid infinite redirects

## File Structure

```
packages/domains/src/domains/auth/
├── components/
│   ├── auth-login.tsx
│   ├── auth-register.tsx
│   └── auth-verify.tsx          # New verification component
├── helpers/
│   ├── auth.client.ts
│   └── auth.server.ts           # Updated with emailVerification
├── server/
│   ├── router.server.ts         # Updated with verification routes
│   ├── service.server.ts        # Updated with verification methods
│   └── table.server.ts
├── schema.ts                    # Updated with verification schema
└── index.ts                     # Export verification component

apps/dashboard/src/routes/(auth)/
├── login/
├── register/                    # Updated to redirect to /verify
└── verify/                      # New verification page
    └── page.tsx

public/locales/
├── en-us/
│   └── auth.json               # Updated with verification keys
└── pt-br/
    └── auth.json               # Updated with verification keys
```

This comprehensive guide ensures consistent implementation of email verification features across the codebase.
