import { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";

import { useRouter } from "expo-router";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import useResponsive from "../../hooks/useResponsive";

import { supabase } from "../../lib/supabase";


function getCategoryIcon(name){

  if(name.includes("Pizza"))
    return "🍕";

  if(name.includes("Burger"))
    return "🍔";

  if(name.includes("Hot"))
    return "☕";

  if(name.includes("Breakfast"))
    return "🍳";

  if(name.includes("Salad"))
    return "🥗";

  if(name.includes("Juice"))
    return "🥤";

  if(name.includes("Rice"))
    return "🍝";

  if(name.includes("Chinese"))
    return "🥡";


  return "🍽️";

}

export default function Categories() {


  const router = useRouter();


  const {
    isMobile,
    isTablet,
    isDesktop
  } = useResponsive();



  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);



  async function fetchCategories(){


    try{


      const { data, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        active,
        category_images(image_url),
        category_items(id)`
      )
      .order("id");

      console.log("Categories fetched:", data);
      console.log("Error fetching categories:", error);

      if(error)
        throw error;


      setCategories(data || []);


    }
    catch(error){

      console.log(error.message);

    }
    finally{

      setLoading(false);

    }


  }



  useEffect(()=>{

    fetchCategories();

  },[]);




  function openCategory(id){

    router.push(
      `/admin/category?id=${id}`
    );

  }




  function cardWidth(){

    if(isDesktop)
      return "31%";


    return "48%";

  }





  return (

    <AuthGuard>

      <AdminLayout>


        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >


          <Text style={styles.title}>
            Categories
          </Text>



          {
            loading ?

            <Text style={styles.loading}>
              Loading...
            </Text>

            :


            <View style={styles.grid}>


              {
                categories.map((category)=>(


                  <TouchableOpacity

                    key={category.id}

                    style={[
                      styles.card,
                      {
                        width:cardWidth()
                      }
                    ]}


                    onPress={()=>openCategory(category.id)}

                  >


                    {
                      category.category_images?.[0]?.image_url ?

                      <Image

                        source={{
                          uri:
                          category.category_images[0].image_url
                        }}

                        style={styles.image}

                      />

                      :

                      <Text style={styles.icon}>
                        {getCategoryIcon(category.name)}
                        </Text>

                    }



                    <Text style={styles.name}>
                      {category.name}
                    </Text>



                    <Text style={styles.items}>
                      {
                        category.category_items?.length || 0
                      }
                      {" "}items
                    </Text>



                    <Text
                      style={[
                        styles.status,
                        {
                          color:
                          category.active
                          ? "#00ff88"
                          : "#ff5555"
                        }
                      ]}
                    >

                      {
                        category.active
                        ? "🟢 Active"
                        : "🔴 Hidden"
                      }

                    </Text>


                  </TouchableOpacity>


                ))
              }




              <TouchableOpacity

                style={[
                  styles.card,
                  styles.addCard,
                  {
                    width:cardWidth()
                  }
                ]}

                onPress={()=>{

                  router.push(
                    "/admin/create-category"
                  );

                }}

              >
<Text style={styles.addIcon}>
                  +
                </Text>


                <Text style={styles.addText}>
                  Add Category
                </Text>


              </TouchableOpacity>



            </View>

          }



        </ScrollView>


      </AdminLayout>


    </AuthGuard>

  );

}





const styles = StyleSheet.create({


container:{

flex:1,

backgroundColor:"#030303",

padding:20,

},



title:{

fontSize:35,

fontWeight:"900",

color:"#f4b400",

marginBottom:30,

},



grid:{

flexDirection:"row",

flexWrap:"wrap",

gap:20,

},



card:{

backgroundColor:"#111",

minHeight:190,

borderRadius:18,

padding:15,

justifyContent:"center",

alignItems:"center",

},



image:{

width:"100%",

height:90,

borderRadius:12,

marginBottom:10,

},



icon:{

fontSize:45,

},



name:{

color:"white",

fontSize:20,

fontWeight:"900",

marginTop:10,

},



items:{

color:"#aaa",

marginTop:5,

},



status:{

marginTop:8,

fontWeight:"700",

},



addCard:{

borderWidth:2,

borderColor:"#f4b400",

},



addIcon:{

fontSize:50,

color:"#f4b400",

fontWeight:"900",

},



addText:{

color:"#f4b400",

fontSize:18,

fontWeight:"900",

},



loading:{

color:"white",

fontSize:18,

}


});