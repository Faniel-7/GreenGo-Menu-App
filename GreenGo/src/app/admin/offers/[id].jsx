import { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { formatLocalTime } from "../../../utils/timeFormattter";

import AdminLayout from "../../../components/admin/AdminLayout";
import AuthGuard from "../../../components/admin/AuthGuard";
import AdminToast from "../../../components/admin/AdminToast";
import { formatOfferDate } from "../../../utils/dateFormatter";
import { supabase } from "../../../lib/supabase";


export default function OfferDetails(){

  const { id } = useLocalSearchParams();

  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;

  const [offer,setOffer] = useState(null);

  const [loading,setLoading] = useState(true);
  const [toast,setToast] = useState("");

  const [offerGroups, setOfferGroups] = useState([]);
  const [offerItems, setOfferItems] = useState([]);
  const [showDescription, setShowDescription] = useState(false);


  useEffect(()=>{

    loadOffer();

  },[]);



  async function loadOffer(){

    try{


      const {data,error} = await supabase

      .from("offers")

      .select("*")

      .eq("id",id)

      .single();



      if(error)
        throw error;


      setOffer(data);
      
  
      const client = supabase;

const { data: groups } = await supabase
  .from("offer_target_groups")
  .select("target_group_id")
  .eq("offer_id", id);

if (groups) {

  const ids = groups.map(g => g.target_group_id);

  const { data: names } = await supabase
    .from("target_groups")
    .select("id,name")
    .in("id", ids);

  setOfferGroups(names || []);

}

const { data: items } = await supabase
  .from("offer_menu_items")
  .select(
    menu_item_id,
    discount_percentage
  )
  .eq("offer_id", id);

if (items) {
  const ids = items.map(i => i.menu_item_id);

  const { data: names } = await supabase
    .from("category_items")
    .select("id,name")
    .in("id", ids);

  const merged = names.map(item => {
    const match = items.find(
      i => i.menu_item_id === item.id
    );

    return {
      ...item,
      discount_percentage: match?.discount_percentage ?? 0,
    };
  });

  setOfferItems(merged);
}


    }

    catch(error){

      console.log(error);

      Alert.alert(
        "Error",
        error.message
      );

    }

    finally{

      setLoading(false);

    }

  }
return (

    <AuthGuard>

      <AdminLayout>


        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >


        {
          loading ?

          <Text style={styles.loading}>
            Loading...
          </Text>


          :


          !offer ?

          <Text style={styles.loading}>
            Offer not found
          </Text>


          :


          <>


          <View style={styles.header}>

<TouchableOpacity
style={styles.backButton}
onPress={()=>router.back()}
>

<Ionicons
name="arrow-back"
size={24}
color="#f4b400"
/>

<Text style={styles.backText}>
Back
</Text>

</TouchableOpacity>


<View style={styles.typeContainer}>

<Text style={styles.typeText}>
{
offer.type === "happy_hour"
?
"🔥 HAPPY HOUR"
:
offer.type === "discount"
?
"🏷 DISCOUNT"
:
"🎉 PROMOTION"
}
</Text>

</View>


</View>


<Text style={styles.title}>
{offer.title}
</Text>
{
            offer.image_url && (

              <View style={styles.imageCard}>

{
offer.image_url ?

<Image
source={{
  uri: offer.image_url
}}
style={[
  styles.image,
  {
    height: isDesktop ? 300 : 220
  }
]}
/>

:

<Text style={styles.noImage}>
No Image
</Text>

}

</View>

            )
          }



          <View style={styles.infoCard}>

  <View style={styles.cardHeader}>

    <Ionicons
      name="document-text"
      size={22}
      color="#f4b400"
    />

    <Text style={styles.cardTitle}>
      Description
    </Text>

  </View>


  <Text style={styles.label}>
    English
  </Text>

  <View>

<Text
style={styles.text}
numberOfLines={
showDescription ? undefined : 3
}
>
{
offer.description_en ||
"No English description"
}
</Text>


{
offer.description_en?.length > 120 && (

<TouchableOpacity
onPress={()=>setShowDescription(!showDescription)}
>

<Text style={styles.seeMore}>

{
showDescription
?
"See less ▲"
:
"See more ▼"
}

</Text>

</TouchableOpacity>

)

}

</View>



  <Text style={styles.label}>
    Local Description
  </Text>

  <Text style={styles.text}>
    {offer.description_ti || "No Local description"}
  </Text>


</View>

{offer.promotion_details ? (

<View style={styles.infoCard}>

<Text style={styles.label}>
Promotion Details
</Text>

<Text style={styles.text}>
{offer.promotion_details}
</Text>

</View>

) : null}

<View style={styles.infoCard}>

<Text style={styles.label}>
Target Groups
</Text>

{!offerGroups?.length ? (

<Text style={styles.secondaryText}>
No target groups
</Text>

) : (

offerGroups.map(group => (

<View key={group.id} style={styles.tagCard}>

  <View style={styles.tagIcon}>
    <Text style={styles.tagEmoji}>👥</Text>
  </View>

  <Text style={styles.tagName}>
    {group.name}
  </Text>

</View>

))

)}

</View>

<View style={styles.infoCard}>

<Text style={styles.label}>
Selected Menu Items
</Text>

{offerItems.length === 0 ? (

<Text style={styles.secondaryText}>
No menu items
</Text>

) : (

offerItems.map(item => (

  <View
    key={item.id}
    style={styles.tagCard}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      }}
    >
      <View style={styles.tagIcon}>
        <Text style={styles.tagEmoji}>🍽</Text>
      </View>

      <Text style={styles.tagName}>
        {item.name}
      </Text>
    </View>

    <Text
      style={{
        color: "#f4b400",
        fontWeight: "900",
        fontSize: 15,
      }}
    >
      {item.discount_percentage}% OFF
    </Text>

  </View>

))

)}

</View>




         <View style={styles.infoCard}>

  {/* Discount */}

  <View style={styles.infoRow}>

    <Text style={styles.infoLabel}>
      Discount
    </Text>

    <Text
      style={[
        styles.discountHighlight,
        !offer.discount_percentage && styles.secondaryText
      ]}
    >
      {
        offer.discount_percentage
        ?
        `${offer.discount_percentage}% OFF`
        :
        "No discount"
      }
    </Text>

  </View>



  {/* Duration */}

  <View style={styles.infoRow}>

    <Text style={styles.infoLabel}>
      Duration
    </Text>

    <Text style={styles.infoValue}>
      {
        offer.start_date
        ?
        `${formatOfferDate(offer.start_date)} - ${formatOfferDate(offer.end_date)}`
        :
        "No dates"
      }
    </Text>

  </View>



  {/* Time */}

  {
    offer.start_time && (

      <View style={styles.infoRow}>

        <Text style={styles.infoLabel}>
          ⏰ Time
        </Text>

        <Text style={styles.infoValue}>
          {formatLocalTime(offer.start_time)}
          {" - "}
          {formatLocalTime(offer.end_time)}
        </Text>

      </View>

    )
  }


</View>



          <View style={styles.statusBox}>

<View style={styles.infoRow}>

<Text style={styles.infoLabel}>
Status
</Text>

<Text
style={[
styles.status,
{
color:
offer.active
?
"#1ecb00"
:
"#ff4444"
}
]}
>
{
offer.active
?
"🟢 ACTIVE"
:
"🔴 HIDDEN"
}
</Text>

</View>

</View>
<View style={styles.buttons}>


            <TouchableOpacity
              style={styles.editButton}
              onPress={()=>router.push(`/admin/offers/edit?id=${offer.id}`)}
            >

              <Text style={styles.buttonText}>
                Edit
              </Text>

            </TouchableOpacity>




            <TouchableOpacity

              style={styles.deleteButton}

              onPress={async()=>{


                Alert.alert(

                  "Delete Offer",

                  "Are you sure?",

                  [

                    {
                      text:"Cancel"
                    },


                    {

                      text:"Delete",

                      onPress:async()=>{


                        const {error}=

                        await supabase
.from("offer_items")
.delete()
.eq(
"offer_id",
offer.id
);


await supabase
.from("offer_target_groups")
.delete()
.eq(
"offer_id",
offer.id
);




if(error){

Alert.alert(
"Error",
error.message
);

return;

}


router.back();


                      }

                    }

                  ]

                );


              }}

            >

              <Text style={styles.buttonText}>
                Delete
              </Text>

            </TouchableOpacity>



          </View>



          </>


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

padding:20

},


loading:{

color:"white",

fontSize:20

},


backButton:{

marginBottom:20

},


backText:{

color:"#f4b400",

fontSize:18,

fontWeight:"900"

},


title:{

color:"#f4b400",

fontSize:34,

fontWeight:"900"

},


type:{

color:"#1ecb00",

fontWeight:"900",

fontSize:16,

marginVertical:15

},


imageCard:{
  width:"100%",
  backgroundColor:"#111",
  borderRadius:20,
  overflow:"hidden",
  marginTop:15,
  marginBottom:10,
},


image:{
  width:"100%",
  height:"100%",
  resizeMode:"contain",
  backgroundColor:"#111",
},

imageCard:{
width:"100%",
backgroundColor:"#111",
borderRadius:20,
overflow:"hidden",
marginTop:15,
marginBottom:15,
alignItems:"center",
justifyContent:"center",
},

infoCard: {
  backgroundColor: "#111",
  borderRadius: 18,
  padding: 20,
  marginTop: 18,
  borderWidth: 1,
  borderColor: "#222",
},


label:{

color:"#f4b400",
fontSize:15,
fontWeight:"800",
marginBottom:6,
textTransform:"uppercase",
letterSpacing:0.5,
},


text:{

color:"white",

fontSize:16,

lineHeight:24

},


statusBox:{

backgroundColor:"#111",

padding:20,

borderRadius:18,

marginTop:20

},


status:{

fontSize:18,

fontWeight:"900"

},


buttons:{

flexDirection:"row",

gap:15,

marginTop:25,

marginBottom:50

},


editButton: {
  flex: 1,
  backgroundColor: "#1a1a1a",
  borderWidth: 1,
  borderColor: "#f4b400",
  padding: 15,
  borderRadius: 12,
  alignItems: "center",
},


deleteButton: {
  flex: 1,
  backgroundColor: "#1a1a1a",
  borderWidth: 1,
  borderColor: "#ff4444",
  padding: 15,
  borderRadius: 12,
  alignItems: "center",
},

buttonText:{
color:"#fff",
fontWeight:"900"
},

headerSection: {
  marginBottom: 20,
},

typeContainer:{
  alignItems:"center",
  marginTop:10,
  marginBottom:15,
},


typeText:{
  color:"#fff",
  fontSize:28,
  fontWeight:"900",
  letterSpacing:0.5,
  fontFamily:"noto-sans-bold",
},

secondaryText: {
  color: "#aaa",
  fontSize: 15,
  fontWeight: "700",
},

cardTitle: {
  color : "#fff",
  fontSize: 18,
  fontWeight: "900",
},

chip:{
backgroundColor:"#1f1f1f",
borderRadius:25,
paddingVertical:10,
paddingHorizontal:15,
marginTop:10,
borderWidth:1,
borderColor:"#333",
},

chipText:{
color:"#fff",
fontWeight:"700",
},

tagCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#151515",
  borderRadius: 14,
  paddingVertical: 12,
  paddingHorizontal: 14,
  marginTop: 10,
  borderWidth: 1,
  borderColor: "#2d2d2d",
},

tagIcon: {
  width: 36,
  height: 36,
  borderRadius: 18,
 
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

tagEmoji: {
  fontSize: 18,
},

tagName: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
},

discountHighlight:{
  color:"#ff6b35",
  fontSize:22,
  fontWeight:"900",
  backgroundColor:"#2a160f",
  paddingHorizontal:12,
  paddingVertical:6,
  borderRadius:10,
  alignSelf:"flex-start",
},

infoRow:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  paddingVertical:12,
  borderBottomWidth:1,
  borderBottomColor:"#222",
},


infoLabel:{
  color:"#f4b400",
  fontSize:15,
  fontWeight:"900",
  textTransform:"uppercase",
  flex:0.35,
},

infoValue:{
  color:"#fff",
  fontSize:15,
  fontWeight:"700",
  flex:0.65,
  textAlign:"right",
  lineHeight:22,
},

seeMore:{
  color:"#f4b400",
  fontWeight:"900",
  marginTop:8,
  fontSize:15,
},

});
