import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { styles } from '../../assets/styles/auth.styles.js'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Request a password reset code
  const onRequestReset = async () => {
    if (!isLoaded) return
    if (!emailAddress.trim()) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const firstFactor = await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })

      if (firstFactor.status === 'needs_first_factor') {
        setSuccessfulCreation(true)
        setError(null)
      }
    } catch (err) {
      console.error('Error requesting password reset:', err)
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError("No account found with this email address")
      } else {
        setError("Failed to send reset code. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset the password with the code and new password
  const onReset = async () => {
    if (!isLoaded) return
    if (!code.trim()) {
      setError("Please enter the verification code")
      return
    }
    if (!password.trim()) {
      setError("Please enter your new password")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      if (result.status === 'needs_second_factor') {
        setSecondFactor(true)
        setError(null)
      } else if (result.status === 'complete') {
        // Password reset successful
        Alert.alert(
          "Success",
          "Your password has been reset successfully!",
          [
            {
              text: "OK",
              onPress: () => router.replace('/sign-in')
            }
          ]
        )
      } else {
        setError("Password reset failed. Please try again.")
      }
    } catch (err) {
      console.error('Error resetting password:', err)
      if (err.errors?.[0]?.code === 'form_code_incorrect') {
        setError("Invalid verification code. Please check and try again.")
      } else if (err.errors?.[0]?.code === 'form_password_pwned') {
        setError("This password has been found in a data breach. Please choose a different password.")
      } else if (err.errors?.[0]?.code === 'form_password_length_too_short') {
        setError("Password is too short. Please use at least 8 characters.")
      } else {
        setError("Password reset failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <Image 
          source={require('@/assets/images/revenue-i4.png')} 
          style={styles.illustration} 
        />

        {!successfulCreation ? (
          <>
            {/* Step 1: Request Reset Code */}
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.helpText}>
              Enter your email address and we will send you a code to reset your password.
            </Text>

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#9A8478"
              onChangeText={(email) => {
                setEmailAddress(email)
                setError(null)
              }}
              keyboardType="email-address"
              autoComplete="email"
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.loadingButton]} 
              onPress={onRequestReset}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Sending..." : "Send Reset Code"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Remember your password?</Text>
              <Link href="/sign-in" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </>
        ) : (
          <>
            {/* Step 2: Enter Code and New Password */}
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.helpText}>
              Enter the verification code sent to {emailAddress} and your new password.
            </Text>

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError(null)}>
                  <Ionicons name="close" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor="#9A8478"
              onChangeText={(code) => {
                setCode(code)
                setError(null)
              }}
              keyboardType="number-pad"
              autoComplete="one-time-code"
            />

            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              placeholder="Enter new password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={(password) => {
                setPassword(password)
                setError(null)
              }}
              autoComplete="new-password"
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.loadingButton]} 
              onPress={onReset}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Text>
            </TouchableOpacity>

            {/* Option to go back and change email */}
            <TouchableOpacity 
              onPress={() => {
                setSuccessfulCreation(false)
                setCode('')
                setPassword('')
                setError(null)
              }}
              style={styles.footerContainer}
            >
              <Text style={styles.linkText}>Use different email address</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}