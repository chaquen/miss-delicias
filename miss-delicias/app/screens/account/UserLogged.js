import React,{useState, useEffect, useRef} from 'react';
import { StyleSheet, View} from 'react-native';
import { Button} from 'react-native-elements';
import  * as firebase  from 'firebase';
import InfoUser from '../../components/account/InfoUser';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AccountOptions from '../../components/account/AccountOptions';

export default function UserLogged(){
	const [userInfo, setUserInfo]=useState({}); 
	const [reloadDataUser,setReloadDataUser]=useState(false); 
	const [isVisibleLoading,setIsVisibleLoading]=useState(false);
	const [textLoading,setTextLoading]=useState("");
	const toastRef=useRef();
	useEffect(()=>{
		(async () => {
			const user = await firebase.auth().currentUser;
			setUserInfo(user.providerData[0]);
		})();
		setReloadDataUser(false)
	},[reloadDataUser]);

	return (
		<View style={styles.viewUserInfo}>
			<InfoUser 
				userInfo={userInfo}
				setReloadDataUser ={setReloadDataUser} 
				toastRef={toastRef}
				setIsVisibleLoading={setIsVisibleLoading}
				setTextLoading={setTextLoading}
			/>
			<AccountOptions
					userInfo={userInfo} 
					setReloadDataUser={setReloadDataUser}
					toastRef={toastRef}
			/>
			<Button 
				title = "Cerrar Sesión"
				buttonStyle={styles.btnLogOut}
				titleStyle={styles.btnLogOutText}
				onPress = { () => firebase.auth().signOut()}
			/>
			<Toast ref={toastRef} position="center" opacity={0.5} adeOutDuration={6000}/>
			<Loading isVisible={isVisibleLoading} text={textLoading}/>
		</View>
	);

} 


const styles = StyleSheet.create({
	viewUserInfo:{
		minHeight:"100%",
		backgroundColor: "#f2f2f2"
	},
	btnLogOut:{
		marginTop: 30,
		borderRadius: 0,
		backgroundColor:"#fff",
		borderTopWidth:1,
		borderTopColor: "#e3e3e3"
	},
	btnLogOutText:{
		color:"#00a680"	
	}
});