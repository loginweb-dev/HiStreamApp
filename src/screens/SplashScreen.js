import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const SplashScreen = () => (
    <View style={ style.container }>
        <Image 
            source={require('../assets/images/icon.png')}
            style={style.logo}
            resizeMode="contain"
        />
        <Text style={style.title}>HiSteam</Text>
        <View style={style.footer}>
            <Text style={style.footerText}>Powered by <Text style={style.footerTextAutor}>LoginWeb</Text></Text>
        </View>
    </View>
);

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        flexDirection: 'column',
        width: 80,
        height:80,
        marginBottom: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 35,
        marginBottom:10
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30
    },
    footerText: {
        textAlign: 'center',
        fontSize: 15
    },
    footerTextAutor: {
        fontWeight: 'bold'
    }
});

export default SplashScreen;