import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import useResponsive from "../../hooks/useResponsive";
import AdminSidebar from "./AdminSidebar";
import AdminBottomTabs from "./AdminBottomTabs";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";



export default function AdminLayout({children}) {

  const {
    isMobile,
    isTablet,
    isDesktop
  } = useResponsive();

  async function logout(){

const { error } = await supabase.auth.signOut();

if(error){

Alert.alert(
"Error",
error.message
);

return;

}

router.replace("../../admin/login");

}

  return (

    <View style={styles.container}>


      {(isTablet || isDesktop) && (
        <AdminSidebar />
      )}


      <View style={styles.content}>

  <View style={styles.topBar}>

    <TouchableOpacity
      style={styles.logoutButton}
      onPress={logout}
    >

      <Text style={styles.logoutText}>
        Logout
      </Text>

    </TouchableOpacity>

  </View>

  {children}

</View>


      {isMobile && (
        <AdminBottomTabs />
      )}


    </View>

  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    flexDirection:"row",
    backgroundColor:"#030303",
  },


  content:{
    flex:1,
    paddingBottom:50,
  },
  topBar:{
height:60,
justifyContent:"center",
alignItems:"flex-end",
paddingHorizontal:20,
},

logoutButton:{
backgroundColor:"#f4b400",
paddingVertical:8,
paddingHorizontal:20,
borderRadius:10,
},

logoutText:{
color:"#000",
fontWeight:"900",
fontSize:15,
},

});