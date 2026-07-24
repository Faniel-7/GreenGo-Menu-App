import { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import {
  useLocalSearchParams,
} from "expo-router";


import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";

import { supabase } from "../../lib/supabase";





export default function Category(){


const { id } = useLocalSearchParams();



const [category,setCategory] = useState(null);

const [images,setImages] = useState([]);

const [items,setItems] = useState([]);


const [loading,setLoading] = useState(true);



const [modalVisible,setModalVisible] = useState(false);


const [editingItem,setEditingItem] = useState(null);



const [itemName,setItemName] = useState("");

const [itemPrice,setItemPrice] = useState("");









async function loadData(){


try{


const {data:cat,error:catError}=

await supabase
.from("categories")
.select("*")
.eq("id",id)
.single();



if(catError)
throw catError;



setCategory(cat);






const {data:imageData,error:imageError}=

await supabase
.from("category_images")
.select("*")
.eq("category_id",id);



if(imageError)
throw imageError;



setImages(imageData || []);







const {data:itemData,error:itemError}=

await supabase
.from("category_items")
.select("*")
.eq("category_id",id)
.order("id");



if(itemError)
throw itemError;



setItems(itemData || []);





}

catch(error){

console.log(error.message);

}

finally{

setLoading(false);

}


}







useEffect(()=>{

loadData();

},[]);









function openAddModal(){


setEditingItem(null);

setItemName("");

setItemPrice("");

setModalVisible(true);


}









function openEditModal(item){


setEditingItem(item);

setItemName(item.name);

setItemPrice(
String(item.price)
);


setModalVisible(true);


}









async function saveItem(){



if(!itemName.trim() || !itemPrice){

Alert.alert(
"Error",
"Enter name and price"
);

return;

}




try{


if(editingItem){


// UPDATE


const {error}=

await supabase
.from("category_items")
.update({

name:itemName,

price:Number(itemPrice)

})

.eq(
"id",
editingItem.id
);



if(error)
throw error;



}



else{


// INSERT


const {error}=

await supabase
.from("category_items")
.insert({

category_id:id,

name:itemName,

price:Number(itemPrice),

active:true

});



if(error)
throw error;



}





setModalVisible(false);

loadData();



}


catch(error){

Alert.alert(
"Error",
error.message
);


}



}









async function toggleActive(item){



const {error}=

await supabase
.from("category_items")
.update({

active:
!item.active

})
.eq(
"id",
item.id
);



if(error){

Alert.alert(
"Error",
error.message
);

return;

}



loadData();



}









async function deleteItem(item){



Alert.alert(

"Delete Item",

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
.from("category_items")
.delete()
.eq(
"id",
item.id
);



if(error){

Alert.alert(
"Error",
error.message
);

return;

}



loadData();


}

}

]

);



}









return(

<AuthGuard>

<AdminLayout>


<ScrollView

style={styles.container}

showsVerticalScrollIndicator={false}

>



{
loading ?

<Text style={styles.white}>
Loading...
</Text>


:


<>


<Text style={styles.title}>
{category?.name}
</Text>







<View style={styles.imageRow}>


{
images.map((img)=>(


<Image

key={img.id}

source={{
uri:img.image_url
}}

style={styles.image}

/>


))

}


</View>







<Text style={styles.section}>
Items
</Text>








{
items.map((item)=>(


<View

key={item.id}

style={styles.itemCard}

>



<View>


<Text style={styles.itemName}>
{item.name}
</Text>


<Text style={styles.price}>
{item.price} ETB
</Text>



<Text

style={{

color:item.active
?"#00ff88"
:"#ff5555"

}}

>

{
item.active
?"🟢 Active"
:"🔴 Hidden"
}


</Text>


</View>







<View style={styles.buttons}>


<TouchableOpacity

style={styles.edit}

onPress={()=>
openEditModal(item)
}

>

<Text>
Edit
</Text>

</TouchableOpacity>
<TouchableOpacity

style={styles.hide}

onPress={()=>
toggleActive(item)
}

>

<Text>
{
item.active
?"Hide"
:"Show"
}
</Text>

</TouchableOpacity>







<TouchableOpacity

style={styles.delete}

onPress={()=>
deleteItem(item)
}

>

<Text>
Delete
</Text>

</TouchableOpacity>



</View>





</View>


))

}







<TouchableOpacity

style={styles.add}

onPress={openAddModal}

>

<Text style={styles.addText}>
+ Add Item
</Text>

</TouchableOpacity>




</>


}



</ScrollView>







<Modal

visible={modalVisible}

transparent

animationType="slide"

>


<View style={styles.modalBackground}>


<View style={styles.modal}>


<Text style={styles.modalTitle}>

{
editingItem
?"Edit Item"
:"Add Item"
}

</Text>





<TextInput

style={styles.input}

placeholder="Food name"

placeholderTextColor="#777"

value={itemName}

onChangeText={setItemName}

/>






<TextInput

style={styles.input}

placeholder="Price"

placeholderTextColor="#777"

keyboardType="numeric"

value={itemPrice}

onChangeText={setItemPrice}

/>






<TouchableOpacity

style={styles.save}

onPress={saveItem}

>

<Text style={styles.saveText}>
Save
</Text>


</TouchableOpacity>





<TouchableOpacity

onPress={()=>
setModalVisible(false)
}

>

<Text style={styles.cancel}>
Cancel
</Text>


</TouchableOpacity>




</View>


</View>


</Modal>





</AdminLayout>

</AuthGuard>


);


}








const styles=StyleSheet.create({


container:{

flex:1,

backgroundColor:"#030303",

padding:20

},



title:{

color:"#f4b400",

fontSize:35,

fontWeight:"900"

},



section:{

color:"white",

fontSize:25,

fontWeight:"900",

marginVertical:20

},



white:{

color:"white"

},




imageRow:{

flexDirection:"row",

gap:15,

flexWrap:"wrap",

marginTop:20

},




image:{

width:130,

height:100,

borderRadius:15

},




itemCard:{

backgroundColor:"#111",

padding:20,

borderRadius:15,

marginBottom:15,

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center"

},




itemName:{

color:"white",

fontSize:20,

fontWeight:"900"

},




price:{

color:"#f4b400",

marginTop:5

},




buttons:{

flexDirection:"row",

gap:8

},



edit:{

backgroundColor:"#f4b400",

padding:8,

borderRadius:8

},



hide:{

backgroundColor:"#555",

padding:8,

borderRadius:8

},



delete:{

backgroundColor:"#aa0000",

padding:8,

borderRadius:8

},




add:{

backgroundColor:"#f4b400",

padding:18,

borderRadius:15,

alignItems:"center",

marginTop:20

},



addText:{

fontWeight:"900"

},





modalBackground:{

flex:1,

backgroundColor:"rgba(0,0,0,0.7)",

justifyContent:"center",

padding:20

},




modal:{

backgroundColor:"#111",

padding:25,

borderRadius:20

},




modalTitle:{

color:"#f4b400",

fontSize:25,

fontWeight:"900",

marginBottom:20

},




input:{

backgroundColor:"#222",

color:"white",

padding:15,

borderRadius:12,

marginBottom:15

},




save:{

backgroundColor:"#f4b400",

padding:15,

borderRadius:12,

alignItems:"center"

},



saveText:{

fontWeight:"900"

},



cancel:{

color:"white",

textAlign:"center",

marginTop:15

}


});