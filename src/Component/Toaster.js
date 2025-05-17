import React from 'react'
import { View, Text,ToastAndroid } from 'react-native'

const Toaster = (toast) => {
    // console.log(toast)
    return (
        ToastAndroid.show(toast, ToastAndroid.LONG)
    )
}

export default Toaster
