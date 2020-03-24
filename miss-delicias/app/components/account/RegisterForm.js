import React, { useState } from 'react';
import {  StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { validateEmail,validatePassword } from '../../utils/Validation';
import  * as firebase  from 'firebase';
import Loading from '../Loading';
import { withNavigation } from 'react-navigation';


function RegisterForm(props){
	const { toastRef,navigation } = props;

	const [ hidePassword, setHidePassword] = useState(true);
	const [ hideConfirmPassword, setHideConfirmPassword] = useState(true);
	const [ isVisibleLoading, setIsVisibleLoading ] = useState(false);
	const [ email, setEmail] = useState("");
	const [ password, setPassword] = useState("");
	const [ confirmPassword, setConfirmPassword] = useState("");

	const register = async () => {
 		setIsVisibleLoading(true);
		if(!email || !password || !confirmPassword){
			toastRef.current.show("Todos los campos son obligatorios");
		}else{
			if(!validateEmail(email)){
				toastRef.current.show("El email no es valido");
			}else if(!validatePassword(password,confirmPassword)){
				toastRef.current.show("Las contraseñas deben ser iguales, ademas debe tener un tamaño de minimo 6 caracteres");
			}else{
				await firebase
					  .auth()
					  .createUserWithEmailAndPassword(email,password)
					  .then(()=> 
					  	navigation.navigate("MyAccount")
					  )
					  .catch(
						  ( error )=>toastRef.current.show(error.message)
						  
						  )

			}
		}	
		setIsVisibleLoading(false);		
	};
	
	return (
		<View style = { styles.formContainer }>
			<Input
				placeholder = "Correo electrónico"
				containerStyle = { styles.inputForm }
				onChange = { e => setEmail(e.nativeEvent.text) }
				rightIcon = {
					<Icon
						type= "material-community"
						name= "at"
						iconStyle= { styles.iconRight}
					/>
				}
			/>
			<Input
				placeholder = "Contraseña"
				password= { true }
				secureTextEntry={ hidePassword }
				containerStyle = { styles.inputForm }
				onChange = { e => setPassword(e.nativeEvent.text) }
				rightIcon = {
					<Icon
						type = "material-community"
						name = {hidePassword ? 'eye-outline' : 'eye-off-outline'}
						iconStyle = { styles.iconRight}
						onPress = {() => setHidePassword(!hidePassword)}

					/>
				}
			/>
			<Input
				placeholder = "Repite la contraseña"
				password = { true }
				secureTextEntry ={ hideConfirmPassword }
				containerStyle = { styles.inputForm }
				onChange = { e => setConfirmPassword(e.nativeEvent.text)}
				rightIcon = {
					<Icon
						type= "material-community"
						name = {hideConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
						iconStyle= { styles.iconRight}
						onPress = {() => setHideConfirmPassword(!hideConfirmPassword)}
					/>
				}
			/>
			<Button 
				title = "Unirse"
				containerStyle = { styles.btnContainerRegister}
				buttonStyle = { styles.btnRegister }
				onPress = { register }
				
			/>	
			<Loading text = "Creando cuenta" isVisible = { isVisibleLoading } />
		</View>
	);

}

export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
	formContainer:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10
	},
	inputForm:{
		width: '100%',
		height: 30,
		marginLeft: 5,
		marginRight: 5,
		marginTop: 5
		
	},
	iconRight:{
		color: '#c1c1c1'
	},
	btnContainerRegister: {
		marginTop: 20,
		width: '95%'
	},
	btnRegister:{
		backgroundColor: '#00a680'
	}


});

