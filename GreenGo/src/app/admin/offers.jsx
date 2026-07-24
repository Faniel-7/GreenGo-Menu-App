import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Switch,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useRouter } from "expo-router";

import AdminLayout from "../../components/admin/AdminLayout";
import AuthGuard from "../../components/admin/AuthGuard";

import { supabase } from "../../lib/supabase";

export default function CreateOffer() {

  const router = useRouter();

  // OFFER TYPE

  const [offerType, setOfferType] =
    useState("happy_hour");



  const [title, setTitle] = useState("");

  const [images, setImages] = useState([]);

  const [descriptionEn, setDescriptionEn] =
    useState("");

  const [descriptionLocal, setDescriptionLocal] =
    useState("");

    const [showGroupModal,setShowGroupModal] = useState(false);

    const [newGroupName,setNewGroupName] = useState("");



  const [discountPercentage,
    setDiscountPercentage] = useState("");

  // PROMOTION DETAILS

  const [promotionDetails,
    setPromotionDetails] = useState("");

  // DATE

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // TIME

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  // ACTIVE

  const [active, setActive] =
    useState(true);

  // TARGET GROUPS

  const [targetGroups,
    setTargetGroups] = useState([]);

  const [selectedGroups,
    setSelectedGroups] = useState([]);

  // MENU ITEMS

  const [menuItems,
    setMenuItems] = useState([]);

  const [selectedItems,
    setSelectedItems] = useState([]);

  // CATEGORY COLLAPSE

  const [expandedCategories,
    setExpandedCategories] = useState({});

  useEffect(() => {

    fetchTargetGroups();

    fetchMenuItems();

  }, []);
async function fetchTargetGroups(){

  const { data, error } =
    await supabase
      .from("target_groups")
      .select("*");

    console.log("Target groups fetched:", data);
    console.log("Error fetching target groups:", error);

  if(error){

    console.log(error);

    return;

  }

  setTargetGroups(data || []);

}
async function fetchMenuItems(){

  const { data, error } =
    await supabase
      .from("category_items")
      .select( `
        id,
        name,
        price,
        category_id,
        categories(name)`
      )
      .eq("active", true);

  if(error){

    console.log(error);

    return;

  }

  setMenuItems(data);

}
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
function toggleCategory(name){

  setExpandedCategories({

    ...expandedCategories,

    [name]:
      !expandedCategories[name]

  });

}
function toggleGroup(id){

  if(selectedGroups.includes(id)){

    setSelectedGroups(

      selectedGroups.filter(
        item => item !== id
      )

    );

  }else{

    setSelectedGroups([
      ...selectedGroups,
      id
    ]);

  }

}
function toggleItem(id){

  if(selectedItems.includes(id)){

    setSelectedItems(

      selectedItems.filter(
        item => item !== id
      )

    );

  }else{

    setSelectedItems([
      ...selectedItems,
      id
    ]);

  }

}

async function uploadImage(uri){

  const response = await fetch(uri);

  const arrayBuffer =
    await response.arrayBuffer();


  const fileName =
    `offer-${Date.now()}.jpg`;


  const {error} =
    await supabase.storage
    .from("menu-images")
    .upload(
      `offers/${fileName}`,
      arrayBuffer,
      {
        contentType:"image/jpeg"
      }
    );


  if(error)
    throw error;


  const {data} =
    supabase.storage
    .from("menu-images")
    .getPublicUrl(
      `offers/${fileName}`
    );


  return data.publicUrl;

}
async function createOffer(){

if(!title.trim()){

Alert.alert(
"Error",
"Offer title required"
);

async function addTargetGroup(){

if(!newGroupName.trim()){

Alert.alert(
"Error",
"Enter target group name"
);

return;

}


const {data,error}=

await supabase
.from("target_groups")
.insert({
name:newGroupName
})
.select()
.single();


if(error){

Alert.alert(
"Error",
error.message
);

return;

}


setTargetGroups([
...targetGroups,
data
]);


setNewGroupName("");

setShowGroupModal(false);

}

return;

}


try{


let imageUrl = null;



if(images.length > 0){

imageUrl =
await uploadImage(images[0]);

}




const {data:offer,error:offerError}=

await supabase

.from("offers")

.insert({

title:title,

type:offerType,

image_url:imageUrl,

description_en:descriptionEn,

description_am:descriptionAm,

description_ti:descriptionTi,

discount_percentage:
discountPercentage
?
Number(discountPercentage)
:
null,

start_date:startDate,

end_date:endDate,

start_time:
offerType==="happy_hour"
?
startTime
:
null,

end_time:
offerType==="happy_hour"
?
endTime
:
null,

active:active

})

.select()

.single();



if(offerError)
throw offerError;





if(selectedItems.length){


const itemsInsert =

selectedItems.map(item=>({

offer_id:offer.id,

item_id:item

}));



const {error:itemError}=

await supabase

.from("offer_items")

.insert(itemsInsert);



if(itemError)
throw itemError;


}






if(selectedGroups.length){


const groupsInsert =

selectedGroups.map(group=>({

offer_id:offer.id,

target_group_id:group

}));



const {error:groupError}=

await supabase

.from("offer_target_groups")

.insert(groupsInsert);



if(groupError)
throw groupError;


}





Alert.alert(
"Success",
"Offer created"
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

return (
<AuthGuard>
<AdminLayout>

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
>

<Text style={styles.title}>
Create Offer
</Text>

<Text style={styles.section}>
Offer Type
</Text>

<View style={styles.typeRow}>

<TouchableOpacity
style={[
styles.typeCard,
offerType==="happy_hour"&&styles.selectedCard
]}
onPress={()=>setOfferType("happy_hour")}
>

<Text style={styles.typeEmoji}>🔥</Text>

<Text style={styles.typeTitle}>
Happy Hour
</Text>

<Text style={styles.typeSubtitle}>
Time Based
</Text>

</TouchableOpacity>

<TouchableOpacity
style={[
styles.typeCard,
offerType==="discount"&&styles.selectedCard
]}
onPress={()=>setOfferType("discount")}
>

<Text style={styles.typeEmoji}>🏷️</Text>

<Text style={styles.typeTitle}>
Discount
</Text>

<Text style={styles.typeSubtitle}>
Price Reduction
</Text>

</TouchableOpacity>

<TouchableOpacity
style={[
styles.typeCard,
offerType==="promotion"&&styles.selectedCard
]}
onPress={()=>setOfferType("promotion")}
>

<Text style={styles.typeEmoji}>🎉</Text>

<Text style={styles.typeTitle}>
Promotion
</Text>

<Text style={styles.typeSubtitle}>
Special Campaign
</Text>

</TouchableOpacity>

</View>

<TextInput
style={styles.input}
placeholder="Offer Title"
placeholderTextColor="#777"
value={title}
onChangeText={setTitle}
/>

<Text style={styles.section}>
Offer Image
</Text>

<View style={styles.imageRow}>

{images.map((img,index)=>(
<Image
key={index}
source={{uri:img}}
style={styles.image}
/>
))}

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
Descriptions
</Text>

<TextInput
style={styles.itemInput}
placeholder="English"
placeholderTextColor="#777"
value={descriptionEn}
onChangeText={setDescriptionEn}
multiline
/>

<TextInput
style={styles.itemInput}
placeholder="Tigrigna/Amharic"
placeholderTextColor="#848484"
value={descriptionLocal}
onChangeText={setDescriptionLocal}
multiline
/>

<Text style={styles.section}>
Target Groups
</Text>

<View style={styles.groupContainer}>

{targetGroups.map(group=>(

<TouchableOpacity
key={group.id}
style={[
styles.groupChip,
selectedGroups.includes(group.id)
&& styles.selectedChip
]}
onPress={()=>toggleGroup(group.id)}
>

<Text
style={[
styles.groupText,
selectedGroups.includes(group.id)
&& styles.selectedGroupText
]}
>

{group.name}

</Text>

</TouchableOpacity>

))}


<TouchableOpacity
onPress={()=>setShowGroupModal(true)}
>

<Text style={styles.addGroupText}>
+ Add Target Group
</Text>

</TouchableOpacity>


</View>

<Text style={styles.section}>
Menu Items
</Text>

<View style={styles.categoryGrid}>

{[
"Pizza",
"Burger and Sandwich",
"Hot Drinks",
"Breakfast",
"Salad and Soup",
"Juice and Shakes",
"Rice, Pasta and Wrap",
"Chinese"
].map(category=>(

<View
key={category}
style={styles.categoryCard}
>

<TouchableOpacity
style={styles.categoryHeader}
onPress={()=>toggleCategory(category)}
>

<Text style={styles.categoryName}>
{category}
</Text>

<Text style={styles.arrow}>
{expandedCategories[category] ? "▼" : "▲"}
</Text>

</TouchableOpacity>

{expandedCategories[category]&&(

<View>

{menuItems
.filter(
item=>
item.categories?.name===category
)
.map(item=>(

<TouchableOpacity
key={item.id}
style={styles.checkboxRow}
onPress={()=>toggleItem(item.id)}
>

<Text style={styles.checkbox}>
{selectedItems.includes(item.id) ? "☑" : "☐"}
</Text>

<Text style={styles.checkboxText}>
{item.name}
</Text>

</TouchableOpacity>

))}

</View>

)}

</View>

))}

</View>

{offerType==="happy_hour"&&(

<>

<Text style={styles.section}>
Happy Hour
</Text>

<TextInput
style={styles.input}
placeholder="Discount %"
placeholderTextColor="#777"
keyboardType="numeric"
value={discountPercentage}
onChangeText={setDiscountPercentage}
/>

<TextInput
style={styles.input}
placeholder="Start Time (4:00 PM)"
placeholderTextColor="#777"
value={startTime}
onChangeText={setStartTime}
/>
<TextInput
style={styles.input}
placeholder="End Time (6:00 PM)"
placeholderTextColor="#777"
value={endTime}
onChangeText={setEndTime}
/>

</>

)}

{offerType==="discount"&&(

<TextInput
style={styles.input}
placeholder="Discount %"
placeholderTextColor="#777"
keyboardType="numeric"
value={discountPercentage}
onChangeText={setDiscountPercentage}
/>

)}

{offerType==="promotion"&&(

<TextInput
style={styles.itemInput}
placeholder="Promotion Details"
placeholderTextColor="#777"
value={promotionDetails}
onChangeText={setPromotionDetails}
multiline
/>

)}

<Text style={styles.section}>
Offer Duration
</Text>

<TextInput
style={styles.input}
placeholder="Start Date"
placeholderTextColor="#777"
value={startDate}
onChangeText={setStartDate}
/>

<TextInput
style={styles.input}
placeholder="End Date"
placeholderTextColor="#777"
value={endDate}
onChangeText={setEndDate}
/>

<View style={styles.switchRow}>

<Text style={styles.white}>
Active
</Text>

<Switch
value={active}
onValueChange={setActive}
/>

</View>

<TouchableOpacity
style={styles.createButton}
>

<Text style={styles.createText}>
CREATE OFFER
</Text>

</TouchableOpacity>
{showGroupModal && (

<View style={styles.modalOverlay}>


<View style={styles.modalBox}>


<Text style={styles.modalTitle}>
Add Target Group
</Text>


<TextInput

style={styles.input}

placeholder="Group name"

placeholderTextColor="#777"

value={newGroupName}

onChangeText={setNewGroupName}

/>


<View style={styles.modalButtons}>


<TouchableOpacity

style={styles.cancelButton}

onPress={()=>setShowGroupModal(false)}

>

<Text style={styles.cancelText}>
Cancel
</Text>

</TouchableOpacity>



<TouchableOpacity

style={styles.saveButton}

onPress={addTargetGroup}

>

<Text style={styles.saveText}>
Save
</Text>

</TouchableOpacity>


</View>


</View>


</View>

)}

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
borderRadius:12,
marginBottom:15
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

itemInput:{
backgroundColor:"#111",
color:"white",
padding:15,
borderRadius:12,
marginBottom:15,
minHeight:90,
textAlignVertical:"top"
},

typeRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
},

typeCard:{
flex:1,
backgroundColor:"#111",
padding:15,
borderRadius:15,
marginHorizontal:5,
alignItems:"center",
borderWidth:2,
borderColor:"#111"
},

selectedCard:{
borderColor:"#f4b400"
},

typeEmoji:{
fontSize:30,
marginBottom:8
},

typeTitle:{
color:"white",
fontWeight:"900",
fontSize:16
},

typeSubtitle:{
color:"#999",
fontSize:12,
marginTop:5
},

groupContainer:{
flexDirection:"row",
flexWrap:"wrap",
gap:10
},

groupChip:{
backgroundColor:"#111",
paddingVertical:10,
paddingHorizontal:18,
borderRadius:30,
borderWidth:1,
borderColor:"#333"
},

selectedChip:{
backgroundColor:"#f4b400",
borderColor:"#f4b400"
},

groupText:{
color:"white",
fontWeight:"700"
},

selectedGroupText:{
color:"#000"
},

categoryGrid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

categoryCard:{
width:"48%",
backgroundColor:"#111",
borderRadius:15,
marginBottom:15,
overflow:"hidden"
},

categoryHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
padding:15
},

categoryName:{
color:"white",
fontWeight:"900",
fontSize:15,
flex:1
},

arrow:{
color:"#f4b400",
fontSize:18,
fontWeight:"900"
},

checkboxRow:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:15,
paddingVertical:10,
borderTopWidth:1,
borderTopColor:"#1d1d1d"
},

checkbox:{
fontSize:18,
marginRight:10,
color:"#f4b400"
},

checkboxText:{
color:"white",
flex:1
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
marginBottom:40,
marginTop:20
},

createText:{
fontWeight:"900",
color:"#000",
fontSize:17
},

addGroupButton:{
backgroundColor:"#111",
borderWidth:1,
borderColor:"#f4b400",
paddingVertical:10,
paddingHorizontal:18,
borderRadius:30
},

addGroupText:{
color:"#f4b400",
fontWeight:"900"
},

});