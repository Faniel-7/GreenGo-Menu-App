import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";






export default function AdminBottomTabs(){

  const [role,setRole] = useState("");
  const [showMore,setShowMore] = useState(false);

  useEffect(()=>{

fetchRole();

},[]);


async function fetchRole(){

const {
data:{user}
}=await supabase.auth.getUser();


const {data,error}=await supabase
.from("admins")
.select("role")
.eq("user_id",user.id)
.single();


if(error){
console.log(error);
return;
}


setRole(data.role);

}

  const tabs = [
  {
    title:"Home",
    icon:"home-outline",
    route:"/admin/dashboard"
  },
  {
    title:"Menu",
    icon:"restaurant-outline",
    route:"/admin/categories"
  },
  {
    title:"Offers",
    icon:"megaphone-outline",
    route:"/admin/offers"
  },
  {
    title:"More",
    icon:"menu-outline",
    route:"/admin/settings"
  }
];

return(

<View style={styles.container}>

{
tabs.map((tab,index)=>(

<TouchableOpacity
key={index}
style={styles.tab}
onPress={()=>{
if(tab.title==="More"){
setShowMore(true);
}else{
router.push(tab.route);
}
}}
>

<Ionicons
name={tab.icon}
size={25}
color="#f4b400"
/>


<Text style={styles.text}>
{tab.title}
</Text>


</TouchableOpacity>

))
}

<Modal
visible={showMore}
transparent
animationType="slide"
>

<TouchableOpacity
style={styles.overlay}
onPress={()=>setShowMore(false)}
>

<View style={styles.moreBox}>


<TouchableOpacity
style={styles.moreItem}
onPress={()=>{
setShowMore(false);
router.push("/admin/settings");
}}
>

<Text style={styles.moreText}>
Settings
</Text>

</TouchableOpacity>


{role==="Super Admin" && (

<TouchableOpacity
style={styles.moreItem}
onPress={()=>{
setShowMore(false);
router.push("/admin/admins");
}}
>

<Text style={styles.moreText}>
Admin Management
</Text>

</TouchableOpacity>

)}


</View>

</TouchableOpacity>

</Modal>

</View>

)

}



const styles = StyleSheet.create({

container:{

position:"absolute",

bottom:0,

left:0,

right:0,

height:70,

backgroundColor:"#080808",

flexDirection:"row",

justifyContent:"space-around",

alignItems:"center",

borderTopWidth:1,

borderColor:"#222"

},


tab:{

alignItems:"center"

},


text:{

color:"white",

fontSize:12,

marginTop:5

},

overlay:{
flex:1,
backgroundColor:"rgba(0,0,0,0.5)",
justifyContent:"flex-end",
},


moreBox:{
backgroundColor:"#111",
padding:20,
borderTopLeftRadius:20,
borderTopRightRadius:20,
},


moreItem:{
padding:18,
borderBottomWidth:1,
borderColor:"#333",
},


moreText:{
color:"white",
fontSize:18,
fontWeight:"900",
},

});