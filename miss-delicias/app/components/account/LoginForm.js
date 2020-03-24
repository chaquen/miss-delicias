import React,{ useState } from 'react';
import {validateEmail}  from '../../utils/Validation';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import  * as firebase  from 'firebase';
import { withNavigation } from 'react-navigation';
import Loading from '../Loading';


function LoginForm(props){
    const { toastRef,navigation } = props;
    const [ hidePassword, setHidePassword] = useState(true);
    const [ password, setPassword] = useState("");
    const [ email, setEmail] = useState("");
    const [ isVisibleLoading, setIsVisibleLoading ] = useState(false);


    const Login = async () => {
        if(!email && !password){
            toastRef.current.show("Todos los campos son obligatorios");            
            return; 
        }else if(!email || !validateEmail(email)){
            toastRef.current.show("Ingresa un correo valido");            
            return; 
        }else if(!password){
            toastRef.current.show("Ingresa una contraseña");
            return; 
        }else{
            setIsVisibleLoading(true);
            await firebase  
                  .auth()
                  .signInWithEmailAndPassword(email,password)
                  .then(()=> {
                      setIsVisibleLoading(false)
                      navigation.navigate("MyAccount")
                  })
                  .catch(() => {
                      setIsVisibleLoading(false) 
                      toastRef.current.show("Los datos ingresados no son correctos, por favor intente nuevamente")
                  });               
        }
    };
    
    return (
        <View style={ styles.formContainer}>
            <Input 
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={ e => setEmail(e.nativeEvent.text)}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={ styles.iconRight}
                    />
                }
            />
            <Input
                placeholder='Escribe tu contraseña'
                containerStyle={ styles.inputForm}
                password={true}
                secureTextEntry={ hidePassword }
                onChange = { e => setPassword(e.nativeEvent.text) }
                rightIcon={
                    <Icon
                        type="material-community"
                        name = {hidePassword ? 'eye-outline' : 'eye-off-outline'}
						iconStyle = { styles.iconRight}
						onPress = {() => setHidePassword(!hidePassword)}
                    />
                }
            />
            <Button
                title="Ingresar"
                containerStyle={ styles.btnContainerLogin }
                buttonStyle = { styles.btnLogin }
                onPress={ Login }
            />
            <Loading isVisible={ isVisibleLoading } text="Ingresando"/>
        </View>
    );
}
export default withNavigation(LoginForm);
const styles = StyleSheet.create({
    formContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginRight:30,
        marginLeft:5
    },
    inputForm:{
        width:"100%",
        marginTop:20
    },
    iconRight:{
        color: "#c1c1",
    },
    btnContainerLogin:{
        marginTop: 20,
        width:"95%"
    },
    btnLogin:{
        backgroundColor:"#00a680"
    }
}); 