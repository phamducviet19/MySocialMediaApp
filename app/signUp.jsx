import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import BackButton from '../components/BackButton';
import Buttons from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { supabase } from '../lib/supabase';

const signUp = () => {
  const router = useRouter();
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading,setLoading] = useState(false);
  const onSubmit = async ()=>{
    if(!emailRef.current || !passwordRef.current ){
      Alert.alert('Sign Up',"Please fill all the fields!")
      return;
    }

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    
    setLoading(true);

    const {data : {session},error} = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setLoading(false);
    console.log('Supabase error:', error);
    console.log('session: ',session);
    console.log('error: ',error);
    if(error){
      Alert.alert('Sign up',error.message);
    }
  }
  return (
    <ScreenWrapper bg='white'>
      <StatusBar style="dark" />
      <View style={styles.container}>
          <BackButton router={router}/>

          {/* welcome */}
          <View>
            <Text style={styles.welcomeText}>Let's,</Text>
            <Text style={styles.welcomeText}>Get Started</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
              <Text style={{fontSize:hp(1.7),fontWeight:'700',color:theme.colors.text}}>
                Please sign up an accout if you haven't yet
              </Text>
              <Input 
                icon = {<AntDesign name="user" size={24} color="black"/>}
                placeholder = 'Enter your name'
                onChangeText={value=> nameRef.current = value}
              />
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
          
              {/* Button */}
              <Buttons title='Sign Up' loading={loading} onPress={onSubmit}/>
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Ready have an account
            </Text>
            <Pressable onPress={()=>router.push('login')}>
              <Text style={[styles.footerText ,{color:theme.colors.primaryDark ,fontWeight:theme.fonts.extraBold}]}>Login</Text>
            </Pressable>
          </View>
      </View>
    </ScreenWrapper>
  )
}

export default signUp

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