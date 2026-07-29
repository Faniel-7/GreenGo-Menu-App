import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";


export default function CreateCategory(){


const router = useRouter();


const [name,setName] = useState("");

const [images,setImages] = useState([]);

const [active,setActive] = useState(true);


const [items,setItems] = useState([
{
name:"",
price:""
}
]);





async function pickImage(){


const result =
await ImagePicker.launchImageLibraryAsync({

mediaTypes:
ImagePicker.MediaTypeOptions.Images,

allowsEditing:true,

aspect:[4,3],

quality:0.8

});



if(!result.canceled){

setImages([
...images,
result.assets[0].uri
]);

}


}






function addItem(){


setItems([
...items,
{
name:"",
price:""
}
]);


}






function updateItem(index,key,value){


const updated=[...items];

updated[index][key]=value;

setItems(updated);


}







async function uploadImage(uri){


const response =
await fetch(uri);


const arrayBuffer =
await response.arrayBuffer();


const fileName =
`category-${Date.now()}.jpg`;



const {error}=

await supabase
.storage
.from("menu-images")
.upload(

`categories/${fileName}`,

arrayBuffer,

{
contentType:"image/jpeg"
}

);



if(error)
throw error;



const {data}=

supabase
.storage
.from("menu-images")
.getPublicUrl(
`categories/${fileName}`
);



return data.publicUrl;


}









async function createCategory(){



if(!name.trim()){

Alert.alert(
"Error",
"Category name required"
);

return;

}




if(images.length===0){

Alert.alert(
"Error",
"Upload at least one image"
);

return;

}




try{



// 1. Create category


const {data:category,error:categoryError}

=
await supabase
.from("categories")
.insert({

name:name,

active:active

})

.select()
.single();



if(categoryError)
throw categoryError;







// 2. Upload images


for(const image of images){


const url =
await uploadImage(image);



await supabase
.from("category_images")
.insert({

category_id:
category.id,

image_url:url

});


}








// 3. Insert items


const validItems =
items.filter(
(item)=>
item.name.trim() &&
item.price
);



if(validItems.length){


const insertItems =
validItems.map(item=>({

category_id:
category.id,

name:item.name,

price:Number(item.price),

active:true


}));



const {error:itemError}

=
await supabase
.from("category_items")
.insert(insertItems);



if(itemError)
throw itemError;


}







Alert.alert(
"Success",
"Category created"
);



router.back();



}

catch(error){


console.log(error);


Alert.alert(
"Error",
error.message
);


}



}









return(

<AuthGuard>

<AdminLayout>


<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
>

<TouchableOpacity
style={styles.backButton}
onPress={()=>router.back()}
>

<Ionicons
name="arrow-back"
size={28}
color="#f4b400"
/>

<Text style={styles.backText}>
Back
</Text>

</TouchableOpacity>


<Text style={styles.title}>
Create Category
</Text>





<TextInput

style={styles.input}

placeholder="Category Name"

placeholderTextColor="#777"

value={name}

onChangeText={setName}

/>







<Text style={styles.section}>
Menu Images
</Text>



<View style={styles.imageRow}>


{
images.map((img,index)=>(


<Image

key={index}

source={{
uri:img
}}

style={styles.image}

/>


))
}





<TouchableOpacity

style={styles.uploadBox}

onPress={pickImage}

>

<Text style={styles.plus}>
+
</Text>

<Text style={styles.uploadText}>
Add Image
</Text>


</TouchableOpacity>


</View>







<Text style={styles.section}>
Items
</Text>





{
items.map((item,index)=>(


<View
key={index}
style={styles.itemBox}
>



<TextInput

style={styles.itemInput}

placeholder="Food / Drink name"

placeholderTextColor="#777"

value={item.name}

onChangeText={(v)=>
updateItem(
index,
"name",
v
)
}

/>




<TextInput

style={styles.itemInput}

placeholder="Price"

placeholderTextColor="#777"

keyboardType="numeric"

value={item.price}

onChangeText={(v)=>
updateItem(
index,
"price",
v
)
}

/>



</View>


))
}
<TouchableOpacity

style={styles.addButton}

onPress={addItem}

>

<Text style={styles.addText}>
+ Add Another Item
</Text>


</TouchableOpacity>









<View style={styles.switchRow}>


<Text style={styles.white}>
Show Category
</Text>


<Switch

value={active}

onValueChange={setActive}

/>


</View>









<TouchableOpacity

style={styles.createButton}

onPress={createCategory}

>

<Text style={styles.createText}>
CREATE CATEGORY
</Text>


</TouchableOpacity>





</ScrollView>


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

fontSize:34,

fontWeight:"900",

marginBottom:25

},



section:{

color:"white",

fontSize:22,

fontWeight:"900",

marginVertical:20

},



input:{

backgroundColor:"#111",

color:"white",

padding:15,

borderRadius:12

},




imageRow:{

flexDirection:"row",

flexWrap:"wrap",

gap:15

},



image:{

width:120,

height:100,

borderRadius:15

},



uploadBox:{

width:120,

height:100,

borderRadius:15,

backgroundColor:"#111",

justifyContent:"center",

alignItems:"center"

},



plus:{

color:"#f4b400",

fontSize:40,

fontWeight:"900"

},



uploadText:{

color:"#aaa"

},




itemBox:{

backgroundColor:"#111",

padding:15,

borderRadius:15,

marginBottom:15

},



itemInput:{

backgroundColor:"#222",

color:"white",

padding:12,

borderRadius:10,

marginBottom:10

},




addButton:{

padding:15,

borderWidth:1,

borderColor:"#f4b400",

borderRadius:12,

alignItems:"center"

},



addText:{

color:"#f4b400",

fontWeight:"900"

},



switchRow:{

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center",

marginVertical:25

},



white:{

color:"white",

fontSize:18

},



createButton:{

backgroundColor:"#f4b400",

padding:18,

borderRadius:15,

alignItems:"center",

marginBottom:40

},



createText:{

fontWeight:"900",

color:"#000"

},

backButton:{
flexDirection:"row",
alignItems:"center",
marginBottom:20
},

backText:{
color:"#f4b400",
fontSize:18,
fontWeight:"900",
marginLeft:10
},

});