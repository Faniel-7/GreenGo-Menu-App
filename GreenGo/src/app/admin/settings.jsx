import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { supabase } from "../../lib/supabase";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";


export default function Settings(){

const router = useRouter();


const [email,setEmail] = useState("");

const [newPassword,setNewPassword] = useState("");

const [confirmPassword,setConfirmPassword] = useState("");



useEffect(()=>{

getUser();

},[]);



async function getUser(){

const {
data:{user}
}=await supabase.auth.getUser();


if(user){

setEmail(user.email || "");

}

}




async function changePassword(){

if(!newPassword.trim()){

Alert.alert(
"Error",
"Enter new password"
);

return;

}


if(newPassword !== confirmPassword){

Alert.alert(
"Error",
"Passwords do not match"
);

return;

}



const {error}=

await supabase.auth.updateUser({

password:newPassword

});



if(error){

Alert.alert(
"Error",
error.message
);

return;

}



Alert.alert(
"Success",
"Password changed successfully"
);



setNewPassword("");

setConfirmPassword("");

}




async function changeEmail(){


if(!email.trim()){

Alert.alert(
"Error",
"Enter email"
);

return;

}



const {error}=

await supabase.auth.updateUser({

email:email

});



if(error){

Alert.alert(
"Error",
error.message
);

return;

}



Alert.alert(
"Success",
"Email update confirmation sent"
);


}





async function logout(){


const {error}=

await supabase.auth.signOut();



if(error){

Alert.alert(
"Error",
error.message
);

return;

}



router.replace("admin/login");


}



return(

<AuthGuard>

<AdminLayout>

<ScrollView

style={styles.container}

showsVerticalScrollIndicator={false}

>


<Text style={styles.title}>
Settings
</Text>



<Text style={styles.section}>
Account Information
</Text>



<View style={styles.card}>


<Text style={styles.label}>
Email
</Text>


<TextInput

style={styles.input}

value={email}

onChangeText={setEmail}

placeholder="Admin email"

placeholderTextColor="#777"

/>



<TouchableOpacity

style={styles.secondaryButton}

onPress={changeEmail}

>


<Text style={styles.secondaryText}>
CHANGE EMAIL
</Text>


</TouchableOpacity>


</View>





<Text style={styles.section}>
Security
</Text>



<View style={styles.card}>


<TextInput

style={styles.input}

placeholder="New Password"

placeholderTextColor="#777"

secureTextEntry

value={newPassword}

onChangeText={setNewPassword}

/>



<TextInput

style={styles.input}

placeholder="Confirm Password"

placeholderTextColor="#777"

secureTextEntry

value={confirmPassword}

onChangeText={setConfirmPassword}

/>



<TouchableOpacity

style={styles.createButton}

onPress={changePassword}

>


<Text style={styles.createText}>
CHANGE PASSWORD
</Text>


</TouchableOpacity>


</View>





<TouchableOpacity

style={styles.logoutButton}

onPress={logout}

>


<Text style={styles.logoutText}>
LOG OUT
</Text>


</TouchableOpacity>




</ScrollView>

</AdminLayout>

</AuthGuard>

);


}



const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:"#030303",
padding:20
},


title:{
color:"#f4b400",
fontSize:34,
fontWeight:"900",
marginBottom:25
},


section:{
color:"white",
fontSize:22,
fontWeight:"900",
marginVertical:20
},


card:{
backgroundColor:"#111",
padding:20,
borderRadius:15,
marginBottom:10
},


label:{
color:"#aaa",
fontSize:16,
marginBottom:10
},


input:{
backgroundColor:"#222",
color:"white",
padding:15,
borderRadius:12,
marginBottom:15
},


secondaryButton:{
borderWidth:1,
borderColor:"#f4b400",
padding:15,
borderRadius:12,
alignItems:"center"
},


secondaryText:{
color:"#f4b400",
fontWeight:"900"
},


createButton:{
backgroundColor:"#f4b400",
padding:18,
borderRadius:15,
alignItems:"center",
marginTop:10
},


createText:{
color:"#000",
fontWeight:"900"
},
logoutButton:{
backgroundColor:"#111",
borderWidth:1,
borderColor:"#ff4444",
padding:18,
borderRadius:15,
alignItems:"center",
marginTop:30,
marginBottom:40
},


logoutText:{
color:"#ff4444",
fontWeight:"900"
}


});