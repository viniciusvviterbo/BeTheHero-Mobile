import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png'

import styles from './styles'

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    
    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents() {
        // Controle para evitar que seja feita uma segunda requisição quando a primeira ainda está sendo carregada
        if (loading) {
            return;
        }
        // Evita que sejam realizadas requisições quando não existem mais casos a serem carregados
        if (total > 0 && incidents.length === total) {
            return;
        }

        setLoading(true);

        const resp = await api.get('casos', {
            params: { pagina },
        });

        // O operador '...' é chamado 'spread', e opera representando todos os valores individuais em incidents e resp.data
        setIncidents([...incidents, ...resp.data]); // O operador '...' é chamado 'spread', e 
        setTotal(resp.headers['x-total-count'])
        setPagina(pagina + 1);
        
        setLoading(false);

    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return(
        <View style = { styles.container }>
            <View style = { styles.header }>
                <Image source = { logoImg } />
                <Text style = { styles.headerText }>
                    Total de <Text style = {styles.headerTextBold }>{ total } casos</Text>.
                </Text>
            </View>

            <Text style = { styles.title }>Bem-vindo!</Text>
            <Text style = { styles.description }>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList 
                data = { incidents }
                keyExtractor = { incident => String(incident.id) }
                showsVerticalScrollIndicator = { true }
                style = { styles.incidentList }
                onEndReached = { loadIncidents } // Função chamada quando o fim da lista é alcançado
                onEndReachedThreshold = { 0.2 } // Chama a função explicitada em 'onEndReached' quando faltar 20% da lista para o usuário alcançar seu final
                renderItem = { ({ item: incident }) => (
                    <View style = { styles.incident }>
                        <Text style = { styles.incidentProperty }>ONG:</Text>
                        <Text style = { styles.incidentValue }>{ incident.nome }</Text>

                        <Text style = { styles.incidentProperty }>CASO:</Text>
                        <Text style = { styles.incidentValue }>{ incident.titulo }</Text>
                        
                        <Text style = { styles.incidentProperty }>VALOR:</Text>
                        <Text style = { styles.incidentValue }>{ Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.valor) }</Text>

                        <TouchableOpacity style = { styles.detailsButton } onPress = { () => navigateToDetail(incident) }>
                            <Text style = { styles.detailsButtonText }>Ver mais detalhes</Text>
                            <Feather name = 'arrow-right' size = { 16 } color ='#e02041' />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}