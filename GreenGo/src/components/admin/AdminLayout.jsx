import { View, StyleSheet } from "react-native";
import useResponsive from "../../hooks/useResponsive";

import AdminSidebar from "./AdminSidebar";
import AdminBottomTabs from "./AdminBottomTabs";


export default function AdminLayout({children}) {

  const {
    isMobile,
    isTablet,
    isDesktop
  } = useResponsive();


  return (

    <View style={styles.container}>


      {(isTablet || isDesktop) && (
        <AdminSidebar />
      )}


      <View style={styles.content}>

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
  }

});