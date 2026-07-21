import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


const menuItems = [
  {
    title:"Dashboard",
    icon:"grid-outline"
  },
  {
  title: "Categories",
  icon: "category-outline",
  route: "/admin/categories",
},
  {
    title:"Menu",
    icon:"restaurant-outline"
  },
  {
    title:"Promotions",
    icon:"megaphone-outline"
  },
  {
    title:"Discounts",
    icon:"pricetag-outline"
  },
  {
    title:"Happy Hours",
    icon:"time-outline"
  },
  {
    title:"Seating",
    icon:"apps-outline"
  },
  {
    title:"Customers",
    icon:"people-outline"
  },
  {
    title:"Settings",
    icon:"settings-outline"
  }
];


export default function AdminSidebar(){

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
style={styles.menuItem}
>


<Ionicons
name={item.icon}
size={24}
color="#f4b400"
/>


<Text style={styles.menuText}>
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

}

});