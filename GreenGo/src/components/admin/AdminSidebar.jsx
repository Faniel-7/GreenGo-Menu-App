import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {router, usePathname} from "expo-router";




export default function AdminSidebar(){

  const [role,setRole] = useState("");
  const pathname = usePathname();
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

const menuItems = [
{
title:"Dashboard",
icon:"grid-outline",
route:"/admin/dashboard"
},

{
title:"Categories",
icon:"restaurant-outline",
route:"/admin/categories"
},

{
title:"Offers",
icon:"gift-outline",
route:"/admin/offers"
},

{
title:"Settings",
icon:"settings-outline",
route:"/admin/settings"
}
];

if (role === "Super Admin") {
  menuItems.push({
    title: "Admin Management",
    icon: "people-outline",
    route: "/admin/admins",
  });
}

return(

<View style={styles.container}>


<Text style={styles.logo}>
GREENGO
</Text>


<Text style={styles.admin}>
ADMIN PANEL
</Text>



{
menuItems.map((item,index)=>(

<TouchableOpacity
key={index}
style={[
  styles.menuItem,
  pathname === item.route && styles.activeMenuItem,
]}
onPress={() => router.push(item.route)}
>


<Ionicons
name={item.icon}
size={24}
color="#f4b400"
/>


<Text
  style={[
    styles.menuText,
    pathname === item.route && styles.activeMenuText,
  ]}
>
{item.title}
</Text>


</TouchableOpacity>


))
}


</View>

)

}



const styles = StyleSheet.create({

container:{

width:260,

backgroundColor:"#080808",

paddingTop:40,

paddingHorizontal:20,

borderRightWidth:1,

borderColor:"#222",

},


logo:{

color:"#f4b400",

fontSize:32,

fontWeight:"900",

marginBottom:5,

},


admin:{

color:"white",

fontSize:14,

letterSpacing:2,

marginBottom:40,

},


menuItem:{

height:55,

flexDirection:"row",

alignItems:"center",

gap:15,

marginBottom:10,

},


menuText:{

color:"white",

fontSize:16,

fontWeight:"700",

},

activeMenuItem: {
  backgroundColor: "#1a1a1a",
  borderLeftWidth: 4,
  borderLeftColor: "#f4b400",
  borderRadius: 10,
  paddingHorizontal: 10,
},

activeMenuText: {
  color: "#f4b400",
},

});