import { View, Text, StyleSheet } from "react-native";

export default function AdminToast({ message, type="success" }) {

  return (
    <View
      style={[
        styles.container,
        type === "error" && styles.error
      ]}
    >
      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({

container:{
  position:"absolute",
  top:20,
  left:20,
  right:20,
  backgroundColor:"#1ecb00",
  padding:15,
  borderRadius:12,
  zIndex:999,
  alignItems:"center",
},

error:{
  backgroundColor:"#d32f2f",
},

text:{
  color:"#fff",
  fontWeight:"900",
  fontSize:15,
}

});