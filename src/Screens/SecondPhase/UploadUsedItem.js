import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import {useEffect, createRef, useRef} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import {RadioButton} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
const actionSheetRefName = createRef();
const actionSheetRefPrice = createRef();
const actionSheetRefDescription = createRef();
const actionSheetRefCurrency = createRef();
import RadioForm from 'react-native-simple-radio-button';
import {Post, GetApi} from '../../Helpers/Service';
import Toaster from '../../Component/Toaster';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadUsedItem = () => {
  const navigation = useNavigation();
  const data = [
    {label: 'LKR', value: 'LKR'},
  
  ];
  const [category, setCategory] = useState();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState(null);
  const [subCategory, setSubCategory] = useState();
  const [selCatName, setSelCatName] = useState('');
  const [setMainCatId, selSetMainCatId] = useState('');
  const [setSubMainCatId, selSetSubMainCatId] = useState('');
  const [selSubCatName, setSelSubCatName] = useState('');
  const [arrayImage, setArrayImage] = useState('');
  const [arrayImageFieldName, setArrayImageFieldName] = useState('');
  ///////  New const
  const [selectBoxNewdata, setSelectBoxNewdata] = React.useState([]);
  const [radioBoxNewdata, setRadioBoxNewdata] = React.useState([]);
  const [checkBoxNewdata, setCheckBoxNewdata] = React.useState([]);
  const [textBoxNewdata, setTextBoxNewdata] = React.useState([]);
  const [fileBoxNewdata, setFileBoxNewdata] = React.useState([]);
  const [textareaBoxNewdata, setTextareaBoxNewdata] = React.useState([]);
  /// set new value const

  const getCategoryData = async () => {
    try {
      const data = await fetch(
        'https://www.kanpid.lk/api/used-item/get-all-category',
      );
      const response = await data.json();
      setCategory(response.data.category_data_list);
    } catch (error) {
      console.error(error);
    }
  };

  const elementRef = useRef();
  useEffect(() => {
    getCategoryData();
  }, []);

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
    } else if (!image) {
      Toaster('Please provide the image');
      return;
    } else if (!setMainCatId) {
      Toaster('Please select the Category');
      return;
    } else if (!setSubMainCatId) {
      Toaster('Please select the SubCategory');
      return;
    } else {
      const user = await AsyncStorage.getItem('userDetail');
      const userId = JSON.parse(user).user_id;
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('product_name', name);
      formData.append('currency', currency);
      formData.append('product_price', price);
      formData.append('product_description', description);
      formData.append('category', setMainCatId);
      formData.append('sub_category', setSubMainCatId);
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
        url: 'https://www.kanpid.lk/api/used-item/upload-used-item',
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
      console.log(docFinal);
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

  const getSubCateory = async id => {
    try {
      const subFilterCategory = await fetch(
        `https://www.kanpid.lk/api/used-item/get-all-sub-category/${id}`,
      );
      const filterResponse = await subFilterCategory.json();
      setSubCategory(filterResponse.data.sub_category);
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

  const getAttribute = async id => {
    try {
      const attribute = await fetch(
        `https://www.kanpid.lk/api/used-item/get-category-attribute-data/${id}`,
      );
      const filterAttribute = await attribute.json();
      setSelectBoxNewdata(filterAttribute.data.select);
      setRadioBoxNewdata(filterAttribute.data.radio);
      setCheckBoxNewdata(filterAttribute.data.checkbox);
      setTextBoxNewdata(filterAttribute.data.text);
      setFileBoxNewdata(filterAttribute.data.file);
      setTextareaBoxNewdata(filterAttribute.data.textarea);
    } catch (error) {
      console.log('error');
    }
  };
  const textFieldDataInsert = (label, value, field_name) => {
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
  const textAreaFieldDataInsert = (label, value, field_name) => {
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
      setSelectBoxNewdata(newcheckdata);
      // console.log('selectBoxNewdata---------');
      // console.log(newcheckdata[0].arrayData);
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
  const checkSelectedProduct = products => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].selected === true) {
        return products[i].value;
      }
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={{padding: 20}}>
          <Text style={{color: '#9AC96D'}}>Upload Used Item</Text>
          <Text style={[styles.inputHeading1]}>Name:</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            value={name}
            onChangeText={actualData => setName(actualData)}
          />
          <Text style={[styles.inputHeading1]}>Image:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              selectDoc();
            }}>
            <Text style={{fontSize: 13}}>Upload Image</Text>
          </TouchableOpacity>

          <Text style={styles.inputHeading}>Currency</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            placeholder="Select Currency"
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={currency}
            onChange={item => {
              setCurrency(item.value);
            }}
          />

          <Text style={styles.inputHeading}>Price</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            keyboardType={'numeric'}
            value={price}
            onChangeText={actualData => setPrice(actualData)}
          />
          <Text style={styles.inputHeading}>Description</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputLarge}
            value={description}
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
            data={category}
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
          <Text style={styles.inputHeading}>Sub Category:</Text>
          <Dropdown
            style={[
              styles.dropdown,
              {borderColor: '#9e9e9eb8', marginTop: 10, color: '#9e9e9eb8'},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            placeholder="Select Sub Category"
            data={subCategory}
            value={selSubCatName}
            maxHeight={300}
            labelField="name"
            valueField="name"
            onChange={item => {
              setSelSubCatName(item.name);
              getAttribute(item.id);
              selSetSubMainCatId(item.id);
            }}
          />
          {textBoxNewdata.map((item, index) => {
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''}
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
                <Text style={styles.inputHeading}></Text>
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
                  {item ? item.label : ''}
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
            return (
              <View>
                <Text style={styles.inputHeading}>
                  {item ? item.label : ''}
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
          {/* {radioBoxNewdata.map((item, index) => {
                        return (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.inputHeading}>{item ? item.label : ''}</Text>
                                <View style={{ flexDirection: "row" }}>
                                    <RadioForm
                                        radio_props={item.arrayData}
                                        initial={0} //initial value of this group
                                        onPress={(value) => {
                                            radioHandler(item.label, value, item.field_name)
                                        }} //if the user changes options, set the new value
                                    />
                                </View>
                            </View>
                        )

                    })} */}
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
                  {item ? item.label : ''}
                </Text>
                {item.arrayData.map((checkval, index) => {
                  return (
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <CheckBox
                        style={styles.checkbox}
                        // value={checkBoxArray.some(code => code.key === item.label) && checkBoxArray.some(code => code.val === checkval.value) ? isSelected : isSelected}
                        id={'kan_' + checkval.value}
                        name={'kan_' + checkval.value}
                        data-name={'kan_' + checkval.value}
                        ref={elementRef}
                        className={'box'}
                        // onValueChange={() => checkboxHandler(item.label, checkval.value)}
                        onValueChange={() =>
                          checkBoxHandler(
                            item.label,
                            checkval.value,
                            item.field_name,
                          )
                        }
                        value={checkval.selected}
                      />
                      <Text style={styles.label}>{checkval.label}</Text>
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
    </View>
  );
};

export default UploadUsedItem;

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
