import React from 'react';
import { Feather} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Text, Image, View, TouchableOpacity, Linking } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function Detail() {
    const navigation = useNavigation();
    const route = useRoute();

    const incident = route.params.incident;
    const doacao = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.valor);
    const message = `Olá ${ incident.nome }, estou entrado em contato pois gostaria de ajudar no caso "${ incident.titulo }" com o valor de ${ doacao }.`;

    function navigateBack() {
        navigation.goBack();
    }

    function sendMail() {
        MailComposer.composeAsync({
            subject: `Herói do Caso "${ incident.titulo }"`,
            recipients: [incident.email],
            body: message,
        })
    }

    function sendWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=${ incident.whatsapp }&text=${ message }`);
    }

    return(
        <View style = { styles.container }>
            <View style = { styles.header }>
                <Image source = { logoImg } />

                <TouchableOpacity onPress = { navigateBack }>
                    <Feather name = 'arrow-left' size = { 28 } color = '#e82041' />
                </TouchableOpacity>
            </View>

            <View style = { styles.incident }>
                <Text style = { [styles.incidentProperty, { marginTop: 0 }] }>ONG:</Text>
                <Text style = { styles.incidentValue }>{ incident.nome } - { incident.cidade }, { incident.uf }</Text>

                <Text style = { styles.incidentProperty }>CASO:</Text>
                <Text style = { styles.incidentValue }>{ incident.titulo }</Text>
                
                <Text style = { styles.incidentProperty }>VALOR:</Text>
                <Text style = { styles.incidentValue }>{ doacao }</Text>
            </View>

            <View style = { styles.contactBox }>
                <Text style = { styles.heroTitle }>Salve o dia!</Text>
                <Text style = { styles.heroTitle }>Seja o herói desse caso.</Text>
                
                <Text style = { styles.heroDescription }>Entre em contato</Text>
                
                <View style = { styles.actions}>
                    <TouchableOpacity style = { styles.action } onPress = { sendWhatsapp } >
                        <Text style = { styles.actionText }>Whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = { styles.action } onPress = { sendMail } >
                        <Text style = { styles.actionText }>E-mail</Text>
                    </TouchableOpacity>
                </View>
            </View>
    </View>
    );
}