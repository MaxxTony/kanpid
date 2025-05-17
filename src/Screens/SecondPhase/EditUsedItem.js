import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, createRef} from 'react';
import {Post, GetApi} from '../../Helpers/Service';
import ActionSheet from 'react-native-actions-sheet';
import DocumentPicker from 'react-native-document-picker';
import {Dropdown} from 'react-native-element-dropdown';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const actionSheetRefName = createRef();
const actionSheetRefPrice = createRef();
const actionSheetRefDescription = createRef();
const actionSheetRefCurrency = createRef();
import Toaster from '../../Component/Toaster';
import {Button, RadioButton} from 'react-native-paper';

const EditUsedItem = ({route}) => {
  const navigation = useNavigation();

  const product = route.params.productId;
  const [image, setImage] = useState('');

  const [list, setList] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const [listSubCategory, setListSubCategory] = useState([]);
  const [selCatName, setSelCatName] = useState('');
  const [selSubCatName, setSelSubCatName] = useState('');
  const [setMainCatId, selSetMainCatId] = useState('');
  const [subMainCatId, setSubMainCatId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(null);
  const [productId, setProductId] = useState('');

  ///////  New const
  const [arrayImage, setArrayImage] = useState('');
  const [arrayImageFieldName, setArrayImageFieldName] = useState('');
  const [selectBoxNewdata, setSelectBoxNewdata] = React.useState([]);
  const [radioBoxNewdata, setRadioBoxNewdata] = React.useState([]);
  const [checkBoxNewdata, setCheckBoxNewdata] = React.useState([]);
  const [textBoxNewdata, setTextBoxNewdata] = React.useState([]);
  const [fileBoxNewdata, setFileBoxNewdata] = React.useState([]);
  const [textareaBoxNewdata, setTextareaBoxNewdata] = React.useState([]);
  useEffect(() => {
    getEditItem();
  }, []);
  const getEditItem = async () => {
    GetApi(`used-item/edit-product/${product}`).then(
      async res => {
        if (res.status == 200) {
          setList(res.data.attribute_field);
          setListCategory(res.data.category_data);
          setListSubCategory(res.data.sub_category_data);
          setSelCatName(res.data.sel_cat_name.name);
          setSelSubCatName(res.data.sel_sub_cat_name.name);
          selSetMainCatId(res.data.sel_cat_name.id);
          setSubMainCatId(res.data.sel_sub_cat_name.id);
          getAttributeEdit(res.data.sel_sub_cat_name.id, product);
          setName(res.data.attribute_field.product_name);
          setPrice(res.data.attribute_field.product_price);
          setDescription(res.data.attribute_field.product_description);
          setCurrency(res.data.attribute_field.currency);
          setProductId(product);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const getAttributeEdit = async (id, product_id) => {
    try {
      const attribute = await fetch(
        `https://www.kanpid.com/api/used-item/get-category-attribute-data-edit/${id}/${product_id}`,
      );
      const filterAttribute = await attribute.json();
      setSelectBoxNewdata(filterAttribute.data.select);
      setRadioBoxNewdata(filterAttribute.data.radio);
      setCheckBoxNewdata(filterAttribute.data.checkbox);
      setTextBoxNewdata(filterAttribute.data.text);
      setFileBoxNewdata(filterAttribute.data.file);
      setTextareaBoxNewdata(filterAttribute.data.textarea);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getAttribute = async id => {
    try {
      const attribute = await fetch(
        `https://www.kanpid.com/api/used-item/get-category-attribute-data/${id}`,
      );
      const filterAttribute = await attribute.json();
      setSelectBoxNewdata(filterAttribute.data.select);
      setRadioBoxNewdata(filterAttribute.data.radio);
      setCheckBoxNewdata(filterAttribute.data.checkbox);
      setTextBoxNewdata(filterAttribute.data.text);
      setFileBoxNewdata(filterAttribute.data.file);
      setTextareaBoxNewdata(filterAttribute.data.textarea);
    } catch (error) {
      console.log('error', error);
    }
  };

  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      const docFinal = {
        uri: doc[0].uri,
        type: doc[0].type,
        name: doc[0].name,
      };
      setImage(docFinal);
      console.log(image);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User Cancelled the upload', err);
      } else {
        console.log(err);
      }
    }
  };

  const selectArrayDoc = async field_name => {
    try {
      const docc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      const docFinalNew = {
        uri: docc[0].uri,
        type: docc[0].type,
        name: docc[0].name,
      };
      setArrayImage(docFinalNew);
      setArrayImageFieldName(field_name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User Cancelled the upload', err);
      } else {
        console.log(err);
      }
    }
  };

  const textFieldDataInsert = (value, field_name) => {
    {
      let newcheckdata = textBoxNewdata.map((mainitem, index) => {
        if (mainitem.field_name == field_name) {
          return {...mainitem, field_value: value};
        } else {
          return mainitem;
        }
      });
      setTextBoxNewdata(newcheckdata);
    }
  };
  const textAreaFieldDataInsert = (value, field_name) => {
    {
      let newcheckdata = textareaBoxNewdata.map((mainitem, index) => {
        if (mainitem.field_name == field_name) {
          return {...mainitem, field_value: value};
        } else {
          return mainitem;
        }
      });
      setTextareaBoxNewdata(newcheckdata);
    }
  };
  const selectHandler = (label, value, field_name) => {
    {
      let newcheckdata = selectBoxNewdata.map((mainitem, index) => {
        if (mainitem.field_name == field_name) {
          let insideArray = mainitem.arrayData.map((item, index) => {
            if (item.value === value) {
              return {...item, selected: true};
            } else {
              return {...item, selected: false};
            }
          });

          mainitem.arrayData = insideArray;
          return mainitem;
        } else {
          return mainitem;
        }
      });
      setSelectBoxNewdata(newcheckdata);
    }
  };
  const radioHandler = (label, value, field_name) => {
    {
      let newcheckdata = radioBoxNewdata.map((mainitem, index) => {
        if (mainitem.field_name == field_name) {
          let insideArray = mainitem.arrayData.map((item, index) => {
            if (item.value === value) {
              return {...item, selected: true};
              // if (item.selected == false) {
              //     return { ...item, selected: true };
              // } else if (item.selected == true) {
              //     return { ...item, selected: false };
              // }
            } else {
              return {...item, selected: false};
              //return item;
            }
          });

          mainitem.arrayData = insideArray;
          return mainitem;
        } else {
          return mainitem;
        }
      });

      setRadioBoxNewdata(newcheckdata);
      //console.log('radioBoxNewdata');
      //console.log(radioBoxNewdata);
    }
  };
  const checkBoxHandler = (label, value, field_name) => {
    {
      let newcheckdata = checkBoxNewdata.map((mainitem, index) => {
        if (mainitem.field_name == field_name) {
          let insideArray = mainitem.arrayData.map((item, index) => {
            if (item.value === value) {
              if (item.selected == false) {
                return {...item, selected: true};
              } else if (item.selected == true) {
                return {...item, selected: false};
              }
            } else {
              return item;
            }
          });

          mainitem.arrayData = insideArray;
          return mainitem;
        } else {
          return mainitem;
        }
      });
      setCheckBoxNewdata(newcheckdata);
    }
  };
  const getSubCateory = async id => {
    try {
      const subFilterCategory = await fetch(
        `https://www.kanpid.com/api/used-item/get-all-sub-category/${id}`,
      );
      const filterResponse = await subFilterCategory.json();
      setListSubCategory(filterResponse.data.sub_category);
      setArrayImage('');
      setArrayImageFieldName('');
      setSelectBoxNewdata([]);
      setRadioBoxNewdata([]);
      setCheckBoxNewdata([]);
      setTextBoxNewdata([]);
      setFileBoxNewdata([]);
      setTextareaBoxNewdata([]);
      setSelSubCatName('');
      setSubMainCatId('');
    } catch (error) {
      console.log('error');
    }
  };

  const checkSelectedProduct = products => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].selected === true) {
        return products[i].value;
      }
    }
  };

  const uploadItem = async () => {
    console.log('submit click');
    if (!name) {
      actionSheetRefName.current?.setModalVisible();
    } else if (!price) {
      actionSheetRefPrice.current?.setModalVisible();
    } else if (!description) {
      actionSheetRefDescription.current?.setModalVisible();
    } else if (!currency) {
      actionSheetRefCurrency.current?.setModalVisible();
    } else {
      const user = await AsyncStorage.getItem('userDetail');
      const userId = JSON.parse(user).user_id;
      const formData = new FormData();
      formData.append('id', productId);
      formData.append('user_id', userId);
      formData.append('product_name', name);
      formData.append('currency', currency);
      formData.append('product_price', price);
      formData.append('product_description', description);
      formData.append('category', setMainCatId);
      formData.append('sub_category', subMainCatId);
      formData.append('product_image', image);
      if (arrayImage != '') {
        formData.append(arrayImageFieldName, arrayImage);
      }

      /// textfield data
      for (let i = 0; i < textBoxNewdata.length; i++) {
        formData.append(
          textBoxNewdata[i].field_name,
          textBoxNewdata[i].field_value,
        );
      }
      for (let i = 0; i < selectBoxNewdata.length; i++) {
        for (let j = 0; j < selectBoxNewdata[i].arrayData.length; j++) {
          if (selectBoxNewdata[i].arrayData[j].selected == true) {
            formData.append(
              selectBoxNewdata[i].arrayData[j].field_name,
              selectBoxNewdata[i].arrayData[j].value,
            );
          }
        }
      }
      //////  radio data
      for (let i = 0; i < radioBoxNewdata.length; i++) {
        for (let j = 0; j < radioBoxNewdata[i].arrayData.length; j++) {
          if (radioBoxNewdata[i].arrayData[j].selected == true) {
            console.log(radioBoxNewdata[i].arrayData[j].value);
            formData.append(
              radioBoxNewdata[i].arrayData[j].field_name,
              radioBoxNewdata[i].arrayData[j].value,
            );
          }
        }
      }
      //////// CheckBox Data
      console.log('---------------------------');
      let selCheckBoxdata = [];
      for (let i = 0; i < checkBoxNewdata.length; i++) {
        for (let j = 0; j < checkBoxNewdata[i].arrayData.length; j++) {
          if (checkBoxNewdata[i].arrayData[j].selected == true) {
            selCheckBoxdata.push({
              label: checkBoxNewdata[i].field_name,
              value: checkBoxNewdata[i].arrayData[j].value,
            });
          }
        }
      }
      formData.append('checkBoxData', JSON.stringify(selCheckBoxdata));

      axios({
        method: 'post',
        url: 'https://www.kanpid.com/api/used-item/update-product',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(function (response) {
          //handle success
          Toaster('You have successfully uploaded item');
          navigation.navigate('Myuseditem');
          // console.log("new axios then");
          console.log(response.data);
        })
        .catch(function (response) {
          //handle error
          Toaster('Something went wrong');
          //console.log("new axios catch");
          console.log(response.data);
        });
    }
  };

  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <Text>Edit Used Item</Text>

        <View>
          <Text style={styles.inputHeading}>Name:</Text>
          <TextInput
            value={name}
            style={styles.input}
            onChangeText={actualData => setName(actualData)}
          />
          <Text style={[styles.inputHeading]}>Image:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              selectDoc();
            }}>
            <Text style={{fontSize: 13}}>Upload Image</Text>
          </TouchableOpacity>
          <Text style={styles.inputHeading}>Price:</Text>
          <TextInput
            value={price}
            style={styles.input}
            onChangeText={actualData => setPrice(actualData)}
          />
          <Text style={styles.inputHeading}>Description:</Text>
          <TextInput
            value={description}
            style={styles.input}
            onChangeText={actualData => setDescription(actualData)}
          />
          <Text style={styles.inputHeading}>Category:</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            placeholder="Select Category"
            data={listCategory}
            value={selCatName}
            onChange={item => {
              setSelCatName(item.name);
              getSubCateory(item.id);
              selSetMainCatId(item.id);
            }}
            maxHeight={300}
            labelField="name"
            valueField="name"
          />
          <Text style={styles.inputHeading}>Select Sub Category:</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            placeholder="Select Sub Category"
            data={listSubCategory}
            value={selSubCatName}
            onChange={item => {
              setSelSubCatName(item.name);
              setSubMainCatId(item.id);
              getAttribute(item.id);
            }}
            maxHeight={300}
            labelField="name"
            valueField="name"
          />
          {textBoxNewdata.map((item, index) => {
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={actualData =>
                    textFieldDataInsert(item.label, actualData, item.field_name)
                  }>
                  <Text style={styles.inputHeading}>
                    {item ? item.field_value : ''}
                  </Text>
                </TextInput>
              </View>
            );
          })}
          {textareaBoxNewdata.map((item, index) => {
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={actualData =>
                    textAreaFieldDataInsert(
                      item.label,
                      actualData,
                      item.field_name,
                    )
                  }>
                  <Text style={styles.inputHeading}>
                    {item ? item.field_value : ''}
                  </Text>
                </TextInput>
              </View>
            );
          })}
          {fileBoxNewdata.map((item, index) => {
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    selectArrayDoc(item.field_name);
                  }}>
                  <Text style={{fontSize: 13}}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {selectBoxNewdata.map((item, index) => {
            console.log('item.arrayData--------------------------', index);
            console.log(item.arrayData);
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    {
                      borderColor: '#9e9e9eb8',
                      marginTop: 10,
                      color: '#9e9e9eb8',
                    },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  placeholder="Select"
                  maxHeight={300}
                  data={item.arrayData}
                  labelField="label"
                  valueField="value"
                  value={checkSelectedProduct(item.arrayData)}
                  onChange={itemval => {
                    selectHandler(item.label, itemval.value, item.field_name);
                    // setMonthValue(item.value);
                  }}
                />
              </View>
            );
          })}
          {radioBoxNewdata.map((item, index) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                {item.arrayData.map((newItem, index) => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value={newItem.value}
                        color="green"
                        status={
                          newItem.selected === true ? 'checked' : 'unchecked'
                        }
                        onPress={() =>
                          radioHandler(
                            newItem.label,
                            newItem.value,
                            newItem.field_name,
                          )
                        }
                      />
                      <Text
                        onPress={() =>
                          radioHandler(
                            newItem.label,
                            newItem.value,
                            newItem.field_name,
                          )
                        }
                        style={{marginTop: 6}}>
                        {newItem.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
          {checkBoxNewdata.map((item, index) => {
            return (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''} :
                </Text>
                {item.arrayData.map((checkval, index) => {
                  return (
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <CheckBox
                        style={styles.checkbox}
                        id={'kan_' + checkval.value}
                        name={'kan_' + checkval.value}
                        data-name={'kan_' + checkval.value}
                        className={'box'}
                        onValueChange={() =>
                          checkBoxHandler(
                            item.label,
                            checkval.value,
                            item.field_name,
                          )
                        }
                        value={checkval.selected}
                      />
                      <Text style={{paddingTop: 5}}>{checkval.label}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              uploadItem();
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ActionSheet
        ref={actionSheetRefName}
        containerStyle={{backgroundColor: '#fff'}}>
        <View style={styles.actionMainView}>
          <View
            style={{
              backgroundColor: '#4AAB7E',
              width: 50,
              height: 5,
              borderRadius: 25,
              marginBottom: 30,
            }}></View>

          <Text
            style={{
              color: '#4AAB7E',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            Enter Your Name
          </Text>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={actionSheetRefPrice}
        containerStyle={{backgroundColor: '#fff'}}>
        <View style={styles.actionMainView}>
          <View
            style={{
              backgroundColor: '#4AAB7E',
              width: 50,
              height: 5,
              borderRadius: 25,
              marginBottom: 30,
            }}></View>

          <Text
            style={{
              color: '#4AAB7E',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            Enter Price
          </Text>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={actionSheetRefDescription}
        containerStyle={{backgroundColor: '#fff'}}>
        <View style={styles.actionMainView}>
          <View
            style={{
              backgroundColor: '#4AAB7E',
              width: 50,
              height: 5,
              borderRadius: 25,
              marginBottom: 30,
            }}></View>

          <Text
            style={{
              color: '#4AAB7E',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            Enter Description
          </Text>
        </View>
      </ActionSheet>
      <ActionSheet
        ref={actionSheetRefCurrency}
        containerStyle={{backgroundColor: '#fff'}}>
        <View style={styles.actionMainView}>
          <View
            style={{
              backgroundColor: '#4AAB7E',
              width: 50,
              height: 5,
              borderRadius: 25,
              marginBottom: 30,
            }}></View>

          <Text
            style={{
              color: '#4AAB7E',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            Choose Currency
          </Text>
        </View>
      </ActionSheet>
    </ScrollView>
  );
};

export default EditUsedItem;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#9e9e9eb8',
  },
  inputHeading: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 13,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputLarge: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#f7f7f7',
    justifyContent: 'flex-start',
    minHeight: 100,
    borderColor: '#9e9e9eb8',
    borderWidth: 1,
  },
  inputHeading: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
  },
  inputHeading1: {
    fontSize: 13,
    marginTop: 20,
    marginBottom: 6,
  },
  addBtn: {
    backgroundColor: '#9AC96D',
    paddingTop: 12,
    paddingBottom: 15,
    borderColor: '#9AC96D',
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 130,
  },
  mainContainer: {
    backgroundColor: '#103524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  firstContainer: {
    flexDirection: 'row',
  },
  secondContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingRight: 9,
  },
  arrowHeading: {
    color: '#fff',
    fontSize: 16,
    marginTop: 9,
    marginLeft: 9,
  },

  menuIcon: {
    color: '#fff',
    fontSize: 26,
    backgroundColor: '#9AC96D',
    width: 44,
    height: 44,
    paddingTop: 8,
    paddingLeft: 10,
    borderRadius: 30,
  },
  actionMainView: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  actionBtn: {
    backgroundColor: '#4AAB7E',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
