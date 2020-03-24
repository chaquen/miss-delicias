import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native'; 
import { Input, Button } from 'react-native-elements'; 
import * as firebase from 'firebase';
import {reauthenticate} from '../../utils/Api'

export default function ChangeEmailForm(props){
    const {email, setIsModalVisible, setReloadDataUser, toastRef} = props;
    const [newEmail, setNewEmail] = useState('');
    const [error, setError]=useState({});
    const [hidePassword,setHidePassword] = useState(true);
    const [password,setPassword]=useState("");
    const [isLoading, setIsLoading] = useState(false);
    const updateEmail = () => {
        setError({});
        if(!newEmail || email === newEmail){
            setError({email:"El email no puede ser el mismo o estar vacío"});
        }else{
            setIsLoading(true);
            reauthenticate(password)
            .then(()=>{
                firebase
                .auth()
                .currentUser
                .updateEmail(newEmail)
                .then(()=>{
                    setIsLoading(false);
                    setReloadDataUser(true);
                    toastRef.current.show("Email actualizado correctamente");
                    setIsModalVisible(false);
                })
                .catch(()=>{
                    setError({email:"Error al actualizar el correo electrónico"})
                    setIsLoading(false);
                });
                })
            .catch(()=>{
                setError({password:"La contraseña no es correcta"});
                setIsLoading(false);
            });
        }       
    };
    return (
        <View styles={styles.view}>
            <Input 
                placeholder="Correo electrónico"
                containerStyle={styles.input}
                defaultValue={email && email}
                onChange={e => setNewEmail(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"at",
                    color:"#c2c2c2"
                }}
                errorMessage={error.email}
            />
            <Input
                placeholder="Escribe tu contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={hidePassword}
                onChange={e => setPassword(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name: hidePassword ? "eye" : "eye-off-outline",
                    color:"#c2c2c2",
                    onPress: () =>  setHidePassword(!hidePassword)

                }}
                errorMessage={error.password}
            />
             <Button
                title="Cambiar email"   
                containerStyle={styles.btnCambiarEmail}
                buttonStyle={styles.btn}
                onPress={updateEmail}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop:10,
        paddingBottom:10        
    },
    input:{
        marginBottom: 10
    },
    btnCambiarEmail:{
        marginTop:20,
        width: "95%"
    },
    btn:{
        backgroundColor:"#00a680"
    }
});