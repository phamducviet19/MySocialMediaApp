import EvilIcons from '@expo/vector-icons/EvilIcons'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Avatar from '../../components/avatar'
import Button from '../../components/Button'
import Header from '../../components/Header'
import RichTextEditor from '../../components/RichTextEditor'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '../../helpers/common'
import { getSupabaseFileUrl } from '../../services/imageService'
import { createOrUpdatePost } from '../../services/postService'

const NewPost = () => {
  const {user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const[loading,setLoading] = useState(false);
  const [file,setFile] = useState(file); //nhớ để lại là file

  const onPick = async (isImage)=>{
    let mediaConfig = {
      mediaTypes: ['images', 'videos'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
    }
    if(!isImage){
      mediaConfig={
        mediaTypes: ['images', 'videos'],
        allowsEditing: true
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    if(!result.canceled){
      setFile(result.assets[0]);
    }
  }

  const isLocalFile = file=>{
    if(!file) return null;
    if(typeof file == 'object') return true;
    return false;
  }
  const getFileType = file =>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.type;
    }
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video';
  }

  const getFileUri = file=>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }

  const onSubmit = async ()=>{
    if(!bodyRef.current && !file){
      Alert.alert('Post',"Please choose an image or add post body");
      return;
    }
    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    }
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if(res.success){
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert('Post',res.msg);
    }
     
  }
  console.log('file uri: ',getFileUri(file));
  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
        <Header title="Create Post"/>
        <ScrollView contentContainerStyle={{gap:20}} nestedScrollEnabled={true}>
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{gap:2}}>
              <Text style={styles.username}>
                {
                  user && user.name
                }
              </Text>
              <Text style={styles.publicText}>
                Public
              </Text>
            </View>
          </View>
          <View style={styles.textEditor}>
                <RichTextEditor editorRef={editorRef} onChange={body=> bodyRef.current = body}/>
          </View>

          {
            file && (
              <View style={styles.file}>
                {
                  getFileType(file) == 'video'? (
                      <Video 
                        style={{flex:1}}
                        source={{
                          uri: getfileUri(file)
                        }}
                        useNativeControls
                        resizeMode='cover'
                        isLooping
                      />
                  ):(
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex: 1}}/>
                  )
                }
                <Pressable style={styles.closeIcon} onPress={()=> setFile(null)}>
                  <EvilIcons name="trash" size={28} color="white" />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={()=> onPick(true)}>
                <FontAwesome5 name="image" size={30} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> onPick(false)}>
                {/* <Feather name="video" size={30} color={theme.colors.text} /> */}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
            buttonStyle={{height:hp(6.2)}}
            title='Post'
            loading={loading}
            hasShadow={false}
            onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  closeIcon:{
    position:'absolute',
    top:10,
    right:10,
    padding:4,
    borderRadius:50,
    backgroundColor: 'rgba(255,0,0,0.6)'
  },
  video:{

  },
  file:{
    height: hp(30),
    width:'100%',
    borderRadius:theme.radius.xl,
    overflow:'hidden',
    borderCurve: 'continuous'
  },
  imageIcon:{
    borderRadius:theme.radius.md
  },
  addImageText:{
    fontSize:hp(1.9),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text
  },
  mediaIcons:{
    flexDirection:'row',
    alignItems:'center',
    gap:15
  },
  media:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    borderWidth:1.5,
    padding:12,
    paddingHorizontal:18,
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderColor:theme.colors.gray
  },
  publicText:{
    fontSize:hp(1.7),
    color:theme.colors.textLight,
    fontWeight:theme.fonts.medium
  },
  avatar:{
    height:hp(6.5),
    width:wp(6.5),
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.1)'
  },
  username:{
    fontSize:hp(2.2),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    gap:12
  },
  title:{
    fontSize:hp(2.5),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text,
    textAlign: 'center'
  },
  container:{
    flex:1,
    marginBottom:30,
    paddingHorizontal:wp(4),
    gap:15
  },
  textEditor:{
    marginTop:10
  }
})