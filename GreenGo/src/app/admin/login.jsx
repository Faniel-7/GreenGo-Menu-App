import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";


export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleLogin() {

    setError("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });


    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }


    if (data.session) {
      router.replace("/admin/dashboard");
    }


    setLoading(false);
  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        GreenGo Admin
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />


      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}



      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >

        {
          loading ?

          <ActivityIndicator color="white"/>

          :

          <Text style={styles.buttonText}>
            LOGIN
          </Text>
        }

      </TouchableOpacity>


    </View>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:25,
    backgroundColor:"#111",
  },

  title:{
    color:"#f5b800",
    fontSize:32,
    fontWeight:"bold",
    textAlign:"center",
    marginBottom:40,
  },

  input:{
    backgroundColor:"#222",
    color:"white",
    padding:15,
    borderRadius:10,
    marginBottom:15,
  },

  loginButton:{
    backgroundColor:"#f5b800",
    padding:15,
    borderRadius:10,
    alignItems:"center",
  },

  buttonText:{
    fontWeight:"bold",
    color:"#000",
  },

  clearButton:{
    marginTop:20,
    alignItems:"center",
  },

  clearText:{
    color:"red",
  },

  error:{
    color:"red",
    textAlign:"center",
    marginBottom:10,
  }

});