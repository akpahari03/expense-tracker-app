// app/(auth)/sign-in.jsx - Updated with forgot password link

import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { useState } from 'react'
import { styles } from '@/assets/styles/auth.styles.js'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    setIsLoading(true)
    setError(null)

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        setError("Sign-in failed. Please try again.")
      }
    } catch (err) {
      console.error('Sign-in error:', err)
      if (err.errors?.[0]?.code === "form_password_incorrect" || err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email or password is incorrect. Please try again.")
      } else {
        setError("An error occurred during sign-in. Please try again later.")
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
        <Image source={require('@/assets/images/revenue-i4.png')} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>
        
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
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => {
            setEmailAddress(emailAddress)
            setError(null)
          }}
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => {
            setPassword(password)
            setError(null)
          }}
          autoComplete="current-password"
        />

        {/* Forgot Password Link */}
        <View style={styles.forgotPasswordContainer}>
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.loadingButton]} 
          onPress={onSignInPress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}