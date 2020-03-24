import React,{useEffect,useState} from 'react';
import {StyleSheet,View,ScrollView,Alert,Dimensions} from 'react-native';
import { Icon,Avatar, Image,Button, Input } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'; 
import * as Location from 'expo-location'
import MapView from 'react-native-maps';
import Modal from '../Modal';
import uuid from "uuid/v4";

import  { firebaseApp }  from '../../utils/FireBase';
import firebase from 'firebase/app';
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);


//Para obtener el tamaño de la pantalla del dispositivo
const widthScreen = Dimensions.get("screen").width;

export default function AddRestaurantForm(props){
    const {navigation,toastRef,setIsLoading,setIsReloadRestaurants} = props;
    const [imagesSelected,setImagesSelected] = useState([]);
    const [restaurantName, setRestaurantName]=useState("");
    const [restaurantAddress, setRestaurantAddress]=useState("");
    const [restaurantDescription, setRestaurantDescription]=useState("");
    const [isVisibleMap, setIsVisibleMap]=useState(false);
    const [locationRestaurant, setLocationResturant]=useState(null);

    const addRestaurant =  () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("¡Todos los campos son obligatorios!");
        }else if(imagesSelected.length === 0){
            toastRef.current.show("¡EL restaurante debe tener al menos una foto!");
        }else if(!locationRestaurant){
            toastRef.current.show("!Tiene que agregar una localización en el mapa¡");
        }else{
                setIsLoading(true);           
                UploadImageFirebaseStorage(imagesSelected)
                .then( arrayImages => {
                    db.collection("restaurants").add({
                        name:restaurantName,
                        address:restaurantAddress,
                        description:restaurantDescription,
                        location:locationRestaurant,
                        images: arrayImages,
                        rating: 0,
                        ratingTotal:0,
                        quantityVoting:0,
                        createAt: new Date(),
                        createBy:firebase.auth().currentUser.uid

                    }).then(()=>{
                        setIsLoading(false);
                        setIsReloadRestaurants(true);
                        navigation.navigate("Restaurants");
                    }).catch((error)=>{
                        setIsLoading(false);
                        toastRef.current.show("Error al crear restaurante, por favor intenta mas mas tarde", 4000);
                    });
                });
                
        }
    };
    const UploadImageFirebaseStorage = async imageArray => {
     
        let imagesNameBlob = [];
        await Promise.all(imageArray.map(async  image => {
            
            let response = await fetch(image);
            let blob = await response.blob();
            let ref = firebase
                .storage()
                .ref("restaurants-images")
                .child(uuid());
               
            await ref.put(blob)
                    .then(result => {
                        imagesNameBlob.push(result.metadata.name);
                    });

        }));
        return imagesNameBlob;
    };
    return(
        <ScrollView >
            <ImageCoverRestaurant imageRestaurant={imagesSelected[0]}/>
            <FormAddRestaurante 
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button 
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map 
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationResturant={setLocationResturant}
                toastRef={toastRef}
            />
        </ScrollView>
    );
}

function UploadImage(props){
 const { imagesSelected,setImagesSelected} = props;
 const selectImage = async () => {
    
    let responsePermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let statusPermissionCamera = responsePermission.permissions.cameraRoll.status;
    
    if(statusPermissionCamera === "denied"){
        toastRef.current.show("¡Debes aceptar permisos para poder agregar imagenes!",5000);
    }else{
        
        let galery = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4,3]
        });
        
        if(!galery.cancelled){
            //...[...imagesSelected,galery.uri] => para agregar nuevos elementos sin sobreescribir
            setImagesSelected([...imagesSelected, galery.uri]);
        }else{
            toastRef.current.show(
                "¡Para subir imagenes debes aceptar los permisos! \n si deseas cambiar por favor accede a los ajustes de tu dispositivo y cambia los permisos de la aplicación"
                ,7000);
        }
       
        
    }
};
 
const removeImage = image => {
    /* Para evitar que se llame esta función al crear el componente Avatar, cada vez que se renderiza,
     se debe invocar como funcion de flecha*/
    let arrayImages = imagesSelected;
    Alert.alert(
        "Eliminar imagen",
        "¿Estas seguro de eliminar esta imagen?",
        [
            {
                text:"Cancelar",
                style:"cancel"
            },
            {
                text:"Eliminar",
                onPress: () => setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))             
            }
        ],
        {cancelable:false}
    );
};
 
 return (
    <View style={styles.viewImages}>
        {imagesSelected.length <= 4 && (
            <Icon 
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={selectImage}
                
            />
        )}
        {imagesSelected.map((imageRestaurant,index) => (
            <Avatar 
                key={index}
                onPress={() => removeImage(imageRestaurant)}
                style={styles.miniatureStyle}
                source ={{ uri: imageRestaurant}}
                showEditButton                
            />
        ))}        
    </View>
 );
}
function ImageCoverRestaurant(props){
    const  {imageRestaurant} = props;

    return (
        <View style={styles.viewPhoto}>
            { imageRestaurant ? (
                <Image
                   source = {{uri:imageRestaurant}}
                   style = {{width: widthScreen, height:200}} 
                />
            ) : (
                <Image 
                    source = { require("../../../assets/img/no-image-restaurant.png") }
                    style = {{width: widthScreen, height:200}} 
                />
            )}
        </View>
    );
}
function FormAddRestaurante(props){   
    const { setRestaurantName,
            setRestaurantAddress,
            setRestaurantDescription,
            setIsVisibleMap,
            locationRestaurant } = props;
    return (
        <View style = {styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurante"
                containerStyle = {styles.input}
                onChange={ e => setRestaurantName(e.nativeEvent.text)}        
            />
            <Input 
                placeholder = "Dirección del resturante"
                containerStyle = {styles.input}
                onChange={ e =>  setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"google-maps",
                    color: locationRestaurant  ?  "#00a680" : "#c2c2c2",
                    onPress : () => setIsVisibleMap(true)
                }}
            />
            <Input 
                placeholder="Descripción del restaurante"
                multiline={true}
                containerStyle={styles.textArea}
                onChange = { e =>  setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    );
}
function Map(props){
    const {isVisibleMap,
           setIsVisibleMap,
           setLocationResturant,
           toastRef } = props;
    const [location, setLocation] = useState(null);

    useEffect(()=> {
        (async () => {
            let responsePermissionLocation = Permissions.askAsync(Permissions.LOCATION);
            let statusPermissionLocation = (await responsePermissionLocation).permissions.location.status;
            if(statusPermissionLocation == "denied"){
                toastRef.current.show("¡Debes aceptar permisos para poder agregar una ubicaión!",5000);
            }else{
                let loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude:loc.coords.latitude,
                    longitude:loc.coords.longitude,
                    latitudeDelta:0.001,
                    longitudeDelta:0.001
                });
            }
            
        })()
    },[]);

    const confirmLocation = () => {
        setLocationResturant(location);
        toastRef.current.show("Localización guardada");
        setIsVisibleMap(false);
    } 

    return (
        <Modal 
            isModalVisible={isVisibleMap}
            setIsModalVisible={setIsVisibleMap}>
                <View>
                    {location && (
                        <MapView 
                            style={styles.mapStyle}
                            initialRegion={location}
                            showsUserLocation={true}
                            onRegionChange={region => setLocation(region)}
                        >
                            <MapView.Marker 
                                coordinate={{
                                    latitude:location.latitude,
                                    longitude:location.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )}
                    <View style={styles.viewMapBtn}>
                          <Button 
                              title="Guardar ubicación"
                              onPress={confirmLocation}
                              containerStyle={styles.viewMapBtnContainerSave}
                              buttonStyle={styles.viewMapBtnSave}
                          />     
                          <Button 
                              title="Cancelar"
                              onPress={()=> setIsVisibleMap(false)}
                              containerStyle={styles.viewMapBtnContainerCancel}
                              buttonStyle={styles.viewMapBtnCancel}
                          />     
                    </View>
                </View>
            </Modal>
    );

}
const styles = StyleSheet.create({
    viewImages:{
        flexDirection:"row",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 40,
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:"#e3e3e3"
    },
    miniatureStyle:{
        width:70,
        height:70,
        marginRight:10,
        
    },
    viewPhoto:{
        alignItems:"center",
        height: 200,
        marginBottom:20
    },
    viewForm:{
        marginLeft: 10,
        marginRight:10
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:100,
        width:"100%",
        padding:0,
        margin:10,
    },
    mapStyle:{
        width:"100%",
        height:450
    },
    viewMapBtn:{
        flexDirection:"row",
        justifyContent:"center",
        marginTop:10

    },
    viewMapBtnContainerSave:{
        paddingRight:5
    },
    viewMapBtnSave:{
        backgroundColor:"#00a680"
    },
    viewMapBtnContainerCancel:{
        paddingLeft:5
    },
    viewMapBtnCancel:{
        backgroundColor:"#a60d0d"
    },
    btnAddRestaurant:{
        backgroundColor:"#00a680",
        margin:15
    }
});