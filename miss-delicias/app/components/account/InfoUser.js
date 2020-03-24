import React from 'react';
import { StyleSheet, View, Text} from 'react-native'; 
import { Avatar } from 'react-native-elements';
import * as firebase from "firebase";
import * as Permisssions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function InfoUser(props){
    const {
        userInfo, 
        userInfo: { uid,  displayName, email, photoURL, providerId },
        setReloadDataUser,   
        toastRef,
        setIsVisibleLoading,
        setTextLoading 
    } = props;
    
    const alterPhoto = "https://api.adorable.io/avatars/266/abott@adorable.png"
    const changeAvatar = async () => {
            const replyPermission = await Permisssions.askAsync(Permisssions.CAMERA_ROLL);
            const permissionCamera = replyPermission.permissions.cameraRoll.status;        
            if(permissionCamera === "denied"){
                toastRef.current.show("Debes acceptar permisos, para acceder a la galería",5000);            
            }else{
                const result = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing : true,
                    aspect: [4,3]
                });

                if(!result.cancelled){                   
                        uploadImage(result.uri,uid)
                        .then(() => {                            
                            updatePhotoUrl(uid);
                        });                      
                }
            }               
    };
    const uploadImage  = async (uri, nameImage) => {
        setTextLoading("Actualziando avatar");
        setIsVisibleLoading(true);
        const infoImage = await fetch(uri);
        const blobImage = await infoImage.blob();
        const refImage = firebase
                         .storage()
                         .ref()
                         .child('avatars/'+nameImage);
                         
        return refImage.put(blobImage);

        
    }
    const updatePhotoUrl = uid => {
        firebase
        .storage()
        .ref('avatars/'+uid)
        .getDownloadURL()
        .then(async result => {
            const updatedImage = {
                photoURL: result
            }             
            await firebase.auth().currentUser.updateProfile(updatedImage);
            setReloadDataUser(true);
            setIsVisibleLoading(false);
        })
        .catch(() => {
            toastRef.current.show("Error al recuperar la imagen del avatar desde el servidor");            
        });

    }
    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton={providerId === "password" ? true : false}
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={
                    {
                        uri:photoURL ? photoURL : alterPhoto
                    }}
            />    
            <View>
                <Text
                    style={styles.displayName}
                >
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email &&  providerId === "password" ? email : providerId}
                </Text>
            </View>        
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        backgroundColor:"#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar:{
        marginRight: 20,
    },
    displayName:{
        fontWeight:"bold"
    }
});