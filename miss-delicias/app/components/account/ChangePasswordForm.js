import React, { useState } from 'react';
import { View ,StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import {reauthenticate} from '../../utils/Api';
import {validatePassword} from '../../utils/Validation';

export default function ChangePasswordForm(props){
    const { setIsModalVisible,toastRef } = props;
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const [isLoading,setIsLoading]= useState(false);
    const [hidePassword,setHidePassword] = useState(true);
    const [hideNewPassword,setHideNewPassword] = useState(true);
    const [hideNewConfirmPassword,setNewConfirmHidePassword] = useState(true);
    
    const updatePassword = () => {
        let objError = {};
        let isValiteToSendUpdatePassword=false;
        setError({});
        
        if(!password || !newPassword || !newConfirmPassword){
            !password && (objError.password =  "*Campo obligatorio"); 
            !newPassword && (objError.newPassword = "*Campo obligatorio!"); 
            !newConfirmPassword && (objError.newConfirmPassword = "*Campo obligatorio");
        }else{
            if(!validatePassword(newPassword,newConfirmPassword)){
                objError.newPassword =  "¡Contraseñas deben ser iguales!";
                objError.newConfirmPassword =  "¡Contraseñas deben ser iguales!"; 
            }else{
                if(password === newPassword ){
                    objError.newPassword =  "¡Contraseña no puede ser igual a la anterior!";
                }else{
                    isValiteToSendUpdatePassword=true;
                }                
            }
        }        

        
        if(isValiteToSendUpdatePassword){
            setIsLoading(true);
            reauthenticate(password)
            .then(
                ()=>{
                    senUpdatePassword(newPassword)
                }
            )
            .catch(
                () => {
                    setError({password:"¡Contraseña actual no es correcta!"})
                    setIsLoading(false);
                }
            );                             
        }else{
            setError(error);
            setIsLoading(false);
        }
    };
    const senUpdatePassword = newPassword => {
        firebase
        .auth()
        .currentUser
        .updatePassword(newPassword)
        .then(()=>{
            setIsLoading(false);   
            setIsModalVisible(false);
            toastRef.current.show("¡Contraseña actualizada!");
            firebase.auth().signOut();            
        })
        .catch(()=>{
            setError({password:"¡Error al actualizar la contraseña!"})
            setIsLoading(false);
        })
    } 
    return (
        <View styles={styles.view}>
            <Input 
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={e => setPassword(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:hidePassword ? 'eye-outline' : 'eye-off-outline',
                    color:"#c2c2c2",
                    onPress:() => setHidePassword(!hidePassword)
                }}
                errorMessage={error.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hideNewPassword}
                onChange = {e => setNewPassword(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:hideNewPassword ? 'eye-outline' : 'eye-off-outline',
                    color:"#c2c2c2",
                    onPress:() => setHideNewPassword(!hideNewPassword)
                }}
                errorMessage={error.newPassword}
            />
            <Input 
                placeholder="Confirma tu nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry = {hideNewConfirmPassword}
                onChange = { e => setNewConfirmPassword(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:hideNewConfirmPassword ? "eye-outline": "eye-off-outline",
                    color:"#c2c2c2",
                    onPress: () => setNewConfirmHidePassword(!hideNewConfirmPassword)
                }}
                errorMessage={error.newConfirmPassword}
            />
            <Button 
                title="Cambiar clave"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updatePassword}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view:{
        alignItems:"center",
        paddingTop:10,
        paddingBottom:10
    },
    input:{
        marginBottom:10,
    },
    btnContainer:{
        marginTop:20,
        width:"95%"
    },
    btn:{
        backgroundColor:"#00a68a"
    }
});