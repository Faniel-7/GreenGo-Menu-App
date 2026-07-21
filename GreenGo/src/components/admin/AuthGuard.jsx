import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";


export default function AuthGuard({ children }) {

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkAdmin();
  }, []);



  async function checkAdmin() {

    console.log("ADMIN GUARD RUNNING");


    // Get logged in user
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();



    if (error || !session) {

      console.log("NO SESSION");
      router.replace("/admin/login");
      return;

    }



    const user = session.user;


    console.log("USER:", user.email);



    // Check admins table

    const { data: admin, error: adminError } =
      await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();



    if (adminError || !admin) {

      console.log("NOT AN ADMIN");

      await supabase.auth.signOut();

      router.replace("/admin/login");

      return;

    }



    console.log("ADMIN VERIFIED");


    setLoading(false);

  }



  if (loading) {

    return (

      <View
        style={{
          flex:1,
          justifyContent:"center",
          alignItems:"center",
        }}
      >

        <ActivityIndicator size="large"/>

      </View>

    );

  }



  return children;

}