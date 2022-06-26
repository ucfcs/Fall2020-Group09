import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const styles = StyleSheet.create({

    stopButton:{
        height: 50, 
        marginLeft: 5, 
        width: 90
    },
    
    startButton:{
        backgroundColor: '#006FD6',
        height: 50, 
        marginLeft: 5, 
        width: 90
    },

    container:{
        margin:5, 
        flexDirection: 'row', 
        justifyContent:'space-between', 
        alignItems:'center'
    },

    buttonView:{
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: - 70
    },

    button:{
        backgroundColor: '#006FD6',
        height: 50, 
        width: 140
    }
    
});

export default styles;