import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View, LogBox, PermissionsAndroid, Image, Alert, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator,TextInput
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
//  import fs from 'fs-extra';
//const FormData = require('form-data');
import FormData from 'form-data';
import axios from 'axios';
import { images } from './constants';
import { Dropdown } from 'react-native-element-dropdown';
import RotateAnimation from './Rotate';



const data = [
  { label: 'Programming', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
];

const win = Dimensions.get('window');
// import Button from 'react-bootstrap/Button';

const App = () => {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState('file:///data/user/0/com.awesomeproject/cache/rn_image_picker_lib_temp_4c93bdeb-5326-4b2e-bc80-efea481b7039.jpg')
  const [textGot, setTextGot] = useState("Select an image to see result")
  const [gptResponse, setGptResponse] = useState("NULL");
  const [value, setValue] = useState("");
  const [textRecognize, setTextRecognize] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };


  const handleCamera = async () => {
    setCount(count + 1);
    requestCameraPermission();
    const res = await launchCamera({ mediaType: 'photo', videoQuality: 'high', saveToPhotos: true })
    Alert.alert('saved to your Gallery')
    console.log(res.assets[0].uri);
    setImage(res.assets[0].uri);
    setTextRecognize(true);
    //fetchData(res.assets[0].uri);
  }

  const handleGallery = async () => {
    setCount(count + 1);
    requestCameraPermission();
    const res = await launchImageLibrary({ mediaType: 'photo', videoQuality: 'high' })
    console.log(res.assets[0].uri);
    setImage(res.assets[0].uri)
    //fetchData(res.assets[0].uri);
  }

  const fetchData = async (imageURI: string | undefined) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageURI,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      console.log("scan started")
      setTextGot('please wait for response')
      setTextRecognize(true)
      const response = await axios.post(
        'https://image-to-text-api.onrender.com',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log(response.data);
      
      setTextGot(response.data);
      setTextRecognize(false);
      gpt(response.data);

    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const gpt = async (question: string | undefined) => {
    const options = {
      method: 'POST',
      url: 'https://open-ai25.p.rapidapi.com/ask',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '85e85cc72dmsh75146aac746f3d3p10282bjsn5205ff683d25',
        'X-RapidAPI-Host': 'open-ai25.p.rapidapi.com'
      },
      data: {
        query: "can you please provide the response for the following : " + question,
        wordLimit: "500"
      }
    };

    try {
      const response = await axios.request(options);
      //console.log(response.data.response);
      setGptResponse(response.data.response);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("rendered");
  }, [])


  return (

    // <ScrollView style={styles.scrollView}>

    //   <Image
    //      source={{uri:image}}
    //      style={{width: 500, height:200,resizeMode:'cover'}}
    //   />
    //   <TouchableOpacity onPress={handleCamera} style={styles.b1}>
    //     <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>Camera</Text>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={handleGallery} style={styles.b2}>
    //     <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>Gallery</Text>
    //   </TouchableOpacity>

    //   <Dropdown
    //     style={styles.dropdown}
    //     placeholderStyle={styles.placeholderStyle}
    //     selectedTextStyle={styles.selectedTextStyle}
    //     inputSearchStyle={styles.inputSearchStyle}
    //     data={data}
    //     search
    //     maxHeight={300}
    //     labelField="label"
    //     valueField="value"
    //     placeholder="Select item"
    //     searchPlaceholder="Search..."
    //     value={value}
    //     onChange={(item)=>{setValue(item.value)}}
    //   />
    //   {textRecognize?<Text>Recognized text : {textGot}</Text>:<Text>select img to recognize</Text>}
    //   {value=='1'? <Text>true</Text>:null}
    //   {gptResponse==="NULL"?<Text style={{color:'white',fontWeight:'900',fontSize:25,fontStyle:'italic'}}>Select Image to see the result</Text>:<Text style={{color:'white',fontWeight:'900',fontSize:25}}>{gptResponse}</Text>}
    // </ScrollView>

    <SafeAreaView >
      <View style={{ backgroundColor: 'black', width: win.width, height: win.height }}>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: 380 }}>
          <View style={{ width: 140, height: 140, backgroundColor: 'rgba(255,0,0,1)', borderRadius: 40, position: 'relative', left: 10, top: 35, zIndex: 1 }}>

          </View>
          <View style={{ width: 140, height: 140, backgroundColor: 'rgba(255,0,0,1)', borderRadius: 100, position: 'relative', left: 55, top: 35 }}>

          </View>
          <TouchableOpacity onPress={handleCamera} style={{ position: 'absolute', backgroundColor: 'yellow', padding: 10, borderRadius: 20, left: 125, top: 55, paddingLeft: 30, zIndex: 0 }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 20 }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGallery} style={{ position: 'absolute', backgroundColor: 'orange', padding: 10, borderRadius: 20, left: 125, top: 110, paddingLeft: 30, zIndex: 0, paddingRight: 15 }}>
            <Text style={{ color: 'black', fontWeight: '800', fontSize: 20 }}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{width: win.width - 20, height: 200, backgroundColor: 'rgba(217,217,217,1)', position: 'absolute', left: 10, top: 190, borderRadius: 20, padding: 10, paddingBottom: 25 }}>

          <Text selectable={true} style={{}}>{textGot}</Text>
          <TextInput style={{borderColor:'black',borderWidth:20}}/>
          {textRecognize ?<RotateAnimation width="650" left="20" color="red" layer={1} opacity={0.5}/>:null}
        </ScrollView>

        <TouchableOpacity onPress={()=>fetchData(image)} style={{ position: 'absolute', backgroundColor: 'yellow', padding: 10, borderRadius: 20, right: 20, top: 333 }}>
          <Text style={{ color: 'black', fontWeight: '800', fontSize: 20 }}>Generate</Text>
        </TouchableOpacity>
        <ScrollView style={{ width: win.width - 20, height: 500, backgroundColor: 'rgba(84, 187, 174, 1)', position: 'absolute', left: 10, top: 400, borderRadius: 20, padding: 10 }}>
          {gptResponse === "NULL" ? <Text style={{ color: 'white', fontWeight: '900', fontSize: 25, fontStyle: 'italic' }}>Select Image to see the result</Text> : <Text style={{ color: 'black', fontWeight: '300', fontSize: 14 }}>{gptResponse}</Text>}
          
        </ScrollView>
      </View>
    </SafeAreaView>

  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  b1: {
    backgroundColor: 'black',
    position: 'absolute',
    width: 70,
    height: 37,
    top: 40,
    right: 40,
    zIndex: 1,
    //borderRadius:10,
  },
  b2: {
    backgroundColor: 'black',
    position: 'absolute',
    width: 70,
    height: 37,
    top: 100,
    right: 40,
    zIndex: 1
  },
  scrollView: {
    backgroundColor: '#155263',

    flex: 0,

  },
  placeholderStyle: {
    fontSize: 16,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'black',
    borderRightColor: 'black',
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderBottomRightRadius: 0,
    backgroundColor: 'yellow',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    borderTopLeftRadius: 0
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    //resizeMode: 'cover'
  }

});

export default App;