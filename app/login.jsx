import React, { useState } from 'react'
import {  Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native'
import ScreenWrapper from '../components/ScreenWrapper'
import Feather from '@expo/vector-icons/Feather';
import { theme } from '../constants/theme'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import { useRef } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Buttons from '../components/Button'
import { supabase } from '../lib/supabase';

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading,setLoading] = useState(false);
  const onSubmit = async ()=>{
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Login',"Please fill all the fields!")
      return;
    }
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    console.log('error: ',error);
    if(error){
      Alert.alert('Login',error.message);
    }
  }
  return (
    <ScreenWrapper bg='white'>
      <StatusBar style="dark" />
      <View style={styles.container}>
          <BackButton router={router}/>

          {/* welcome */}
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
              <Text style={{fontSize:hp(1.7),fontWeight:'700',color:theme.colors.text}}>
                Please login to continue
              </Text>
              <Input 
                icon = {<Feather name="mail" size={24} color="black"/>}
                placeholder = 'Enter your email'
                onChangeText={value=> emailRef.current = value}
              />
              <Input 
                icon = {<AntDesign name="lock" size={24} color="black" />}
                placeholder = 'Enter your password'
                secureTextEntry
                onChangeText={value=> passwordRef.current = value}
              />
              <Text style={styles.forgotPassword}>
                Forgot Password?
              </Text>
              {/* Button */}
              <Buttons title='Login' loading={loading} onPress={onSubmit}/>
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>
            <Pressable onPress={()=>router.push('signUp')}>
              <Text style={[styles.footerText ,{color:theme.colors.primaryDark ,fontWeight:theme.fonts.extraBold}]}>Sign Up</Text>
            </Pressable>
          </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex : 1,
    gap : 45,
    paddingHorizontal : wp(5)
  },
  welcomeText:{
    fontSize : hp(4),
    fontWeight: theme.fonts.bold,
    color : theme.colors.text
  },
  form:{
    gap:25,
  },
  forgotPassword:{
    textAlign: 'right',
    fontWeight : theme.fonts.semibold,
    color : theme.colors.text
  },
  footer:{
    flexDirection :'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  },
  footerText :{
    textAlign : 'center',
    color:theme.colors.text,
    fontSize: hp(1.6),
    fontWeight:theme.fonts.mediume
  }
})