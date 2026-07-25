import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import { supabase } from "../../lib/supabase";
import {router} from "expo-router";


export default function Admins(){

const [admins,setAdmins] = useState([]);

const [fullName,setFullName] = useState("");

const [email,setEmail] = useState("");

const [userId,setUserId] = useState("");

const [role,setRole] = useState("Admin");

const [myRole,setMyRole] = useState("");


useEffect(()=>{

fetchAdmins();
fetchMyRole();

},[]);



async function fetchAdmins(){

const {data,error}=

await supabase
.from("admins")
.select("*")
.order("created_at",{ascending:false});


if(error){

console.log(error);

return;

}


setAdmins(data || []);

}




async function addAdmin(){

if(
!fullName.trim() ||
!email.trim() ||
!userId.trim()
){

Alert.alert(
"Error",
"Fill all fields"
);

return;

}


const {data,error}=

await supabase
.from("admins")
.insert({

full_name:fullName,

email:email,

user_id:userId,

role:role,

})
.select();

console.log("Data:", data)
console.log("Error:", error)


if(error){

Alert.alert(
"Error",
error.message
);

return;

}


await fetchAdmins();

setFullName("");

setEmail("");

setUserId("");

setRole("Admin");


Alert.alert(
"Success",
"Admin added"
);


}

async function deleteAdmin(id) {

 
  const {

data:{user}

}=await supabase.auth.getUser();

const adminToDelete=

admins.find(a=>a.id===id);

if(adminToDelete.user_id===user.id){

Alert.alert(
"Error",
"You cannot delete yourself."
);

return;

}

  const {data,error} = await supabase
    .from("admins")
    .delete()
    .eq("id", id)
    .select();

  console.log("Deleted data:", data);
  console.log("Delete error:", error);

  if (error) {
    Alert.alert("Error", error.message);
    return;
  }

  await fetchAdmins();

  Alert.alert("Success", "Admin removed");
}

async function updateRole(id){

const { error } = await supabase
.from("admins")
.update({
role:"Super Admin"
})
.eq("id",id);

if(error){

Alert.alert(
"Error",
error.message
);

return;

}

await fetchAdmins();

Alert.alert(
"Success",
"Role updated"
);

}

async function fetchMyRole() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  setMyRole(data.role);

if(data.role !== "Super Admin"){

Alert.alert(
"Access denied",
"Only Super Admin can manage admins"
);

router.replace("/admin/dashboard");

}
}


return(

<AuthGuard>

<AdminLayout>

<ScrollView

style={styles.container}

showsVerticalScrollIndicator={false}

contentContainerStyle={{paddingBottom:50}}

>


<Text style={styles.title}>
Admins
</Text>



<Text style={styles.section}>
Add New Admin
</Text>



<View style={styles.card}>


<TextInput

style={styles.input}

placeholder="Full Name"

placeholderTextColor="#777"

value={fullName}

onChangeText={setFullName}

/>



<TextInput

style={styles.input}

placeholder="Email"

placeholderTextColor="#777"

keyboardType="email-address"

value={email}

onChangeText={setEmail}

/>



<TextInput

style={styles.input}

placeholder="User ID"

placeholderTextColor="#777"

value={userId}

onChangeText={setUserId}

/>



<Text style={styles.label}>
Role
</Text>



<View style={styles.roleRow}>


<TouchableOpacity

style={[
styles.roleButton,
role==="Admin" && styles.activeRole
]}

onPress={()=>setRole("Admin")}

>

<Text style={styles.roleText}>
Admin
</Text>

</TouchableOpacity>




<TouchableOpacity

style={[
styles.roleButton,
role==="Super Admin" && styles.activeRole
]}

onPress={()=>setRole("Super Admin")}

>

<Text style={styles.roleText}>
Super Admin
</Text>

</TouchableOpacity>


</View>



<TouchableOpacity

style={styles.createButton}

onPress={addAdmin}

>

<Text style={styles.createText}>
+ ADD ADMIN
</Text>


</TouchableOpacity>



</View>





<Text style={styles.section}>
Existing Admins
</Text>




{admins.map(admin=>(




<View

key={admin.user_id}

style={styles.adminCard}

>


<View>

<Text style={styles.name}>
{admin.full_name}
</Text>


<Text style={styles.email}>
{admin.email}
</Text>


</View>



<View

style={[
styles.badge,
admin.role==="Super Admin"
&& styles.superBadge
]}

>

<Text style={styles.badgeText}>
{admin.role}
</Text>

{admin.role === "Admin" && (

<TouchableOpacity
style={styles.roleButton2}
onPress={() => updateRole(admin.id)}
>

<Text style={styles.roleButtonText}>
Make Super Admin
</Text>

</TouchableOpacity>

)}

{admin.role !== "Super Admin" && (

<TouchableOpacity
style={styles.removeButton}
onPress={() =>{
console.log("Removing admin with ID:", admin.id);
 deleteAdmin(admin.id)}}
>

<Text style={styles.removeButtonText}>
Remove
</Text>

</TouchableOpacity>

)}


</View>



</View>



))}





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
borderRadius:15
},


input:{
backgroundColor:"#222",
color:"white",
padding:15,
borderRadius:12,
marginBottom:15
},


label:{
color:"#aaa",
marginBottom:10
},


roleRow:{
flexDirection:"row",
gap:10,
marginBottom:20
},


roleButton:{
flex:1,
padding:12,
borderRadius:12,
borderWidth:1,
borderColor:"#555",
alignItems:"center"
},


activeRole:{
backgroundColor:"#f4b400",
borderColor:"#f4b400"
},


roleText:{
color:"white",
fontWeight:"900"
},


createButton:{
backgroundColor:"#f4b400",
padding:18,
borderRadius:15,
alignItems:"center"
},


createText:{
color:"#000",
fontWeight:"900"
},
adminCard:{
backgroundColor:"#111",
padding:20,
borderRadius:15,
marginBottom:15,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},


name:{
color:"white",
fontSize:18,
fontWeight:"900"
},


email:{
color:"#999",
marginTop:5
},


badge:{
backgroundColor:"#333",
paddingVertical:8,
paddingHorizontal:12,
borderRadius:20
},


superBadge:{
backgroundColor:"#f4b400"
},


badgeText:{
color:"black",
fontWeight:"900"
},

removeButton:{
backgroundColor:"#d32f2f",
paddingVertical:10,
paddingHorizontal:16,
borderRadius:10,
marginTop:10
},

removeButtonText:{
color:"white",
fontWeight:"900"
},

roleButton2:{
backgroundColor:"#2196F3",
padding:10,
borderRadius:10,
marginTop:10
},

roleButtonText:{
color:"white",
fontWeight:"900"
},

});