'use server'

import { db } from '@/lib/db'
import { sendOTPEmail } from '@/lib/email'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate 6-digit OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash OTP for secure storage
function hashOTP(code: string): string {
  const salt = process.env.OTP_SALT || 'peyda-otp-salt-2024'
  return crypto.createHmac('sha256', salt).update(code).digest('hex')
}

// Verify OTP against stored hash
function verifyOTPHash(code: string, hashedCode: string): boolean {
  return hashOTP(code) === hashedCode
}

// Request OTP - Send verification code to email
export async function requestOtp(email: string, isRegistration: boolean = false): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    // Validate email format
    if (!email || !isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return { success: false, error: 'Ongeldig e-mailadres' }
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log('Processing OTP request for:', normalizedEmail, 'Is registration:', isRegistration);

    // Check if this email already has a registered business
    const existingOwner = await db.businessOwner.findUnique({
      where: { email: normalizedEmail }
    })

    // Only block if this is a registration attempt and user already has a business
    if (isRegistration && existingOwner?.businessId) {
      // Check if trying to register a new business - block this
      return { success: false, error: 'Dit e-mailadres is al gekoppeld aan een bedrijf. Gebruik een ander e-mailadres voor een nieuw bedrijf.' }
    }

    // Check if there's a valid unused token that hasn't expired yet
    // We used to block new tokens here, but that prevents "resend code" from working
    // since we hash the token and can't resend the old one.
    // Now we always generate a new token if requested.

    // Optional: We could implement a tighter rate limit here (e.g. 1 minute) if needed in future
    // but for now, let's ensure the user gets their code.

    // Generate 6-digit code
    const code = generateOTP()

    // Hash the OTP for secure storage
    const hashedCode = hashOTP(code)

    // Set expiration to 10 minutes
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { identifier: normalizedEmail }
    })

    // Create new verification token (store hashed version)
    await db.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: hashedCode,
        expires
      }
    })

    // Send OTP email
    try {
      console.log('Sending OTP email to:', normalizedEmail);
      await sendOTPEmail(normalizedEmail, code)
      console.log('OTP email sent successfully');
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
      return { success: false, error: 'Kon e-mail niet versturen. Controleer de SMTP-instellingen.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error requesting OTP:', error)
    return { success: false, error: 'Er is iets misgegaan. Probeer het later opnieuw.' }
  }
}

// Verify OTP - Check code and create session
export async function verifyOtp(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!email || !isValidEmail(email)) {
      return { success: false, error: 'Ongeldig e-mailadres' }
    }

    if (!code || code.length !== 6) {
      return { success: false, error: 'Ongeldige code' }
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find the verification token (we need to get all tokens for this email to compare)
    const verificationTokens = await db.verificationToken.findMany({
      where: {
        identifier: normalizedEmail,
      },
      orderBy: { expires: 'desc' }
    })

    // Find the valid token by comparing hashes
    let validToken = null
    for (const token of verificationTokens) {
      if (verifyOTPHash(code, token.token)) {
        validToken = token
        break
      }
    }

    // Check if token exists and is valid
    if (!validToken) {
      return { success: false, error: 'Ongeldige code' }
    }

    // Check if token has expired (10 minutes)
    if (validToken.expires < new Date()) {
      // Delete expired token
      await db.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: normalizedEmail,
            token: validToken.token
          }
        }
      })
      return { success: false, error: 'Code is verlopen. Vraag een nieuwe code aan.' }
    }

    // Find or create business owner
    let businessOwner = await db.businessOwner.findUnique({
      where: { email: normalizedEmail }
    })

    if (!businessOwner) {
      // For new users, create a placeholder account
      businessOwner = await db.businessOwner.create({
        data: {
          email: normalizedEmail,
          name: normalizedEmail.split('@')[0],
        }
      })
    }

    // Update last login
    await db.businessOwner.update({
      where: { id: businessOwner.id },
      data: { lastLoginAt: new Date() }
    })

    // Delete the used token (one-time use)
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: validToken.token
        }
      }
    })

    // Create session cookie (expires in 3 hours)
    const cookieStore = await cookies()
    cookieStore.set('session_token', businessOwner.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60 * 60 // 3 hours in seconds
    })

    return { success: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'Er is iets misgegaan. Probeer het later opnieuw.' }
  }
}

// Logout - Clear session (server action for client components)
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session_token')
  // Don't redirect here - let the client handle it
}

// Get current session
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')

  if (!sessionToken) {
    return null
  }

  return sessionToken.value
}

// Get current logged in user
export async function getCurrentUser() {
  const sessionId = await getSession()
  if (!sessionId) return null

  const user = await db.businessOwner.findUnique({
    where: { id: sessionId },
    include: { business: true }
  })

  return user
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

// Check if user has a registered business
export async function userHasBusiness(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.businessId !== null && user?.businessId !== undefined
}

// Check if user has a PUBLISHED business (not just registered)
export async function userHasPublishedBusiness(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user?.businessId) return false

  // Check if the business is published
  return user.business?.publishStatus === 'PUBLISHED'
}

// Get current user email (for secure form pre-fill)
export async function getUserEmail(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.email || null
}

// Check if an email has a registered business (for login flow)
export async function checkEmailHasBusiness(email: string): Promise<{ hasBusiness: boolean; email: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    const owner = await db.businessOwner.findUnique({
      where: { email: normalizedEmail }
    })
    return {
      hasBusiness: !!owner?.businessId,
      email: normalizedEmail
    }
  } catch (error) {
    return { hasBusiness: false, email: email }
  }
}
