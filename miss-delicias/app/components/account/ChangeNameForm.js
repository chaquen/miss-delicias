import React, {useState} from "react";
import { View, StyleSheet } from 'react-native'; 
import { Input, Button } from 'react-native-elements'; 
import * as firebase from 'firebase';

export default function ChangeNameForm(props){
    const {name, setIsModalVisible, setReloadDataUser, toastRef} = props;
    const [newName, setNewName]=useState(null);
    const [error, setError] =useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const updateName = () => {
        setError(null);
        if(!newName){
            setError("El nombre del usuario no ha cambiado.");
        }else{
            setIsLoading(true);
            const updateData = {
                displayName:newName
            };
                        
            firebase
            .auth()
            .currentUser
            .updateProfile(updateData)
            .then(()=>{
                setIsLoading(false);
                setReloadDataUser(true);
                toastRef.current.show("Nombre actualizado");  
                setIsModalVisible(false);
            })
            .catch(()=>{
                setError("Erro al actualizar enl nombre");
                setIsLoading(false);
            });
            
        }
        
    };
    return (
        <View styles={styles.view}>
            <Input 
                placeholder="Nombre "
                containerStyle={styles.input}
                defaultValue={name && name}
                onChange={e => setNewName(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"account-circle-outline",
                    color:"#c2c2c2"
                }}
                errorMessage={error}
            />
            <Button
                title="Cambiar nombre"   
                containerStyle={styles.btnCambiarNombre}
                buttonStyle={styles.btn}
                onPress={updateName}
                loading={isLoading}
            />
        </View>
    );
}

const styles =StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop:40,
        paddingBottom:10
        
    },
    input:{
        marginBottom: 10
    },
    btnCambiarNombre:{
        marginTop:20,
        width:"95%"
    },
    btn:{
          backgroundColor  : "#00a680"
    }
});