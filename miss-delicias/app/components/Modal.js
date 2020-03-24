import React from 'react';
import { StyleSheet } from 'react-native';
import { Overlay } from  'react-native-elements';

export default function Modal(props){
    const {isModalVisible, setIsModalVisible, children} = props;

    //esta sintaxis aplica si es una sola linea
    const closeModal = () => setIsModalVisible(false);
    
    return (
        <Overlay
            isVisible={isModalVisible}
            windowBackgroundColor="rga(0, 0, 0, .5)"
            overBackgroundColor="transparent"
            overlayStyle={styles.overlay}
            onBackdropPress={closeModal}
        >
            {children}
        </Overlay>
    );
}

const styles = StyleSheet.create({
    overlay:{
        height: "auto",
        width:"90%",
        backgroundColor:"#e5e5e5"
    }
});