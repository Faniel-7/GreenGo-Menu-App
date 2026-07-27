import { 
  useEffect, 
  useState 
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";

import { useRouter } from "expo-router";

import AdminLayout from "./AdminLayout";
import AuthGuard from "./AuthGuard";

import { supabase } from "../../lib/supabase";


export default function OffersList({
  title,
  icon,
  type,
}) {


  const router = useRouter();


  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;



  const [offers,setOffers] = useState([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    loadOffers();

  },[]);





  async function loadOffers(){


    try{


      setLoading(true);



      const {data,error}=

      await supabase

      .from("offers")

      .select("*")

      .eq(
        "type",
        type
      )

      .order(
        "created_at",
        {
          ascending:false
        }
      );




      if(error)
        throw error;




      setOffers(
        data || []
      );



    }


    catch(error){


      console.log(error);



      Alert.alert(
        "Error",
        "Failed to load offers"
      );


    }


    finally{


      setLoading(false);


    }


  }


async function deleteOffer(id){


  Alert.alert(

    "Delete Offer",

    "Are you sure you want to delete this offer?",

    [

      {
        text:"Cancel",
        style:"cancel"
      },


      {

        text:"Delete",

        style:"destructive",


        onPress:async()=>{


          try{


            const {error}=

            await supabase

            .from("offers")

            .delete()

            .eq(
              "id",
              id
            );



            if(error)
              throw error;



            loadOffers();



          }

          catch(error){


            Alert.alert(
              "Error",
              error.message
            );


          }


        }


      }


    ]

  );


}






async function toggleActive(offer){


  try{


    const {error}=

    await supabase

    .from("offers")

    .update({

      active:
      !offer.active

    })

    .eq(
      "id",
      offer.id
    );




    if(error)
      throw error;



    loadOffers();



  }


  catch(error){


    Alert.alert(
      "Error",
      error.message
    );


  }


}







return (

<AuthGuard>

<AdminLayout>


<ScrollView

style={styles.container}

showsVerticalScrollIndicator={false}

>



<View style={styles.header}>


<View>


<Text style={styles.title}>

{icon} {title}

</Text>



<Text style={styles.subtitle}>

Manage your {title.toLowerCase()}

</Text>


</View>





<TouchableOpacity

style={styles.refreshButton}

onPress={loadOffers}

>


<Text style={styles.refreshText}>

Refresh

</Text>


</TouchableOpacity>



</View>





{
loading ?


<Text style={styles.loading}>

Loading...

</Text>




:


offers.length===0 ?



<View style={styles.emptyBox}>


<Text style={styles.emptyEmoji}>

📭

</Text>


<Text style={styles.emptyTitle}>

No {title}

</Text>


<Text style={styles.emptySubtitle}>

Create your first {title.toLowerCase()}

</Text>


</View>





:


<View

style={

[

styles.grid,

isDesktop && styles.desktopGrid

]

}

>

{

offers.map((offer)=>(


<View

key={offer.id}
style={[
  styles.offerCard,
  {
    width: width >= 768 ? "48%" : "100%"
  }
]}
>




{
offer.image_url &&


<Image

source={{
uri:offer.image_url
}}

style={[
 styles.offerImage,
 {
   height: width >= 768 ? 220 : 180
 }
]}

/>

}





<View style={styles.offerContent}>



<View style={styles.offerHeader}>


<Text style={styles.offerTitle}>

{
offer.title ||
"Untitled Offer"
}

</Text>





<View

style={[

styles.badge,

offer.active

?

styles.activeBadge

:

styles.hiddenBadge

]}

>


<Text style={styles.badgeText}>

{

offer.active

?

"ACTIVE"

:

"HIDDEN"

}


</Text>



</View>



</View>







<Text style={styles.typeText}>

{

offer.type

.replace("_"," ")

.toUpperCase()

}


</Text>







<Text style={styles.description}>


{

offer.description_en ||

"No description"

}



</Text>






{

offer.discount_percentage &&


<Text style={styles.discount}>


🔥 {offer.discount_percentage}% OFF


</Text>


}







{

offer.start_date &&


<Text style={styles.info}>


📅 {offer.start_date}


{offer.end_date ? ` - ${offer.end_date}` : ""}



</Text>


}






{

offer.start_time &&


<Text style={styles.info}>


⏰ {offer.start_time}


{

offer.end_time

?

 ` - ${offer.end_time}`

:

""

}



</Text>


}






<View style={styles.actions}>


<TouchableOpacity

style={styles.editButton}

onPress={()=>


router.push(

`/admin/offers/${offer.id}`

)

}

>


<Text style={styles.buttonText}>
✏️ Edit
</Text>


</TouchableOpacity>






<TouchableOpacity

style={styles.hideButton}

onPress={()=>toggleActive(offer)}

>


<Text style={styles.buttonText}>
👁️ {offer.active ? "Hide" : "Show"}
</Text>


</TouchableOpacity>







<TouchableOpacity

style={styles.deleteButton}

onPress={()=>deleteOffer(offer.id)}

>


<Text style={styles.buttonText}>

🗑️ Delete

</Text>


</TouchableOpacity>




</View>




</View>





</View>



))

}



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


  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:25,
  },


  title:{
    color:"#f4b400",
    fontSize:34,
    fontWeight:"900",
  },


  subtitle:{
    color:"#999",
    marginTop:6,
    fontSize:15,
  },


  refreshButton:{
    backgroundColor:"#f4b400",
    paddingHorizontal:18,
    paddingVertical:10,
    borderRadius:12,
  },


  refreshText:{
    color:"#000",
    fontWeight:"900",
  },


  loading:{
    color:"#fff",
    fontSize:18,
    textAlign:"center",
    marginTop:50,
  },


  emptyBox:{
    backgroundColor:"#111",
    borderRadius:20,
    padding:40,
    alignItems:"center",
    marginTop:30,
  },


  emptyEmoji:{
    fontSize:50,
  },


  emptyTitle:{
    color:"#fff",
    fontSize:22,
    fontWeight:"900",
    marginTop:15,
  },


  emptySubtitle:{
    color:"#999",
    marginTop:8,
    textAlign:"center",
  },


  grid:{
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"space-between",
  },


  desktopGrid:{
    gap:20,
  },


  offerCard:{
    backgroundColor:"#111",

    borderRadius:22,

    overflow:"hidden",

    marginBottom:20,

    borderWidth:1,

    borderColor:"#222",

    shadowColor:"#000",

    shadowOpacity:0.4,

    shadowRadius:10,

    elevation:5,
  },


  offerImage:{
    width:"100%",

    resizeMode:"cover",
  },


  offerContent:{
    padding:18,
  },


  offerHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },


  offerTitle:{
    color:"#fff",

    fontSize:20,

    fontWeight:"900",

    flex:1,

    marginRight:10,
  },


  badge:{
    paddingHorizontal:12,

    paddingVertical:6,

    borderRadius:20,
  },


  activeBadge:{
    backgroundColor:"#1ecb00",
  },


  hiddenBadge:{
    backgroundColor:"#555",
  },


  badgeText:{
    color:"#000",

    fontSize:11,

    fontWeight:"900",
  },


  typeText:{
    color:"#f4b400",

    fontSize:14,

    fontWeight:"900",

    marginTop:12,

    textTransform:"uppercase",
  },


  description:{
    color:"#bbb",

    marginTop:12,

    lineHeight:22,

    fontSize:15,
  },


  discount:{
    color:"#1ecb00",

    fontSize:20,

    fontWeight:"900",

    marginTop:15,
  },


  info:{
    color:"#aaa",

    marginTop:10,

    fontSize:14,
  },


  actions:{
    flexDirection:"row",

    marginTop:22,

    gap:10,
  },


  editButton:{
  flex:1,
  backgroundColor:"#1a1a1a",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  justifyContent:"center",
  borderWidth:1,
  borderColor:"#f4b400",
},

hideButton:{
  flex:1,
  backgroundColor:"#1a1a1a",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  justifyContent:"center",
  borderWidth:1,
  borderColor:"#444",
},

deleteButton:{
  flex:1,
  backgroundColor:"#1a1a1a",
  padding:12,
  borderRadius:12,
  alignItems:"center",
  justifyContent:"center",
  borderWidth:1,
  borderColor:"#8b3a3a",
},


  editText:{
  color:"#f4b400",
  fontWeight:"900",
  fontSize:13,
},

hideText:{
  color:"#ddd",
  fontWeight:"900",
  fontSize:13,
},

deleteText:{
  color:"#ff6b6b",
  fontWeight:"900",
  fontSize:13,
},

buttonText:{
  color:"#fff",
  fontWeight:"900",
  fontSize:13,
},

});