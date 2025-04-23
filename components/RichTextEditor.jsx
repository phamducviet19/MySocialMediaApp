import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({editorRef,onChange}) => {
  return (
    <View style={{minHeight:285}}>
        <RichToolbar 
            actions={[
                actions.insertImage,
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.keyboard,
                actions.setStrikethrough,
                actions.setUnderline,
                actions.removeFormat,
                actions.insertVideo,
                actions.checkboxList,
                actions.undo,
                actions.redo,
                actions.heading1,
                actions.heading4
            ]}
            iconMap={{
                [actions.heading1]: ({tintColor})=> <Text style={{color:tintColor}}>H1</Text>,
                [actions.heading4]: ({tintColor})=> <Text style={{color:tintColor}}>H4</Text>
            }}
            style = {styles.richBar}
            flatContainerStyle = {styles.flatStyle}
            selectedIconTint = {theme.colors.primaryDark}
            editor={editorRef}
            disable={false}
        />
        <RichEditor
            ref={editorRef}
            containerStyle={styles.rich}
            initialContentHTML=""
            editorStyle={{
                backgroundColor: 'white',
                color: theme.colors.textDark,
                placeholderColor: 'gray',
                contentCSSText: 'font-size: 16px; padding: 10px;', // ⚠️ Cái này là quan trọng!
            }}
            placeholder={"What's on your mind?"}
            onChange={onChange}          
        />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar:{
        borderTopRightRadius : theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
        flexDirection: 'row'
        
    },
    listStyle:{

    },
    rich:{
        minHeight:240,
        flex:1,
        borderWidth:0.5,
        borderTopWidth:0,
        borderBottomLeftRadius:theme.radius.xl,
        borderBottomRightRadius:theme.radius.xl,
        padding:5
    },
    contentStyle:{
        color:theme.colors.textDark,
        placeholderColor: 'gray',
    },
    flatStyle:{
        paddingHorizontal:8,
        gap:3,   
    }
})